"use client";

import { type ReactNode } from "react";
import Orbs from "./Orbs";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  blurb?: string;
  align?: "center" | "left";
  children?: ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  blurb,
  align = "center",
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[var(--ink)] pt-32 pb-16 md:pt-40 md:pb-20">
      <div aria-hidden className="absolute inset-0 bg-grid-neon opacity-25" />
      <div aria-hidden className="absolute inset-0 bg-halftone opacity-10" />
      <Orbs />

      <div
        className={`relative z-10 mx-auto max-w-[1300px] px-4 md:px-8 lg:px-12 flex flex-col ${
          align === "center" ? "items-center text-center" : "items-start text-left"
        } gap-5`}
      >
        <span className="sticker sticker-magenta">{eyebrow}</span>
        <h1 className="font-bowlby text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase leading-[0.88]">
          <span className="text-rainbow">{title}</span>
        </h1>
        {blurb && (
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-white/75">
            {blurb}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
