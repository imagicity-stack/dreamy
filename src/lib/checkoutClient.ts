"use client";

import { openRazorpayCheckout } from "./razorpayClient";
import type { PriceBreakdown } from "./pricing";

/**
 * The browser half of a payment, in one place.
 *
 * Three pages sell things and none of them does any arithmetic: they ask the
 * server what a basket costs, show exactly that, and hand the answer back when
 * Razorpay is done. The only numbers here are the ones the server sent.
 */

export type ProductKey = "fetePass" | "cosplayEntry" | "merch";

export type QuoteLine = {
  id: string;
  label: string;
  qty: number;
  unitPaise: number;
  amountPaise: number;
};

export type Quote = {
  product: ProductKey;
  label: string;
  description: string;
  units: number;
  lines: QuoteLine[];
  price: PriceBreakdown;
};

export type Receipt = {
  orderId: string;
  paymentId: string;
  product: ProductKey;
  label: string;
  description: string;
  units: number;
  codes: string[];
  primaryCode: string;
  lines: QuoteLine[];
  amount: PriceBreakdown & { currency: string };
  customerName: string;
  firstTime: boolean;
};

export type CustomerInput = {
  name: string;
  phone: string;
  email?: string;
  school?: string;
  /** Product extras — the cosplay character, the squad list. */
  [key: string]: string | undefined;
};

/** Thrown when the buyer closed the Razorpay window; not an error to shout about. */
export class CheckoutDismissed extends Error {
  constructor() {
    super("Checkout closed");
    this.name = "CheckoutDismissed";
  }
}

/**
 * Thrown when money was taken but this browser could not get the receipt. The
 * webhook will still finish the order, so the message says that rather than
 * implying the payment failed.
 */
export class PaidButUnconfirmed extends Error {
  constructor(public paymentId: string) {
    super(
      `Your payment went through (reference ${paymentId}) but the confirmation did not reach us. ` +
        `Your pass is being issued — keep this reference, and the fest office can confirm it.`,
    );
    this.name = "PaidButUnconfirmed";
  }
}

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  return (body && typeof body.error === "string" && body.error) || fallback;
}

/** What a basket costs, priced by the server. */
export async function fetchQuote(product: ProductKey, input: unknown): Promise<Quote> {
  const res = await fetch("/api/checkout/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product, input }),
  });
  if (!res.ok) throw new Error(await readError(res, "Could not price that"));
  return (await res.json()) as Quote;
}

/**
 * Opens Razorpay for a basket and resolves with the issued receipt.
 *
 * Every figure comes back from `/api/checkout/order`; the amount passed to the
 * modal is the one the server put on the Razorpay order, so there is nothing
 * here for a browser console to move.
 */
export async function startCheckout(args: {
  product: ProductKey;
  input: unknown;
  customer: CustomerInput;
  /** Shown as the heading inside the Razorpay window. */
  title?: string;
}): Promise<Receipt> {
  const orderRes = await fetch("/api/checkout/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product: args.product, input: args.input, customer: args.customer }),
  });
  if (!orderRes.ok) throw new Error(await readError(orderRes, "Could not start checkout"));
  const order = await orderRes.json();

  return new Promise<Receipt>((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    openRazorpayCheckout({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: args.title ?? "MADOOZA",
      description: order.description,
      order_id: order.orderId,
      prefill: {
        name: args.customer.name,
        contact: args.customer.phone,
        email: args.customer.email || undefined,
      },
      theme: { color: "#35C6D4" },
      handler: async (response) => {
        try {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          if (!verifyRes.ok) {
            const message = await readError(verifyRes, "");
            // A refusal the server can explain (sold out while paying) is worth
            // showing as written; anything else, the webhook is still working.
            finish(() =>
              reject(
                message
                  ? new Error(message)
                  : new PaidButUnconfirmed(response.razorpay_payment_id),
              ),
            );
            return;
          }
          const { receipt } = (await verifyRes.json()) as { receipt: Receipt };
          finish(() => resolve(receipt));
        } catch {
          finish(() => reject(new PaidButUnconfirmed(response.razorpay_payment_id)));
        }
      },
      modal: { ondismiss: () => finish(() => reject(new CheckoutDismissed())) },
    }).catch((e) => finish(() => reject(e instanceof Error ? e : new Error("Could not open checkout"))));
  });
}
