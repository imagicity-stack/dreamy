import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSettings, saveSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  return NextResponse.json({ settings: await getSettings() });
}

export async function PUT(req: Request) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const saved = await saveSettings(body);
  if (!saved) {
    return NextResponse.json({ error: "Firestore is not configured" }, { status: 503 });
  }

  return NextResponse.json({ settings: saved, savedBy: check.user.email });
}
