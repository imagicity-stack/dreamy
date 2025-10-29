"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

const categories = [
  { title: "Music", description: "Band / Solo / DJ" },
  { title: "Dance", description: "Solo / Group" },
  { title: "Open Mic", description: "Poetry / Stand-up / Rap" },
  { title: "Special Acts", description: "Magic / Theatre / Fusion" },
];

const perks = [
  "Professional stage, sound, and light setup provided.",
  "On-ground shout-outs and social media features for every act.",
  "Green room access with refreshments.",
  "Certificate of participation for all performers.",
];

const stageFlow = [
  "Sound-check and stage briefing before performance.",
  "Dedicated stage manager to assist with cues and props.",
  "Live crowd engagement with anchor introductions.",
  "Performance recordings shared post-event.",
];

const formFieldClasses =
  "w-full bg-white px-4 py-3 text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-black/50";
const formLabelClasses =
  "flex flex-col gap-2 text-sm font-montserrat font-medium text-white";

export default function PerformerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    setLoading(true);
    setError("");
    setSubmitStatus(null);

    const formData = new FormData(form);
    const equipment = formData.getAll("equipment");

    const data = {
      name: formData.get("name"),
      category: formData.get("category"),
      duration: formData.get("duration"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      equipment: equipment.join(", ") || "None",
      sample: formData.get("sample") || "Not provided",
      termsAccepted: formData.get("terms") === "accepted",
      timestamp: new Date().toLocaleString("en-IN"),
    };

    try {
      const response = await fetch("/api/performers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        form.reset();

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setSubmitStatus("error");
        setError("Unable to submit entry. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitStatus("error");
      setError("There was an error submitting the form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 bg-[#ffe300] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 bg-[#ff1a1a] opacity-40 blur-3xl" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
          <span className="font-montserrat text-xs uppercase tracking-[0.6em] text-[#ffe300]">Involve With Us</span>
          <h1 className="font-travel-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-white">
            Be the Sound of Madness
          </h1>
          <p className="max-w-3xl text-base sm:text-lg md:text-xl text-white/80">
            Are you a singer, dancer, poet, or performer who can set the stage on fire? Madooza is calling creators who bring the
            crowd to life. From solo acts to group showcases, this is your moment.
          </p>
        </div>
      </section>

      <section className="border-y border-[#ffe300]/30 bg-black py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6 bg-[#ff1a1a] p-8 shadow-[0_0_35px_rgba(255,26,26,0.25)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase text-white">Performance Categories</h2>
            <ul className="space-y-4 text-left text-sm sm:text-base">
              {categories.map((item) => (
                <li key={item.title} className="bg-black/40 px-5 py-4 text-white">
                  <span className="font-montserrat text-xs uppercase tracking-[0.3em] text-[#ffe300]">{item.title}</span>
                  <p className="mt-2 text-sm sm:text-base text-white/80">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 bg-[#ffe300] p-8 text-black shadow-[0_0_35px_rgba(255,227,0,0.25)]">
            <div className="space-y-3 text-left text-sm sm:text-base">
              <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase">Why Perform?</h2>
              <ul className="space-y-3">
                {perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
            <div className="bg-black px-4 py-3 text-sm text-white">
              Selected performers will receive confirmation within 5 days of registration.
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#ffe300]/30 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <div className="flex flex-col gap-6 bg-black p-8 shadow-[0_0_30px_rgba(255,227,0,0.2)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase text-[#ffe300]">Stage Flow</h2>
            <ul className="space-y-3 text-sm sm:text-base text-white/80">
              {stageFlow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              Bring your own instruments if required. We&apos;ll handle amplification, cables, and tech support.
            </p>
          </div>
          <div className="flex flex-col gap-6 bg-[#ff1a1a] p-8 text-white shadow-[0_0_30px_rgba(255,26,26,0.2)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase">Need Assistance?</h2>
            <p className="text-sm sm:text-base text-white/80">
              Our programming team will connect with shortlisted performers for cues, tech requirements, and promotional
              material.
            </p>
            <p className="text-sm sm:text-base text-white">
              Share links to your past performances or social handles in the form. It helps us feature you better!
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#ffe300] py-16 text-black">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-travel-sans text-3xl uppercase">Drop Your Act Details</h2>
          <p className="mt-4 text-sm sm:text-base">
            Fill out the form below and we&apos;ll get in touch with timings, setup, and promotion guidelines.
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
                  Name / Group Name
                  <input id="performer-name" name="name" type="text" required className={formFieldClasses} placeholder="Enter your name or group name" />
                </label>
                <label className={formLabelClasses}>
                  Category
                  <select id="performer-category" name="category" required defaultValue="" className={`${formFieldClasses} cursor-pointer`}>
                    <option value="" disabled className="bg-white text-black">
                      Choose a category
                    </option>
                    <option value="music" className="bg-white text-black">
                      Music
                    </option>
                    <option value="dance" className="bg-white text-black">
                      Dance
                    </option>
                    <option value="open-mic" className="bg-white text-black">
                      Open Mic
                    </option>
                    <option value="special-act" className="bg-white text-black">
                      Special Act
                    </option>
                  </select>
                </label>
                <label className={formLabelClasses}>
                  Performance Duration (minutes)
                  <input id="performer-duration" name="duration" type="number" min="1" required className={formFieldClasses} placeholder="e.g. 10" />
                </label>
                <label className={formLabelClasses}>
                  Contact Number
                  <input id="performer-phone" name="phone" type="tel" required className={formFieldClasses} placeholder="+91 XXXXXXXXXX" />
                </label>
                <label className={formLabelClasses}>
                  Email ID
                  <input id="performer-email" name="email" type="email" required className={formFieldClasses} placeholder="your.email@example.com" />
                </label>
                <label className={formLabelClasses}>
                  Upload Link to Sample Video (optional)
                  <input id="performer-link" name="sample" type="url" className={formFieldClasses} placeholder="Share a Google Drive / YouTube link" />
                </label>
              </div>
              <div>
                <span className="text-sm font-montserrat font-semibold text-white">Equipment Requirements</span>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  {["Mic", "Speaker", "Instruments"].map((label) => (
                    <label key={label} className="inline-flex items-center gap-2 font-montserrat text-white">
                      <input type="checkbox" name="equipment" value={label.toLowerCase()} className="h-5 w-5 accent-[#ff1a1a]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-3 text-sm font-montserrat text-white/80">
                <input type="checkbox" name="terms" value="accepted" required className="mt-1 h-5 w-5 accent-[#ff1a1a]" />
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
                className="w-full bg-[#ff1a1a] px-6 py-3 text-base font-montserrat font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Performance Entry"}
              </button>
              {submitStatus === "success" && (
                <p className="bg-[#00f5ff]/20 px-4 py-3 text-center text-sm text-white">
                  Thanks! We&apos;ve received your performance entry. Our team will reach out within 5 days. Redirecting...
                </p>
              )}
              {submitStatus === "error" && (
                <p className="bg-[#ff1a1a]/40 px-4 py-3 text-center text-sm text-white">{error}</p>
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
