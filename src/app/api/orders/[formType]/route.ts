import { NextRequest, NextResponse } from "next/server";
import { calculateTotalAmount, normalizeQuantity, UNIT_PRICES } from "@/lib/payment-utils";
import type { PaymentFormType } from "@/lib/payment-records-shared";

const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID ??
  process.env.RZP_LIVE_KEY_ID ??
  process.env.NEXT_PUBLIC_RZP_LIVE_KEY_ID ??
  "";
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET ?? "";

const isPaymentFormType = (value: string): value is PaymentFormType =>
  Object.prototype.hasOwnProperty.call(UNIT_PRICES, value);

const extractQuantity = (payload: Record<string, unknown>): number => {
  const formData = (payload.formData ?? {}) as Record<string, unknown>;
  const rawQuantity =
    payload.quantity ??
    formData.quantity ??
    formData.ticketCount ??
    formData.participantCount;

  return normalizeQuantity(rawQuantity);
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formType: string }> },
) {
  const { formType } = await params;

  if (!isPaymentFormType(formType)) {
    return NextResponse.json(
      { message: "Invalid payment type." },
      { status: 400 },
    );
  }

  if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
    return NextResponse.json(
      { message: "Razorpay credentials are not configured." },
      { status: 500 },
    );
  }

  let payload: Record<string, unknown> = {};

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const quantity = extractQuantity(payload);
  const amount = calculateTotalAmount(formType, quantity);
  const currency = "INR";

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET}`,
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: `receipt_${formType}_${Date.now()}`,
        notes: {
          formType,
          quantity: quantity.toString(),
        },
      }),
    });

    const data = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            (typeof data?.error === "object" &&
              data.error &&
              typeof (data.error as { description?: string }).description ===
                "string" &&
              (data.error as { description?: string }).description) ||
            "Failed to create Razorpay order.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      orderId: data.id,
      razorpayKeyId: RAZORPAY_KEY_ID,
      amount: data.amount ?? amount,
      currency: data.currency ?? currency,
    });
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    return NextResponse.json(
      { message: "Unable to create payment order." },
      { status: 500 },
    );
  }
}
