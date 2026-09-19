import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const qty = Number(body?.qty);

  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const settings = await getSettings();
  if (settings.soldOut) {
    return NextResponse.json({ error: "Sold out" }, { status: 409 });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    return NextResponse.json({ error: "Payments are not configured yet" }, { status: 503 });
  }

  // The price always comes from the server's settings, never from the request.
  const amount = qty * settings.fetePrice * 100;
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
