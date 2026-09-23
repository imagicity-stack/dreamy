"use client";

import { breakdownLines, formatPaise, type PriceBreakdown } from "@/lib/pricing";

/**
 * The money under a checkout.
 *
 * One row, because the price listed is the price charged and a second line
 * could only restate the first. The figure is the one the server sent back
 * with the quote, printed as given — nothing here recomputes anything.
 */
export default function PriceLines({
  price,
  baseLabel = "SUBTOTAL",
  tone = "dark",
}: {
  price: PriceBreakdown;
  baseLabel?: string;
  tone?: "dark" | "light";
}) {
  const muted = tone === "dark" ? "#C4AAE4" : "#6B5292";
  const strong = tone === "dark" ? "var(--lilac)" : "var(--ink)";
  const rule = tone === "dark" ? "1px dashed #4A2A73" : "1px dashed #C9B6E4";

  const lines = breakdownLines(price, baseLabel);
  // The rule divided a total from the rows above it; with one row there are
  // none, and a line over the only figure reads as a mistake.
  const ruled = lines.length > 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {lines.map((line) => (
        <div
          key={line.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 12,
            paddingTop: line.strong && ruled ? 9 : 0,
            borderTop: line.strong && ruled ? rule : undefined,
          }}
        >
          <span
            style={{
              fontSize: line.strong ? 11 : 10.5,
              letterSpacing: "0.14em",
              fontWeight: line.strong ? 700 : 400,
              color: line.strong ? strong : muted,
            }}
          >
            {line.label}
          </span>
          {line.strong ? (
            <span className="font-display" style={{ fontSize: 22, color: tone === "dark" ? "var(--teal)" : "var(--ink)" }}>
              {formatPaise(line.amountPaise)}
            </span>
          ) : (
            <span style={{ fontSize: 13.5, color: strong }}>{formatPaise(line.amountPaise)}</span>
          )}
        </div>
      ))}
    </div>
  );
}
