import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { PRODUCTS, isProductKey, isQuoteError } from "@/lib/products";

export const dynamic = "force-dynamic";

/**
 * What a basket costs, priced on the server.
 *
 * The checkout panels call this rather than multiplying a price by a quantity
 * in the browser: every figure on screen — the subtotal, the convenience fee,
 * the GST, the total — is the same arithmetic that will be sent to Razorpay,
 * done in the same place. Creates nothing; safe to call on every keystroke.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const product = body?.product;

  if (!isProductKey(product)) {
    return NextResponse.json({ error: "Unknown product" }, { status: 400 });
  }

  const settings = await getSettings();
  const def = PRODUCTS[product];

  const closed = def.closed(settings);
  if (closed) return NextResponse.json({ error: closed, closed: true }, { status: 409 });

  const quote = await def.quote(body?.input, settings);
  if (isQuoteError(quote)) {
    return NextResponse.json({ error: quote.error }, { status: quote.status });
  }

  return NextResponse.json({
    product: quote.product,
    label: quote.label,
    description: quote.description,
    units: quote.units,
    lines: quote.lines,
    price: quote.price,
  });
}
