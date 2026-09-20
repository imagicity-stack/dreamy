import { NextResponse } from "next/server";
import { sessionCookieOptions } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** Drops the session cookie. Signing out never needs to be authorized. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...sessionCookieOptions(0), value: "" });
  return res;
}
