"use client";

import { FormEvent, useState } from "react";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

export default function PerformerPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7300ff] via-[#ff1a00] to-[#ffe300] py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.4em] text-[#ffe300] font-oswald mb-4">
            Involve With Us
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald uppercase text-white drop-shadow-xl">
            Be the Sound of Madness
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed">
            Are you a singer, dancer, poet, or performer who can set the stage on fire? Madooza is calling creators who bring
            the crowd to life. From solo acts to group showcases, this is your moment.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16">
          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">
              Performance Categories
            </h2>
            <ul className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed">
              <li><span className="font-semibold text-white">Music:</span> Band / Solo / DJ</li>
              <li><span className="font-semibold text-white">Dance:</span> Solo / Group</li>
              <li><span className="font-semibold text-white">Open Mic:</span> Poetry / Stand-up / Rap</li>
              <li><span className="font-semibold text-white">Special Acts:</span> Magic / Theatre / Fusion</li>
            </ul>
            <div className="mt-8 p-4 sm:p-5 bg-[#9dffff]/10 border border-[#9dffff]/40 rounded-xl text-[#9dffff] text-sm sm:text-base">
              <p>Selected performers will receive confirmation within 5 days of registration.</p>
            </div>
          </div>

          <div className="bg-[#1a062a] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">
              Submit Your Entry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="performer-name">
                  Name / Group Name
                </label>
                <input
                  id="performer-name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Enter your name or group name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="performer-category">
                  Category
                </label>
                <select
                  id="performer-category"
                  name="category"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  <option value="music">Music</option>
                  <option value="dance">Dance</option>
                  <option value="open-mic">Open Mic</option>
                  <option value="special-act">Special Act</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="performer-duration">
                  Performance Duration (minutes)
                </label>
                <input
                  id="performer-duration"
                  name="duration"
                  type="number"
                  min="1"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="e.g. 10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="performer-phone">
                    Contact Number
                  </label>
                  <input
                    id="performer-phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="performer-email">
                    Email ID
                  </label>
                  <input
                    id="performer-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-200 mb-2">
                  Equipment Requirements
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                  {[
                    { id: "mic", label: "Mic" },
                    { id: "speaker", label: "Speaker" },
                    { id: "instruments", label: "Instruments" },
                  ].map((item) => (
                    <label key={item.id} className="inline-flex items-center gap-2">
                      <input type="checkbox" name="equipment" value={item.id} className="accent-[#ffe300]" />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="performer-link">
                  Upload Link to Sample Video (optional)
                </label>
                <input
                  id="performer-link"
                  name="sample"
                  type="url"
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Share a Google Drive / YouTube link"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-[#ffe300] px-4 py-3 font-oswald text-lg text-black uppercase tracking-wide hover:bg-[#ffd000] transition"
              >
                Submit Performance Entry
              </button>

              {submitted && (
                <p className="rounded-md bg-green-500/10 border border-green-400/40 text-green-200 px-4 py-3 text-sm sm:text-base">
                  Thanks! We&apos;ve received your performance entry. Our team will reach out within 5 days.
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
