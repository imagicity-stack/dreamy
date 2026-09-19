import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSettings, saveSettings } from "@/lib/settings";
import { merchItems } from "@/data/fest";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const check = await requireAdmin(req);
  if ("response" in check) return check.response;

  return NextResponse.json({
    settings: await getSettings(),
    merch: merchItems.map((m) => ({ id: m.id, name: m.name, note: m.note })),
  });
}

export async function PUT(req: Request) {
  const check = await requireAdmin(req);
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
