/**
 * Every rupee figure the site charges, computed in one place.
 *
 * Two rules hold everywhere below:
 *
 * 1. Money is counted in paise, as integers. A price with a percentage on top
 *    stops being representable in rupees the moment it is a float — 499 × 1.02
 *    is 508.98000000000002 — and Razorpay takes paise anyway.
 * 2. Nothing here runs in a browser to decide what is charged. The client may
 *    import this module to *show* a breakdown the server sent it, but the
 *    figure that reaches Razorpay is always computed on the server from the
 *    settings, never read back off a request body.
 *
 * What is charged, in the order the buyer sees it:
 *
 *   the ticket price
 *   + GST on the ticket
 *   + a convenience fee, taken as a percentage of the ticket price
 *   + GST on that fee
 *
 * GST sits on the ticket itself, which is the thing being sold; the fee is a
 * separate service and carries its own GST, which is the ordinary treatment and
 * why it is billed as its own line. A council that does not want GST on the fee
 * turns off `gstOnConvenienceFee` in the panel and the fee line goes out clean.
 *
 * If any of that changes it changes here, once, and the whole site — checkout,
 * receipts, the emails, the policies — follows.
 */

export type FeeRates = {
  /** Convenience fee, as a percentage of the ticket price. */
  convenienceFeePercent: number;
  /** GST, as a percentage. Applies to the ticket, and to the fee unless told otherwise. */
  gstPercent: number;
  /** Whether the convenience fee carries GST of its own. Normally it does. */
  gstOnConvenienceFee: boolean;
};

export type PriceBreakdown = {
  /** The tickets or items themselves. */
  basePaise: number;
  /** GST on that. */
  gstPaise: number;
  convenienceFeePaise: number;
  /** GST on the convenience fee, or 0 when the fee is exempt. */
  feeGstPaise: number;
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
 * The ticket, its GST, the convenience fee, and the fee's GST.
 *
 * Every line is rounded to a whole paisa on its own, from the ticket price,
 * rather than each one compounding on the last. The four lines on screen then
 * add up to the total that is charged — a breakdown that doesn't add up is
 * worse than no breakdown at all.
 */
export function priceWithFees(basePaise: number, rates: FeeRates): PriceBreakdown {
  const base = Math.max(0, Math.round(basePaise));
  const feePercent = clampPercent(rates.convenienceFeePercent);
  const gstPercent = clampPercent(rates.gstPercent);

  const gstPaise = Math.round((base * gstPercent) / 100);
  const convenienceFeePaise = Math.round((base * feePercent) / 100);
  const feeGstPaise = rates.gstOnConvenienceFee
    ? Math.round((convenienceFeePaise * gstPercent) / 100)
    : 0;

  return {
    basePaise: base,
    gstPaise,
    convenienceFeePaise,
    feeGstPaise,
    totalPaise: base + gstPaise + convenienceFeePaise + feeGstPaise,
    convenienceFeePercent: feePercent,
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

/** The breakdown as the rows a checkout panel prints, in order. */
export function breakdownLines(price: PriceBreakdown, baseLabel = "SUBTOTAL"): BreakdownLine[] {
  const lines: BreakdownLine[] = [{ label: baseLabel, amountPaise: price.basePaise }];
  if (price.gstPaise > 0) {
    lines.push({
      label: `GST (${formatPercent(price.gstPercent)}%)`,
      amountPaise: price.gstPaise,
    });
  }
  if (price.convenienceFeePaise > 0) {
    lines.push({
      label: `CONVENIENCE FEE (${formatPercent(price.convenienceFeePercent)}%)`,
      amountPaise: price.convenienceFeePaise,
    });
  }
  if (price.feeGstPaise > 0) {
    lines.push({
      label: `GST ON FEE (${formatPercent(price.gstPercent)}%)`,
      amountPaise: price.feeGstPaise,
    });
  }
  lines.push({ label: "TOTAL", amountPaise: price.totalPaise, strong: true });
  return lines;
}

/** 2 rather than 2.0, 2.5 rather than 2.50. */
export function formatPercent(value: number): string {
  return String(Math.round(Number(value) * 100) / 100);
}
