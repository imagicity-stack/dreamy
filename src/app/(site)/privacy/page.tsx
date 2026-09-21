import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { legalDocs } from "@/lib/legal";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy policy — MADOOZA",
  description: "What MADOOZA asks you for, why, where it is kept, and how to have it removed.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();
  return (
    <LegalDoc
      doc={legalDocs(settings).privacy}
      contactEmail={settings.contactEmail}
      contactPhone={settings.contactPhone}
    />
  );
}
