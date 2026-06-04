"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import ScrollingBanner from "@/components/ScrollingBanner";
import AboutSection from "@/components/AboutSection";
import LineupSection from "@/components/LineupSection";
import ScheduleSection from "@/components/ScheduleSection";
import VenueSection from "@/components/VenueSection";
import GallerySection from "@/components/GallerySection";
import SponsorsSection from "@/components/SponsorsSection";
import TicketsSection from "@/components/TicketsSection";
import InvolveSection from "@/components/InvolveSection";
import FAQSection from "@/components/FAQSection";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import TicketModal from "@/components/TicketModal";

export default function Home() {
  const [ticketsOpen, setTicketsOpen] = useState(false);

  return (
    <div className="w-full bg-[var(--ink)] text-white">
      <Hero onOpenTickets={() => setTicketsOpen(true)} />

      <ScrollingBanner variant="acid" tilt="left" />
      <ScrollingBanner variant="magenta" tilt="right" />

      <AboutSection />
      <LineupSection />

      <ScrollingBanner variant="cyan" tilt="left" />

      <ScheduleSection />
      <VenueSection />

      <ScrollingBanner variant="stripe" tilt="right" />

      <GallerySection />
      <InvolveSection />
      <TicketsSection onOpenTickets={() => setTicketsOpen(true)} />
      <SponsorsSection />

      <ScrollingBanner variant="acid" tilt="left" />

      <FAQSection />
      <ContactUs />
      <Footer />

      <TicketModal open={ticketsOpen} onClose={() => setTicketsOpen(false)} />
    </div>
  );
}
