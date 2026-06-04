import PageHero from "@/components/PageHero";
import VenueSection from "@/components/VenueSection";
import ScrollingBanner from "@/components/ScrollingBanner";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";

export const metadata = {
  title: "Venue · MADOOZA",
  description:
    "Where to find Madooza 2025 in Hazaribagh, Jharkhand — directions, parking, amenities.",
};

export default function VenuePage() {
  return (
    <>
      <PageHero
        eyebrow="The Venue"
        title="Find The Madness"
        blurb="Hazaribagh — Jharkhand's creative heartland. Saturday 13 December. Exact pin drops two weeks out."
      />
      <ScrollingBanner variant="cyan" tilt="left" />
      <VenueSection />
      <ContactUs />
      <Footer />
    </>
  );
}
