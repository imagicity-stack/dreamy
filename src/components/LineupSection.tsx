"use client";

import Image from "next/image";
import Link from "next/link";
import { artists, type Artist } from "@/lib/festData";
import ScrollReveal from "./ScrollReveal";
import { ArrowUpRight } from "lucide-react";

const accentMap = {
  magenta: "var(--magenta)",
  cyan: "var(--cyan)",
  acid: "var(--acid)",
  violet: "var(--violet)",
  orange: "var(--orange)",
  lime: "var(--lime)",
} as const;

interface LineupSectionProps {
  full?: boolean;
}

function ArtistCard({ a, idx }: { a: Artist; idx: number }) {
  const accent = accentMap[a.accent];
  return (
    <ScrollReveal mode="up" delay={idx * 60} className="h-full">
      <div
        className="group relative h-full overflow-hidden border-2 border-black bg-[var(--ink-2)] transition-all hover:-translate-y-2 hover:rotate-[-1deg]"
        style={{ boxShadow: `8px 8px 0 ${accent}` }}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ink-3)]">
          {a.image ? (
            <Image
              src={a.image}
              alt={a.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-quaron text-5xl text-white/20">
              {a.category[0]}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <span
            className="absolute top-3 left-3 sticker"
            style={{ background: accent, color: "var(--ink)" }}
          >
            {a.category}
          </span>
          {a.time && (
            <span className="absolute top-3 right-3 sticker sticker-cyan">
              {a.time}
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="font-montserrat text-[0.6rem] uppercase tracking-[0.32em] text-white/70">
              {a.day}
            </p>
            <p
              className="mt-1 font-quaron text-2xl md:text-3xl leading-tight"
              style={{ color: accent }}
            >
              {a.name}
            </p>
            <p className="text-xs text-white/80 mt-1 font-montserrat tracking-[0.15em]">
              {a.role}
            </p>
          </div>
        </div>
        <div className="p-4 border-t-2 border-black/30">
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {a.about}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function LineupSection({ full = false }: LineupSectionProps) {
  const shown = full ? artists : artists.slice(0, 6);
  return (
    <section
      id="lineup"
      className="relative bg-[var(--ink-2)] py-20 md:py-28 scroll-mt-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
            <span className="sticker sticker-cyan">The Lineup</span>
            <h2 className="font-quaron text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9]">
              <span className="text-rainbow">Who&apos;s Playing</span>
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-white/70">
              Headliners drop in waves. Refresh, follow, and don&apos;t blink — slots
              fill fast and the surprise drops are loud.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {shown.map((a, idx) => (
            <ArtistCard key={a.name} a={a} idx={idx} />
          ))}
        </div>

        {!full && (
          <div className="mt-12 flex justify-center">
            <Link href="/lineup" className="btn-ghost-neon">
              <span>See Full Lineup</span>
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
