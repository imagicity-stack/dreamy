import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/settings";

// Settings live in Firestore and the admin panel edits them, so every public
// page is rendered per request rather than baked at build time.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Header settings={settings} />
      {children}
      <Footer />
    </>
  );
}
