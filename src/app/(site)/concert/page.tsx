import { getSettings } from "@/lib/settings";
import ConcertClient from "./ConcertClient";

export const dynamic = "force-dynamic";

export default async function ConcertPage() {
  return <ConcertClient settings={await getSettings()} />;
}
