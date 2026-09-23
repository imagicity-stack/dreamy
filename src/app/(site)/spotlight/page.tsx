import { notFound } from "next/navigation";
import { publicContent } from "@/lib/content";
import { getCopy } from "@/lib/copy";
import { getSettings, isPageHidden } from "@/lib/settings";
import { SPOTLIGHT_ACTS, SPOTLIGHT_ACT_KEYS } from "@/lib/products";
import SpotlightClient, { type ActOption, type Prize, type Talent } from "./SpotlightClient";

export const dynamic = "force-dynamic";

export default async function SpotlightPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "spotlight")) notFound();

  const words = await getCopy("spotlight");

  const [talentRecords, prizeRecords, carnivalTiers] = await Promise.all([
    publicContent("spotlightCategories"),
    publicContent("spotlightPrizes"),
    publicContent("cosplayTiers"),
  ]);

  const talents: Talent[] = talentRecords.map((t) => ({
    id: t.id,
    title: String(t.title ?? ""),
    // The value is what gets stored with the entry; fall back to the title so a
    // talent added without one still saves something readable.
    value: String(t.value ?? "").trim() || String(t.title ?? ""),
    body: String(t.body ?? ""),
  }));

  const prizes: Prize[] = prizeRecords.map((p) => ({
    id: p.id,
    amount: String(p.amount ?? ""),
    title: String(p.title ?? ""),
    note: String(p.note ?? ""),
  }));

  // The act sizes, their caps and their prices are the server's to state — the
  // form only picks one, and the price it is charged is quoted again on the
  // server when the order is made.
  const acts: ActOption[] = SPOTLIGHT_ACT_KEYS.map((key) => ({
    key,
    label: SPOTLIGHT_ACTS[key].label,
    who: SPOTLIGHT_ACTS[key].who,
    maxMinutes: SPOTLIGHT_ACTS[key].maxMinutes,
    priceRupees: SPOTLIGHT_ACTS[key].price(settings),
  }));

  return (
    <SpotlightClient
      words={words}
      talents={talents}
      prizes={prizes}
      acts={acts}
      sponsorsLive={carnivalTiers.length > 0 && !isPageHidden(settings, "sponsors")}
    />
  );
}
