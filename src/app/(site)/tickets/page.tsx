import { notFound } from "next/navigation";
import { describeDate, getSettings, isPageHidden } from "@/lib/settings";
import TicketsClient from "./TicketsClient";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "tickets")) notFound();

  return <TicketsClient settings={settings} date={describeDate(settings)} />;
}
