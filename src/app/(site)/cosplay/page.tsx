import { getSettings } from "@/lib/settings";
import CosplayClient from "./CosplayClient";

export const dynamic = "force-dynamic";

export default async function CosplayPage() {
  return <CosplayClient settings={await getSettings()} />;
}
