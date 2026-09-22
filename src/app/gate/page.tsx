import type { Metadata } from "next";
import { gatePinIsSet, readGateSession } from "@/lib/gateAuth";
import GateClient from "./GateClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MADOOZA gate",
  robots: { index: false, follow: false },
};

/**
 * The gate. Not linked from anywhere on the site: volunteers are given the
 * address and the PIN on the morning.
 */
export default async function GatePage() {
  const [session, pinIsSet] = await Promise.all([readGateSession(), gatePinIsSet()]);
  return <GateClient signedInAs={session?.volunteer ?? null} pinIsSet={pinIsSet} />;
}
