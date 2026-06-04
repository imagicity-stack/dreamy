import PageHero from "@/components/PageHero";
import GallerySection from "@/components/GallerySection";
import ScrollingBanner from "@/components/ScrollingBanner";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";

export const metadata = {
  title: "Gallery · MADOOZA",
  description: "Snippets, moodboards, and the buildup. Real gallery fills in after Madooza 2025.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="From The Field"
        title="Madness In Motion"
        blurb="The buildup, the moodboards, and a sneak of what 13 December will look like."
      />
      <ScrollingBanner variant="magenta" tilt="right" />
      <GallerySection full />
      <ContactUs />
      <Footer />
    </>
  );
}
