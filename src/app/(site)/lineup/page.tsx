import { notFound } from "next/navigation";
import { publicContent } from "@/lib/content";
import { getCopy } from "@/lib/copy";
import { getSettings, isPageHidden } from "@/lib/settings";
import LineupClient, { type ArtistCard, type SupportAct } from "./LineupClient";

export const dynamic = "force-dynamic";

export default async function LineupPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "lineup")) notFound();

  const words = await getCopy("lineup");

  const lineup: ArtistCard[] = (await publicContent("lineup")).map((r) => ({
    id: r.id,
    slot: String(r.slot ?? ""),
    kicker: String(r.kicker ?? ""),
    clue: String(r.clue ?? ""),
    hint: String(r.hint ?? ""),
    reveal: String(r.reveal ?? ""),
    revealed: r.revealed === true,
    name: String(r.name ?? ""),
    bio: String(r.bio ?? ""),
    image: (r.image as ArtistCard["image"]) ?? null,
  }));

  const supportActs: SupportAct[] = (await publicContent("supportActs")).map((r) => ({
    id: r.id,
    name: String(r.name ?? ""),
    when: String(r.when ?? ""),
    note: String(r.note ?? ""),
  }));

  return <LineupClient settings={settings} words={words} lineup={lineup} supportActs={supportActs} />;
}
