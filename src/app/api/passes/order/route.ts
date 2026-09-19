import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { FEST } from "@/data/fest";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const qty = Number(body?.qty);

  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }
  if (FEST.soldOut) {
    return NextResponse.json({ error: "Sold out" }, { status: 409 });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    return NextResponse.json({ error: "Payments are not configured yet" }, { status: 503 });
  }

  const amount = qty * FEST.fetePrice * 100;
  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `fete_${Date.now()}`,
    notes: { tier: "fete", qty: String(qty) },
  });

  return NextResponse.json({
    orderId: order.id,
    amount,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
