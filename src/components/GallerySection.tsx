"use client";

import Image from "next/image";
import Link from "next/link";
import { galleryImages } from "@/lib/festData";
import ScrollReveal from "./ScrollReveal";
import { ArrowUpRight } from "lucide-react";

interface GallerySectionProps {
  full?: boolean;
}

const rotations = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];

export default function GallerySection({ full = false }: GallerySectionProps) {
  const shown = full ? galleryImages : galleryImages.slice(0, 8);
  return (
    <section
      id="gallery"
      className="relative bg-[var(--ink)] py-20 md:py-28 scroll-mt-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 md:px-8 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <span className="sticker sticker-violet">From The Field</span>
            <h2 className="font-quaron text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9]">
              <span className="text-rainbow">Madness in Motion</span>
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-white/70">
              Snippets from the buildup. The real gallery fills up after Dec 13 —
              tag <span className="text-[var(--acid)]">@madooza.in</span> and you might land in here.
            </p>
          </div>
        </ScrollReveal>

        <div className={`grid gap-4 ${full ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-4"}`}>
          {shown.map((src, i) => {
            const tall = i % 5 === 0 || i % 7 === 0;
            return (
              <ScrollReveal key={`${src}-${i}`} mode="scale" delay={i * 40}>
                <div
                  className={`relative overflow-hidden border-2 border-black bg-[var(--ink-2)] transition-transform duration-500 hover:rotate-0 hover:scale-[1.03] hover:z-10 ${
                    tall ? "aspect-[3/4]" : "aspect-square"
                  }`}
                  style={{
                    transform: `rotate(${rotations[i % rotations.length]})`,
                    boxShadow: `6px 6px 0 ${
                      ["var(--magenta)", "var(--cyan)", "var(--acid)", "var(--violet)", "var(--orange)"][i % 5]
                    }`,
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {!full && (
          <div className="mt-12 flex justify-center">
            <Link href="/gallery" className="btn-ghost-neon">
              <span>Open Gallery</span>
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
