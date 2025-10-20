"use client";

import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

export default function CancellationRefundPolicyPage() {
  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7300ff] via-[#ff1a00] to-[#ffe300] text-white py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.35em] text-[#ffe300] font-oswald mb-4">
            Website Legals
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald uppercase drop-shadow-xl">
            Cancellation and Refund Policy – Madooza
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
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">1. Overview</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                This Cancellation and Refund Policy governs all payments made for participation in Madooza, organized by IMAGICITY, Hazaribagh, Jharkhand. It applies to all ticket holders, stall vendors, and cosplay event participants. By making a payment or registering for Madooza, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">2. Ticket Purchases</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                All general entry tickets purchased online through official Madooza platforms are final, non-refundable, and non-transferable.
              </p>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300] mt-4">
                <li>Once a ticket is booked, no cancellation or refund will be permitted for any reason, including change of plans, travel delays, or non-attendance.</li>
                <li>Tickets cannot be transferred, exchanged, or used for any other event.</li>
                <li>Any ticket obtained through unauthorized sources will be considered invalid.</li>
                <li>Lost, stolen, or damaged tickets will not be replaced.</li>
              </ul>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 mt-4">
                <span className="text-white font-semibold">Reason:</span> All infrastructure, venue arrangements, artist coordination, and event logistics are confirmed based on advance ticket sales. Hence, refunds or cancellations are not feasible once the booking is completed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">3. Stall and Vendor Cancellations</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                Vendors or exhibitors who book stalls but later decide not to participate before the day of the event may be eligible for a partial refund, depending on the timing and reason for withdrawal.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-oswald text-[#ffe300] uppercase mb-3">3.1 Eligibility for Refund</h3>
                  <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                    <li>A written cancellation request must be sent to madooza@imagicity.in from the registered email ID used during booking.</li>
                    <li>The email must include stall details, payment proof, and a valid reason for cancellation.</li>
                    <li>Requests made on or after the event day will not be eligible for refunds.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-oswald text-[#ffe300] uppercase mb-3">3.2 Refund Structure</h3>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    <div className="grid grid-cols-1 md:grid-cols-3 text-sm sm:text-base md:text-lg text-gray-100">
                      <div className="bg-[#ffe300]/10 p-4 font-oswald uppercase text-[#ffe300]">Time of Cancellation</div>
                      <div className="bg-[#ffe300]/10 p-4 font-oswald uppercase text-[#ffe300]">Refund Percentage</div>
                      <div className="bg-[#ffe300]/10 p-4 font-oswald uppercase text-[#ffe300]">Condition</div>
                      <div className="p-4 border-t border-white/5">3 or more days before the event</div>
                      <div className="p-4 border-t border-white/5">70%</div>
                      <div className="p-4 border-t border-white/5">Subject to deduction of setup and promotion costs.</div>
                      <div className="p-4 border-t border-white/5">2 days before the event</div>
                      <div className="p-4 border-t border-white/5">50%</div>
                      <div className="p-4 border-t border-white/5">Partial refund, depending on preparation stage.</div>
                      <div className="p-4 border-t border-white/5">1 day before or on event day</div>
                      <div className="p-4 border-t border-white/5">0%</div>
                      <div className="p-4 border-t border-white/5">No refund, as allocations and logistics are finalized.</div>
                    </div>
                  </div>
                  <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300] mt-4">
                    <li>Administrative and processing charges will be deducted from the refund amount.</li>
                    <li>Final approval of any refund remains at the discretion of IMAGICITY management.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-oswald text-[#ffe300] uppercase mb-3">3.3 Refund Process</h3>
                  <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                    <li>Approved refunds will be processed within 10–15 working days using the same payment method.</li>
                    <li>IMAGICITY will not be responsible for external bank or gateway delays.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">4. Cosplay Event Participants</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                Participants registering for the Cosplay Competition will follow the same cancellation and refund terms as stall vendors.
              </p>

              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-oswald text-[#ffe300] uppercase mb-3">4.1 Cancellation and Refund Eligibility</h3>
                  <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                    <li>Cancellation requests must be emailed to madooza@imagicity.in from the registered email ID.</li>
                    <li>The email should clearly mention the participant&apos;s full name, registration ID, and valid reason for withdrawal.</li>
                    <li>Cancellations will only be accepted before the event day. Once the event day begins, no refund will be applicable.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-oswald text-[#ffe300] uppercase mb-3">4.2 Refund Structure</h3>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    <div className="grid grid-cols-1 md:grid-cols-3 text-sm sm:text-base md:text-lg text-gray-100">
                      <div className="bg-[#ffe300]/10 p-4 font-oswald uppercase text-[#ffe300]">Time of Cancellation</div>
                      <div className="bg-[#ffe300]/10 p-4 font-oswald uppercase text-[#ffe300]">Refund Percentage</div>
                      <div className="bg-[#ffe300]/10 p-4 font-oswald uppercase text-[#ffe300]">Condition</div>
                      <div className="p-4 border-t border-white/5">3 or more days before event</div>
                      <div className="p-4 border-t border-white/5">70%</div>
                      <div className="p-4 border-t border-white/5">Refund possible after deduction of admin and processing costs.</div>
                      <div className="p-4 border-t border-white/5">2 days before event</div>
                      <div className="p-4 border-t border-white/5">50%</div>
                      <div className="p-4 border-t border-white/5">Refund may be partially approved based on preparation stage.</div>
                      <div className="p-4 border-t border-white/5">1 day before or on event day</div>
                      <div className="p-4 border-t border-white/5">0%</div>
                      <div className="p-4 border-t border-white/5">No refund. Participation fee will be forfeited.</div>
                    </div>
                  </div>
                  <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300] mt-4">
                    <li>Refunds, if approved, will be processed within 10–15 working days.</li>
                    <li>Management reserves full rights to deny refund requests made after deadlines or without valid justification.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">5. Event Cancellation or Postponement</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                In case Madooza is postponed or cancelled due to unavoidable situations such as government orders, extreme weather, or safety concerns:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300] mt-4">
                <li>All tickets, stall bookings, and cosplay registrations will automatically be carried forward to the rescheduled date.</li>
                <li>If rescheduling is not possible, partial refunds may be processed after deducting unavoidable setup and marketing costs.</li>
              </ul>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 mt-4">
                IMAGICITY will not be liable for travel, accommodation, or personal expenses incurred by participants or visitors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">6. No-Show Policy</h2>
              <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 marker:text-[#ffe300]">
                <li>Ticket holders, stall vendors, or cosplay participants who fail to attend the event on the scheduled day will be considered no-shows.</li>
                <li>No-shows are not eligible for any refund or transfer of their booking.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">7. Force Majeure</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                If Madooza is disrupted by events beyond IMAGICITY&apos;s control (e.g., natural calamities, power failures, lockdowns, or government restrictions), the organizers will not be obligated to issue refunds. Every effort will be made to provide alternative dates or arrangements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">8. Misuse and Refund Abuse Prevention</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                IMAGICITY reserves the right to reject any refund request that appears fraudulent, repetitive, or unreasonable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">9. Agreement</h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-200">
                By purchasing a ticket, booking a stall, or registering for the cosplay event, you acknowledge that you have read, understood, and agreed to this Cancellation and Refund Policy.
              </p>
            </section>

            <section className="bg-[#ffe300]/10 border border-[#ffe300]/30 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">10. Contact</h2>
              <div className="space-y-2 text-sm sm:text-base md:text-lg text-gray-100 leading-relaxed">
                <p>📧 madooza@imagicity.in</p>
                <p>📍 IMAGICITY, Hazaribagh, Jharkhand, India</p>
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
