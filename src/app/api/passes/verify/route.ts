import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getDb } from "@/lib/firebaseAdmin";
import { FEST, formatInr } from "@/data/fest";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { orderId, paymentId, signature, qty, buyer } = body ?? {};

  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string" ||
    !Number.isInteger(qty) ||
    !buyer?.name ||
    !buyer?.phone
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ok = verifyRazorpaySignature({ orderId, paymentId, signature });
  if (!ok) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const passCode = "MDZ-F-" + String(Math.floor(1000 + Math.random() * 8999));
  const total = qty * FEST.fetePrice;

  const db = getDb();
  if (db) {
    await db.collection("passes").add({
      passCode,
      tier: "fete",
      qty,
      total,
      buyer: {
        name: String(buyer.name).trim(),
        school: String(buyer.school ?? "").trim(),
        phone: String(buyer.phone).trim(),
      },
      razorpay: { orderId, paymentId },
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  return NextResponse.json({
    passCode,
    tierLabel: "FETE PASS",
    qty,
    totalLabel: formatInr(total),
    persisted: !!db,
  });
}
