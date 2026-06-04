"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import TicketsSection from "@/components/TicketsSection";
import FAQSection from "@/components/FAQSection";
import ScrollingBanner from "@/components/ScrollingBanner";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";
import TicketModal from "@/components/TicketModal";

export default function TicketsPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHero
        eyebrow="Live now"
        title="Grab Your Pass"
        blurb="Pick a tier. Drop your details. The pass lands instantly in your inbox after payment."
      />
      <ScrollingBanner variant="acid" tilt="right" />
      <TicketsSection onOpenTickets={() => setOpen(true)} />
      <FAQSection />
      <ContactUs />
      <Footer />
      <TicketModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
