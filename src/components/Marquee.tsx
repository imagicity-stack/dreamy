"use client";

import type { ReactNode } from "react";

interface MarqueeProps {
  items: string[];
  separator?: ReactNode;
  speed?: "fast" | "normal" | "slow";
  reverse?: boolean;
  className?: string;
  textClassName?: string;
  tone?: "acid" | "magenta" | "cyan" | "stripe-acid" | "stripe-magenta" | "ink";
  tilt?: "left" | "right" | "none";
}

const toneBg: Record<NonNullable<MarqueeProps["tone"]>, string> = {
  acid: "bg-[var(--acid)] text-[var(--ink)]",
  magenta: "bg-[var(--magenta)] text-white",
  cyan: "bg-[var(--cyan)] text-[var(--ink)]",
  "stripe-acid": "bg-stripe-acid text-[var(--acid)]",
  "stripe-magenta": "bg-stripe-magenta text-white",
  ink: "bg-[var(--ink)] text-[var(--acid)]",
};

export default function Marquee({
  items,
  separator,
  speed = "normal",
  reverse = false,
  className = "",
  textClassName = "",
  tone = "ink",
  tilt = "none",
}: MarqueeProps) {
  const speedClass =
    speed === "fast" ? "fast" : speed === "slow" ? "slow" : "";

  const tiltClass =
    tilt === "left" ? "tilt-band" : tilt === "right" ? "tilt-band-reverse" : "";

  return (
    <div
      className={`w-full overflow-hidden py-3 md:py-5 border-y-2 border-black ${toneBg[tone]} ${tiltClass} ${className}`}
    >
      <div className={`marquee-track ${speedClass} ${reverse ? "reverse" : ""}`}>
        {[0, 1].map((loop) => (
          <div
            key={loop}
            className="flex items-center gap-8 md:gap-12 flex-shrink-0 px-6"
            aria-hidden={loop === 1}
          >
            {items.map((item, idx) => (
              <span
                key={`${loop}-${idx}`}
                className={`font-bungee text-2xl sm:text-4xl md:text-5xl tracking-wide flex items-center gap-8 md:gap-12 ${textClassName}`}
              >
                {item}
                {separator ?? (
                  <span className="text-[var(--magenta)] text-4xl md:text-6xl">★</span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
