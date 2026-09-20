import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb } from "@/lib/firebaseAdmin";
import { collectionDef, createRecord, listContent, isSeeded, seedCollection } from "@/lib/content";

export const dynamic = "force-dynamic";

async function resolve(params: Promise<{ collection: string }>) {
  const { collection } = await params;
  return { collection, def: collectionDef(collection) };
}

export async function GET(_req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const { collection, def } = await resolve(params);
  if (!def) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  return NextResponse.json({
    def,
    records: await listContent(collection),
    saved: await isSeeded(collection),
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const { collection, def } = await resolve(params);
  if (!def) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  if (!getDb()) return NextResponse.json({ error: "Firestore is not configured" }, { status: 503 });

  const body = await req.json().catch(() => null);

  // Copying the starting values in is what makes them editable; it is refused
  // once anything has been saved, so it can never wipe real edits.
  if (body?.action === "seed") {
    const written = await seedCollection(collection);
    if (written === 0) {
      return NextResponse.json({ error: "This list already has saved records" }, { status: 409 });
    }
    return NextResponse.json({ written, records: await listContent(collection) });
  }

  const record = await createRecord(collection, body?.record ?? {});
  if (!record) return NextResponse.json({ error: "Could not create that" }, { status: 500 });
  return NextResponse.json({ record });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const { collection, def } = await resolve(params);
  if (!def) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Firestore is not configured" }, { status: 503 });

  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.order) ? (body.order as unknown[]).map(String) : null;
  if (!ids) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const batch = db.batch();
  ids.forEach((id, order) => batch.set(db.collection(`content_${collection}`).doc(id), { order }, { merge: true }));
  await batch.commit();

  return NextResponse.json({ ok: true });
}
