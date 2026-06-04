import PageHero from "@/components/PageHero";
import AboutSection from "@/components/AboutSection";
import ScrollingBanner from "@/components/ScrollingBanner";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";

export const metadata = {
  title: "About · MADOOZA",
  description:
    "Why Madooza exists, who built it, and what twelve hours of pure madness in Hazaribagh actually means.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The Story"
        title="About Madooza"
        blurb="Twelve hours, one city, one mission — give Hazaribagh's creators a stage worthy of their energy."
      />
      <ScrollingBanner variant="acid" tilt="left" />
      <AboutSection />
      <ContactUs />
      <Footer />
    </>
  );
}
