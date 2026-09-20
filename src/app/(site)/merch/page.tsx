import { notFound } from "next/navigation";
import { publicContent } from "@/lib/content";
import { getCopy } from "@/lib/copy";
import { getSettings, isPageHidden } from "@/lib/settings";
import MerchClient, { type MerchRecord } from "./MerchClient";

export const dynamic = "force-dynamic";

export default async function MerchPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "merch")) notFound();

  const words = await getCopy("merch");

  const items = (await publicContent("merch")).map((r) => ({
    id: r.id,
    name: String(r.name ?? ""),
    price: Number(r.price ?? 0),
    note: String(r.note ?? ""),
    image: (r.image as MerchRecord["image"]) ?? null,
  }));

  return <MerchClient merchItems={items} words={words} open={settings.merchOpen} closedNote={settings.merchClosedNote} />;
}
