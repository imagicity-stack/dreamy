import { NextRequest, NextResponse } from "next/server";
import { readGateSession } from "@/lib/gateAuth";
import { searchTickets } from "@/lib/tickets";

export const dynamic = "force-dynamic";

/** The dead-phone fallback: find somebody by name, phone or pass code. */
export async function GET(req: NextRequest) {
  const session = await readGateSession();
  if (!session) return NextResponse.json({ error: "Sign in again" }, { status: 401 });

  const q = new URL(req.url).searchParams.get("q") ?? "";
  return NextResponse.json({ tickets: await searchTickets(q) });
}
