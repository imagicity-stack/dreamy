"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function remaining(targetMs: number): Parts | null {
  const diff = targetMs - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

/**
 * The countdown the council starts from the panel. The clock only runs after
 * mount — the server has no idea what time it is in the visitor's browser, so
 * rendering figures during SSR would guarantee a hydration mismatch.
 */
export default function Countdown({
  target,
  label,
  tone = "dark",
}: {
  target: string;
  label: string;
  tone?: "dark" | "light";
}) {
  const targetMs = Date.parse(target);
  const valid = Number.isFinite(targetMs);
  const [parts, setParts] = useState<Parts | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!valid) return;
    setLive(true);
    setParts(remaining(targetMs));
    const id = setInterval(() => setParts(remaining(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs, valid]);

  if (!valid) return null;

  const tiles: { value: number; unit: string }[] = parts
    ? [
        { value: parts.days, unit: "DAYS" },
        { value: parts.hours, unit: "HRS" },
        { value: parts.minutes, unit: "MIN" },
        { value: parts.seconds, unit: "SEC" },
      ]
    : [
        { value: 0, unit: "DAYS" },
        { value: 0, unit: "HRS" },
        { value: 0, unit: "MIN" },
        { value: 0, unit: "SEC" },
      ];

  const done = live && parts === null;
  const numberColor = tone === "dark" ? "var(--teal)" : "var(--ink)";
  const tileBg = tone === "dark" ? "var(--near-black)" : "var(--lilac)";
  const tileBorder = tone === "dark" ? "2px solid var(--teal)" : "2px solid var(--ink)";
  const labelColor = tone === "dark" ? "var(--violet-text)" : "var(--purple)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: labelColor }}>
        {done ? "IT'S HAPPENING" : label}
      </div>
      {done ? (
        <div className="font-display" style={{ fontSize: "clamp(24px, 5vw, 38px)", color: numberColor, lineHeight: 1 }}>
          TODAY
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tiles.map((t) => (
            <div
              key={t.unit}
              style={{
                background: tileBg,
                border: tileBorder,
                borderRadius: 14,
                padding: "10px 14px",
                minWidth: 66,
                textAlign: "center",
              }}
            >
              <div
                className="font-display"
                style={{ fontSize: 26, lineHeight: 1, color: numberColor, opacity: live ? 1 : 0.35 }}
                suppressHydrationWarning
              >
                {live ? String(t.value).padStart(2, "0") : "--"}
              </div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.16em", color: labelColor, marginTop: 6 }}>
                {t.unit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
