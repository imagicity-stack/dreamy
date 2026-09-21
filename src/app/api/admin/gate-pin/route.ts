import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { gatePinIsSet, setGatePin } from "@/lib/gateAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const check = await requireAdmin();
  if ("response" in check) return check.response;
  return NextResponse.json({ set: await gatePinIsSet() });
}

/** Sets the gate PIN. Every phone using the old one is signed out by this. */
export async function PUT(req: NextRequest) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const body = await req.json().catch(() => null);
  const result = await setGatePin(String(body?.pin ?? ""));
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ ok: true });
}
