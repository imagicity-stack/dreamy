import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import {
  claimWebhookEvent,
  fulfilOrder,
  isFailure,
  markOrderFailed,
  markOrderRefunded,
  releaseWebhookEvent,
} from "@/lib/orders";

export const dynamic = "force-dynamic";
// The signature is computed over the exact bytes Razorpay sent, so this route
// must never run through anything that re-serialises the body.
export const runtime = "nodejs";

/**
 * Razorpay's own account of what happened, and the reason a closed laptop no
 * longer costs somebody their pass.
 *
 * Set it up in the Razorpay dashboard under Settings → Webhooks:
 *
 *   URL     https://<the site>/api/razorpay/webhook
 *   Secret  the same string as RAZORPAY_WEBHOOK_SECRET in the environment
 *   Events  payment.captured, payment.failed, order.paid,
 *           refund.created, refund.processed
 *
 * Everything here is idempotent. Razorpay retries a delivery for 24 hours until
 * it gets a 2xx, and it may send the same event more than once even after a
 * success, so each event id is claimed once and fulfilment is keyed on the
 * order. A retry costs a read and nothing else.
 *
 * Only a bad signature answers with an error: any other non-2xx would have
 * Razorpay redeliver an event we have already understood.
 */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, signature)) {
    // Either someone is guessing, or RAZORPAY_WEBHOOK_SECRET doesn't match the
    // dashboard. Both are worth a 400 and a look at the logs.
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Unreadable payload" }, { status: 400 });
  }

  const event = String(payload.event ?? "");
  const eventId = req.headers.get("x-razorpay-event-id") || `${event}:${payload.created_at ?? Date.now()}`;

  const claim = await claimWebhookEvent(eventId, event);
  if (claim === "duplicate") {
    return NextResponse.json({ ok: true, duplicate: true });
  }
  if (claim === "unavailable") {
    // We cannot tell whether this event is new, so we must not act on it and
    // must not accept it either. A 5xx has Razorpay redeliver, which is exactly
    // what a Firestore outage needs.
    return NextResponse.json({ error: "Not ready to record this yet" }, { status: 503 });
  }

  const payment = payload.payload?.payment?.entity;
  const refund = payload.payload?.refund?.entity;
  const order = payload.payload?.order?.entity;

  try {
    switch (event) {
      // Only a captured payment issues anything. An authorised-but-uncaptured
      // payment is money held, not money taken, so it is left alone until
      // capture arrives — Razorpay's auto-capture makes that the same second.
      case "payment.captured": {
        const orderId = String(payment?.order_id ?? "");
        const paymentId = String(payment?.id ?? "");
        if (!orderId || !paymentId) break;

        const result = await fulfilOrder({ orderId, paymentId, source: "webhook" });
        if (isFailure(result)) {
          // A refusal here is a real state — sold out, amount mismatch — and is
          // already recorded on the order. Redelivering it would not help.
          return NextResponse.json({ ok: true, event, handled: false, reason: result.error });
        }
        return NextResponse.json({ ok: true, event, handled: true, issued: result.firstTime });
      }

      case "order.paid": {
        const orderId = String(order?.id ?? payment?.order_id ?? "");
        const paymentId = String(payment?.id ?? "");
        if (!orderId || !paymentId) break;
        const result = await fulfilOrder({ orderId, paymentId, source: "webhook" });
        if (isFailure(result)) {
          return NextResponse.json({ ok: true, event, handled: false, reason: result.error });
        }
        return NextResponse.json({ ok: true, event, handled: true, issued: result.firstTime });
      }

      case "payment.failed": {
        const orderId = String(payment?.order_id ?? "");
        if (!orderId) break;
        const reason =
          String(payment?.error_description ?? "") || String(payment?.error_reason ?? "") || "Payment failed";
        await markOrderFailed(orderId, reason, String(payment?.id ?? ""));
        return NextResponse.json({ ok: true, event, handled: true });
      }

      case "refund.created":
      case "refund.processed": {
        const orderId = String(refund?.order_id ?? payment?.order_id ?? "");
        if (!orderId) break;
        await markOrderRefunded({
          orderId,
          refundId: String(refund?.id ?? ""),
          amountPaise: Number(refund?.amount ?? 0),
        });
        return NextResponse.json({ ok: true, event, handled: true });
      }
    }
  } catch (e) {
    // Something of ours broke — Firestore, the Razorpay fetch. Give the event
    // id back before asking for the redelivery, or the retry would arrive to
    // find its own claim sitting there and be dismissed as a duplicate.
    console.error("razorpay webhook", event, e);
    await releaseWebhookEvent(eventId);
    return NextResponse.json({ error: "Could not process the event" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, event, handled: false });
}

type Entity = Record<string, unknown>;

type WebhookPayload = {
  event?: string;
  created_at?: number;
  payload?: {
    payment?: { entity?: Entity };
    order?: { entity?: Entity };
    refund?: { entity?: Entity };
  };
};
