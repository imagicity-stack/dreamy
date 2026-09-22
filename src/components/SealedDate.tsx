import type { DateDisplay } from "@/lib/settings";

/**
 * The date treatment used wherever the fest's day would otherwise be printed.
 *
 * The reveal happens in two steps, so these have to read correctly at each:
 * nothing named, then the month named with the day still held back, then the
 * whole date. The tiles fill in one at a time on their own; the stamp has to
 * be told, because "DATE SEALED" is a lie once the month is public.
 */

type TileProps = {
  date: DateDisplay;
  /** Tile height. "lg" is the home hero, "sm" suits inline rows. */
  size?: "sm" | "lg";
};

export function SealedDateTiles({ date, size = "lg" }: TileProps) {
  const pad = size === "lg" ? "8px 14px" : "5px 10px";
  const fontSize = size === "lg" ? 22 : 16;

  // A revealed number gets the solid treatment; a held-back one keeps the
  // pulsing outline, so the tiles fill in as the council gives things away.
  const sealed = {
    background: "var(--ink)",
    color: "var(--teal)",
    border: "2px solid var(--teal)",
    borderRadius: 12,
    padding: pad,
    fontSize,
  } as const;

  const known = {
    background: "var(--lilac)",
    color: "var(--ink)",
    border: "2px solid var(--ink)",
    borderRadius: 12,
    padding: pad,
    fontSize,
  } as const;

  const dot = { fontSize, color: "var(--violet-text)" } as const;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <div
        className="font-display"
        style={date.dayTile === "??" ? { ...sealed, animation: "mzpulse 1.6s ease-in-out infinite" } : known}
      >
        {date.dayTile}
      </div>
      <div className="font-display" style={dot}>&middot;</div>
      <div
        className="font-display"
        style={
          date.monthTile === "??"
            ? { ...sealed, animation: "mzpulse 1.6s ease-in-out infinite", animationDelay: "0.35s" }
            : known
        }
      >
        {date.monthTile}
      </div>
      <div className="font-display" style={dot}>&middot;</div>
      <div className="font-display" style={known}>{date.yearTile}</div>
    </div>
  );
}

/** A small rotated sticker for page corners and pass cards. */
export function SealedDateStamp({ date, rotate = -3 }: { date: DateDisplay; rotate?: number }) {
  return (
    <div
      className="font-display"
      style={{
        display: "inline-block",
        background: "var(--crimson)",
        color: "var(--paper)",
        border: "3px solid var(--ink)",
        borderRadius: 14,
        boxShadow: "4px 4px 0 var(--ink)",
        padding: "8px 14px",
        fontSize: 13,
        letterSpacing: "0.08em",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {/* Only a fully sealed date is a secret. Once the month is out, say it —
          date.short is "NOVEMBER 2026", and its own line elsewhere carries the
          fact that the day is still coming. */}
      {date.mode === "sealed" ? "DATE SEALED" : date.short}
    </div>
  );
}
