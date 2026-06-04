"use client";

import { useState } from "react";
import { faqs } from "@/lib/festData";
import ScrollReveal from "./ScrollReveal";
import { Plus } from "lucide-react";

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="relative bg-[var(--ink-2)] py-20 md:py-28 overflow-hidden scroll-mt-24"
    >
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-[420px] h-[420px] orb orb-orange orb-drift" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <span className="sticker sticker-cyan">Quick Answers</span>
            <h2 className="font-bowlby text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9]">
              <span className="text-rainbow">FAQ</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <ScrollReveal key={f.q} mode="up" delay={i * 60}>
                <div
                  className="border-2 border-black bg-[var(--ink-3)] transition-shadow"
                  style={{
                    boxShadow: isOpen ? "6px 6px 0 var(--acid)" : "4px 4px 0 var(--magenta)",
                  }}
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="font-bowlby text-xl md:text-2xl text-white">
                      {f.q}
                    </span>
                    <Plus
                      size={22}
                      strokeWidth={2.5}
                      className={`flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-45 text-[var(--acid)]" : "text-[var(--cyan)]"
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-400"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm md:text-base text-white/75 leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
