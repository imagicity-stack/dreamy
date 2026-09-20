import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { copyGroup, rawCopy, saveCopy } from "@/lib/copy";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ group: string }> }) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const { group } = await params;
  const def = copyGroup(group);
  if (!def) return NextResponse.json({ error: "Unknown page" }, { status: 404 });

  return NextResponse.json({ def, words: await rawCopy(group) });
}

export async function PUT(req: Request, { params }: { params: Promise<{ group: string }> }) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const { group } = await params;
  if (!copyGroup(group)) return NextResponse.json({ error: "Unknown page" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const saved = await saveCopy(group, (body as { words?: unknown }).words);
  if (!saved) return NextResponse.json({ error: "Firestore is not configured" }, { status: 503 });

  return NextResponse.json({ words: saved });
}
