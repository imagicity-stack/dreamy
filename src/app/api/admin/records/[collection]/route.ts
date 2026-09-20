import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

/** Only these collections can be read through the panel. */
const READABLE = ["passes", "cosplayEntries", "concertInterest", "merchOrders"] as const;
type Readable = (typeof READABLE)[number];

function isReadable(name: string): name is Readable {
  return (READABLE as readonly string[]).includes(name);
}

/** Firestore values aren't all JSON — turn timestamps into ISO strings. */
function serialize(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serialize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serialize(v)]));
  }
  return value;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const { collection } = await params;
  if (!isReadable(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Firestore is not configured" }, { status: 503 });
  }

  const limitParam = Number(new URL(req.url).searchParams.get("limit"));
  const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 500) : 100;

  const snap = await db.collection(collection).orderBy("createdAt", "desc").limit(limit).get();
  const rows = snap.docs.map((doc) => ({ id: doc.id, ...(serialize(doc.data()) as object) }));

  return NextResponse.json({ collection, count: rows.length, rows });
}
