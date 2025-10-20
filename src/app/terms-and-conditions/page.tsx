"use client";

import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7300ff] via-[#ff1a00] to-[#ffe300] text-white py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.35em] text-[#ffe300] font-oswald mb-4">
            Website Legals
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald uppercase drop-shadow-xl">
            Terms and Conditions – Madooza
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-100">
            Last Updated: October 2025
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <article className="bg-[#0d0318] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 space-y-8">
            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">1. Acceptance of Terms</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                By visiting the Madooza website, registering, or attending the event, you agree to these Terms and Conditions. If you do not agree, please refrain from participating.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">2. Event Organizer</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                Madooza is conceptualized and managed by IMAGICITY, headquartered in Hazaribagh, Jharkhand.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">3. Ticket Policy</h2>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                <li>Tickets once purchased are non-refundable and non-transferable.</li>
                <li>Entry will be granted only to valid ticket holders.</li>
                <li>Lost or damaged tickets will not be reissued.</li>
                <li>Unauthorized resale of tickets is prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">4. Payments</h2>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                <li>All ticket prices are in INR (Indian Rupees).</li>
                <li>Payments are processed securely via third-party gateways.</li>
                <li>IMAGICITY is not responsible for payment failures or delays due to user error or technical issues.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">5. Entry and Security</h2>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                <li>Attendees must comply with on-ground security checks.</li>
                <li>Outside food, alcohol, drugs, sharp objects, or hazardous materials are strictly banned.</li>
                <li>IMAGICITY reserves the right to deny entry to any person for safety or disciplinary reasons.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">6. Event Rules</h2>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                <li>Timings, artists, and schedules are subject to change without notice.</li>
                <li>Any damage to property or venue caused by an attendee will result in liability and compensation.</li>
                <li>The event may be recorded; by entering, you consent to being photographed or filmed for marketing use.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">7. Vendor and Exhibitor Policy</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                Vendors, performers, or collaborators must adhere to the event&apos;s operational guidelines and safety instructions. Non-compliance may result in removal without refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">8. Cancellation or Postponement</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                In case of cancellation due to weather, unforeseen circumstances, or government orders, IMAGICITY will not be liable for refunds beyond what is feasible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">9. Limitation of Liability</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                IMAGICITY and its affiliates are not responsible for any injury, loss, or damage occurring at or during the event. Entry and participation are at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">10. Intellectual Property</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                All event content, designs, and branding are owned by IMAGICITY. Reproduction or misuse is prohibited without written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">11. Privacy</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                Personal data collected during ticket purchase or registration is managed under our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">12. Governing Law</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                All disputes are subject to the jurisdiction of Hazaribagh, Jharkhand, India.
              </p>
            </section>

            <section className="bg-[#ffe300]/10 border border-[#ffe300]/30 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">13. Contact</h2>
              <div className="space-y-2 text-sm sm:text-base md:text-lg text-gray-100 leading-relaxed">
                <p>📧 contact@imagicity.in</p>
                <p>📍 Hazaribagh, Jharkhand, India</p>
              </div>
            </section>
          </article>
        </div>
      </section>

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
