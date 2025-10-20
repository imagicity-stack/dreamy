"use client";

import Link from "next/link";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black">
     
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-castle text-[#ffe300] mb-4">
            PRIVACY POLICY
          </h1>
          <p className="text-[#9dffff] text-lg md:text-xl font-tt-commons">
            Last Updated: October 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 font-sans md:space-y-12 text-white font-tt-commons">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Welcome to Madooza, organized by IMAGICITY. We value your privacy and are committed to
              protecting your personal information. This Privacy Policy explains how we collect, use, and
              safeguard your data when you visit our website or register for the event.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              2. Information We Collect
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-none space-y-3 ml-4">
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300] font-bold">• Personal Details:</span> Name, email address, phone number, and age when you register or buy tickets.
              </li>
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300] font-bold">• Payment Information:</span> Processed securely through our payment gateway. We do not store card or banking details.
              </li>
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300] font-bold">• Usage Data:</span> Device information, browser type, pages visited, and interaction logs collected via cookies or analytics tools.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-none space-y-3 ml-4">
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300]">•</span> Process event registrations and payments.
              </li>
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300]">•</span> Communicate updates, confirmations, and event-related details.
              </li>
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300]">•</span> Improve our website&apos;s performance and user experience.
              </li>
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300]">•</span> Ensure event security and regulatory compliance.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              4. Data Protection
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Your personal information is stored on secure servers. We use encryption and limited-access
              protocols to prevent unauthorized use or disclosure.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              5. Sharing of Information
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
              We do not sell or rent your personal data. We may share limited information only with:
            </p>
            <ul className="list-none space-y-3 ml-4">
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300]">•</span> Payment gateways for processing transactions.
              </li>
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300]">•</span> Event partners or vendors who assist in operations under confidentiality agreements.
              </li>
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300]">•</span> Law enforcement if required by law.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              6. Cookies
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              We use cookies to enhance website performance and understand user behavior. You can
              disable cookies through your browser settings, but certain features may not function properly.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              7. Third-Party Links
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Our site may contain links to third-party websites. We are not responsible for their privacy
              practices or content.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              8. Your Rights
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-none space-y-3 ml-4">
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300]">•</span> Request access, correction, or deletion of your data.
              </li>
              <li className="text-gray-300 text-base md:text-lg leading-relaxed">
                <span className="text-[#ffe300]">•</span> Withdraw consent for communications.
              </li>
            </ul>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-4">
              To exercise these rights, email us at{" "}
              <a href="mailto:contact@imagicity.in" className="text-[#9dffff] hover:text-[#ffe300] transition">
                contact@imagicity.in
              </a>
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              We do not knowingly collect information from individuals under 13 years of age. If such data is
              discovered, it will be deleted promptly.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              10. Updates to This Policy
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              We may revise this Privacy Policy from time to time. Updates will be posted on this page with a
              new &quot;Last Updated&quot; date.
            </p>
          </section>

          {/* Section 11 - Contact */}
          <section className="bg-gradient-to-r from-[#ff1a00]/10 to-[#7300ff]/10 border-l-4 border-[#ffe300] p-6 md:p-8 rounded-r-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-[#ff1a00] mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
              For any questions or concerns regarding this Privacy Policy, contact:
            </p>
            <div className="space-y-2">
              <p className="text-[#9dffff] text-base md:text-lg">
                📧{" "}
                <a href="mailto:contact@imagicity.in" className="hover:text-[#ffe300] transition">
                  contact@imagicity.in
                </a>
              </p>
              <p className="text-[#9dffff] text-base md:text-lg">
                📍 Hazaribagh, Jharkhand, India
              </p>
            </div>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 md:mt-16 text-center">
          <Link
            href="/"
            className="inline-block bg-[#ffe300] text-black px-8 py-3 md:px-12 md:py-4 text-lg md:text-xl font-bold rounded hover:bg-[#ff1a00] hover:text-white transition-all duration-300"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
