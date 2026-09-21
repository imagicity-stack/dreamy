import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { legalDocs } from "@/lib/legal";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Refund policy — MADOOZA",
  description: "How refunds work for MADOOZA passes, cosplay entries, coins and merch — settled at the school office.",
};

export default async function RefundsPage() {
  const settings = await getSettings();
  return (
    <LegalDoc
      doc={legalDocs(settings).refunds}
      contactEmail={settings.contactEmail}
      contactPhone={settings.contactPhone}
    />
  );
}
