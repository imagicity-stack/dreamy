import { NextRequest, NextResponse } from "next/server";
import { GATE_COOKIE, signInGate } from "@/lib/gateAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "");
  const pin = String(body?.pin ?? "");

  if (!email.trim() || !pin.trim()) {
    return NextResponse.json({ error: "Enter your email and your PIN." }, { status: 400 });
  }

  const result = await signInGate(email, pin);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const res = NextResponse.json({ ok: true, session: result.session });
  res.cookies.set(GATE_COOKIE, result.cookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: result.maxAge,
  });
  return res;
}
