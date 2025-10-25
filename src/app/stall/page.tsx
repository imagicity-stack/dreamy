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
        name: "Madooza",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7300ff] via-[#ff1a00] to-[#ffe300] text-black py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.4em] text-[#ffe300] font-oswald mb-4">
            Involve With Us
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald uppercase text-white drop-shadow-xl">
            Bring Your Stall to Madooza
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed">
            Showcase your creativity, food, art, or brand to hundreds of visitors. Madooza gives local creators a premium
            space to display their talent and products in a vibrant, youth-driven environment.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16">
          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">
              Stall Details
            </h2>
            <ul className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed">
              <li><span className="font-semibold text-white">Stall Size:</span> 10×10 ft canopy (table + chair provided)</li>
              <li><span className="font-semibold text-white">Cost:</span> ₹2500 per stall (1-day)</li>
              <li>Electricity access available on request (extra ₹300).</li>
              <li>Refundable deposit: ₹500 (cleanliness &amp; discipline).</li>
              <li>Setup Time: 7:00 AM to 9:30 AM</li>
              <li>Event Hours: 10:00 AM to 7:00 PM</li>
            </ul>
            <div className="mt-8 p-4 sm:p-5 bg-[#ffe300]/10 border border-[#ffe300]/40 rounded-xl text-[#ffe300] text-sm sm:text-base">
              <p>
                After completing the payment, you&apos;ll receive a confirmation mail with stall allocation and setup
                instructions within 24 hours.
              </p>
            </div>
          </div>

          <div className="bg-[#1a062a] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">
              Register Your Stall
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="stall-name">
                  Name
                </label>
                <input
                  id="stall-name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="stall-brand">
                  Brand / Stall Name
                </label>
                <input
                  id="stall-brand"
                  name="brand"
                  type="text"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Enter your brand or stall name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="stall-product">
                  Product Type
                </label>
                <select
                  id="stall-product"
                  name="productType"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="food">Food</option>
                  <option value="merchandise">Merchandise</option>
                  <option value="art">Art</option>
                  <option value="games">Games</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="stall-phone">
                    Phone Number
                  </label>
                  <input
                    id="stall-phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="stall-email">
                    Email ID
                  </label>
                  <input
                    id="stall-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="stall-power">
                  Power Required?
                </label>
                <div className="flex gap-4 text-sm sm:text-base">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="power" value="yes" required className="accent-[#ffe300]" />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="power" value="no" required className="accent-[#ffe300]" />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="stall-notes">
                  Any Additional Notes
                </label>
                <textarea
                  id="stall-notes"
                  name="notes"
                  rows={4}
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Tell us anything special about your stall"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#ffe300] px-4 py-3 font-oswald text-lg text-black uppercase tracking-wide hover:bg-[#ffd000] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Processing Payment..." : "Pay ₹2500 & Register"}
              </button>

              {error && (
                <p className="rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm sm:text-base text-red-200">
                  {error}
                </p>
              )}

              {submitted && (
                <p className="rounded-md bg-green-500/10 border border-green-400/40 text-green-200 px-4 py-3 text-sm sm:text-base">
                  Your stall has been successfully registered. You will receive setup details by email.
                  {paymentId && (
                    <span className="block text-xs text-green-100/80 mt-2">Payment reference: {paymentId}</span>
                  )}
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
