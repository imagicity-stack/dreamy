import { notFound } from "next/navigation";
import { publicContent } from "@/lib/content";
import { getCopy } from "@/lib/copy";
import { getSettings, isPageHidden } from "@/lib/settings";
import { expectedImageName, localImage } from "@/lib/localImage";
import CosplayClient, { type Category, type Prize } from "./CosplayClient";

export const dynamic = "force-dynamic";

export default async function CosplayPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "cosplay")) notFound();

  const words = await getCopy("cosplay");

  const [categoryRecords, prizeRecords, carnivalTiers] = await Promise.all([
    publicContent("cosplayCategories"),
    publicContent("cosplayPrizes"),
    publicContent("cosplayTiers"),
  ]);

  const categories: Category[] = categoryRecords.map((c) => {
    // The value is what gets stored with the entry; fall back to the title so a
    // category added without one still saves something readable.
    const value = String(c.value ?? "").trim() || String(c.title ?? "");
    const uploaded = (c.image as { url: string } | null) ?? null;
    // An upload through the panel wins; otherwise look for a file committed to
    // the repo under the category's own name, and failing that hand the card
    // the filename it is waiting for so the gap explains itself.
    const onDisk = localImage("cosplay", value);

    return {
      id: c.id,
      title: String(c.title ?? ""),
      value,
      body: String(c.body ?? ""),
      image: uploaded?.url ? uploaded : onDisk ? { url: onDisk } : null,
      expectedImage: expectedImageName("cosplay", value),
    };
  });

  const prizes: Prize[] = prizeRecords.map((p) => ({
    id: p.id,
    amount: String(p.amount ?? ""),
    title: String(p.title ?? ""),
    note: String(p.note ?? ""),
  }));

  return (
    <CosplayClient
      settings={settings}
      words={words}
      categories={categories}
      prizes={prizes}
      carnivalTiersLive={carnivalTiers.length > 0}
    />
  );
}
