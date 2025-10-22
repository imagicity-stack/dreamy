import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PAYMENT_API_BASE_URL = "https://madooza-back-production.up.railway.app";
const PAYMENT_API_BASE_URL = process.env.PAYMENT_API_BASE_URL ?? DEFAULT_PAYMENT_API_BASE_URL;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { formType?: string } }
): Promise<NextResponse> {
  const formType = params.formType?.trim();

  if (!formType) {
    return NextResponse.json(
      { message: "Missing form type." },
      { status: 400 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 }
    );
  }

  try {
    const upstreamResponse = await fetch(`${PAYMENT_API_BASE_URL}/api/orders/${formType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const rawBody = await upstreamResponse.text();
    let parsedBody: unknown = null;

    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = rawBody;
      }
    }

    if (!upstreamResponse.ok) {
      const message =
        (isRecord(parsedBody) && typeof parsedBody.message === "string" && parsedBody.message.trim().length > 0
          ? parsedBody.message
          : "Failed to create payment order. Please try again.");

      const errorBody = isRecord(parsedBody)
        ? { ...parsedBody, message }
        : { message };

      return NextResponse.json(errorBody, { status: upstreamResponse.status });
    }

    if (parsedBody === null) {
      return NextResponse.json({}, { status: 200 });
    }

    if (typeof parsedBody === "string") {
      return NextResponse.json({ message: parsedBody }, { status: 200 });
    }

    if (isRecord(parsedBody)) {
      return NextResponse.json(parsedBody, { status: 200 });
    }

    return NextResponse.json({ data: parsedBody }, { status: 200 });
  } catch (error) {
    console.error("Payment order proxy failed:", error);
    return NextResponse.json(
      { message: "Unable to reach payment service. Please try again in a moment." },
      { status: 502 }
    );
  }
}
