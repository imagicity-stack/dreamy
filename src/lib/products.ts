import { publicContent } from "./content";
import { feeRates, isPageHidden, type FestSettings } from "./festSettings";
import { priceWithFees, rupeesToPaise, type PriceBreakdown } from "./pricing";

/**
 * Everything the site can take money for, described once.
 *
 * A product says what it costs, how many of it a person may buy, what closes
 * it (a hidden page, a sold-out switch, a capacity), and what the code on the
 * resulting pass looks like. Checkout, the webhook, the counters and the admin
 * panel all read this list, so adding a paid thing — concert passes, a workshop
 * seat — is an entry here rather than another pair of API routes.
 *
 * This module reads the merch catalogue from Firestore, so it is server-only.
 * The pure money maths it uses lives in pricing.ts, which the browser may have.
 */

export type ProductKey = "fetePass" | "cosplayEntry" | "merch";

export const PRODUCT_KEYS = ["fetePass", "cosplayEntry", "merch"] as const;

export function isProductKey(value: unknown): value is ProductKey {
  return typeof value === "string" && (PRODUCT_KEYS as readonly string[]).includes(value);
}

/** One line of what is being bought, priced by the server. */
export type QuoteLine = {
  id: string;
  label: string;
  qty: number;
  unitPaise: number;
  amountPaise: number;
};

export type Quote = {
  product: ProductKey;
  /** Name of the thing, for the Razorpay modal and the receipt. */
  label: string;
  /** What the checkout modal calls it. */
  description: string;
  /** Countable units — passes, entries, items. What the counters count. */
  units: number;
  lines: QuoteLine[];
  price: PriceBreakdown;
  /** The collection each paid order of this product is written into. */
  collection: string;
  /** Prefix of the codes issued on fulfilment. */
  codePrefix: string;
  /** One code per unit (a pass each) or one per order (a collection slip). */
  codesPerUnit: boolean;
};

export type QuoteError = { error: string; status: number };

export type Product = {
  key: ProductKey;
  label: string;
  collection: string;
  codePrefix: string;
  codesPerUnit: boolean;
  /**
   * Whether this is scanned at a door.
   *
   * A scanned product gets a ticket per code: a token, a QR, a page of the PDF
   * and a card in the receipt. A merch order is a bag at a tent, so it keeps
   * its collection code and nothing else. When concert passes go on sale they
   * only have to say `ticketed: true` here to get the whole apparatus.
   */
  ticketed: boolean;

  /** Total units that may ever be sold; 0 means no limit. */
  capacity: (settings: FestSettings) => number;
  /** Why this product cannot be bought right now, or null when it can. */
  closed: (settings: FestSettings) => string | null;
  /** Prices a request. Input is whatever the client sent, and is not trusted. */
  quote: (input: unknown, settings: FestSettings) => Promise<Quote | QuoteError>;
};

/** The fee rates every product is priced with. */
const rates = feeRates;

function asQty(value: unknown, max: number): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > max) return null;
  return n;
}

const MAX_PASSES = 10;
const MAX_MERCH_PER_ITEM = 10;

export const PRODUCTS: Record<ProductKey, Product> = {
  fetePass: {
    key: "fetePass",
    label: "Fete Pass",
    collection: "passes",
    codePrefix: "MDZ-F",
    codesPerUnit: true,
    ticketed: true,
    capacity: (s) => s.fetePassCapacity,
    closed: (s) => {
      if (isPageHidden(s, "tickets")) return "Passes are not on sale.";
      if (s.soldOut) return "Fete Passes are sold out.";
      return null;
    },
    async quote(input, settings) {
      const body = (input ?? {}) as { qty?: unknown };
      const qty = asQty(body.qty, MAX_PASSES);
      if (qty === null) return { error: `Choose between 1 and ${MAX_PASSES} passes.`, status: 400 };

      const unitPaise = rupeesToPaise(settings.fetePrice);
      const basePaise = unitPaise * qty;

      return {
        product: "fetePass",
        label: "Fete Pass",
        description: `Fete Pass × ${qty}`,
        units: qty,
        lines: [{ id: "fetePass", label: "Fete Pass", qty, unitPaise, amountPaise: basePaise }],
        price: priceWithFees(basePaise, rates(settings)),
        collection: "passes",
        codePrefix: "MDZ-F",
        codesPerUnit: true,
      };
    },
  },

  cosplayEntry: {
    key: "cosplayEntry",
    label: "Cosplay entry",
    collection: "cosplayEntries",
    codePrefix: "MDZ-C",
    codesPerUnit: true,
    ticketed: true,
    capacity: (s) => s.cosplayCapacity,
    closed: (s) => (isPageHidden(s, "cosplay") ? "The cosplay contest is not open." : null),
    async quote(input, settings) {
      // One entry per checkout, solo or squad — a squad is still one walk.
      const body = (input ?? {}) as { mode?: unknown };
      const mode = body.mode === "team" ? "team" : "solo";
      const unitPaise = rupeesToPaise(settings.cosplayFee);

      return {
        product: "cosplayEntry",
        label: "Cosplay contest entry",
        description: mode === "team" ? "Cosplay squad entry" : "Cosplay solo entry",
        units: 1,
        lines: [
          {
            id: "cosplayEntry",
            label: mode === "team" ? "Squad entry" : "Solo entry",
            qty: 1,
            unitPaise,
            amountPaise: unitPaise,
          },
        ],
        price: priceWithFees(unitPaise, rates(settings)),
        collection: "cosplayEntries",
        codePrefix: "MDZ-C",
        codesPerUnit: true,
      };
    },
  },

  merch: {
    key: "merch",
    label: "Merch",
    collection: "merchOrders",
    codePrefix: "MDZ-M",
    codesPerUnit: false,
    ticketed: false,
    capacity: () => 0,
    closed: (s) => {
      if (isPageHidden(s, "merch")) return "The merch shop is closed.";
      if (!s.merchOpen) return s.merchClosedNote || "Pre-orders are closed.";
      return null;
    },
    async quote(input, settings) {
      const body = (input ?? {}) as { cart?: unknown };
      const cart = body.cart;
      if (!cart || typeof cart !== "object") return { error: "Your bag is empty.", status: 400 };

      // Prices come from the catalogue on the server; the cart only names items.
      const catalogue = await publicContent("merch");
      const lines: QuoteLine[] = [];

      for (const [id, rawQty] of Object.entries(cart as Record<string, unknown>)) {
        const qty = asQty(rawQty, MAX_MERCH_PER_ITEM);
        if (qty === null) continue;
        const item = catalogue.find((m) => m.id === id);
        if (!item) continue;
        const unitPaise = rupeesToPaise(Number(item.price ?? 0));
        if (unitPaise <= 0) continue;
        lines.push({
          id,
          label: String(item.name ?? "Item"),
          qty,
          unitPaise,
          amountPaise: unitPaise * qty,
        });
      }

      if (lines.length === 0) return { error: "Your bag is empty.", status: 400 };

      const units = lines.reduce((sum, l) => sum + l.qty, 0);
      const basePaise = lines.reduce((sum, l) => sum + l.amountPaise, 0);

      return {
        product: "merch",
        label: "MADOOZA merch",
        description: `${units} item${units === 1 ? "" : "s"} from the merch drop`,
        units,
        lines,
        price: priceWithFees(basePaise, rates(settings)),
        collection: "merchOrders",
        codePrefix: "MDZ-M",
        codesPerUnit: false,
      };
    },
  },
};

export function isQuoteError(value: Quote | QuoteError): value is QuoteError {
  return (value as QuoteError).error !== undefined;
}

/**
 * The buyer's own details, kept with the order rather than sent up again after
 * payment: the webhook has to be able to finish an order whose browser closed.
 */
export type Customer = {
  name: string;
  phone: string;
  email: string;
  school: string;
  /**
   * Who each pass is for, when an order buys more than one.
   *
   * A pass is scanned per person and carries a name at the gate, so three
   * passes bought together are three different people — not three copies of
   * the buyer. The first entry is the buyer themselves; the rest are whoever
   * they are bringing. Empty for a product where the idea does not apply.
   */
  attendees: string[];
  /** Product-specific extras — the cosplay character, the squad, and so on. */
  extra: Record<string, string>;
  /**
   * Whether they agreed to the pass being sent over WhatsApp.
   *
   * Meta requires an opt-in before a business may message anybody, and it has
   * to be the buyer's own answer rather than something inferred from the fact
   * that they typed a number. Stored with the order so the record of consent
   * sits beside the thing consented to.
   */
  whatsappOptIn: boolean;
};

const EXTRA_KEYS: Record<ProductKey, string[]> = {
  fetePass: [],
  cosplayEntry: ["character", "category", "mode", "team", "members"],
  merch: [],
};

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Validates the buyer block, returning either a customer or why it was refused. */
export function readCustomer(
  product: ProductKey,
  raw: unknown,
  /** How many passes this order is for, so the names can be counted against it. */
  units = 1,
): { customer: Customer } | { error: string } {
  const body = (raw ?? {}) as Record<string, unknown>;
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 20);
  const email = clean(body.email, 160).toLowerCase();

  if (name.length < 2) return { error: "Tell us the name this is for." };
  // Ten digits, however they were typed — spaces, dashes, a +91 in front.
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return { error: "That phone number doesn't look right." };
  // Both are required, and for the same reason: the pass goes to the address
  // and the day's messages go to the number, so an order missing either is one
  // the fest cannot deliver and cannot chase.
  if (!email) return { error: "We need an email address — it is where your pass is sent." };
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
    return { error: "That email address doesn't look right." };
  }

  const extra: Record<string, string> = {};
  for (const key of EXTRA_KEYS[product]) {
    const value = clean(body[key], 600);
    if (value) extra[key] = value;
  }

  if (product === "cosplayEntry" && !extra.character) {
    return { error: "Tell us who you are walking as." };
  }

  // One name per pass, the buyer first. A blank later box falls back to the
  // buyer's name rather than refusing the sale: a pass in somebody's name is
  // better than no pass, and the gate can be told who is actually holding it.
  const attendees: string[] = [];
  if (product === "fetePass" && units > 1) {
    const given = Array.isArray(body.attendees) ? body.attendees : [];
    for (let i = 0; i < units; i++) {
      const value = clean(given[i], 120);
      attendees.push(i === 0 ? value || name : value || name);
    }
  }

  return {
    customer: {
      name,
      phone,
      email,
      school: clean(body.school, 160),
      attendees,
      extra,
      whatsappOptIn: body.whatsappOptIn === true,
    },
  };
}
