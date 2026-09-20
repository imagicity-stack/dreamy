import { notFound } from "next/navigation";
import { publicContent } from "@/lib/content";
import { getSettings, isPageHidden } from "@/lib/settings";
import CosplayClient, { type Category, type Prize } from "./CosplayClient";

export const dynamic = "force-dynamic";

export default async function CosplayPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "cosplay")) notFound();

  const [categoryRecords, prizeRecords] = await Promise.all([
    publicContent("cosplayCategories"),
    publicContent("cosplayPrizes"),
  ]);

  const categories: Category[] = categoryRecords.map((c) => ({
    id: c.id,
    title: String(c.title ?? ""),
    // The value is what gets stored with the entry; fall back to the title so a
    // category added without one still saves something readable.
    value: String(c.value ?? "").trim() || String(c.title ?? ""),
    body: String(c.body ?? ""),
    image: (c.image as { url: string } | null) ?? null,
  }));

  const prizes: Prize[] = prizeRecords.map((p) => ({
    id: p.id,
    amount: String(p.amount ?? ""),
    title: String(p.title ?? ""),
    note: String(p.note ?? ""),
  }));

  return <CosplayClient settings={settings} categories={categories} prizes={prizes} />;
}
