import { notFound } from "next/navigation";
import { applyTokens, publicContent } from "@/lib/content";
import { getCopy } from "@/lib/copy";
import { describeDate, getSettings, isPageHidden } from "@/lib/settings";
import ConcertClient from "./ConcertClient";

export const dynamic = "force-dynamic";

export default async function ConcertPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "concert")) notFound();

  const words = await getCopy("concert");

  const points = (await publicContent("concertPoints")).map((r) =>
    applyTokens(String(r.text ?? ""), settings),
  );

  // The date promise sits apart from the editable list because its wording has
  // to change with how much of the date is out. Both versions are slots, so the
  // sentence is still the council's to write.
  const date = describeDate(settings);
  points.push(date.sealed ? words.confirmItemDateSealed : words.confirmItemDateRevealed);

  const info = (await publicContent("concertInfo")).map((r) => ({
    title: applyTokens(String(r.title ?? ""), settings),
    body: applyTokens(String(r.body ?? ""), settings),
  }));

  return (
    <ConcertClient
      settings={settings}
      words={words}
      points={points}
      info={info}
      lineupLive={!isPageHidden(settings, "lineup")}
    />
  );
}
