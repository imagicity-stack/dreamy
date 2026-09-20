import { notFound } from "next/navigation";
import { getSettings, isPageHidden } from "@/lib/settings";
import ConcertClient from "./ConcertClient";

export const dynamic = "force-dynamic";

export default async function ConcertPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "concert")) notFound();

  return <ConcertClient settings={settings} />;
}
