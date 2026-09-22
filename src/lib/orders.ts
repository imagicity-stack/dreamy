import { FieldValue, type Firestore, type Transaction } from "firebase-admin/firestore";
import { getDb } from "./firebaseAdmin";
import { getRazorpay } from "./razorpay";
import { getSettings } from "./settings";
import { paiseToRupees, type PriceBreakdown } from "./pricing";
import { issueTickets, type IssuedTicket } from "./tickets";
import {
  PRODUCTS,
  isQuoteError,
  type Customer,
  type ProductKey,
  type Quote,
  type QuoteLine,
} from "./products";

/**
 * The life of a payment, from "they pressed pay" to "there is a pass with a
 * number on it".
 *
 * The shape of it:
 *
 *   createOrder()  writes orders/<razorpay order id> as `created`, with the
 *                  priced lines and the buyer's details already on it. The
 *                  amount is computed here and handed to Razorpay; nothing the
 *                  browser sends is ever used as a price.
 *
 *   fulfilOrder()  is the only way an order becomes `paid`. It re-checks the
 *                  payment against Razorpay's own record, then, in a single
 *                  Firestore transaction, allocates the pass numbers, writes
 *                  the pass/entry/order record and moves the counters. It is
 *                  idempotent by construction: the browser calling it after
 *                  checkout and the webhook calling it a second later both end
 *                  up with the same codes and one record.
 *
 * The buyer's details live on the order from the moment it is created, which is
 * what lets the webhook finish an order whose browser was closed, lost signal
 * or crashed between paying and telling us.
 */

export type OrderStatus = "created" | "paid" | "failed" | "oversold" | "refunded";

export type OrderAmount = PriceBreakdown & { currency: "INR" };

export type Receipt = {
  orderId: string;
  paymentId: string;
  product: ProductKey;
  label: string;
  description: string;
  units: number;
  /** One per pass, or a single collection code for an order of merch. */
  codes: string[];
  primaryCode: string;
  lines: QuoteLine[];
  amount: OrderAmount;
  customerName: string;
  /** The buyer, so a receipt can be addressed without re-reading the order. */
  customer: Customer;
  /**
   * Scannable tickets, present only on the call that issued them. Tokens are
   * never stored — only their hashes are — so the one request that created
   * them is the only one that can hand them to a browser or a PDF.
   */
  tickets: { code: string; token: string; url: string }[];
  /** True when this call did the fulfilling, false when it was already done. */
  firstTime: boolean;
};

export type OrderFailure = {
  error: string;
  status: number;
  /** Names the cases a caller acts on rather than merely reports. */
  code?: "oversold" | "not-ours" | "already-refunded";
};

export function isFailure<T>(value: T | OrderFailure): value is OrderFailure {
  return typeof value === "object" && value !== null && "error" in value && "status" in value;
}

const ORDERS = "orders";
const COUNTERS = "counters";
const WEBHOOK_EVENTS = "webhookEvents";

/** What a product's counter holds. Live units are sold minus refunded. */
export type ProductCounter = {
  units: number;
  orders: number;
  refundedUnits: number;
  lastSeq: number;
  basePaise: number;
  feePaise: number;
  gstPaise: number;
  feeGstPaise: number;
  totalPaise: number;
  refundedPaise: number;
};

function readCounter(data: unknown): ProductCounter {
  const raw = (data ?? {}) as Record<string, unknown>;
  const num = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  return {
    units: num(raw.units),
    orders: num(raw.orders),
    refundedUnits: num(raw.refundedUnits),
    lastSeq: num(raw.lastSeq),
    basePaise: num(raw.basePaise),
    feePaise: num(raw.feePaise),
    gstPaise: num(raw.gstPaise),
    feeGstPaise: num(raw.feeGstPaise),
    totalPaise: num(raw.totalPaise),
    refundedPaise: num(raw.refundedPaise),
  };
}

/** Live count of a product: what has been sold, less what was refunded. */
export function liveUnits(counter: ProductCounter): number {
  return Math.max(0, counter.units - counter.refundedUnits);
}

/** Every product's counter, for the admin panel and the capacity checks. */
export async function getCounters(): Promise<Record<string, ProductCounter>> {
  const db = getDb();
  if (!db) return {};
  const snap = await db.collection(COUNTERS).get();
  const out: Record<string, ProductCounter> = {};
  for (const doc of snap.docs) {
    if (doc.id === "concertInterest") continue; // Not a paid product; counted elsewhere.
    out[doc.id] = readCounter(doc.data());
  }
  return out;
}

function counterRef(db: Firestore, product: ProductKey) {
  return db.collection(COUNTERS).doc(product);
}

/** MDZ-F-0001. Sequential, so a pass number is also a count. */
function issueCode(prefix: string, seq: number): string {
  return `${prefix}-${String(seq).padStart(4, "0")}`;
}

function toAmount(price: PriceBreakdown): OrderAmount {
  return { ...price, currency: "INR" };
}

// ---------------------------------------------------------------- create ----

export type CreateOrderInput = {
  product: ProductKey;
  /** Whatever the page sent — a quantity, a cart. Priced, never trusted. */
  input: unknown;
  customer: Customer;
};

export type CreatedOrder = {
  orderId: string;
  amountPaise: number;
  currency: "INR";
  keyId: string;
  quote: Quote;
};

export async function createOrder(
  args: CreateOrderInput,
): Promise<CreatedOrder | OrderFailure> {
  const settings = await getSettings();
  const product = PRODUCTS[args.product];

  const closed = product.closed(settings);
  if (closed) return { error: closed, status: 409 };

  const quote = await product.quote(args.input, settings);
  if (isQuoteError(quote)) return { error: quote.error, status: quote.status };
  if (quote.price.totalPaise < 100) {
    return { error: "That comes to nothing — check what you picked.", status: 400 };
  }

  const razorpay = getRazorpay();
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!razorpay || !keyId) {
    return { error: "Payments are not configured yet", status: 503 };
  }

  // Taking money we have nowhere to record is worse than not taking it.
  const db = getDb();
  if (!db) {
    return { error: "Checkout is not ready yet — try again shortly.", status: 503 };
  }

  const capacity = product.capacity(settings);
  if (capacity > 0) {
    const snap = await counterRef(db, args.product).get();
    const sold = liveUnits(readCounter(snap.data()));
    if (sold + quote.units > capacity) {
      const left = Math.max(0, capacity - sold);
      return {
        error: left === 0 ? `${product.label} is sold out.` : `Only ${left} left — lower the quantity.`,
        status: 409,
      };
    }
  }

  const rzpOrder = await razorpay.orders.create({
    amount: quote.price.totalPaise,
    currency: "INR",
    receipt: `${args.product}_${Date.now()}`.slice(0, 40),
    notes: {
      product: args.product,
      units: String(quote.units),
      name: args.customer.name,
      phone: args.customer.phone,
    },
  });

  const orderId = String(rzpOrder.id);

  await db
    .collection(ORDERS)
    .doc(orderId)
    .set({
      orderId,
      product: args.product,
      label: quote.label,
      description: quote.description,
      units: quote.units,
      lines: quote.lines,
      amount: toAmount(quote.price),
      customer: args.customer,
      status: "created" satisfies OrderStatus,
      payment: null,
      fulfilment: null,
      refund: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

  return {
    orderId,
    amountPaise: quote.price.totalPaise,
    currency: "INR",
    keyId,
    quote,
  };
}

// --------------------------------------------------------------- fulfilment -

type StoredOrder = {
  orderId: string;
  product: ProductKey;
  label: string;
  description: string;
  units: number;
  lines: QuoteLine[];
  amount: OrderAmount;
  customer: Customer;
  status: OrderStatus;
  fulfilment: { codes?: string[]; recordId?: string } | null;
  payment: { paymentId?: string } | null;
};

function receiptFrom(order: StoredOrder, paymentId: string, firstTime: boolean): Receipt {
  const codes = order.fulfilment?.codes ?? [];
  return {
    orderId: order.orderId,
    paymentId,
    product: order.product,
    label: order.label,
    description: order.description,
    units: order.units,
    codes,
    primaryCode: codes[0] ?? "",
    lines: order.lines ?? [],
    amount: order.amount,
    customerName: order.customer?.name ?? "",
    customer: order.customer ?? { name: "", phone: "", email: "", school: "", extra: {} },
    tickets: [],
    firstTime,
  };
}

/**
 * Turns a paid order into a pass, an entry or a merch slip — once.
 *
 * Called from the browser after checkout and again from the webhook; whichever
 * arrives second reads the finished order back out and returns the same codes.
 */
export async function fulfilOrder(args: {
  orderId: string;
  paymentId: string;
  /** Who is asking — recorded so a payment's route through the system is legible. */
  source: "checkout" | "webhook";
}): Promise<Receipt | OrderFailure> {
  const db = getDb();
  const razorpay = getRazorpay();
  if (!db || !razorpay) return { error: "Payments are not configured yet", status: 503 };

  const orderRef = db.collection(ORDERS).doc(args.orderId);
  const existing = await orderRef.get();
  if (!existing.exists) return { error: "That order is not one of ours.", status: 404, code: "not-ours" };

  const order = existing.data() as StoredOrder;

  // Already done: hand back what was issued rather than issuing it twice.
  if (order.status === "paid" && order.fulfilment?.codes?.length) {
    return receiptFrom(order, order.payment?.paymentId ?? args.paymentId, false);
  }
  if (order.status === "refunded") {
    return { error: "That payment has been refunded.", status: 409, code: "already-refunded" };
  }

  // The truth about a payment is Razorpay's, not the browser's.
  const payment = await razorpay.payments.fetch(args.paymentId);
  const status = String(payment.status ?? "");
  if (String(payment.order_id ?? "") !== args.orderId) {
    return { error: "That payment belongs to a different order.", status: 400 };
  }
  if (status !== "captured" && status !== "authorized") {
    return { error: `Payment is ${status || "not complete"}.`, status: 409 };
  }
  if (Number(payment.amount) !== Number(order.amount.totalPaise)) {
    // Never fulfil a short payment; the office settles it by hand.
    return { error: "The amount paid does not match the order.", status: 409 };
  }

  const product = PRODUCTS[order.product];
  const settings = await getSettings();
  const capacity = product.capacity(settings);

  const result = await db.runTransaction(async (tx: Transaction) => {
    const fresh = await tx.get(orderRef);
    const current = fresh.data() as StoredOrder | undefined;
    if (!current) return { error: "That order is not one of ours.", status: 404 } as OrderFailure;

    // Another request may have fulfilled it between our read and this one.
    if (current.status === "paid" && current.fulfilment?.codes?.length) {
      return receiptFrom(current, current.payment?.paymentId ?? args.paymentId, false);
    }

    const cRef = counterRef(db, current.product);
    const counterSnap = await tx.get(cRef);
    const counter = readCounter(counterSnap.data());

    if (capacity > 0 && liveUnits(counter) + current.units > capacity) {
      // Paid, but there is nothing left to give. Flagged rather than fulfilled,
      // so the office refunds it instead of a gate volunteer arguing about it.
      tx.set(
        orderRef,
        {
          status: "oversold" satisfies OrderStatus,
          payment: { paymentId: args.paymentId, source: args.source, at: FieldValue.serverTimestamp() },
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      return {
        error: "We sold out while you were paying. The office will refund this in full.",
        status: 409,
        code: "oversold",
      } as OrderFailure;
    }

    const codeCount = product.codesPerUnit ? current.units : 1;
    const codes = Array.from({ length: codeCount }, (_, i) =>
      issueCode(product.codePrefix, counter.lastSeq + i + 1),
    );

    const recordRef = db.collection(product.collection).doc();
    tx.set(recordRef, buildRecord(current, codes, args.paymentId));

    tx.set(
      cRef,
      {
        units: counter.units + current.units,
        orders: counter.orders + 1,
        lastSeq: counter.lastSeq + codeCount,
        basePaise: counter.basePaise + current.amount.basePaise,
        feePaise: counter.feePaise + current.amount.convenienceFeePaise,
        gstPaise: counter.gstPaise + current.amount.gstPaise,
        feeGstPaise: counter.feeGstPaise + current.amount.feeGstPaise,
        totalPaise: counter.totalPaise + current.amount.totalPaise,
        refundedUnits: counter.refundedUnits,
        refundedPaise: counter.refundedPaise,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    tx.set(
      orderRef,
      {
        status: "paid" satisfies OrderStatus,
        payment: {
          paymentId: args.paymentId,
          method: String(payment.method ?? ""),
          contact: String(payment.contact ?? ""),
          email: String(payment.email ?? ""),
          source: args.source,
          at: FieldValue.serverTimestamp(),
        },
        fulfilment: {
          codes,
          recordId: recordRef.id,
          collection: product.collection,
          at: FieldValue.serverTimestamp(),
        },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return receiptFrom({ ...current, fulfilment: { codes, recordId: recordRef.id } }, args.paymentId, true);
  });

  // Our own form treats the email as optional, but Razorpay's checkout collects
  // one. If the buyer gave it there and not here, that is still their address
  // and the receipt should reach it.
  if (!isFailure(result) && !result.customer.email) {
    const fromPayment = String(payment.email ?? "").trim();
    if (fromPayment) result.customer = { ...result.customer, email: fromPayment };
  }

  // Passes become scannable tickets here, before anyone is told the payment
  // worked, so the browser can offer the PDF the moment the page turns green.
  // Only a pass needs one: a cosplay entry is a slot at a desk and a merch
  // order is a bag at a tent.
  if (!isFailure(result) && result.firstTime && result.product === "fetePass") {
    try {
      const issued: IssuedTicket[] = await issueTickets({
        orderId: result.orderId,
        product: result.product,
        tierLabel: result.label,
        codes: result.codes,
        holderName: result.customer.name,
        holderPhone: result.customer.phone,
        holderEmail: result.customer.email,
      });
      result.tickets = issued.map((t) => ({ code: t.code, token: t.token, url: t.url }));
    } catch (e) {
      // A pass without a QR is still a pass: the code and the gate's name
      // search both work, and the payment is already recorded.
      console.error("could not issue tickets for", result.orderId, e);
    }
  }

  return result;
}

/**
 * The record the fest actually works off on the day: a pass at the gate, an
 * entry in the arena, a bag at the merch tent. Money is stored twice on
 * purpose — in paise for arithmetic, in rupees for the columns the panel and
 * its CSVs have always had.
 */
function buildRecord(order: StoredOrder, codes: string[], paymentId: string) {
  const common = {
    amount: order.amount,
    totalPaise: order.amount.totalPaise,
    razorpay: { orderId: order.orderId, paymentId },
    createdAt: FieldValue.serverTimestamp(),
  };
  const buyer = {
    name: order.customer.name,
    school: order.customer.school,
    phone: order.customer.phone,
    email: order.customer.email,
  };

  if (order.product === "fetePass") {
    return {
      ...common,
      passCode: codes[0],
      passCodes: codes,
      tier: "fete",
      qty: order.units,
      total: paiseToRupees(order.amount.totalPaise),
      buyer,
    };
  }

  if (order.product === "cosplayEntry") {
    const extra = order.customer.extra ?? {};
    return {
      ...common,
      entryCode: codes[0],
      ...buyer,
      character: extra.character ?? "",
      category: extra.category ?? "",
      mode: extra.mode === "team" ? "team" : "solo",
      team: extra.team ?? "",
      members: extra.members ?? "",
      fee: paiseToRupees(order.amount.totalPaise),
    };
  }

  return {
    ...common,
    collectionCode: codes[0],
    lines: (order.lines ?? []).map((l) => ({
      id: l.id,
      name: l.label,
      price: paiseToRupees(l.unitPaise),
      qty: l.qty,
    })),
    qty: order.units,
    total: paiseToRupees(order.amount.totalPaise),
    buyer,
    paid: true,
  };
}

// ------------------------------------------------------------ other states --

/** A payment Razorpay tells us failed. Recorded, never fulfilled. */
export async function markOrderFailed(orderId: string, reason: string, paymentId?: string) {
  const db = getDb();
  if (!db) return;
  const ref = db.collection(ORDERS).doc(orderId);
  const snap = await ref.get();
  if (!snap.exists) return;
  // A later failure event must not undo an order that was captured and issued.
  if ((snap.data() as StoredOrder).status === "paid") return;
  await ref.set(
    {
      status: "failed" satisfies OrderStatus,
      failure: { reason: reason.slice(0, 300), paymentId: paymentId ?? null, at: FieldValue.serverTimestamp() },
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * A refund, from the webhook. The units go back to the counter, so a refunded
 * pass frees its place rather than holding one nobody can use.
 */
export async function markOrderRefunded(args: {
  orderId: string;
  refundId: string;
  amountPaise: number;
}): Promise<{ name: string; email: string } | null> {
  const db = getDb();
  if (!db) return null;
  const orderRef = db.collection(ORDERS).doc(args.orderId);

  return db.runTransaction(async (tx): Promise<{ name: string; email: string } | null> => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) return null;
    const order = snap.data() as StoredOrder & { refund?: unknown };
    // Already refunded: no counter moves again, and nobody is told twice.
    if (order.status === "refunded") return null;

    const wasFulfilled = order.status === "paid";
    if (wasFulfilled) {
      const cRef = counterRef(db, order.product);
      const counter = readCounter((await tx.get(cRef)).data());
      tx.set(
        cRef,
        {
          refundedUnits: counter.refundedUnits + order.units,
          refundedPaise: counter.refundedPaise + Math.min(args.amountPaise, order.amount.totalPaise),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      // The pass itself is marked dead, not deleted: the gate needs to know a
      // code that was issued is no longer good.
      const recordId = (order.fulfilment as { recordId?: string } | null)?.recordId;
      if (recordId) {
        tx.set(
          db.collection(PRODUCTS[order.product].collection).doc(recordId),
          { refunded: true, refundedAt: FieldValue.serverTimestamp() },
          { merge: true },
        );
      }
    }

    tx.set(
      orderRef,
      {
        status: "refunded" satisfies OrderStatus,
        refund: { refundId: args.refundId, amountPaise: args.amountPaise, at: FieldValue.serverTimestamp() },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return { name: order.customer?.name ?? "", email: order.customer?.email ?? "" };
  });
}

/**
 * Records a webhook event id and says whether it is new. Razorpay retries, and
 * retries must not be allowed to double-count anything.
 *
 * Three answers, not two, and the difference matters: "duplicate" means we have
 * already seen this event and the delivery can be waved through, while
 * "unavailable" means we could not even check — Firestore is down or absent —
 * and the delivery must be refused so Razorpay sends it again. Collapsing those
 * two into one boolean loses a payment every time the database blinks.
 *
 * A claim is only good for a delivery that goes on to be processed: a handler
 * that throws calls releaseWebhookEvent() on the way out, so the redelivery
 * Razorpay sends is treated as new rather than waved through as a duplicate.
 */
export type EventClaim = "claimed" | "duplicate" | "unavailable";

export async function claimWebhookEvent(eventId: string, event: string): Promise<EventClaim> {
  const db = getDb();
  if (!db) return "unavailable";
  const ref = db.collection(WEBHOOK_EVENTS).doc(eventId);
  try {
    return await db.runTransaction(async (tx): Promise<EventClaim> => {
      const snap = await tx.get(ref);
      if (snap.exists) return "duplicate";
      tx.set(ref, { event, at: FieldValue.serverTimestamp() });
      return "claimed";
    });
  } catch {
    return "unavailable";
  }
}

/** Lets go of a claimed event id after a handler failed, so a retry can run. */
export async function releaseWebhookEvent(eventId: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.collection(WEBHOOK_EVENTS).doc(eventId).delete();
  } catch {
    // Nothing to do: the worst case is one redelivery answered as a duplicate.
  }
}
