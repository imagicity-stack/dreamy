import { NextResponse } from "next/server";
import crypto from "crypto";
import { calculateTotalAmount, normalizeQuantity, UNIT_PRICES } from "@/lib/payment-utils";
import { recordPaymentServer } from "@/lib/payment-records-server";
import type { PaymentFormType } from "@/lib/payment-records-shared";

const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET ?? "";

const isPaymentFormType = (value: string): value is PaymentFormType =>
  Object.prototype.hasOwnProperty.call(UNIT_PRICES, value);

const extractQuantity = (formData: Record<string, unknown>): number => {
  const rawQuantity =
    formData.quantity ??
    formData.ticketCount ??
    formData.participantCount;

  return normalizeQuantity(rawQuantity);
};

const isValidSignature = (
  orderId: string,
  paymentId: string,
  signature: string,
): boolean => {
  if (!RAZORPAY_SECRET) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "utf8");
  const generatedBuffer = Buffer.from(generatedSignature, "utf8");

  if (signatureBuffer.length !== generatedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, generatedBuffer);
};

export async function POST(request: Request) {
  let payload: Record<string, unknown> = {};

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const paymentId =
    typeof payload.razorpay_payment_id === "string"
      ? payload.razorpay_payment_id
      : "";
  const orderId =
    typeof payload.razorpay_order_id === "string" ? payload.razorpay_order_id : "";
  const signature =
    typeof payload.razorpay_signature === "string" ? payload.razorpay_signature : "";
  const formData =
    (payload.formData as Record<string, unknown> | undefined) ?? {};
  const formTypeValue =
    typeof formData.formType === "string" ? formData.formType : "";

  if (!paymentId || !orderId || !signature || !formTypeValue) {
    return NextResponse.json(
      { message: "Missing payment verification details." },
      { status: 400 },
    );
  }

  if (!isPaymentFormType(formTypeValue)) {
    return NextResponse.json(
      { message: "Invalid payment type." },
      { status: 400 },
    );
  }

  if (!RAZORPAY_SECRET) {
    return NextResponse.json(
      { message: "Razorpay secret is not configured." },
      { status: 500 },
    );
  }

  if (!isValidSignature(orderId, paymentId, signature)) {
    return NextResponse.json(
      { message: "Invalid Razorpay signature." },
      { status: 400 },
    );
  }

  const quantity = extractQuantity(formData);
  const amount = calculateTotalAmount(formTypeValue, quantity);
  const currency = "INR";

  try {
    await recordPaymentServer({
      formType: formTypeValue,
      paymentId,
      orderId,
      signature,
      amount,
      currency,
      details: formData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to record payment:", error);
    return NextResponse.json(
      { message: "Unable to record payment." },
      { status: 500 },
    );
  }
}
