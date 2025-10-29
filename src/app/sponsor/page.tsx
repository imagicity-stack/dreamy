"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

const sponsorshipOptions = [
  {
    title: "Title Sponsor",
    description: "Logo on stage, main banners, and all digital creatives.",
  },
  {
    title: "Powered By Partner",
    description: "Brand placement on merchandise, tickets, and influencer shout-outs.",
  },
  {
    title: "Zone Sponsor",
    description: "Own a food, art, gaming, or chill zone with immersive branding.",
  },
  {
    title: "In-Kind Partner",
    description: "Product collaboration, barter tie-ups, or experience integration.",
  },
];

const deliverables = [
  "Curated content collabs with our creator network.",
  "LED screens, stage mentions, and emcee shout-outs.",
  "Press coverage and post-event aftermovie branding.",
  "Access to attendee data for post-event engagement.",
];

const formFieldClasses =
  "w-full bg-white px-4 py-3 text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-black/50";

export default function SponsorPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
        <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 bg-[#ff1a1a] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 bg-[#ffe300] opacity-40 blur-3xl" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
          <span className="font-montserrat text-xs uppercase tracking-[0.6em] text-[#ffe300]">Involve With Us</span>
          <h1 className="font-travel-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-white">
            Partner With Madooza
          </h1>
          <p className="max-w-3xl text-base sm:text-lg md:text-xl text-white/80">
            Collaborate with Madooza to connect your brand with Jharkhand’s most dynamic youth audience. Sponsorship delivers
            visibility across digital media, on-ground branding, and immersive engagement opportunities.
          </p>
        </div>
      </section>

      <section className="border-y border-[#ffe300]/30 bg-black py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <div className="flex flex-col gap-6 bg-[#ffe300] p-8 text-black shadow-[0_0_35px_rgba(255,227,0,0.25)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase">Sponsorship Options</h2>
            <ul className="space-y-4 text-sm sm:text-base">
              {sponsorshipOptions.map((option) => (
                <li key={option.title} className="bg-black px-5 py-4 text-white">
                  <span className="font-montserrat text-xs uppercase tracking-[0.3em] text-[#ffe300]">{option.title}</span>
                  <p className="mt-2 text-sm sm:text-base text-white/80">{option.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 bg-[#ff1a1a] p-8 text-white shadow-[0_0_35px_rgba(255,26,26,0.25)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase">Brand Deliverables</h2>
            <ul className="space-y-3 text-sm sm:text-base text-white/80">
              {deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="bg-black px-4 py-3 text-sm text-white">
              Sponsorship deck and media kit will be mailed after form submission.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#ffe300]/30 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="font-travel-sans text-3xl uppercase text-[#ffe300]">Let’s Craft an Experience Together</h2>
          <p className="mt-4 text-sm sm:text-base text-white/80">
            Share your brand vision, preferred deliverables, and we’ll curate a partnership plan that stands out.
          </p>
        </div>
      </section>

      <section className="bg-black py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 bg-[#00f5ff]/50 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-none bg-black p-8 text-white shadow-[0_0_45px_rgba(0,255,255,0.35)]">
              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Brand Name
                  <input id="sponsor-brand" name="brand" type="text" required className={formFieldClasses} placeholder="Your brand name" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Contact Person
                  <input id="sponsor-person" name="person" type="text" required className={formFieldClasses} placeholder="Who should we speak with?" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Phone Number
                  <input id="sponsor-phone" name="phone" type="tel" required className={formFieldClasses} placeholder="+91 XXXXXXXXXX" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Email ID
                  <input id="sponsor-email" name="email" type="email" required className={formFieldClasses} placeholder="your.email@example.com" />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                Sponsorship Type Interested In
                <select id="sponsor-type" name="type" required defaultValue="" className={`${formFieldClasses} cursor-pointer`}>
                  <option value="" disabled className="bg-white text-black">
                    Choose an option
                  </option>
                  <option value="title" className="bg-white text-black">
                    Title Sponsor
                  </option>
                  <option value="powered-by" className="bg-white text-black">
                    Powered By Partner
                  </option>
                  <option value="zone" className="bg-white text-black">
                    Zone Sponsor
                  </option>
                  <option value="in-kind" className="bg-white text-black">
                    In-Kind Partner
                  </option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                Brief Description of Brand / Offering
                <textarea
                  id="sponsor-description"
                  name="description"
                  rows={4}
                  required
                  className={`${formFieldClasses} resize-none`}
                  placeholder="Tell us about your brand and the collaboration you envision"
                />
              </label>
              <label className="flex items-start gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
                <input type="checkbox" name="terms" value="accepted" required className="mt-1 h-5 w-5 accent-[#ff1a1a]" />
                <span className="normal-case text-left text-white/80">
                  I accept the{" "}
                  <Link href="/terms-and-conditions" className="text-[#00f5ff] underline-offset-4 hover:underline">
                    terms and conditions
                  </Link>
                </span>
              </label>
              <button
                type="submit"
                className="w-full bg-[#ff1a1a] px-6 py-3 font-montserrat text-sm uppercase tracking-[0.3em] text-white transition-transform hover:scale-[1.02]"
              >
                Submit Sponsorship Interest
              </button>
              {submitted && (
                <p className="bg-[#00f5ff]/20 px-4 py-3 text-center text-sm text-white">
                  Thank you! Our partnerships team will reach out with the sponsorship deck and media kit shortly.
                </p>
              )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
