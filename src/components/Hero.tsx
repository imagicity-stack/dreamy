"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Ticket, MapPin, Sparkles, ArrowDown } from "lucide-react";
import Orbs from "./Orbs";

const HERO_TITLE = "MADOOZA";

interface HeroProps {
  onOpenTickets?: () => void;
}

const EVENT_DATE = "2025-12-13T15:00:00+05:30";

function useCountdown(target: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = +new Date(target) - Date.now();
      const clamped = Math.max(0, diff);
      const d = Math.floor(clamped / (1000 * 60 * 60 * 24));
      const h = Math.floor((clamped / (1000 * 60 * 60)) % 24);
      const m = Math.floor((clamped / (1000 * 60)) % 60);
      const s = Math.floor((clamped / 1000) % 60);
      setT({ d, h, m, s });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);
  return t;
}

export default function Hero({ onOpenTickets }: HeroProps) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { d, h, m, s } = useCountdown(EVENT_DATE);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--mx", `${x * 12}px`);
      el.style.setProperty("--my", `${y * 12}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative isolate w-full min-h-[100vh] overflow-hidden bg-[var(--ink)]"
    >
      <Image
        src="/hero.png"
        alt=""
        aria-hidden
        fill
        priority
        className="object-cover opacity-60"
        style={{ transform: "translate3d(var(--mx,0), var(--my,0), 0)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/85" />
      <div className="absolute inset-0 bg-grid-neon opacity-40 mix-blend-screen" />
      <Orbs />

      {/* Floating stickers */}
      <span className="hidden md:block absolute top-24 left-6 sticker sticker-magenta tilt-l wiggle">
        Live Dec 13 · 15:00
      </span>
      <span className="hidden md:block absolute top-32 right-6 sticker sticker-cyan tilt-r float-slow">
        Hazaribagh · Jharkhand
      </span>
      <span className="hidden lg:block absolute bottom-32 left-12 sticker sticker-lime tilt-r float-med">
        100% Outdoor · 12hr Madness
      </span>
      <span className="hidden lg:block absolute bottom-48 right-16 sticker sticker-violet tilt-l wiggle">
        Music · Cosplay · Stalls · Vibes
      </span>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] px-4 pt-24 pb-16 text-center">
        <div className="flex items-center gap-3 mb-5 text-[var(--cyan)]">
          <span className="h-px w-10 bg-[var(--cyan)]" />
          <span className="font-montserrat text-[0.65rem] sm:text-xs tracking-[0.45em]">
            HAZARIBAGH PRESENTS
          </span>
          <span className="h-px w-10 bg-[var(--cyan)]" />
        </div>

        <div
          className="hero-title font-league-gothic"
          role="heading"
          aria-level={1}
          aria-label="Madooza"
        >
          <span className="sr-only">Madooza</span>
          {HERO_TITLE.split("").map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="hero-letter"
              aria-hidden="true"
              style={{ animationDelay: `${i * 0.09}s` }}
            >
              {c}
            </span>
          ))}
        </div>

        <p className="mt-2 text-white/95 font-montserrat text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.32em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          The Sound of Pure Madness
        </p>

        <div className="mt-8 flex items-center gap-3 text-white/85">
          <MapPin size={16} className="text-[var(--acid)]" />
          <span className="font-montserrat text-xs sm:text-sm tracking-[0.32em] uppercase">
            Hazaribagh · 13 December
          </span>
        </div>

        {/* Countdown */}
        <div className="mt-8 flex items-end gap-2 sm:gap-3">
          {[
            { v: d, l: "Days" },
            { v: h, l: "Hours" },
            { v: m, l: "Mins" },
            { v: s, l: "Sec" },
          ].map((u, i) => (
            <div key={u.l} className="flex flex-col items-center">
              <div
                className="countdown-digit"
                style={{
                  boxShadow:
                    i % 2 === 0
                      ? "5px 5px 0 var(--cyan)"
                      : "5px 5px 0 var(--magenta)",
                }}
              >
                {String(u.v).padStart(2, "0")}
              </div>
              <span className="mt-2 font-montserrat text-[0.62rem] sm:text-xs tracking-[0.3em] text-white/70 uppercase">
                {u.l}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          {onOpenTickets ? (
            <button
              type="button"
              onClick={onOpenTickets}
              className="hero-cta-button mobile-tap text-sm sm:text-base"
            >
              <Ticket size={18} strokeWidth={3} />
              <span>Get Tickets Now</span>
            </button>
          ) : (
            <Link href="/tickets" className="hero-cta-button mobile-tap text-sm sm:text-base">
              <Ticket size={18} strokeWidth={3} />
              <span>Get Tickets Now</span>
            </Link>
          )}
          <Link
            href="/lineup"
            className="btn-ghost-neon text-sm sm:text-base"
          >
            <Sparkles size={16} strokeWidth={2.5} />
            <span>See Lineup</span>
          </Link>
        </div>

        <Link
          href="#scroll-target"
          className="mt-14 flex flex-col items-center gap-2 text-white/60 hover:text-[var(--acid)] transition-colors group"
          aria-label="Scroll down"
        >
          <span className="font-montserrat text-[0.6rem] tracking-[0.4em]">SCROLL</span>
          <ArrowDown size={18} className="animate-bounce group-hover:scale-125 transition-transform" />
        </Link>
      </div>

      <div id="scroll-target" />
    </section>
  );
}
