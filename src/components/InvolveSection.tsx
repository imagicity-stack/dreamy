"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { ArrowUpRight } from "lucide-react";

const options = [
  {
    name: "Bring Your Stall",
    desc: "Showcase food, art, games, or merch in a high-energy bazaar built for creators.",
    logo: "/involve/stall.jpg",
    href: "/stall",
    accent: "var(--acid)",
  },
  {
    name: "Cosplay Event",
    desc: "Step into character and own Jharkhand's wildest fandom stage at MADOOZA.",
    logo: "/involve/cosplay.jpg",
    href: "/cosplay",
    accent: "var(--magenta)",
  },
  {
    name: "Performers",
    desc: "From bands and DJs to poets and dancers, light up the lineup with your act.",
    logo: "/involve/Perfomers.jpg",
    href: "/performer",
    accent: "var(--cyan)",
  },
  {
    name: "Volunteers",
    desc: "Join the crew, earn experience, and see the madness from behind the scenes.",
    logo: "/involve/volunteer.jpg",
    href: "/volunteer",
    accent: "var(--violet)",
  },
  {
    name: "Sponsors",
    desc: "Partner with MADOOZA to amplify your brand across Jharkhand's youth movement.",
    logo: "/involve/sponsorship.png",
    href: "/sponsor",
    accent: "var(--lime)",
  },
];

export default function InvolveSection() {
  const [active, setActive] = useState(options[0].name);
  const current = options.find((o) => o.name === active) ?? options[0];

  return (
    <section
      id="involvewithus"
      className="relative bg-[var(--ink)] py-20 md:py-28 px-4 scroll-mt-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-neon opacity-25 pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-[420px] h-[420px] orb orb-orange orb-drift" />

      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <span className="sticker sticker-violet">Join In</span>
            <h2 className="font-bowlby text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9]">
              <span className="text-rainbow">Involve With Us</span>
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-white/70">
              Bring your stall, your set, your costume, or your craft. Madooza
              runs on people who show up loud.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="scroll-x">
            <div className="flex gap-2 min-w-max md:min-w-0 md:grid md:grid-cols-5">
              {options.map((o) => {
                const isActive = active === o.name;
                return (
                  <button
                    key={o.name}
                    onClick={() => setActive(o.name)}
                    className={`relative cursor-pointer font-montserrat tracking-[0.14em] text-[0.7rem] sm:text-xs uppercase whitespace-nowrap px-4 py-3 border-2 border-black transition-all ${
                      isActive
                        ? "text-[var(--ink)]"
                        : "text-white bg-[var(--ink-3)] hover:bg-[var(--ink-2)]"
                    }`}
                    style={
                      isActive
                        ? { background: o.accent, boxShadow: "5px 5px 0 #000" }
                        : { boxShadow: "3px 3px 0 #000" }
                    }
                  >
                    {o.name}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <ScrollReveal mode="left">
            <div
              className="h-full border-2 border-black bg-[var(--ink-2)] p-8 md:p-10 lg:p-12 flex flex-col justify-center"
              style={{ boxShadow: `10px 10px 0 ${current.accent}` }}
            >
              <p className="font-montserrat text-[0.65rem] uppercase tracking-[0.4em] text-white/55">
                Currently viewing
              </p>
              <h3
                className="mt-3 font-bowlby text-4xl md:text-5xl lg:text-6xl uppercase leading-[0.95]"
                style={{ color: current.accent }}
              >
                {current.name}
              </h3>
              <p className="mt-5 text-sm md:text-base text-white/80 leading-relaxed">
                {current.desc}
              </p>
              <Link
                href={current.href}
                className="mt-7 inline-flex w-fit items-center gap-2 border-2 border-black bg-[var(--acid)] text-[var(--ink)] px-5 py-3 font-montserrat text-xs tracking-[0.2em] uppercase shadow-[5px_5px_0_#000] hover:shadow-[8px_8px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                Learn More
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal mode="right">
            <div
              key={current.name}
              className="relative h-full min-h-[300px] overflow-hidden border-2 border-black bg-[var(--ink-3)]"
              style={{ boxShadow: `10px 10px 0 ${current.accent}` }}
            >
              <Image
                src={current.logo}
                alt={current.name}
                fill
                className="object-cover transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span
                className="absolute top-4 right-4 sticker"
                style={{ background: current.accent, color: "var(--ink)" }}
              >
                Featured
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
