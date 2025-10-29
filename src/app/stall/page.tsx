"use client";

import { FormEvent, useState } from "react";

import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";
import {
  createPaymentOrder,
  loadRazorpayScript,
  RazorpayOptions,
  RazorpaySuccessResponse,
} from "@/lib/razorpay";

const stallHighlights = [
  "10×10 ft canopy (table + chair provided)",
  "₹2500 per stall (1-day) with ₹500 refundable deposit",
  "Electricity access available on request (extra ₹300)",
  "Setup Time: 7:00 AM – 9:30 AM | Event Hours: 10:00 AM – 7:00 PM",
];

const stallTips = [
  "Bring display stands, signage, and lighting for the best impression.",
  "Card / UPI payments encouraged for smoother transactions.",
  "Keep a helper for peak-hour crowd management.",
  "Clean-up checks happen post-event before deposit refunds.",
];

const formFieldClasses =
  "w-full bg-black px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-white/60";

export default function StallPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    setSubmitted(false);
    setError("");
    setPaymentId(null);
    setLoading(true);

    const formData = new FormData(form);
    const getValue = (key: string) => formData.get(key)?.toString().trim() ?? "";

    const stallDetails = {
      name: getValue("name"),
      brand: getValue("brand"),
      productType: getValue("productType"),
      phone: getValue("phone"),
      email: getValue("email"),
      power: getValue("power"),
      notes: getValue("notes"),
      timestamp: new Date().toISOString(),
    };

    try {
      const orderConfig = await createPaymentOrder("stall", 2500, stallDetails);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Unable to load payment gateway. Please refresh and try again.");
      }

      let paymentCompleted = false;

      const options: RazorpayOptions = {
        key: orderConfig.razorpayKeyId,
        amount: orderConfig.amount,
        currency: orderConfig.currency,
        name: "Madooza Stall Setup",
        description: "Stall Registration",
        order_id: orderConfig.orderId,
        prefill: {
          name: stallDetails.name,
          email: stallDetails.email,
          contact: stallDetails.phone,
        },
        notes: {
          formType: "stall",
          brand: stallDetails.brand,
          productType: stallDetails.productType,
          powerRequirement: stallDetails.power,
          displayName: "Madooza Stall Setup",
        },
        config: {
          branding: {
            brand_name: "Madooza Stall Setup",
            company_name: "Madooza Stall Setup",
          },
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
              setError("Payment popup closed before completion. Please try again to confirm your booking.");
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
      console.error("Error processing stall registration:", err);
      setError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
        <div className="pointer-events-none absolute -top-24 left-0 h-72 w-72 bg-[#ffe300] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 bg-[#ff1a1a] opacity-40 blur-3xl" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
          <span className="font-montserrat text-xs uppercase tracking-[0.6em] text-[#ffe300]">Involve With Us</span>
          <h1 className="font-travel-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-white">
            Bring Your Stall to Madooza
          </h1>
          <p className="max-w-3xl text-base sm:text-lg md:text-xl text-white/80">
            Showcase your creativity, food, art, or brand to hundreds of visitors. Madooza gives local creators a premium space
            to display their talent and products in a vibrant, youth-driven environment.
          </p>
        </div>
      </section>

      <section className="border-y border-[#ffe300]/30 bg-black py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <div className="flex flex-col gap-6 bg-[#ffe300] p-8 text-black shadow-[0_0_35px_rgba(255,227,0,0.25)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase">Stall Details</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              {stallHighlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="bg-black px-4 py-3 text-sm text-white">
              After completing the payment, you&apos;ll receive a confirmation mail with stall allocation and setup instructions within 24 hours.
            </p>
          </div>
          <div className="flex flex-col gap-6 bg-[#ff1a1a] p-8 text-white shadow-[0_0_35px_rgba(255,26,26,0.25)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase">Make Your Stall Stand Out</h2>
            <ul className="space-y-3 text-sm sm:text-base text-white/80">
              {stallTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <p className="text-sm text-white">
              Our team will help you with placement, electricity, and last-minute requirements on event day.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#ffe300]/30 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-travel-sans text-3xl uppercase text-[#ffe300]">Reserve Your Stall Now</h2>
          <p className="mt-4 text-sm sm:text-base text-white/80">
            Fill out the form, complete the payment, and secure your stall instantly.
          </p>
        </div>
      </section>

      <section className="bg-black py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative overflow-hidden rounded-none bg-black p-8 text-white shadow-[0_0_45px_rgba(0,255,255,0.35)]">
            <div className="pointer-events-none absolute -inset-6 -z-10 bg-[#00f5ff]/40 blur-3xl" aria-hidden />
            <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Name
                  <input id="stall-name" name="name" type="text" required className={formFieldClasses} placeholder="Enter your full name" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Brand / Stall Name
                  <input id="stall-brand" name="brand" type="text" required className={formFieldClasses} placeholder="Enter your brand or stall name" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Product Type
                  <select id="stall-product" name="productType" required defaultValue="" className={`${formFieldClasses} cursor-pointer`}>
                    <option value="" disabled className="bg-black text-white">
                      Select a category
                    </option>
                    <option value="food" className="bg-black text-white">
                      Food
                    </option>
                    <option value="merchandise" className="bg-black text-white">
                      Merchandise
                    </option>
                    <option value="art" className="bg-black text-white">
                      Art
                    </option>
                    <option value="games" className="bg-black text-white">
                      Games & Experiences
                    </option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Contact Number
                  <input id="stall-phone" name="phone" type="tel" required className={formFieldClasses} placeholder="+91 XXXXXXXXXX" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Email ID
                  <input id="stall-email" name="email" type="email" required className={formFieldClasses} placeholder="your.email@example.com" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  Power Requirement
                  <select id="stall-power" name="power" required defaultValue="" className={`${formFieldClasses} cursor-pointer`}>
                    <option value="" disabled className="bg-black text-white">
                      Choose an option
                    </option>
                    <option value="none" className="bg-black text-white">
                      No Power Needed
                    </option>
                    <option value="basic" className="bg-black text-white">
                      Basic Lighting (₹300)
                    </option>
                    <option value="heavy" className="bg-black text-white">
                      High Load Equipment
                    </option>
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                Additional Notes
                <textarea
                  id="stall-notes"
                  name="notes"
                  rows={3}
                  className={`${formFieldClasses} resize-none`}
                  placeholder="Share special requirements or products"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff1a1a] px-6 py-3 font-montserrat text-sm uppercase tracking-[0.3em] text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Processing Payment..." : "Pay ₹2500 & Book Stall"}
              </button>
              {error && (
                <p className="bg-[#ff1a1a]/40 px-4 py-3 text-center text-sm text-white">{error}</p>
              )}
              {submitted && (
                <div className="space-y-1 bg-[#00f5ff]/20 px-4 py-3 text-center text-sm text-white">
                  <p>Your stall is confirmed! We will share setup instructions within 24 hours.</p>
                  {paymentId && <span className="block text-xs">Payment reference: {paymentId}</span>}
                </div>
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
