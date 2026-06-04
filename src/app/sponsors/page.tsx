import PageHero from "@/components/PageHero";
import SponsorsSection from "@/components/SponsorsSection";
import ScrollingBanner from "@/components/ScrollingBanner";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";

export const metadata = {
  title: "Sponsors · MADOOZA",
  description: "The brands fuelling Madooza 2025. Headline, stage, zone, and community partners.",
};

export default function SponsorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Powered By"
        title="Our Partners"
        blurb="The brands fuelling the madness. Headline title spot is still open — want your logo here?"
      />
      <ScrollingBanner variant="acid" tilt="left" />
      <SponsorsSection full />
      <ContactUs />
      <Footer />
    </>
  );
}
