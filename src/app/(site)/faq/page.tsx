import { notFound } from "next/navigation";
import { applyTokens, publicContent } from "@/lib/content";
import { getSettings, isPageHidden } from "@/lib/settings";
import FaqClient from "./FaqClient";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "faq")) notFound();

  const faqs = (await publicContent("faqs")).map((r) => ({
    q: applyTokens(String(r.q ?? ""), settings),
    a: applyTokens(String(r.a ?? ""), settings),
  }));

  return <FaqClient faqs={faqs} contactEmail={settings.contactEmail} />;
}
