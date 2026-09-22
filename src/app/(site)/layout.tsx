import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetaPixel from "@/components/MetaPixel";
import { describeDate, getSettings } from "@/lib/settings";

// Settings live in Firestore and the admin panel edits them, so every public
// page is rendered per request rather than baked at build time.
export const dynamic = "force-dynamic";

/** Title and description are editable too, and the date phrasing follows suit. */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const date = describeDate(settings);
  return {
    title: settings.siteTitle,
    description: `${settings.siteDescription} Happening ${date.sentence}.`,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      {/* The pixel lives on the public pages and deliberately nowhere else.
          The gate scanner and the admin panel are staff tools, and /t/<token>
          is somebody's actual ticket — the pixel reports the page's URL, so
          putting it there would hand Meta a stream of live pass tokens. */}
      <MetaPixel />
      <Header settings={settings} />
      {children}
      <Footer />
    </>
  );
}
