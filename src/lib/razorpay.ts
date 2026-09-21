import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "crypto";

export function getRazorpay(): Razorpay | null {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;
  const expected = createHmac("sha256", keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(params.signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Checks a webhook delivery against the secret set in the Razorpay dashboard.
 *
 * The body must be the exact bytes Razorpay sent — re-serialising the parsed
 * JSON changes the signature and every event starts failing — so callers pass
 * the raw text, not an object.
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  // timingSafeEqual throws on a length mismatch, which is itself an answer.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** True once the webhook secret is set, so the panel can say when it isn't. */
export function webhookConfigured(): boolean {
  return !!process.env.RAZORPAY_WEBHOOK_SECRET;
}
