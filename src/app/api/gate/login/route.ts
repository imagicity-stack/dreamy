import { NextRequest, NextResponse } from "next/server";
import { GATE_COOKIE, openGateSession } from "@/lib/gateAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const pin = String(body?.pin ?? "");
  const volunteer = String(body?.volunteer ?? "");

  const session = await openGateSession(pin, volunteer);
  if ("error" in session) {
    return NextResponse.json({ error: session.error }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, volunteer: volunteer.trim() || "Gate" });
  res.cookies.set(GATE_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  return res;
}
