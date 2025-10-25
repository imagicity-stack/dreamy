"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";
import {
  createPaymentOrder,
  loadRazorpayScript,
  RazorpayOptions,
  RazorpaySuccessResponse,
} from "@/lib/razorpay";

const eventFormat = [
  {
    title: "Part 1: Expo Zone",
    description:
      "Participants freely showcase their characters across the campus for photo-ops and crowd engagement.",
  },
  {
    title: "Part 2: The MAD Parade",
    description:
      "A high-energy stage walk where the top 10 cosplayers perform or pose live, followed by crowd voting and final judging.",
  },
];

const participationDetails = [
  "Open for students (of any school) and local youth participants.",
  "₹299 entry for externals.",
  "Costumes can be from anime, gaming, movies, pop culture, or pure imagination.",
  "Limited slots — registration on the website.",
];

const prizes = [
  {
    title: "🥇 1st Place – The Mad Legend",
    description: "₹3000 + Amazon gift voucher + certificate + feature reel",
    cardClass: "bg-[#1d0f2f]",
    titleClass: "text-[#ffe300]",
    descriptionClass: "text-[#ffe9a0]",
  },
  {
    title: "🥈 2nd Place – The Mad Icon",
    description: "₹2000 + certificate + feature reel",
    cardClass: "bg-[#0f1f33]",
    titleClass: "text-[#9dffff]",
    descriptionClass: "text-[#c6fdff]",
  },
  {
    title: "🥉 3rd Place – Crowd Favorite",
    description: "₹500 + food coupon + certificate",
    cardClass: "bg-[#291326]",
    titleClass: "text-[#ffd6a8]",
    descriptionClass: "text-[#ffe7cc]",
  },
];

const judgingCriteria = [
  { criteria: "Costume Accuracy & Creativity", weight: "40%" },
  { criteria: "Stage Presence / Performance", weight: "25%" },
  { criteria: "Character Portrayal", weight: "20%" },
  { criteria: "Audience Engagement", weight: "15%" },
];

const rules = [
  "No dangerous props, sharp objects, or offensive content.",
  "Keep performances school-safe.",
  "Arrive at least 1 hour before event start for costume check-in.",
  "Respect all fellow participants and volunteers.",
  "Have fun — the madder, the better.",
];

const highlights = [
  "Neon photo booths & selfie zones.",
  "Professional photos + aftermovie coverage by Imagicity.",
  "Crowd interactions, live music, and anchor-led energy.",
  "Winning entries featured on the official MADOOZA Instagram.",
];

export default function CosplayPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const openModal = () => {
    setSubmitted(false);
    setError("");
    setPaymentId(null);
    setLoading(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setLoading(false);
    setError("");
    setPaymentId(null);
    setSubmitted(false);
    setIsModalOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    setSubmitted(false);
    setError("");
    setPaymentId(null);
    setLoading(true);

    const formData = new FormData(form);
    const getValue = (key: string) => formData.get(key)?.toString().trim() ?? "";

    const cosplayDetails = {
      name: getValue("name"),
      character: getValue("character"),
      email: getValue("email"),
      phone: getValue("phone"),
      notes: getValue("notes"),
      timestamp: new Date().toISOString(),
    };

    try {
      const orderConfig = await createPaymentOrder("cosplay", 299, cosplayDetails);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Unable to load payment gateway. Please refresh and try again.");
      }

      let paymentCompleted = false;

      const options: RazorpayOptions = {
        key: orderConfig.razorpayKeyId,
        amount: orderConfig.amount,
        currency: orderConfig.currency,
        name: "Madooza",
        description: "Cosplay Registration",
        order_id: orderConfig.orderId,
        prefill: {
          name: cosplayDetails.name,
          email: cosplayDetails.email,
          contact: cosplayDetails.phone,
        },
        notes: {
          formType: "cosplay",
          character: cosplayDetails.character,
        },
        handler: (response: RazorpaySuccessResponse) => {
          paymentCompleted = true;
          setPaymentId(response.razorpay_payment_id ?? null);
          setSubmitted(true);
          setError("");
          form.reset();
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompleted) {
              setError("Payment popup closed before completion. Please try again to confirm your registration.");
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        paymentCompleted = false;
        setError("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (err) {
      console.error("Error processing cosplay registration:", err);
      setError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7300ff] via-[#ff1a00] to-[#ffe300] text-black py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.4em] text-[#ffe300] font-oswald mb-4">
            Cosplay Arena
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald uppercase text-white drop-shadow-xl">
            🎭 Cosplay Arena – Step Into the MADVERSE
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed font-quicksand">
            Welcome to MADOOZA’s Cosplay Arena — where fun gets crazy and everyone becomes a hero or villain. Dress up, walk around, click photos, and join the MAD PARADE — the big cosplay battle where the crowd picks the winner!
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Event Format</h2>
            <div className="space-y-4">
              {eventFormat.map((item) => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-oswald text-white uppercase mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300 font-quicksand leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1a062a] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Participation Details</h2>
              <ul className="space-y-3 text-sm sm:text-base text-gray-200 font-quicksand leading-relaxed list-disc list-inside">
                {participationDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
            <div className="mt-6 rounded-xl border border-[#ffe300]/30 bg-[#ffe300]/10 p-4 text-sm sm:text-base text-[#ffe300] font-quicksand leading-relaxed">
              ₹299 entry covers arena access, stage participation, and certification for all registered cosplayers.
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#080510]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-10 xl:gap-16 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">Prizes &amp; Titles</h2>
            <div className="space-y-4">
              {prizes.map((prize) => (
                <div
                  key={prize.title}
                  className={`rounded-xl border border-white/10 p-4 sm:p-6 shadow-lg ${prize.cardClass}`}
                >
                  <h3 className={`text-xl sm:text-2xl font-oswald uppercase mb-2 ${prize.titleClass}`}>
                    {prize.title}
                  </h3>
                  <p className={`text-sm sm:text-base font-quicksand leading-relaxed ${prize.descriptionClass}`}>
                    {prize.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-black/40 border border-[#ffe300]/40 rounded-xl p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-oswald text-[#ffe300] uppercase mb-3">Bonus Titles</h3>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm font-quicksand text-black">
                <span className="bg-[#ffe300] px-3 py-1 rounded-full uppercase tracking-wide">Best Group Cosplay</span>
                <span className="bg-[#ff1a00] px-3 py-1 rounded-full uppercase tracking-wide text-white">Most Creative Design</span>
                <span className="bg-[#9dffff] px-3 py-1 rounded-full uppercase tracking-wide">Judge&apos;s Choice</span>
              </div>
            </div>
          </div>

          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Judging Criteria</h2>
            <div className="space-y-3">
              {judgingCriteria.map((item) => (
                <div
                  key={item.criteria}
                  className="flex items-center justify-between bg-black/40 border border-[#9dffff]/30 rounded-lg px-4 py-3"
                >
                  <span className="text-sm sm:text-base font-quicksand text-gray-200">{item.criteria}</span>
                  <span className="text-lg sm:text-xl font-oswald text-[#9dffff]">{item.weight}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4">
              <h3 className="text-lg sm:text-xl font-oswald text-[#ffe300] uppercase mb-2">Judging Panel</h3>
              <p className="text-sm sm:text-base text-gray-300 font-quicksand leading-relaxed">
                1 creative representative from Imagicity, 1 faculty member, and 1 local artist / influencer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12">
          <div className="bg-[#1a062a] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Rules &amp; Guidelines</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-200 font-quicksand leading-relaxed list-disc list-inside">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Highlights</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-200 font-quicksand leading-relaxed list-disc list-inside">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#080510]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">
            Ready to Join the MAD Parade?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 font-quicksand leading-relaxed">
            Lock in your slot for Jharkhand’s wildest cosplay throwdown. Secure your registration online and arrive fully ready to rule the stage.
          </p>
          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center rounded-md bg-[#ffe300] px-6 py-3 font-oswald text-lg uppercase tracking-wide text-black transition hover:bg-[#ffd000]"
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-[#11011b] p-6 sm:p-8">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
              aria-label="Close registration form"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-2xl font-oswald uppercase text-[#ffe300]">Cosplay Registration</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-300 font-quicksand">
              Complete the form and secure your spot with a quick payment. We’ll email you confirmation and event-day cues.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="cosplay-name">
                    Full Name
                  </label>
                  <input
                    id="cosplay-name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="cosplay-character">
                    Character Name
                  </label>
                  <input
                    id="cosplay-character"
                    name="character"
                    type="text"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="Who are you cosplaying?"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="cosplay-email">
                    Email ID
                  </label>
                  <input
                    id="cosplay-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="cosplay-phone">
                    Phone Number
                  </label>
                  <input
                    id="cosplay-phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="cosplay-notes">
                  Additional Notes
                </label>
                <textarea
                  id="cosplay-notes"
                  name="notes"
                  rows={3}
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Share performance cues or prop details"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#ffe300] px-4 py-3 font-oswald text-lg uppercase tracking-wide text-black transition hover:bg-[#ffd000] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Processing Payment..." : "Pay ₹299 & Register"}
              </button>
              {error && (
                <p className="rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}
              {submitted && (
                <p className="rounded-md border border-green-400/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                  Your cosplay slot is secured! We’ll send payment instructions and confirmation shortly.
                  {paymentId && (
                    <span className="mt-2 block text-xs text-green-100/80">Payment reference: {paymentId}</span>
                  )}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
