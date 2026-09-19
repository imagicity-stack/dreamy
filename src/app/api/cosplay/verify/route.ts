import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { orderId, paymentId, signature, entry } = body ?? {};

  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string" ||
    !entry?.name ||
    !entry?.character ||
    !entry?.phone
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ok = verifyRazorpaySignature({ orderId, paymentId, signature });
  if (!ok) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const db = getDb();
  if (db) {
    await db.collection("cosplayEntries").add({
      name: String(entry.name).trim(),
      school: String(entry.school ?? "").trim(),
      phone: String(entry.phone).trim(),
      character: String(entry.character).trim(),
      category: String(entry.category ?? "Anime"),
      mode: entry.mode === "team" ? "team" : "solo",
      team: String(entry.team ?? "").trim(),
      members: String(entry.members ?? "").trim(),
      fee: 400,
      razorpay: { orderId, paymentId },
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  return NextResponse.json({ ok: true, persisted: !!db });
}
