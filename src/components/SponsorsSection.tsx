"use client";

import Link from "next/link";
import { sponsors, type Sponsor } from "@/lib/festData";
import ScrollReveal from "./ScrollReveal";
import { ArrowUpRight, Handshake } from "lucide-react";

const accentMap = {
  acid: "var(--acid)",
  magenta: "var(--magenta)",
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  lime: "var(--lime)",
} as const;

const tiers: Sponsor["tier"][] = ["Headline", "Stage", "Zone", "Community"];

interface SponsorsSectionProps {
  full?: boolean;
}

export default function SponsorsSection({ full = false }: SponsorsSectionProps) {
  return (
    <section
      id="sponsors"
      className="relative bg-[var(--ink-2)] py-20 md:py-28 scroll-mt-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-neon opacity-15 pointer-events-none" />
      <div className="absolute -top-32 right-1/3 w-[460px] h-[460px] orb orb-acid orb-drift" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <span className="sticker sticker-lime">Powered By</span>
            <h2 className="font-bowlby text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9]">
              <span className="text-rainbow">Our Partners</span>
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-white/70">
              The brands fuelling the madness. Want your logo here? You&apos;re a
              message away.
            </p>
          </div>
        </ScrollReveal>

        {full ? (
          <div className="space-y-12">
            {tiers.map((tier) => {
              const tierItems = sponsors.filter((s) => s.tier === tier);
              if (!tierItems.length) return null;
              return (
                <ScrollReveal key={tier}>
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-bowlby text-3xl md:text-4xl text-[var(--acid)]">
                        {tier}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-white/40 to-transparent" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {tierItems.map((s, i) => (
                        <ScrollReveal key={`${s.name}-${i}`} mode="scale" delay={i * 60}>
                          <div
                            className="group relative border-2 border-black bg-[var(--ink-3)] aspect-[4/3] flex items-center justify-center p-4 transition-all hover:-translate-y-1 hover:rotate-[-1deg]"
                            style={{ boxShadow: `6px 6px 0 ${accentMap[s.accent]}` }}
                          >
                            <p
                              className="text-center font-bowlby text-2xl leading-tight"
                              style={{ color: accentMap[s.accent] }}
                            >
                              {s.name}
                            </p>
                            {s.blurb && (
                              <p className="absolute inset-0 p-4 bg-black/90 text-white/85 text-xs flex items-center text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {s.blurb}
                              </p>
                            )}
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sponsors.slice(0, 8).map((s, i) => (
              <ScrollReveal key={`${s.name}-${i}`} mode="scale" delay={i * 60}>
                <div
                  className="border-2 border-black bg-[var(--ink-3)] aspect-[4/3] flex items-center justify-center p-4 transition-all hover:-translate-y-1 hover:rotate-[-1deg]"
                  style={{ boxShadow: `6px 6px 0 ${accentMap[s.accent]}` }}
                >
                  <p
                    className="text-center font-bowlby text-2xl leading-tight"
                    style={{ color: accentMap[s.accent] }}
                  >
                    {s.name}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal>
          <div className="mt-14 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/sponsor" className="btn-acid">
              <Handshake size={18} strokeWidth={2.5} />
              <span>Sponsor Madooza</span>
            </Link>
            {!full && (
              <Link href="/sponsors" className="btn-ghost-neon">
                <span>All Partners</span>
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </Link>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
