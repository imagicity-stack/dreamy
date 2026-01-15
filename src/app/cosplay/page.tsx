"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { CSSProperties } from "react";
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
import { recordPayment } from "@/lib/payment-records";

const eventFormat = [
  {
    title: "Part 1: Expo Zone",
    description:
      "Participants freely showcase their characters across the campus for photo-ops and crowd engagement.",
  },
  {
    title: "Part 2: The MAD Parade",
    description:
      "A high-energy stage walk where the top cosplayers perform or pose live, followed by crowd voting and final judging.",
  },
];

const participationDetails = [
  "Open for students and local youth participants.",
  "₹299 entry for externals.",
  "Costumes can be from anime, gaming, movies, pop culture, or pure imagination.",
  "Limited slots — registration on the website.",
];

const yellowBulletStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='6'><rect width='6' height='6' fill='%23e22154'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0 0.45rem",
};

const prizes = [
  {
    title: "🥇 1st Place – The Mad Legend",
    description: "₹3000 + Amazon gift voucher + certificate + feature reel",
  },
  {
    title: "🥈 2nd Place – The Mad Icon",
    description: "₹2000 + certificate + feature reel",
  },
  {
    title: "🥉 3rd Place – Crowd Favorite",
    description: "₹500 + food coupon + certificate",
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

const formFieldClasses =
  "w-full bg-white px-4 py-3 text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-black/50";

export default function CosplayPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;

    if (isModalOpen) {
      body.style.overflow = "hidden";

      return () => {
        body.style.overflow = previousOverflow;
      };
    }

    body.style.overflow = previousOverflow;

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

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
      termsAccepted: formData.get("terms") === "accepted",
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
        name: "Madooza Cosplay",
        description: "Cosplay Registration",
        prefill: {
          name: cosplayDetails.name,
          email: cosplayDetails.email,
          contact: cosplayDetails.phone,
        },
        notes: {
          formType: "cosplay",
          character: cosplayDetails.character,
          displayName: "Madooza Cosplay",
        },
        config: {
          branding: {
            brand_name: "Madooza Cosplay",
            company_name: "Madooza Cosplay",
          },
        },
        handler: (response: RazorpaySuccessResponse) => {
          paymentCompleted = true;
          setPaymentId(response.razorpay_payment_id ?? null);
          setSubmitted(true);
          setError("");
          form.reset();
          void recordPayment({
            formType: "cosplay",
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: orderConfig.amount,
            currency: orderConfig.currency,
            details: cosplayDetails,
          }).catch((error) => {
            console.error("Failed to record cosplay payment:", error);
          });
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompleted) {
              setError(
                "Payment popup closed before completion. Please try again to confirm your registration.",
              );
            }
          },
        },
      };

      if (orderConfig.orderId) {
        options.order_id = orderConfig.orderId;
      }

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
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
        <div className="pointer-events-none absolute -top-24 left-0 h-64 w-64 bg-[#e22154] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 bg-[#ffe300] opacity-40 blur-3xl" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
          <span className="font-montserrat text-xs uppercase tracking-[0.6em] text-[#ffe300]">
            Cosplay Arena
          </span>
          <h1 className="font-travel-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-white">
            Step Into the MADVERSE
          </h1>
          <p className="max-w-3xl text-base sm:text-lg md:text-xl text-white/80">
            Welcome to MADOOZA’s Cosplay Arena — where fun gets crazy and everyone becomes a hero or villain. Dress up, walk
            around, click photos, and join the MAD PARADE — the big cosplay battle where the crowd picks the winner!
          </p>
          <button
            onClick={openModal}
            className="mt-4 inline-flex items-center justify-center bg-[#e22154] px-6 py-3 font-montserrat text-sm uppercase tracking-[0.3em] text-white transition-transform hover:scale-[1.03]"
          >
            Register Now
          </button>
        </div>
      </section>

      <section className="border-y border-[#ffe300]/30 bg-black py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 lg:grid-cols-2">
          <div className="flex h-full flex-col gap-6 bg-[#e22154] p-8 shadow-[0_0_35px_rgba(226,33,84,0.25)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase text-white">Event Format</h2>
            <div className="space-y-4 text-left">
              {eventFormat.map((item) => (
                <div key={item.title} className="bg-black/40 p-4 text-white">
                  <h3 className="font-montserrat text-sm uppercase tracking-[0.3em] text-[#ffe300]">{item.title}</h3>
                  <p className="mt-2 text-sm sm:text-base text-white/80">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-full flex-col justify-between gap-6 bg-[#ffe300] p-8 text-black shadow-[0_0_35px_rgba(255,227,0,0.25)]">
            <div className="space-y-4">
              <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase">Participation Details</h2>
              <ul className="space-y-3 text-left text-sm sm:text-base">
                {participationDetails.map((detail) => (
                  <li key={detail} className="pl-6 text-black" style={yellowBulletStyle}>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-black px-4 py-3 text-sm text-white">
              ₹299 entry covers arena access, stage participation, and certification for all registered cosplayers.
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#ffe300]/30 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase text-[#ffe300]">Prizes & Titles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {prizes.map((prize, index) => {
                const tone = index === 1 ? "bg-[#ffe300] text-black" : index === 2 ? "bg-black border border-[#ffe300] text-white" : "bg-[#e22154] text-white";
                return (
                  <div key={prize.title} className={`${tone} p-6 shadow-[0_0_30px_rgba(226,33,84,0.2)]`}> 
                    <h3 className="font-montserrat text-base uppercase tracking-[0.2em]">{prize.title}</h3>
                    <p className="mt-3 text-sm sm:text-base">
                      {prize.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-black p-6 shadow-[0_0_30px_rgba(255,227,0,0.2)]">
                <h3 className="font-travel-sans text-xl uppercase text-[#ffe300]">Judging Criteria</h3>
                <ul className="mt-4 space-y-3 text-sm sm:text-base text-white/80">
                  {judgingCriteria.map((item) => (
                    <li key={item.criteria} className="flex items-center justify-between">
                      <span>{item.criteria}</span>
                      <span className="font-montserrat text-xs uppercase tracking-[0.3em] text-[#ffe300]">{item.weight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#e22154] p-6 text-white shadow-[0_0_30px_rgba(226,33,84,0.2)]">
                <h3 className="font-travel-sans text-xl uppercase">Judging Panel</h3>
                <p className="mt-3 text-sm sm:text-base text-white/80">
                  1 creative representative from Imagicity, 1 faculty member, and 1 local artist or influencer.
                </p>
                <p className="mt-4 text-sm sm:text-base text-white">
                  Audience cheers will be counted live before the final verdict.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-black p-6 shadow-[0_0_30px_rgba(255,227,0,0.2)]">
              <h3 className="font-travel-sans text-xl uppercase text-[#ffe300]">Rules & Guidelines</h3>
              <ul className="mt-4 space-y-3 text-sm sm:text-base text-white/80">
                {rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#ffe300] p-6 text-black shadow-[0_0_30px_rgba(255,227,0,0.3)]">
              <h3 className="font-travel-sans text-xl uppercase">Arena Highlights</h3>
              <ul className="mt-4 space-y-3 text-sm sm:text-base">
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e22154] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-travel-sans text-3xl uppercase">Ready to Own the Parade?</h2>
          <p className="mt-4 text-sm sm:text-base text-white/80">
            Lock in your slot for Jharkhand’s wildest cosplay throwdown. Secure your registration online and arrive fully ready to rule the stage.
          </p>
          <button
            onClick={openModal}
            className="mt-6 inline-flex items-center justify-center bg-black px-6 py-3 font-montserrat text-sm uppercase tracking-[0.3em] text-white transition-transform hover:scale-[1.03]"
          >
            Apply Now
          </button>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8 sm:py-12">
          <div className="relative w-full max-w-xl">
            <div className="pointer-events-none absolute -inset-6 -z-10 bg-[#00f5ff]/50 blur-3xl" aria-hidden />
            <div className="relative flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-none bg-black text-white shadow-[0_0_45px_rgba(0,255,255,0.35)]">
              <button
                type="button"
                onClick={closeModal}
                className="mobile-tap absolute right-4 top-4 z-20 text-white transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00f5ff]"
                aria-label="Close cosplay form"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="relative z-10 flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-8 sm:px-10">
                <div className="text-center">
                  <p className="font-montserrat text-sm font-semibold text-[#00f5ff]">Cosplay Entry</p>
                  <h3 className="mt-3 font-travel-sans text-3xl uppercase text-white">Secure Your Slot</h3>
                  <p className="mt-3 text-sm text-white/70">
                    Complete the form and lock your participation with an instant payment confirmation.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm font-montserrat font-medium text-white">
                      Full Name *
                      <input id="cosplay-name" name="name" type="text" required className={formFieldClasses} placeholder="Enter your name" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-montserrat font-medium text-white">
                      Character Name *
                      <input id="cosplay-character" name="character" type="text" required className={formFieldClasses} placeholder="Who are you cosplaying?" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-montserrat font-medium text-white">
                      Email ID *
                      <input id="cosplay-email" name="email" type="email" required className={formFieldClasses} placeholder="your.email@example.com" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-montserrat font-medium text-white">
                      Phone Number *
                      <input
                        id="cosplay-phone"
                        name="phone"
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
                  </div>
                  <label className="flex flex-col gap-2 text-sm font-montserrat font-medium text-white">
                    Additional Notes *
                    <textarea
                      id="cosplay-notes"
                      name="notes"
                      rows={3}
                      required
                      className={`${formFieldClasses} resize-none`}
                      placeholder="Share performance cues or prop details"
                    />
                  </label>
                  <label className="flex items-start gap-3 text-sm font-montserrat text-white/80">
                    <input
                      type="checkbox"
                      name="terms"
                      value="accepted"
                      required
                      className="mt-1 h-5 w-5 accent-[#e22154]"
                    />
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
                    className="mobile-tap w-full bg-[#e22154] px-6 py-3 text-base font-montserrat font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Processing Payment..." : "Pay ₹299 & Register"}
                  </button>
                  {error && (
                    <p className="bg-[#e22154]/40 px-4 py-3 text-center text-sm text-white">
                      {error}
                    </p>
                  )}
                  {submitted && (
                    <div className="space-y-1 bg-[#00f5ff]/20 px-4 py-3 text-center text-sm text-white">
                      <p>Your cosplay slot is secured! We’ll send payment instructions and confirmation shortly.</p>
                      {paymentId && <span className="block text-xs">Payment reference: {paymentId}</span>}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
