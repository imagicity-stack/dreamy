import { getSettings } from "@/lib/settings";
import LineupClient from "./LineupClient";

export const dynamic = "force-dynamic";

export default async function LineupPage() {
  return <LineupClient settings={await getSettings()} />;
}
