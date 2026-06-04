import PageHero from "@/components/PageHero";
import ScheduleSection from "@/components/ScheduleSection";
import ScrollingBanner from "@/components/ScrollingBanner";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";

export const metadata = {
  title: "Schedule · MADOOZA",
  description:
    "Full Madooza 2025 schedule — 12 hours, 3 zones, every set you don't want to miss.",
};

export default function SchedulePage() {
  return (
    <>
      <PageHero
        eyebrow="Saturday · 13 December"
        title="The Schedule"
        blurb="Twelve hours. Three zones. Plot your route, then follow the loudest sound anyway."
      />
      <ScrollingBanner variant="acid" tilt="right" />
      <ScheduleSection full />
      <ContactUs />
      <Footer />
    </>
  );
}
