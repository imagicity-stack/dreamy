"use client";

import { ticketTiers } from "@/lib/festData";
import ScrollReveal from "./ScrollReveal";
import { Check, Ticket } from "lucide-react";

const accentMap = {
  acid: "var(--acid)",
  magenta: "var(--magenta)",
  cyan: "var(--cyan)",
  violet: "var(--violet)",
} as const;

interface TicketsSectionProps {
  onOpenTickets: () => void;
}

export default function TicketsSection({ onOpenTickets }: TicketsSectionProps) {
  return (
    <section
      id="tickets"
      className="relative bg-[var(--ink)] py-20 md:py-28 scroll-mt-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-neon opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] orb orb-magenta orb-drift" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <span className="sticker sticker-magenta pulse-magenta">Live now</span>
            <h2 className="font-bowlby text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9]">
              <span className="text-rainbow">Grab Your Pass</span>
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-white/70">
              Tickets are limited, but we kept prices honest. Pick a tier and we&apos;ll
              meet you at the gate.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {ticketTiers.map((tier, i) => {
            const accent = accentMap[tier.accent];
            return (
              <ScrollReveal key={tier.name} mode="scale" delay={i * 100}>
                <div
                  className={`relative h-full flex flex-col overflow-hidden border-2 border-black bg-[var(--ink-2)] transition-all hover:-translate-y-2 ${
                    tier.highlight ? "lg:-translate-y-4" : ""
                  }`}
                  style={{
                    boxShadow: `${tier.highlight ? "12px 12px" : "8px 8px"} 0 ${accent}`,
                  }}
                >
                  {tier.highlight && (
                    <div
                      className="absolute top-4 right-4 sticker pulse-acid"
                      style={{ background: accent, color: "var(--ink)" }}
                    >
                      Most Popular
                    </div>
                  )}

                  <div className="p-6 sm:p-8 border-b-2 border-black/30">
                    <p className="font-montserrat text-[0.65rem] uppercase tracking-[0.4em] text-white/55">
                      {tier.name}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span
                        className="font-bowlby text-5xl md:text-6xl leading-none"
                        style={{ color: accent }}
                      >
                        ₹{tier.price}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-white/70">{tier.blurb}</p>
                  </div>

                  <ul className="flex-1 p-6 sm:p-8 space-y-3">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-white/85">
                        <span
                          className="mt-0.5 flex-shrink-0 inline-flex h-5 w-5 items-center justify-center border-2 border-black"
                          style={{ background: accent }}
                        >
                          <Check size={12} strokeWidth={3} color="#000" />
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-6 sm:p-8 pt-0">
                    <button
                      type="button"
                      onClick={onOpenTickets}
                      className={tier.highlight ? "btn-acid w-full justify-center" : "btn-magenta w-full justify-center"}
                    >
                      <Ticket size={16} strokeWidth={2.5} />
                      <span>Book {tier.name.split(" ")[0]}</span>
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal>
          <p className="mt-10 text-center text-xs text-white/55 max-w-2xl mx-auto">
            All passes are non-transferable post-payment confirmation. By booking you
            agree to our Terms, Privacy Policy, and Cancellation Policy.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
