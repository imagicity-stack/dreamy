import { NextRequest, NextResponse } from "next/server";
import { createOrder, isFailure } from "@/lib/orders";
import { isProductKey, readCustomer } from "@/lib/products";

export const dynamic = "force-dynamic";

/**
 * Opens a checkout: prices the basket, creates the Razorpay order, and writes
 * our own order record with the buyer's details already on it — so the webhook
 * can finish the job even if this browser never comes back.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const product = body?.product;

  if (!isProductKey(product)) {
    return NextResponse.json({ error: "Unknown product" }, { status: 400 });
  }

  // The names are counted against the quantity, so the quantity is read first.
  const units = Number((body?.input as { qty?: unknown } | undefined)?.qty ?? 1);
  const read = readCustomer(product, body?.customer, Number.isFinite(units) ? units : 1);
  if ("error" in read) {
    return NextResponse.json({ error: read.error }, { status: 400 });
  }

  let created;
  try {
    created = await createOrder({ product, input: body?.input, customer: read.customer });
  } catch (e) {
    // Razorpay or Firestore refused. Nothing has been charged — the browser
    // never gets an order id to open checkout with — so say so plainly rather
    // than letting a stack trace become the error message.
    console.error("checkout order", product, e);
    return NextResponse.json({ error: "Could not start checkout — try again in a moment." }, { status: 502 });
  }

  if (isFailure(created)) {
    return NextResponse.json({ error: created.error }, { status: created.status });
  }

  return NextResponse.json({
    orderId: created.orderId,
    amount: created.amountPaise,
    currency: created.currency,
    keyId: created.keyId,
    description: created.quote.description,
    price: created.quote.price,
    lines: created.quote.lines,
    units: created.quote.units,
  });
}
