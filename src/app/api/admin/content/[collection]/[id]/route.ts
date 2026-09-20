import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb } from "@/lib/firebaseAdmin";
import { collectionDef, deleteRecord, updateRecord } from "@/lib/content";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ collection: string; id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const { collection, id } = await params;
  if (!collectionDef(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  if (!getDb()) return NextResponse.json({ error: "Firestore is not configured" }, { status: 503 });

  const body = await req.json().catch(() => null);
  const record = await updateRecord(collection, id, body?.record ?? {});
  if (!record) return NextResponse.json({ error: "Could not save that" }, { status: 500 });
  return NextResponse.json({ record });
}

export async function DELETE(_req: Request, { params }: Params) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const { collection, id } = await params;
  if (!collectionDef(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  if (!getDb()) return NextResponse.json({ error: "Firestore is not configured" }, { status: 503 });

  await deleteRecord(collection, id);
  return NextResponse.json({ ok: true });
}
