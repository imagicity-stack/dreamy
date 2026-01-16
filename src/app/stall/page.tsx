"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";
import {
  createPaymentOrder,
  loadRazorpayScript,
  RazorpayOptions,
  RazorpaySuccessResponse,
  verifyPayment,
} from "@/lib/razorpay";

const stallHighlights = [
  "10×10 ft canopy (table + chair provided)",
  "₹3600 per stall (1-day), including tax",
  "Electricity access available on request",
  "Setup Time: 7:00 AM – 9:30 AM | Event Hours: 10:00 AM – 7:00 PM",
];

const stallTips = [
  "Bring display stands, signage, and lighting for the best impression.",
  "Card / UPI payments encouraged for smoother transactions.",
  "Keep a helper for peak-hour crowd management.",
  "Clean-up checks happen post-event before deposit refunds.",
];

const formFieldClasses =
  "w-full bg-white px-4 py-3 text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-black/50";
const formLabelClasses =
  "flex flex-col gap-2 text-sm font-montserrat font-medium text-white";

export default function StallPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [selectedPower, setSelectedPower] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    setSubmitted(false);
    setError("");
    setPaymentId(null);
    setLoading(true);

    const formData = new FormData(form);
    const getValue = (key: string) => formData.get(key)?.toString().trim() ?? "";

    const powerChoice = getValue("power");
    setSelectedPower(powerChoice || null);
    const requiresPower = powerChoice === "yes";
    const baseAmount = 3600;
    const additionalPowerFee = 0;
    const totalAmount = baseAmount + additionalPowerFee;

    const stallDetails = {
      name: getValue("name"),
      brand: getValue("brand"),
      productType: getValue("productType"),
      phone: getValue("phone"),
      email: getValue("email"),
      power: powerChoice,
      powerFee: additionalPowerFee,
      totalAmount,
      notes: getValue("notes"),
      termsAccepted: formData.get("terms") === "accepted",
      timestamp: new Date().toISOString(),
    };

    try {
      const orderConfig = await createPaymentOrder(
        "stall",
        {
          ...stallDetails,
          formType: "stall",
        },
        1,
      );

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
          powerFee: additionalPowerFee.toString(),
          totalAmount: totalAmount.toString(),
          displayName: "Madooza Stall Setup",
        },
        config: {
          branding: {
            brand_name: "Madooza Stall Setup",
            company_name: "Madooza Stall Setup",
          },
        },
        handler: async (response: RazorpaySuccessResponse) => {
          paymentCompleted = true;
          const verification = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            formData: {
              ...stallDetails,
              formType: "stall",
              quantity: 1,
            },
          });

          if (!verification.success) {
            paymentCompleted = false;
            setError(verification.message ?? "Payment verification failed. Please contact support.");
            return;
          }

          setPaymentId(response.razorpay_payment_id ?? null);
          setSubmitted(true);
          setError("");
          form.reset();
          setSelectedPower(null);
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompleted) {
              setError("Payment popup closed before completion. Please try again to confirm your booking.");
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
      console.error("Error processing stall registration:", err);
      setError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayedTotal = 3600;

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
        <div className="pointer-events-none absolute -top-24 left-0 h-72 w-72 bg-[#ffe300] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 bg-[#e22154] opacity-40 blur-3xl" />
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
          <div className="flex flex-col gap-6 bg-[#e22154] p-8 text-white shadow-[0_0_35px_rgba(226,33,84,0.25)]">
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
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 bg-[#00f5ff]/50 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-none bg-black p-8 text-white shadow-[0_0_45px_rgba(0,255,255,0.35)]">
              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={formLabelClasses}>
                  Name *
                  <input id="stall-name" name="name" type="text" required className={formFieldClasses} placeholder="Enter your full name" />
                </label>
                <label className={formLabelClasses}>
                  Brand / Stall Name *
                  <input id="stall-brand" name="brand" type="text" required className={formFieldClasses} placeholder="Enter your brand or stall name" />
                </label>
                <label className={formLabelClasses}>
                  Product Type *
                  <select id="stall-product" name="productType" required defaultValue="" className={`${formFieldClasses} cursor-pointer`}>
                    <option value="" disabled className="bg-white text-black">
                      Select a category
                    </option>
                    <option value="food" className="bg-white text-black">
                      Food
                    </option>
                    <option value="merchandise" className="bg-white text-black">
                      Merchandise
                    </option>
                    <option value="art" className="bg-white text-black">
                      Art
                    </option>
                    <option value="advertisement" className="bg-white text-black">
                      Advertisement
                    </option>
                    <option value="games" className="bg-white text-black">
                      Games & Experiences
                    </option>
                  </select>
                </label>
                <label className={formLabelClasses}>
                  Contact Number *
                  <input
                    id="stall-phone"
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
                <label className={formLabelClasses}>
                  Email ID *
                  <input id="stall-email" name="email" type="email" required className={formFieldClasses} placeholder="your.email@example.com" />
                </label>
                <label className={formLabelClasses}>
                  Power Requirement *
                  <select
                    id="stall-power"
                    name="power"
                    required
                    defaultValue=""
                    className={`${formFieldClasses} cursor-pointer`}
                    onChange={(event) => setSelectedPower(event.target.value)}
                  >
                    <option value="" disabled className="bg-white text-black">
                      Choose an option
                    </option>
                    <option value="no" className="bg-white text-black">
                      No Power Needed
                    </option>
                    <option value="yes" className="bg-white text-black">
                      Yes
                    </option>
                  </select>
                </label>
              </div>
              <label className={formLabelClasses}>
                Additional Notes *
                <textarea
                  id="stall-notes"
                  name="notes"
                  rows={3}
                  required
                  className={`${formFieldClasses} resize-none`}
                  placeholder="Share special requirements or products"
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
                {loading ? "Processing Payment..." : `Pay ₹${displayedTotal} & Book Stall`}
              </button>
              {error && (
                <p className="bg-[#e22154]/40 px-4 py-3 text-center text-sm text-white">{error}</p>
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
        </div>
      </section>

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
