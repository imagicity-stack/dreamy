"use client";

import Link from "next/link";
import { scheduleDay1 } from "@/lib/festData";
import ScrollReveal from "./ScrollReveal";
import { ArrowUpRight, Clock } from "lucide-react";

const tagAccent: Record<string, string> = {
  Live: "var(--magenta)",
  Cosplay: "var(--violet)",
  Food: "var(--lime)",
  Talk: "var(--cyan)",
  Stalls: "var(--orange)",
  DJ: "var(--acid)",
};

interface ScheduleSectionProps {
  full?: boolean;
}

export default function ScheduleSection({ full = false }: ScheduleSectionProps) {
  const shown = full ? scheduleDay1 : scheduleDay1.slice(0, 6);

  return (
    <section
      id="schedule"
      className="relative bg-[var(--ink)] py-20 md:py-28 scroll-mt-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-neon opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] orb orb-violet orb-drift" />

      <div className="relative z-10 mx-auto max-w-[1100px] px-4 md:px-8 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <span className="sticker sticker-magenta">Saturday · 13 December</span>
            <h2 className="font-bowlby text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9]">
              <span className="text-rainbow">The Schedule</span>
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-white/70">
              Twelve hours. Three zones. Zero dead air. Plot your route, then forget it
              and follow the loudest sound.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div
            aria-hidden
            className="hidden md:block absolute left-[7.5rem] top-2 bottom-2 w-1 bg-gradient-to-b from-[var(--magenta)] via-[var(--acid)] to-[var(--cyan)]"
          />

          <ul className="space-y-4 md:space-y-5">
            {shown.map((s, i) => {
              const accent = tagAccent[s.tag] ?? "var(--acid)";
              return (
                <ScrollReveal key={`${s.start}-${s.title}`} mode="left" delay={i * 60}>
                  <li
                    className="relative grid grid-cols-[auto_1fr] md:grid-cols-[7rem_auto_1fr] items-stretch gap-3 md:gap-6"
                  >
                    <div className="hidden md:flex flex-col items-end justify-center pr-2">
                      <span
                        className="font-bowlby text-2xl md:text-3xl leading-none"
                        style={{ color: accent }}
                      >
                        {s.start}
                      </span>
                    </div>

                    <div className="hidden md:flex items-center">
                      <span
                        className="h-5 w-5 rounded-full border-2 border-black ring-2 ring-[var(--ink)]"
                        style={{ background: accent }}
                      />
                    </div>

                    <div
                      className="border-2 border-black bg-[var(--ink-2)] p-4 md:p-5 transition-transform hover:-translate-y-1"
                      style={{ boxShadow: `5px 5px 0 ${accent}` }}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="md:hidden inline-flex items-center gap-1 font-bowlby text-xl" style={{ color: accent }}>
                          <Clock size={14} />
                          {s.start}
                        </span>
                        <span
                          className="sticker"
                          style={{ background: accent, color: "var(--ink)" }}
                        >
                          {s.tag}
                        </span>
                        <span className="font-montserrat text-[0.6rem] sm:text-xs tracking-[0.3em] uppercase text-white/60">
                          {s.zone}
                        </span>
                      </div>
                      <p className="font-bowlby text-2xl md:text-3xl text-white leading-tight">
                        {s.title}
                      </p>
                      {s.desc && (
                        <p className="mt-1 text-xs md:text-sm text-white/65">
                          {s.desc}
                        </p>
                      )}
                    </div>
                  </li>
                </ScrollReveal>
              );
            })}
          </ul>
        </div>

        {!full && (
          <div className="mt-12 flex justify-center">
            <Link href="/schedule" className="btn-ghost-neon">
              <span>Full Schedule</span>
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
