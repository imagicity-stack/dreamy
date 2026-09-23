"use client";

import { track, toAmount } from "./pixel";
import { gtagEvent } from "./gtag";

/**
 * The three things worth measuring, said once.
 *
 * Meta and Google want the same facts under different names — InitiateCheckout
 * against begin_checkout, Purchase against purchase, Lead against
 * generate_lead — so the call sites report what happened and this translates.
 * The alternative is two lines at every event, which is how one of them
 * quietly stops being sent.
 *
 * Both take the amount actually charged, fee and GST included, because that is
 * the number the fest is really paid and the one an ad account should optimise
 * towards.
 */

export function trackCheckoutStarted(args: {
  product: string;
  totalPaise: number;
  currency: string;
  orderId: string;
}): void {
  const value = toAmount(args.totalPaise);

  track(
    "InitiateCheckout",
    { content_type: "product", content_ids: [args.product], value, currency: args.currency },
    args.orderId,
  );

  gtagEvent("begin_checkout", {
    currency: args.currency,
    value,
    items: [{ item_id: args.product, item_name: args.product, quantity: 1 }],
  });
}

export function trackPurchase(args: {
  product: string;
  units: number;
  totalPaise: number;
  currency: string;
  orderId: string;
}): void {
  const value = toAmount(args.totalPaise);

  track(
    "Purchase",
    {
      content_type: "product",
      content_ids: [args.product],
      contents: [{ id: args.product, quantity: args.units }],
      num_items: args.units,
      value,
      currency: args.currency,
    },
    args.orderId,
  );

  // GA4 de-duplicates a repeated purchase by transaction_id, which matters
  // here: a browser that reloads the confirmation must not be counted twice.
  gtagEvent("purchase", {
    transaction_id: args.orderId,
    currency: args.currency,
    value,
    items: [{ item_id: args.product, item_name: args.product, quantity: args.units, price: value }],
  });
}

export function trackLead(name: string, id: string): void {
  track("Lead", { content_name: name }, id);
  gtagEvent("generate_lead", { lead_source: name });
}
