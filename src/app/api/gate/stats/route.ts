import { NextResponse } from "next/server";
import { readGateSession } from "@/lib/gateAuth";
import { gateCounts } from "@/lib/tickets";

export const dynamic = "force-dynamic";

/** The running tally on the gate screen: in, issued, still to come. */
export async function GET() {
  const session = await readGateSession();
  if (!session) return NextResponse.json({ error: "Sign in again" }, { status: 401 });

  const counts = await gateCounts();
  return NextResponse.json({ ...counts, volunteer: session.volunteer });
}
