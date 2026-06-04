"use client";

import ScrollReveal from "./ScrollReveal";
import { MapPin, Compass, Wifi, Car, UtensilsCrossed, ShieldCheck } from "lucide-react";

const amenities = [
  { icon: Car, label: "On-site Parking" },
  { icon: UtensilsCrossed, label: "20+ Food Vendors" },
  { icon: Wifi, label: "Free Wi-Fi Zones" },
  { icon: ShieldCheck, label: "Trained Stewards" },
  { icon: Compass, label: "Open-Air Stages" },
  { icon: MapPin, label: "Centrally Located" },
];

export default function VenueSection() {
  return (
    <section
      id="venue"
      className="relative bg-[var(--ink-2)] py-20 md:py-28 scroll-mt-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-neon opacity-15 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] orb orb-cyan orb-drift" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <span className="sticker sticker-cyan">The Venue</span>
            <h2 className="font-quaron text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9]">
              <span className="text-rainbow">Find The Madness</span>
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-white/70">
              Hazaribagh — Jharkhand’s creative heartland. Exact pin drops two weeks
              out, but the city is your map until then.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          <ScrollReveal mode="left">
            <div
              className="relative h-full min-h-[420px] overflow-hidden border-2 border-black bg-[var(--ink-3)]"
              style={{ boxShadow: "10px 10px 0 var(--magenta)" }}
            >
              <iframe
                title="Hazaribagh map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=85.27%2C23.95%2C85.45%2C24.05&amp;layer=mapnik&amp;marker=24.0,85.36"
                className="absolute inset-0 w-full h-full grayscale contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute top-4 left-4 sticker sticker-magenta tilt-l wiggle">
                <MapPin size={12} className="inline mr-1" /> You drop here
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal mode="right">
            <div
              className="h-full border-2 border-black bg-[var(--ink-3)] p-8 md:p-10"
              style={{ boxShadow: "10px 10px 0 var(--acid)" }}
            >
              <p className="font-montserrat text-xs tracking-[0.4em] uppercase text-[var(--acid)]">
                Saturday · 13 December 2025
              </p>
              <h3 className="mt-3 font-quaron text-4xl md:text-5xl text-white leading-[0.95]">
                Hazaribagh,
                <br />
                <span className="text-[var(--cyan)]">Jharkhand</span>
              </h3>
              <p className="mt-4 text-sm md:text-base text-white/75 leading-relaxed">
                Twelve hours of open-air madness in the city centre. Multiple zones,
                multiple stages, one wristband.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://www.google.com/maps/place/Hazaribagh,+Jharkhand"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-magenta text-xs sm:text-sm"
                >
                  <Compass size={16} strokeWidth={2.5} />
                  Open in Maps
                </a>
                <a
                  href="https://www.openstreetmap.org/?mlat=24.0&mlon=85.36"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost-neon text-xs sm:text-sm"
                >
                  <MapPin size={16} strokeWidth={2.5} />
                  Open Street View
                </a>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map(({ icon: Icon, label }, i) => (
                  <ScrollReveal key={label} mode="scale" delay={i * 60}>
                    <div className="flex flex-col items-start gap-2 border-2 border-black bg-[var(--ink-2)] p-3 hover:bg-[var(--ink)] transition-colors">
                      <Icon size={20} className="text-[var(--cyan)]" />
                      <p className="font-montserrat text-[0.62rem] sm:text-xs tracking-[0.18em] uppercase text-white/85">
                        {label}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
