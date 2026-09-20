import { NextResponse } from "next/server";
import { SESSION_MAX_AGE_MS, sessionCookieOptions, signInAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** Signs an admin in and hands back an HttpOnly session cookie. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Enter an email and a password" }, { status: 400 });
  }

  const result = await signInAdmin(email, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const res = NextResponse.json({ email: result.user.email });
  res.cookies.set({
    ...sessionCookieOptions(SESSION_MAX_AGE_MS / 1000),
    value: result.cookie,
  });
  return res;
}
