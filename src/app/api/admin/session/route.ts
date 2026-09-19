import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** Confirms the signed-in account is an admin, so the panel can open. */
export async function GET(req: Request) {
  const check = await requireAdmin(req);
  if ("response" in check) return check.response;
  return NextResponse.json({ email: check.user.email, uid: check.user.uid });
}
