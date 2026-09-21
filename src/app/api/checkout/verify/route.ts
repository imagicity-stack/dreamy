import { NextRequest, NextResponse } from "next/server";
import { fulfilOrder, isFailure } from "@/lib/orders";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

/**
 * The browser reporting back from Razorpay's checkout.
 *
 * The signature proves the response came from Razorpay rather than a console;
 * fulfilOrder() then re-checks the payment against Razorpay's own record
 * before anything is issued. The webhook runs the same fulfilment, so whichever
 * of the two arrives first does the work and the other reads it back.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { orderId, paymentId, signature } = body ?? {};

  if (typeof orderId !== "string" || typeof paymentId !== "string" || typeof signature !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!verifyRazorpaySignature({ orderId, paymentId, signature })) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  try {
    const receipt = await fulfilOrder({ orderId, paymentId, source: "checkout" });
    if (isFailure(receipt)) {
      return NextResponse.json({ error: receipt.error }, { status: receipt.status });
    }
    return NextResponse.json({ receipt });
  } catch (e) {
    // The payment itself is fine — it is Razorpay's record either way — so this
    // is only about the browser's copy of the receipt. An empty error body is
    // the page's cue to say "paid, being issued" rather than "payment failed",
    // and the webhook finishes the order regardless.
    console.error("checkout verify", orderId, e);
    return NextResponse.json({}, { status: 503 });
  }
}
