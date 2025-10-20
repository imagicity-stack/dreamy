"use client";

import { FormEvent, useState } from "react";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

export default function SponsorPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7300ff] via-[#ff1a00] to-[#ffe300] py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.4em] text-[#ffe300] font-oswald mb-4">
            Involve With Us
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald uppercase text-white drop-shadow-xl">
            Partner With Madooza
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed">
            Collaborate with Madooza to connect your brand with Jharkhand’s most dynamic youth audience. Sponsorship delivers
            visibility across digital media, on-ground branding, and immersive engagement opportunities.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16">
          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">
              Sponsorship Options
            </h2>
            <ul className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed">
              <li><span className="font-semibold text-white">Title Sponsor:</span> Logo on stage &amp; main banner.</li>
              <li><span className="font-semibold text-white">Powered By Partner:</span> Brand on merchandise &amp; tickets.</li>
              <li><span className="font-semibold text-white">Zone Sponsor:</span> Own a food, art, or chill zone.</li>
              <li><span className="font-semibold text-white">In-Kind Partner:</span> Product collaboration or barter.</li>
            </ul>
            <div className="mt-8 p-4 sm:p-5 bg-[#9dffff]/10 border border-[#9dffff]/40 rounded-xl text-[#9dffff] text-sm sm:text-base">
              <p>Sponsorship deck and media kit will be mailed after form submission.</p>
            </div>
          </div>

          <div className="bg-[#1a062a] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">
              Submit Sponsorship Interest
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="sponsor-brand">
                  Brand Name
                </label>
                <input
                  id="sponsor-brand"
                  name="brand"
                  type="text"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Your brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="sponsor-person">
                  Contact Person
                </label>
                <input
                  id="sponsor-person"
                  name="person"
                  type="text"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Who should we speak with?"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="sponsor-phone">
                    Phone Number
                  </label>
                  <input
                    id="sponsor-phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="sponsor-email">
                    Email ID
                  </label>
                  <input
                    id="sponsor-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="sponsor-type">
                  Sponsorship Type Interested In
                </label>
                <select
                  id="sponsor-type"
                  name="type"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose an option
                  </option>
                  <option value="title">Title Sponsor</option>
                  <option value="powered-by">Powered By Partner</option>
                  <option value="zone">Zone Sponsor</option>
                  <option value="in-kind">In-Kind Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="sponsor-description">
                  Brief Description of Brand / Offering
                </label>
                <textarea
                  id="sponsor-description"
                  name="description"
                  rows={4}
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Tell us about your brand and the collaboration you envision"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-[#ffe300] px-4 py-3 font-oswald text-lg text-black uppercase tracking-wide hover:bg-[#ffd000] transition"
              >
                Submit Sponsorship Interest
              </button>

              {submitted && (
                <p className="rounded-md bg-green-500/10 border border-green-400/40 text-green-200 px-4 py-3 text-sm sm:text-base">
                  Thank you! Our partnerships team will reach out with the sponsorship deck and media kit shortly.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
