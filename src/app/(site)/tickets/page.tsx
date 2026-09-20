import { notFound } from "next/navigation";
import { applyTokens, publicContent } from "@/lib/content";
import { getCopy } from "@/lib/copy";
import { describeDate, getSettings, isPageHidden } from "@/lib/settings";
import TicketsClient from "./TicketsClient";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "tickets")) notFound();

  const words = await getCopy("tickets");

  const fetePassIncludes = (await publicContent("fetePassIncludes")).map((r) => ({
    id: r.id,
    text: applyTokens(String(r.text ?? ""), settings),
    included: !!r.included,
  }));

  const concertPassIncludes = (await publicContent("concertPassIncludes")).map((r) => ({
    id: r.id,
    text: applyTokens(String(r.text ?? ""), settings),
  }));

  return (
    <TicketsClient
      settings={settings}
      date={describeDate(settings)}
      words={words}
      fetePassIncludes={fetePassIncludes}
      concertPassIncludes={concertPassIncludes}
    />
  );
}
