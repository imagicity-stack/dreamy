import { buildFaqs } from "@/data/fest";
import { getSettings } from "@/lib/settings";
import FaqClient from "./FaqClient";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const settings = await getSettings();
  return <FaqClient faqs={buildFaqs(settings)} />;
}
