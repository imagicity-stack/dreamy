import PageHero from "@/components/PageHero";
import LineupSection from "@/components/LineupSection";
import ScrollingBanner from "@/components/ScrollingBanner";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";

export const metadata = {
  title: "Lineup · MADOOZA",
  description:
    "Headliners, bands, DJs, creators, and the MAD Parade — the full Madooza 2025 lineup.",
};

export default function LineupPage() {
  return (
    <>
      <PageHero
        eyebrow="The Lineup"
        title="Who's Playing"
        blurb="Headliners drop in waves. Names get bigger as the date gets closer. Stay tuned."
      />
      <ScrollingBanner variant="magenta" tilt="left" />
      <LineupSection full />
      <ScrollingBanner variant="cyan" tilt="right" />
      <ContactUs />
      <Footer />
    </>
  );
}
