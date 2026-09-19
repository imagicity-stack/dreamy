import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { FEST } from "@/data/fest";

export async function POST() {
  const razorpay = getRazorpay();
  if (!razorpay) {
    return NextResponse.json({ error: "Payments are not configured yet" }, { status: 503 });
  }

  const amount = FEST.cosplayFee * 100;
  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `cosplay_${Date.now()}`,
    notes: { type: "cosplay-entry" },
  });

  return NextResponse.json({
    orderId: order.id,
    amount,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
