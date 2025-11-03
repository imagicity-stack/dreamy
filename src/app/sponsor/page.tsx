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
const formLabelClasses =
  "flex flex-col gap-2 text-sm font-montserrat font-medium text-white";

export default function SponsorPage() {
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    setLoading(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const formData = new FormData(form);
    const getValue = (key: string) => formData.get(key)?.toString().trim() ?? "";

    const payload = {
      brandName: getValue("brandName"),
      contactPerson: getValue("contactPerson"),
      phoneNumber: getValue("phoneNumber"),
      emailId: getValue("emailId"),
      sponsorshipType: getValue("sponsorshipType"),
      brandDescription: getValue("brandDescription"),
    };

    try {
      const response = await fetch("/api/sponsor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.message || "An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting sponsor form:", error);
      setSubmitStatus("error");
      setErrorMessage("There was an error submitting the form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
        <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 bg-[#e22154] opacity-40 blur-3xl" />
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
          <div className="flex flex-col gap-6 bg-[#e22154] p-8 text-white shadow-[0_0_35px_rgba(226,33,84,0.25)]">
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
                  <label className={formLabelClasses}>
                    Brand Name *
                    <input id="sponsor-brand" name="brandName" type="text" required className={formFieldClasses} placeholder="Your brand name" />
                  </label>
                  <label className={formLabelClasses}>
                    Contact Person *
                    <input id="sponsor-person" name="contactPerson" type="text" required className={formFieldClasses} placeholder="Who should we speak with?" />
                  </label>
                  <label className={formLabelClasses}>
                    Phone Number *
                    <input
                      id="sponsor-phone"
                      name="phoneNumber"
                      type="tel"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      minLength={10}
                      title="Enter a 10-digit phone number"
                      className={formFieldClasses}
                      placeholder="9876543210"
                    />
                  </label>
                  <label className={formLabelClasses}>
                    Email ID *
                    <input id="sponsor-email" name="emailId" type="email" required className={formFieldClasses} placeholder="your.email@example.com" />
                  </label>
                </div>
                <label className={formLabelClasses}>
                  Sponsorship Type Interested In *
                  <select id="sponsor-type" name="sponsorshipType" required defaultValue="" className={`${formFieldClasses} cursor-pointer`}>
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
                <label className={formLabelClasses}>
                  Brief Description of Brand / Offering
                  <textarea
                    id="sponsor-description"
                    name="brandDescription"
                    rows={4}
                    required
                    className={`${formFieldClasses} resize-none`}
                    placeholder="Tell us about your brand and the collaboration you envision"
                  />
                </label>
                <label className="flex items-start gap-3 text-sm font-montserrat text-white/80">
                  <input type="checkbox" name="terms" value="accepted" required className="mt-1 h-5 w-5 accent-[#e22154]" />
                  <span className="text-left">
                    I accept the{" "}
                    <Link href="/terms-and-conditions" className="text-[#00f5ff] underline-offset-4 hover:underline">
                      terms and conditions
                    </Link>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#e22154] px-6 py-3 text-base font-montserrat font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Sponsorship Interest"}
                </button>
                {submitStatus === "success" && (
                  <p className="bg-[#00f5ff]/15 border border-[#00f5ff]/40 px-4 py-3 text-center text-sm text-white" aria-live="polite">
                    Thank you! Our partnerships team will reach out with the sponsorship deck and media kit shortly.
                  </p>
                )}
                {submitStatus === "error" && errorMessage && (
                  <p className="bg-red-500/10 border border-red-500/40 px-4 py-3 text-center text-sm text-red-200" aria-live="assertive">
                    {errorMessage}
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
