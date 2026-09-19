import { NextRequest, NextResponse } from "next/server";
import { getRazorpay, verifyRazorpaySignature } from "@/lib/razorpay";
import { getDb } from "@/lib/firebaseAdmin";
import { formatInr } from "@/data/fest";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { orderId, paymentId, signature, buyer } = body ?? {};

  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string" ||
    !buyer?.name ||
    !buyer?.phone
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ok = verifyRazorpaySignature({ orderId, paymentId, signature });
  if (!ok) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    return NextResponse.json({ error: "Payments are not configured yet" }, { status: 503 });
  }

  // Quantity and total are read back off the Razorpay order, so what we record
  // is what was actually charged rather than whatever the browser claims.
  const order = await razorpay.orders.fetch(orderId);
  const total = Number(order.amount) / 100;
  const qty = Number(order.notes?.qty ?? 1);

  if (!Number.isFinite(total) || !Number.isInteger(qty) || qty < 1) {
    return NextResponse.json({ error: "Could not read the order" }, { status: 400 });
  }

  const passCode = "MDZ-F-" + String(Math.floor(1000 + Math.random() * 8999));

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
