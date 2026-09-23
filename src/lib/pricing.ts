/**
 * Every rupee figure the site charges, computed in one place.
 *
 * Two rules hold everywhere below:
 *
 * 1. Money is counted in paise, as integers. A price with a percentage in it
 *    stops being representable in rupees the moment it is a float, and
 *    Razorpay takes paise anyway.
 * 2. Nothing here runs in a browser to decide what is charged. The client may
 *    import this module to *show* a figure the server sent it, but the amount
 *    that reaches Razorpay is always computed on the server from the settings,
 *    never read back off a request body.
 *
 * The price is the price. A pass listed at ₹499 costs ₹499 — there is nothing
 * added at the last screen, and nothing to itemise, because a buyer who is
 * shown one number and charged another has been quoted a price that was never
 * true. Tax lives inside that amount rather than on top of it: the fest is
 * registered and has to account for GST, so the portion of each sale that is
 * tax is worked out here and kept with the order, where the council and its
 * accountant can find it. The buyer never sees it, and does not need to.
 *
 * If any of that changes it changes here, once, and the whole site — checkout,
 * receipts, the emails, the policies — follows.
 */

export type FeeRates = {
  /** GST, as a percentage, contained within the listed price. */
  gstPercent: number;
  /** Retired. Kept so orders written under the old model still read back. */
  convenienceFeePercent?: number;
  /** Retired, as above. */
  gstOnConvenienceFee?: boolean;
};

export type PriceBreakdown = {
  /** The sale net of the tax inside it — what the fest actually keeps. */
  basePaise: number;
  /** The tax contained in the price, for the fest's own books. */
  gstPaise: number;
  /** Always 0 now. Kept so orders taken under the old model still read back. */
  convenienceFeePaise: number;
  /** Always 0 now, as above. */
  feeGstPaise: number;
  /** What the buyer is charged, and what was listed. */
  totalPaise: number;
  /** The rates this breakdown was computed at, so a record can be re-read years later. */
  convenienceFeePercent: number;
  gstPercent: number;
};

export function rupeesToPaise(rupees: number): number {
  return Math.round(Number(rupees) * 100);
}

/** Paise as a rupee number, for the records that store rupees. */
export function paiseToRupees(paise: number): number {
  return Math.round(paise) / 100;
}

/**
 * What a listed price costs, and how much of it is tax.
 *
 * The listed figure is the whole of it. GST is extracted from inside rather
 * than added outside — ₹499 at 18% contains ₹76.12 of tax and leaves ₹422.88 —
 * which is the ordinary treatment for a price advertised to the public, and the
 * only one that lets the number on the poster be the number on the card.
 */
export function priceWithFees(listPaise: number, rates: FeeRates): PriceBreakdown {
  const total = Math.max(0, Math.round(listPaise));
  const gstPercent = clampPercent(rates.gstPercent);

  // The tax inside a tax-inclusive price: total × rate / (100 + rate).
  const gstPaise = gstPercent > 0 ? Math.round((total * gstPercent) / (100 + gstPercent)) : 0;

  return {
    basePaise: total - gstPaise,
    gstPaise,
    convenienceFeePaise: 0,
    feeGstPaise: 0,
    totalPaise: total,
    convenienceFeePercent: 0,
    gstPercent,
  };
}

/** A rate that is negative, absurd or not a number would silently mis-charge. */
function clampPercent(value: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, 100);
}

/**
 * ₹510.78 — with the paise dropped when there are none, because ₹499.00 on a
 * poster-loud fest site reads like a spreadsheet.
 */
export function formatPaise(paise: number): string {
  const value = Math.round(Number(paise) || 0) / 100;
  const whole = Number.isInteger(value);
  return (
    "₹" +
    value.toLocaleString("en-IN", {
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

export type BreakdownLine = { label: string; amountPaise: number; strong?: boolean };

/**
 * The money as a checkout prints it: one row.
 *
 * There is nothing to break down. What the page listed is what the card is
 * charged, so a second line could only restate the first — and a panel of
 * sub-totals is how a buyer learns to expect a surprise at the end.
 */
export function breakdownLines(price: PriceBreakdown, baseLabel = "TOTAL"): BreakdownLine[] {
  return [{ label: baseLabel, amountPaise: price.totalPaise, strong: true }];
}

/** 2 rather than 2.0, 2.5 rather than 2.50. */
export function formatPercent(value: number): string {
  return String(Math.round(Number(value) * 100) / 100);
}
