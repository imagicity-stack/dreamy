import { notFound } from "next/navigation";
import { applyTokens, publicContent } from "@/lib/content";
import { getCopy } from "@/lib/copy";
import { getSettings, isPageHidden } from "@/lib/settings";
import FaqClient, { type VenueTime } from "./FaqClient";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "faq")) notFound();

  const words = await getCopy("faq");

  const [faqRecords, scheduleRecords] = await Promise.all([
    publicContent("faqs"),
    publicContent("venueSchedule"),
  ]);

  const faqs = faqRecords.map((r) => ({
    q: applyTokens(String(r.q ?? ""), settings),
    a: applyTokens(String(r.a ?? ""), settings),
  }));

  const venueTimes: VenueTime[] = scheduleRecords.map((r) => ({
    id: r.id,
    label: String(r.label ?? ""),
    time: String(r.time ?? ""),
  }));

  return (
    <FaqClient
      faqs={faqs}
      venueTimes={venueTimes}
      words={words}
      contactEmail={settings.contactEmail}
      instagram={settings.instagram}
    />
  );
}
