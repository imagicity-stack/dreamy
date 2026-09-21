import { createHash, randomBytes } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import QRCode from "qrcode";
import { getDb } from "./firebaseAdmin";
import type { Receipt } from "./orders";

/**
 * One ticket per person through the gate, and the scan that admits them.
 *
 * A pass code like MDZ-F-0042 is a fine thing for a human to read out, but it
 * is sequential: anyone holding one can guess the next. So the code is not what
 * the QR carries. Each ticket also gets a random 128-bit token, and only the
 * token's hash is stored — a copy of the database is therefore not a stack of
 * working tickets. The QR encodes a URL built from the token, so a scan from a
 * plain camera app lands on the ticket page instead of showing gibberish.
 *
 * Admission is a transaction on the ticket document, which is what makes two
 * volunteers scanning the same code at two gates come out with one entry and
 * one "already admitted".
 */

const TICKETS = "tickets";

export type TicketStatus = "valid" | "used" | "void";

export type Ticket = {
  /** Firestore id: the token's hash, so a lookup is one read and holds no secret. */
  id: string;
  code: string;
  orderId: string;
  product: string;
  tierLabel: string;
  holderName: string;
  holderPhone: string;
  holderEmail: string;
  /** 1 of 3, 2 of 3 … for an order that bought several. */
  index: number;
  of: number;
  status: TicketStatus;
  usedAt: string | null;
  usedBy: string | null;
};

export type IssuedTicket = Ticket & {
  /** Only ever held in memory and in the email; never stored. */
  token: string;
  url: string;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** 22 URL-safe characters, 128 bits of randomness. */
function newToken(): string {
  return randomBytes(16).toString("base64url");
}

/** Where a ticket lives. Absolute, because it goes into an email and a QR. */
export function ticketUrl(token: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");
  return `${base}/t/${token}`;
}

/** The QR as a PNG, ready to attach to an email. */
export async function qrPng(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 640,
    color: { dark: "#150331ff", light: "#ffffffff" },
  });
}

/** The QR as a data URL, for rendering the ticket page itself. */
export async function qrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 560,
    color: { dark: "#150331ff", light: "#ffffffff" },
  });
}

/**
 * Creates the tickets for a paid order — one per pass, each with its own token.
 *
 * Called from fulfilment, which has already run inside a transaction and cannot
 * be replayed, so this is safe to do after it: a second call with the same
 * codes would find them present and do nothing.
 */
export async function issueTickets(receipt: Receipt): Promise<IssuedTicket[]> {
  const db = getDb();
  if (!db) return [];

  const existing = await db.collection(TICKETS).where("orderId", "==", receipt.orderId).limit(1).get();
  if (!existing.empty) return []; // Already issued; nothing to do and nothing to send.

  const tierLabel = receipt.label;
  const issued: IssuedTicket[] = [];
  const batch = db.batch();

  receipt.codes.forEach((code, i) => {
    const token = newToken();
    const id = hashToken(token);
    const ticket: Omit<Ticket, "id"> = {
      code,
      orderId: receipt.orderId,
      product: receipt.product,
      tierLabel,
      holderName: receipt.customer.name,
      holderPhone: receipt.customer.phone,
      holderEmail: receipt.customer.email,
      index: i + 1,
      of: receipt.codes.length,
      status: "valid",
      usedAt: null,
      usedBy: null,
    };
    batch.set(db.collection(TICKETS).doc(id), { ...ticket, createdAt: FieldValue.serverTimestamp() });
    issued.push({ ...ticket, id, token, url: ticketUrl(token) });
  });

  await batch.commit();
  return issued;
}

/** Reads a ticket from the token in a URL. */
export async function findTicket(token: string): Promise<Ticket | null> {
  const db = getDb();
  if (!db || !token) return null;

  const snap = await db.collection(TICKETS).doc(hashToken(token)).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as Omit<Ticket, "id">) };
}

export type CheckInResult =
  | { result: "admitted"; ticket: Ticket }
  | { result: "already"; ticket: Ticket; usedAt: string; usedBy: string }
  | { result: "void"; ticket: Ticket }
  | { result: "unknown" };

/**
 * Admits somebody, once.
 *
 * The status is read and written in one transaction, so two gates scanning the
 * same ticket at the same moment produce one "admitted" and one "already" —
 * whichever loses the race is the one that gets told.
 */
export async function checkIn(token: string, by: string): Promise<CheckInResult> {
  const db = getDb();
  if (!db || !token) return { result: "unknown" };

  const ref = db.collection(TICKETS).doc(hashToken(token));

  return db.runTransaction(async (tx): Promise<CheckInResult> => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { result: "unknown" };

    const ticket = { id: snap.id, ...(snap.data() as Omit<Ticket, "id">) };

    if (ticket.status === "void") return { result: "void", ticket };

    if (ticket.status === "used") {
      return {
        result: "already",
        ticket,
        usedAt: ticket.usedAt ?? "",
        usedBy: ticket.usedBy ?? "",
      };
    }

    const usedAt = new Date().toISOString();
    tx.set(ref, { status: "used", usedAt, usedBy: by }, { merge: true });

    return { result: "admitted", ticket: { ...ticket, status: "used", usedAt, usedBy: by } };
  });
}

/**
 * The fallback for a dead phone: find somebody by name, phone or pass code.
 * Firestore has no substring search, so this matches on a prefix of the name
 * and on exact phone and code — which is what a volunteer at a gate can type.
 */
export async function searchTickets(query: string): Promise<Ticket[]> {
  const db = getDb();
  const term = query.trim();
  if (!db || term.length < 3) return [];

  const rows = new Map<string, Ticket>();
  const add = (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => {
    for (const doc of docs) rows.set(doc.id, { id: doc.id, ...(doc.data() as Omit<Ticket, "id">) });
  };

  const digits = term.replace(/\D/g, "");
  const [byCode, byPhone, byName] = await Promise.all([
    db.collection(TICKETS).where("code", "==", term.toUpperCase()).limit(10).get(),
    digits.length >= 6
      ? db.collection(TICKETS).where("holderPhone", "==", term).limit(10).get()
      : Promise.resolve(null),
    db
      .collection(TICKETS)
      .orderBy("holderName")
      .startAt(term)
      .endAt(term + "")
      .limit(10)
      .get(),
  ]);

  add(byCode.docs);
  if (byPhone) add(byPhone.docs);
  add(byName.docs);

  return [...rows.values()].sort((a, b) => a.code.localeCompare(b.code));
}

/** Admits a ticket the volunteer found by name, when the QR cannot be scanned. */
export async function admitById(id: string, by: string): Promise<CheckInResult> {
  const db = getDb();
  if (!db) return { result: "unknown" };

  const ref = db.collection(TICKETS).doc(id);
  return db.runTransaction(async (tx): Promise<CheckInResult> => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { result: "unknown" };
    const ticket = { id: snap.id, ...(snap.data() as Omit<Ticket, "id">) };
    if (ticket.status === "void") return { result: "void", ticket };
    if (ticket.status === "used") {
      return { result: "already", ticket, usedAt: ticket.usedAt ?? "", usedBy: ticket.usedBy ?? "" };
    }
    const usedAt = new Date().toISOString();
    tx.set(ref, { status: "used", usedAt, usedBy: `${by} (by name)` }, { merge: true });
    return { result: "admitted", ticket: { ...ticket, status: "used", usedAt, usedBy: by } };
  });
}

/** A refunded order's tickets stop working. */
export async function voidTicketsForOrder(orderId: string): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  const snap = await db.collection(TICKETS).where("orderId", "==", orderId).get();
  if (snap.empty) return 0;

  const batch = db.batch();
  for (const doc of snap.docs) {
    batch.set(doc.ref, { status: "void", voidedAt: FieldValue.serverTimestamp() }, { merge: true });
  }
  await batch.commit();
  return snap.size;
}

/** How the day is going: issued, admitted, still to come. */
export async function gateCounts(): Promise<{ issued: number; admitted: number; voided: number }> {
  const db = getDb();
  if (!db) return { issued: 0, admitted: 0, voided: 0 };

  const [issued, admitted, voided] = await Promise.all([
    db.collection(TICKETS).count().get(),
    db.collection(TICKETS).where("status", "==", "used").count().get(),
    db.collection(TICKETS).where("status", "==", "void").count().get(),
  ]);

  return {
    issued: issued.data().count,
    admitted: admitted.data().count,
    voided: voided.data().count,
  };
}
