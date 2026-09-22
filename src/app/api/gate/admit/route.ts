import { NextRequest, NextResponse } from "next/server";
import { readGateSession } from "@/lib/gateAuth";
import { admitById } from "@/lib/tickets";

export const dynamic = "force-dynamic";

/** Admitting somebody the volunteer found by name rather than by QR. */
export async function POST(req: NextRequest) {
  const session = await readGateSession();
  if (!session) return NextResponse.json({ error: "Sign in again" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "").trim();
  if (!id) return NextResponse.json({ error: "No ticket named" }, { status: 400 });

  return NextResponse.json(await admitById(id, session.volunteer));
}
