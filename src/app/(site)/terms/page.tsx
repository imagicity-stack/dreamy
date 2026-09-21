import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { legalDocs } from "@/lib/legal";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & conditions — MADOOZA",
  description: "The rules of the MADOOZA site, the pass, the cosplay arena and the grounds.",
};

export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <LegalDoc
      doc={legalDocs(settings).terms}
      contactEmail={settings.contactEmail}
      contactPhone={settings.contactPhone}
    />
  );
}
