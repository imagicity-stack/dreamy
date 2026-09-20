import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { publicContent } from "@/lib/content";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const cart = body?.cart as Record<string, number> | undefined;

  if (!cart || typeof cart !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Prices come from the merch records on the server; the cart only names items.
  const catalogue = await publicContent("merch");

  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ item: catalogue.find((m) => m.id === id), qty: Number(qty) }))
    .filter((l): l is { item: (typeof catalogue)[number]; qty: number } => !!l.item && l.qty > 0);

  if (lines.length === 0) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  const total = lines.reduce((sum, l) => sum + Number(l.item.price ?? 0) * l.qty, 0);

  const db = getDb();
  if (db) {
    await db.collection("merchOrders").add({
      lines: lines.map((l) => ({
        id: l.item.id,
        name: String(l.item.name ?? ""),
        price: Number(l.item.price ?? 0),
        qty: l.qty,
      })),
      total,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  return NextResponse.json({ ok: true, total, persisted: !!db });
}
