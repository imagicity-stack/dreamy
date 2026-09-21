import { after, NextRequest, NextResponse } from "next/server";
import { fulfilOrder, isFailure } from "@/lib/orders";
import { notifyOrderPaid, notifyOversold } from "@/lib/notify";
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
      // Money taken with nothing to give is the one failure a person has to
      // hear about, not just a ledger row.
      if (receipt.code === "oversold") {
        after(() => notifyOversold({ orderId, paymentId, product: "pass" }));
      }
      return NextResponse.json({ error: receipt.error }, { status: receipt.status });
    }

    // The receipt goes out after the response: a slow mail server must not keep
    // somebody staring at a spinner having already paid. Only the call that did
    // the issuing sends it, so the webhook arriving second doesn't send a second.
    if (receipt.firstTime) after(() => notifyOrderPaid(receipt));

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
