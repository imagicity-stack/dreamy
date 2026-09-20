import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** Confirms the session cookie still belongs to an admin. */
export async function GET() {
  const check = await requireAdmin();
  if ("response" in check) return check.response;
  return NextResponse.json({ email: check.user.email, uid: check.user.uid });
}
