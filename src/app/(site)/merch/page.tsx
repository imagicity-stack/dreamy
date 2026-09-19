import { getSettings, merchWithPrices } from "@/lib/settings";
import MerchClient from "./MerchClient";

export const dynamic = "force-dynamic";

export default async function MerchPage() {
  return <MerchClient merchItems={merchWithPrices(await getSettings())} />;
}
