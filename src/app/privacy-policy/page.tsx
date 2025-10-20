"use client";

import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7300ff] via-[#ff1a00] to-[#ffe300] text-white py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.35em] text-[#ffe300] font-oswald mb-4">
            Website Legals
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald uppercase drop-shadow-xl">
            Privacy Policy – Madooza
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-100">
            Last Updated: October 2025
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">
          <article className="bg-[#0d0318] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 space-y-8">
            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">1. Introduction</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                Welcome to Madooza, organized by IMAGICITY. We value your privacy and are committed to protecting your personal
                information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or
                register for the event.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">2. Information We Collect</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                <li>
                  <span className="text-white font-semibold">Personal Details:</span> Name, email address, phone number, and age when you register or buy tickets.
                </li>
                <li>
                  <span className="text-white font-semibold">Payment Information:</span> Processed securely through our payment gateway. We do not store card or banking details.
                </li>
                <li>
                  <span className="text-white font-semibold">Usage Data:</span> Device information, browser type, pages visited, and interaction logs collected via cookies or analytics tools.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">3. How We Use Your Information</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                <li>Process event registrations and payments.</li>
                <li>Communicate updates, confirmations, and event-related details.</li>
                <li>Improve our website&rsquo;s performance and user experience.</li>
                <li>Ensure event security and regulatory compliance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">4. Data Protection</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                Your personal information is stored on secure servers. We use encryption and limited-access protocols to prevent unauthorized use or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">5. Sharing of Information</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 mb-4">
                We do not sell or rent your personal data. We may share limited information only with:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                <li>Payment gateways for processing transactions.</li>
                <li>Event partners or vendors who assist in operations under confidentiality agreements.</li>
                <li>Law enforcement if required by law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">6. Cookies</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                We use cookies to enhance website performance and understand user behavior. You can disable cookies through your browser settings, but certain features may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">7. Third-Party Links</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                Our site may contain links to third-party websites. We are not responsible for their privacy practices or content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">8. Your Rights</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                <li>Request access, correction, or deletion of your data.</li>
                <li>Withdraw consent for communications.</li>
              </ul>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 mt-4">
                To exercise these rights, email us at
                <a href="mailto:contact@imagicity.in" className="ml-2 text-[#ffe300] underline-offset-4 hover:underline">
                  contact@imagicity.in
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">9. Children&rsquo;s Privacy</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                We do not knowingly collect information from individuals under 13 years of age. If such data is discovered, it will be deleted promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">10. Updates to This Policy</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                We may revise this Privacy Policy from time to time. Updates will be posted on this page with a new &quot;Last Updated&quot; date.
              </p>
            </section>

            <section className="bg-[#ffe300]/10 border border-[#ffe300]/30 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">11. Contact Us</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                For any questions or concerns regarding this Privacy Policy, contact:
              </p>
              <div className="mt-4 space-y-2 text-sm sm:text-base md:text-lg text-gray-100">
                <p>📧 contact@imagicity.in</p>
                <p>📍 Hazaribagh, Jharkhand, India</p>
              </div>
            </section>

            <p className="text-xs sm:text-sm text-gray-500 italic">
              Would you like me to rewrite this to fit your website’s visual tone (neon, festival vibe) while keeping it legally accurate?
            </p>
          </article>
        </div>
      </section>

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
