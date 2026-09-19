import { getSettings } from "@/lib/settings";
import TicketsClient from "./TicketsClient";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  return <TicketsClient settings={await getSettings()} />;
}
