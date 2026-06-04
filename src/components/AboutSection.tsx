"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const stats = [
  { v: "50+", l: "Creators & Brands", c: "var(--acid)" },
  { v: "20+", l: "Live Experiences", c: "var(--cyan)" },
  { v: "12hr", l: "Of Pure Madness", c: "var(--magenta)" },
  { v: "1", l: "City. One Movement.", c: "var(--violet)" },
];

const features = [
  {
    title: "Immersive Zones",
    desc: "Live stages, art alleys, gaming corners, and food pop-ups — every sense buzzing from day to night.",
    color: "var(--cyan)",
    icon: "◢◤",
  },
  {
    title: "Creator-First",
    desc: "Local brands and artists own the spotlight, with resources and reach to scale their craft.",
    color: "var(--magenta)",
    icon: "✦",
  },
  {
    title: "Community Energy",
    desc: "Built with and for Hazaribagh — raw, real, and unmistakably ours.",
    color: "var(--acid)",
    icon: "◐",
  },
];

export default function AboutSection() {
  return (
    <section
      id="aboutus"
      className="relative bg-[var(--ink)] py-20 md:py-28 scroll-mt-24 text-white overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-grid-neon opacity-20 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -top-24 -left-24 w-[420px] h-[420px] orb orb-magenta orb-drift"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -right-24 w-[420px] h-[420px] orb orb-cyan orb-drift"
        style={{ animationDelay: "4s" }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4">
            <span className="sticker sticker-magenta">Why Madooza</span>
            <h2 className="font-quaron text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-rainbow leading-[0.95]">
              About The Madness
            </h2>
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-white/80">
              Madooza is Hazaribagh’s first creative explosion — a 12-hour collision
              of music, cosplay, art, food, and ideas. Born in 2025 with one mission:
              give the city a stage worthy of its energy.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid items-stretch gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <ScrollReveal mode="left" className="flex flex-col gap-6">
            <div className="relative overflow-hidden border-2 border-black bg-[var(--ink-2)] p-8 md:p-10 poster-card poster-card-cyan">
              <div className="absolute -top-3 left-6 sticker sticker-magenta">Manifesto</div>
              <h3 className="mt-4 font-quaron text-3xl md:text-4xl uppercase text-[var(--acid)]">
                The Sound of Pure Madness
              </h3>
              <p className="mt-4 text-sm md:text-base text-white/85 leading-relaxed">
                Madooza is not just another fest. It’s a playground for creators,
                entrepreneurs, and dreamers. A bazaar that turns into a moshpit
                that turns into a runway that turns into a midnight singalong.
              </p>
              <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">
                From food stalls to live exhibitions and cosplay parades — every
                corner is built to spark curiosity, collaboration, and chaos.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {features.map((f, i) => (
                <ScrollReveal key={f.title} mode="up" delay={i * 100}>
                  <div
                    className="h-full bg-[var(--ink-3)] border-2 border-black p-5 transition-transform hover:-translate-y-1 hover:rotate-[-1deg]"
                    style={{ boxShadow: `6px 6px 0 ${f.color}` }}
                  >
                    <div
                      className="font-quaron text-2xl mb-2"
                      style={{ color: f.color }}
                    >
                      {f.icon}
                    </div>
                    <h4 className="font-montserrat text-sm font-extrabold uppercase tracking-[0.15em] mb-2"
                      style={{ color: f.color }}
                    >
                      {f.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <ScrollReveal key={s.l} mode="scale" delay={i * 80}>
                  <div
                    className="border-2 border-black bg-[var(--ink-2)] px-3 py-5 text-center"
                    style={{ boxShadow: `5px 5px 0 ${s.c}` }}
                  >
                    <p
                      className="font-quaron text-3xl md:text-4xl leading-none"
                      style={{ color: s.c }}
                    >
                      {s.v}
                    </p>
                    <p className="mt-2 text-[0.6rem] sm:text-xs uppercase tracking-[0.28em] text-white/70 font-montserrat">
                      {s.l}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal mode="right">
            <div className="relative overflow-hidden border-2 border-black bg-[var(--ink-2)] h-full min-h-[480px]"
              style={{ boxShadow: "10px 10px 0 var(--magenta)" }}
            >
              <Image
                src="/aboutUs.jpg"
                alt="Friends enjoying Madooza"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute top-4 right-4 sticker sticker-cyan tilt-r">
                #Madooza25
              </div>

              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <p className="font-montserrat text-[0.65rem] uppercase tracking-[0.5em] text-[var(--acid)]">
                  This is Madooza
                </p>
                <p className="font-quaron text-3xl md:text-4xl text-white leading-tight">
                  Built for the dreamers turning Hazaribagh into a creative capital.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
