"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";
import AboutSection from "@/components/AboutSection";
import OurPartners from "@/components/OurPartners";
import ContactUs from "@/components/ContactUs";

const involvementOptions = [
  {
    name: "Bring Your Stall",
    desc: "Showcase food, art, games, or merch in a high-energy bazaar built for creators.",
    panelClass: "bg-red-500 text-white",
    imageBgClass: "bg-yellow-300",
    logo: "/D2.png",
    href: "/stall",
  },
  {
    name: "Cosplay Event",
    desc: "Step into character and own Jharkhand’s wildest fandom stage at MADOOZA.",
    panelClass: "bg-orange-500 text-white",
    imageBgClass: "bg-[#A1FFFD]",
    logo: "/D3.png",
    href: "/cosplay",
  },
  {
    name: "Performers",
    desc: "From bands and DJs to poets and dancers, light up the lineup with your act.",
    panelClass: "bg-[#A1FFFD] text-black",
    imageBgClass: "bg-pink-600",
    logo: "/D5.png",
    href: "/performer",
  },
  {
    name: "Volunteers",
    desc: "Join the crew, earn experience, and see the madness from behind the scenes.",
    panelClass: "bg-blue-500 text-white",
    imageBgClass: "bg-yellow-300",
    logo: "/D1.png",
    href: "/volunteer",
  },
  {
    name: "Sponsors",
    desc: "Partner with MADOOZA to amplify your brand across Jharkhand’s youth movement.",
    panelClass: "bg-green-400 text-black",
    imageBgClass: "bg-blue-600",
    logo: "/D4.png",
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

export default function Home() {
  const [active, setActive] = useState(involvementOptions[0].name);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const currentFestival =
    involvementOptions.find((f) => f.name === active) ?? involvementOptions[0];

  const openTicketModal = () => {
    setIsTicketModalOpen(true);
  };

  const closeTicketModal = () => {
    setIsTicketModalOpen(false);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle ticket form submission logic here
    alert("Ticket request submitted! We'll contact you shortly.");
    closeTicketModal();
  };

  return (
    <div className="w-full">
  
        <div className="w-full h-[50vh] md:h-[80vh] bg-blue-500 relative">
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-4">
          {/* Logo */}
          <div className="relative w-[70%] sm:w-[60%] md:w-[50%] lg:w-[45%] xl:w-[40%] max-w-[600px]">
            <Image 
              src="/logo.png" 
              alt="MADOOZA" 
              width={600} 
              height={570} 
              className="w-full h-auto"
              priority
            />
          </div>
          
          {/* Text and Button */}
          <div className="text-center flex flex-col items-center gap-2 sm:gap-3 md:gap-4 -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-10">
            <p className="text-[#9dffff] font-extrabold font-tt-commons text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl text-center relative z-20 px-4">
              THE SOUND OF PURE MADNESS
            </p>
            <button 
              onClick={openTicketModal}
              className="bg-[#ffe300] text-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold py-2 px-4 sm:py-2.5 sm:px-5 md:py-3 md:px-6 lg:py-3.5 lg:px-8 pointer-events-auto cursor-pointer hover:bg-[#ffd000] hover:scale-105 transition-all z-20 rounded-sm shadow-lg">
              GET TICKETS NOW
            </button>
          </div>
        </div>
         
      </div>
      <ScrollingBanner/>
       <AboutSection />
      <section id="involvewithus" className="bg-[#7300ff] text-white py-12 md:py-20 flex justify-center items-center flex-col px-4">
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
            <p className="text-white text-base sm:text-lg md:text-xl font-bold font-tt-commons">
              Coming Soon
            </p>
          </div>

          {/* Creator Cards */}
          <div id="creators" className="flex flex-col md:flex-row justify-center items-stretch gap-8 md:gap-12 max-w-5xl mx-auto">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
          <div className="relative bg-black border-4 border-[#ffe300] w-full max-w-2xl max-h-[95vh] overflow-y-auto p-2 sm:p-4">
            {/* Corner Decoration Image */}
            <Image
              src="/comic.png"
              alt="decoration"
              width={160}
              height={160}
              className="absolute top-0 left-0 w-20 sm:w-24 md:w-32 lg:w-40 h-20 sm:h-24 md:h-32 lg:h-40 opacity-50 pointer-events-none z-0"
            />

            {/* Close Button */}
            <button
              onClick={closeTicketModal}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:text-[#ffe300] text-2xl sm:text-3xl z-10 transition-colors"
            >
              ✕
            </button>

            {/* Form Content */}
            <form onSubmit={handleTicketSubmit} className="relative z-10 font-sans">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#ff1a00] to-[#7300ff] p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
                <h2 className="text-[#ffe300] font-oswald text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center uppercase">
                  Get Your Tickets
                </h2>
                <p className="text-white text-xs sm:text-sm md:text-base text-center mt-2">
                  Fill in your details and we&apos;ll get back to you with ticket information
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-3 sm:space-y-4 px-2 sm:px-4">
                {/* Name Field */}
                <div>
                  <label className="block text-[#ffe300] font-semibold mb-2 text-sm sm:text-base" htmlFor="ticket-name">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="ticket-name"
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-[#7300ff] bg-black/50 text-white text-sm sm:text-base focus:border-[#ffe300] focus:outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[#ffe300] font-semibold mb-2 text-sm sm:text-base" htmlFor="ticket-email">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="ticket-email"
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-[#7300ff] bg-black/50 text-white text-sm sm:text-base focus:border-[#ffe300] focus:outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-[#ffe300] font-semibold mb-2 text-sm sm:text-base" htmlFor="ticket-phone">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="ticket-phone"
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-[#7300ff] bg-black/50 text-white text-sm sm:text-base focus:border-[#ffe300] focus:outline-none transition-all"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>

                {/* Number of Tickets */}
                <div>
                  <label className="block text-[#ffe300] font-semibold mb-2 text-sm sm:text-base" htmlFor="ticket-quantity">
                    Number of Tickets *
                  </label>
                  <select
                    id="ticket-quantity"
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-[#7300ff] bg-black/50 text-white text-sm sm:text-base focus:border-[#ffe300] focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select quantity</option>
                    <option value="1">1 Ticket</option>
                    <option value="2">2 Tickets</option>
                    <option value="3">3 Tickets</option>
                    <option value="4">4 Tickets</option>
                    <option value="5">5 Tickets</option>
                    <option value="5+">5+ Tickets (Group Booking)</option>
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[#ffe300] font-semibold mb-2 text-sm sm:text-base" htmlFor="ticket-message">
                    Special Requests / Questions (Optional)
                  </label>
                  <textarea
                    id="ticket-message"
                    rows={3}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-[#7300ff] bg-black/50 text-white text-sm sm:text-base focus:border-[#ffe300] focus:outline-none transition-all resize-none"
                    placeholder="Any special requirements or questions..."
                  ></textarea>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="ticket-terms"
                    required
                    className="mt-1 w-5 h-5 accent-[#ffe300] cursor-pointer"
                  />
                  <label htmlFor="ticket-terms" className="text-sm text-gray-300 cursor-pointer">
                    I have read and agree to the{" "}
                    <Link href="/privacy-policy" className="text-[#ffe300] hover:underline">
                      terms and conditions
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#ffe300] text-black font-oswald text-sm sm:text-base md:text-lg py-2 sm:py-3 hover:bg-[#ffd000] transition-all uppercase hover:scale-105"
                >
                  Request Tickets
                </button>
                <button
                  type="button"
                  onClick={closeTicketModal}
                  className="sm:w-auto px-6 py-2 sm:py-3 border-2 border-[#ffe300] text-white text-sm sm:text-base font-semibold hover:bg-[#ffe300] hover:text-black transition-all"
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