"use client";
import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";
import AboutSection from "@/components/AboutSection";
import OurPartners from "@/components/OurPartners";
import ContactUs from "@/components/ContactUs";
import {
  createPaymentOrder,
  loadRazorpayScript,
  RazorpayOptions,
  RazorpaySuccessResponse,
} from "@/lib/razorpay";

const involvementOptions = [
  {
    name: "Bring Your Stall",
    desc: "Showcase food, art, games, or merch in a high-energy bazaar built for creators.",
    panelClass: "bg-red-500 text-white",
    imageBgClass: "bg-yellow-300",
    logo: "/involve/stall.jpg",
    href: "/stall",
  },
  {
    name: "Cosplay Event",
    desc: "Step into character and own Jharkhand’s wildest fandom stage at MADOOZA.",
    panelClass: "bg-orange-500 text-white",
    imageBgClass: "bg-[#A1FFFD]",
    logo: "/involve/cosplay.jpg",
    href: "/cosplay",
  },
  {
    name: "Performers",
    desc: "From bands and DJs to poets and dancers, light up the lineup with your act.",
    panelClass: "bg-[#A1FFFD] text-black",
    imageBgClass: "bg-pink-600",
    logo: "/involve/Perfomers.jpg",
    href: "/performer",
  },
  {
    name: "Volunteers",
    desc: "Join the crew, earn experience, and see the madness from behind the scenes.",
    panelClass: "bg-blue-500 text-white",
    imageBgClass: "bg-yellow-300",
    logo: "/involve/volunteer.jpg",
    href: "/volunteer",
  },
  {
    name: "Sponsors",
    desc: "Partner with MADOOZA to amplify your brand across Jharkhand’s youth movement.",
    panelClass: "bg-green-400 text-black",
    imageBgClass: "bg-blue-600",
    logo: "/involve/sponsorship.png",
    href: "/sponsor",
  },
];

const highlights = [
  {
    title: "CREATOR 1",
    subtitle: "Coming Soon",
    color: "bg-[#ff1a00]",
    textColor: "text-[#ffe300]",
    image: "/creator1.png",
  },
  {
    title: "CREATOR 2",
    subtitle: "Coming Soon",
    color: "bg-[#7300ff]",
    textColor: "text-[#9dffff]",
    image: "/creator1.png",
  },
];

const HERO_TITLE = "HAZARIBAGH";

const TICKET_UNIT_PRICE = 30;

const resolveTicketQuantity = (value: string): number => {
  const parsed = Number.parseInt(value, 10);

  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.min(parsed, 5);
  }

  return 1;
};

export default function Home() {
  const [active, setActive] = useState(involvementOptions[0].name);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketProcessing, setTicketProcessing] = useState(false);

  const currentFestival =
    involvementOptions.find((f) => f.name === active) ?? involvementOptions[0];

  const openTicketModal = () => {
    setIsTicketModalOpen(true);
  };

  const closeTicketModal = () => {
    setIsTicketModalOpen(false);
    setTicketProcessing(false);
  };

  const handleTicketSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (ticketProcessing) {
      return;
    }

    setTicketProcessing(true);

    const formData = new FormData(form);
    const getValue = (key: string) => formData.get(key)?.toString().trim() ?? "";

    const quantityValue = getValue("quantity");
    const quantity = resolveTicketQuantity(quantityValue);
    const totalAmount = quantity * TICKET_UNIT_PRICE;

    const ticketDetails = {
      name: getValue("name"),
      email: getValue("email"),
      phone: getValue("phone"),
      quantity: quantity.toString(),
      totalAmount,
      message: getValue("message"),
      termsAccepted: formData.get("terms") === "accepted",
      timestamp: new Date().toISOString(),
      unitPrice: TICKET_UNIT_PRICE,
    };

    try {
      const orderConfig = await createPaymentOrder("ticket", totalAmount, ticketDetails);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Unable to load payment gateway. Please refresh and try again.");
      }

      let paymentCompleted = false;

      const options: RazorpayOptions = {
        key: orderConfig.razorpayKeyId,
        amount: orderConfig.amount,
        currency: orderConfig.currency,
        name: "Madooza Event Pass",
        description: "Ticket Purchase",
        order_id: orderConfig.orderId,
        prefill: {
          name: ticketDetails.name,
          email: ticketDetails.email,
          contact: ticketDetails.phone,
        },
        notes: {
          formType: "ticket",
          quantity: quantity.toString(),
          unitPrice: TICKET_UNIT_PRICE.toString(),
          totalAmount: totalAmount.toString(),
          displayName: "Madooza Event Pass",
        },
        config: {
          branding: {
            brand_name: "Madooza Event Pass",
            company_name: "Madooza Event Pass",
          },
        },
        handler: (response: RazorpaySuccessResponse) => {
          paymentCompleted = true;
          form.reset();
          closeTicketModal();
          const reference = response.razorpay_payment_id
            ? ` Reference: ${response.razorpay_payment_id}`
            : "";
          alert(
            `Payment successful! Your ${
              quantity === 1
                ? "event pass is confirmed."
                : `${quantity} event passes are confirmed.`
            }${reference}`,
          );
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompleted) {
              alert("Payment popup closed before completion. Please try again.");
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        paymentCompleted = false;
        alert("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (err) {
      console.error("Error processing ticket purchase:", err);
      alert(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setTicketProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div id="tickets" className="w-full h-[50vh] md:h-[80vh] bg-blue-500 relative">
        <Image
          src="/hero.png"

          alt="MADOOZA Hero Video"
          width={1920}
          height={1080}

          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-4 sm:gap-5 md:gap-7 lg:gap-8 px-4">
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <div
              className="hero-title font-league-gothic"
              role="heading"
              aria-level={1}
              aria-label="Hazaribagh"
            >
              <span className="sr-only">Hazaribagh</span>
              {HERO_TITLE.split("").map((character, index) => (
                <span
                  key={`${character}-${index}`}
                  className="hero-letter"
                  aria-hidden="true"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  {character}
                </span>
              ))}
            </div>
            <p className="text-white font-extrabold font-quicksand text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl text-center relative z-20 px-4">
              THE SOUND OF PURE MADNESS
            </p>
          </div>

          <button
            onClick={openTicketModal}
            className="hero-cta-button bg-[#ffe300] text-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-montserrat pointer-events-auto cursor-pointer z-20"
          >
            <Image
              src="/ticketicon.png"
              alt="Ticket icon"
              width={24}
              height={24}
              className="w-5 h-5 md:w-6 md:h-6 object-contain"
            />
            <span>GET TICKETS NOW</span>
          </button>
        </div>

      </div>
      <ScrollingBanner />
      <AboutSection />
      <section
        id="involvewithus"
        className="bg-[#7300ff] text-white py-12 md:py-20 flex justify-center items-center flex-col px-4 scroll-mt-24"
      >
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase mb-6 md:mb-10 font-oswald tracking-wide text-[#9dffff]">
          INVOLVE WITH US
        </h2>

        {/* Tabs */}
        <div className="flex justify-center w-full">
          <div className="w-full md:w-10/12 overflow-x-auto">
            <div className="flex gap-1 md:gap-2 min-w-max md:min-w-0">
              {involvementOptions.map((festival) => (
                <button
                  key={festival.name}
                  onClick={() => setActive(festival.name)}
                  className={`flex items-center justify-center gap-1 md:gap-3 flex-1 px-2 md:px-4 py-2 md:py-3 cursor-pointer font-oswald tracking-wide text-sm sm:text-base md:text-lg lg:text-xl uppercase transition-all text-blue-700 whitespace-nowrap ${
                    active === festival.name
                      ? "bg-[#A1FFFD]"
                      : "bg-[#FFD600] hover:bg-[#A1FFFD]"
                  }`}
                >
                  <span className="text-center">{festival.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Festival Content */}
        <div className="flex justify-center mt-6 md:mt-10 w-full">
          <div className="w-full md:w-10/12 flex flex-col lg:flex-row items-stretch h-auto lg:min-h-[440px]">
            {/* Left Info */}
            <div
              className={`${currentFestival.panelClass} p-8 md:p-12 lg:p-20 lg:w-1/2 h-auto lg:h-full flex-1 flex flex-col justify-center`}
            >
              <h3
                className="mb-4 uppercase font-oswald text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide"
              >
                {currentFestival.name}
              </h3>
              <div className="h-auto lg:max-h-64 overflow-y-auto">
                <p className="text-sm md:text-base leading-relaxed">
                  {currentFestival.desc}
                </p>
              </div>
              <Link
                href={currentFestival.href}
                className="mt-4 inline-flex w-fit cursor-pointer bg-[#ffe300] text-black text-sm sm:text-base md:text-lg font-oswald px-5 py-2 rounded-md hover:bg-[#ffd000] transition-all uppercase"
              >
                Learn More
              </Link>
            </div>

            {/* Right Image */}
            <div
              className={`${currentFestival.imageBgClass} lg:w-1/2 w-full flex justify-center items-center p-6 md:p-8 lg:p-10 flex-1 min-h-[280px]`}
            >
              <Image
                src={currentFestival.logo}
                alt={`${currentFestival.name} logo`}
                width={600}
                height={600}
                className="object-fill max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
        <section className="py-8 md:py-12 w-full md:w-10/12 px-4 md:px-0">
          {/* Creators Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-wide font-oswald text-[#ffe300] mb-4">
              FEATURED CREATORS
            </h2>
            <p className="text-white text-base sm:text-lg md:text-xl font-bold font-quicksand">
              Coming Soon
            </p>
          </div>

          {/* Creator Cards */}
          <div
            id="creators"
            className="flex flex-col md:flex-row justify-center items-stretch gap-8 md:gap-12 max-w-5xl mx-auto scroll-mt-24"
          >
            {highlights.map((item, index) => (
              <div
                key={index}
                className={`${item.color} flex flex-col items-center w-full md:w-1/2 text-center duration-300 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-all border-4 border-white/20 hover:border-white/40`}
              >
                <div className="flex flex-col items-center justify-center p-8 pb-6">
                  <h3
                    className={`${item.textColor} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-wide font-oswald mb-3`}
                  >
                    {item.title}
                  </h3>
                  <p className={`${item.textColor} text-base sm:text-lg md:text-xl font-bold opacity-90`}>
                    {item.subtitle}
                  </p>
                </div>

                <div className="relative w-full flex justify-center items-end flex-1">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={600}
                    className="object-cover w-full h-full min-h-[300px] md:min-h-[400px] lg:min-h-[450px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
      <ScrollingBanner />
      <ContactUs />
      <OurPartners />
      <Footer />

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-none bg-black text-white shadow-[0_0_45px_rgba(0,255,255,0.35)]">
            <div className="pointer-events-none absolute -inset-6 -z-10 opacity-40 blur-3xl bg-[#00f5ff]" aria-hidden />

            <button
              onClick={closeTicketModal}
              className="absolute top-4 right-4 text-white text-2xl transition-transform hover:scale-110"
              aria-label="Close ticket form"
            >
              ✕
            </button>

            <form onSubmit={handleTicketSubmit} className="relative z-10 space-y-6 px-6 py-8 sm:px-10">
              <div className="text-center">
                <p className="font-montserrat text-sm tracking-[0.4em] text-[#00f5ff]">Tickets</p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-travel-sans uppercase text-white">
                  Get Your Passes
                </h2>
                <p className="mt-3 text-sm sm:text-base text-white/70">
                  Drop your details below and we&apos;ll confirm your tickets instantly once the payment succeeds.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm uppercase tracking-wide">
                  Full Name *
                  <input
                    type="text"
                    id="ticket-name"
                    name="name"
                    required
                    className="w-full bg-black px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-white/60"
                    placeholder="Enter your full name"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm uppercase tracking-wide">
                  Email Address *
                  <input
                    type="email"
                    id="ticket-email"
                    name="email"
                    required
                    className="w-full bg-black px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-white/60"
                    placeholder="your.email@example.com"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm uppercase tracking-wide">
                  Phone Number *
                  <input
                    type="tel"
                    id="ticket-phone"
                    name="phone"
                    required
                    className="w-full bg-black px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-white/60"
                    placeholder="+91 9122289578"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm uppercase tracking-wide">
                  Number of Tickets *
                  <select
                    id="ticket-quantity"
                    name="quantity"
                    required
                    className="w-full bg-black px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black cursor-pointer"
                  >
                    <option value="" className="bg-black text-white">
                      Select quantity
                    </option>
                    <option value="1" className="bg-black text-white">
                      1 Ticket
                    </option>
                    <option value="2" className="bg-black text-white">
                      2 Tickets
                    </option>
                    <option value="3" className="bg-black text-white">
                      3 Tickets
                    </option>
                    <option value="4" className="bg-black text-white">
                      4 Tickets
                    </option>
                    <option value="5" className="bg-black text-white">
                      5 Tickets
                    </option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm uppercase tracking-wide">
                Special Requests / Questions (Optional)
                <textarea
                  id="ticket-message"
                  name="message"
                  rows={4}
                  className="w-full resize-none bg-black px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-white/60"
                  placeholder="Let us know how we can help"
                />
              </label>

              <label className="flex items-start gap-3 text-xs sm:text-sm text-white/80">
                <input
                  type="checkbox"
                  id="ticket-terms"
                  name="terms"
                  value="accepted"
                  required
                  className="mt-1 h-5 w-5 accent-[#ff1a1a]"
                />
                <span>
                  I accept the{' '}
                  <Link href="/terms-and-conditions" className="text-[#00f5ff] underline-offset-4 hover:underline">
                    terms and conditions
                  </Link>
                </span>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={ticketProcessing}
                  className="flex-1 bg-[#ff1a1a] px-6 py-3 text-base font-montserrat uppercase tracking-[0.2em] text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ticketProcessing ? "Processing Payment..." : "Request Tickets"}
                </button>
                <button
                  type="button"
                  onClick={closeTicketModal}
                  className="bg-black px-6 py-3 text-base font-montserrat uppercase tracking-[0.2em] text-white transition-transform hover:scale-[1.02]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
