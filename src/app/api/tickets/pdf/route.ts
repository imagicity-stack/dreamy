import { NextRequest, NextResponse } from "next/server";
import { findTicket, ticketUrl } from "@/lib/tickets";
import { ticketsPdf, type PdfTicket } from "@/lib/ticketPdf";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * The passes as a file.
 *
 * The tokens are the authorisation: holding one is what it means to hold that
 * pass, exactly as on the ticket page. Nothing else is accepted — an order id
 * would let anybody who guessed one print somebody else's passes.
 *
 * Takes JSON from the confirmation page, or a plain form post, so the ticket
 * page's download button works with no JavaScript at all.
 */
export async function POST(req: NextRequest) {
  const tokens = await readTokens(req);
  if (!tokens.length) {
    return NextResponse.json({ error: "No pass named" }, { status: 400 });
  }

  const settings = await getSettings();
  const found: PdfTicket[] = [];

  for (const token of tokens.slice(0, 20)) {
    const ticket = await findTicket(token);
    // A voided pass still prints: its holder is owed an explanation from the
    // office, not a silently missing file.
    if (!ticket) continue;
    found.push({
      code: ticket.code,
      url: ticketUrl(token),
      holderName: ticket.holderName,
      tierLabel: ticket.tierLabel,
      index: ticket.index,
      of: ticket.of,
      product: ticket.product,
    });
  }

  if (!found.length) {
    return NextResponse.json({ error: "Those passes are not ours" }, { status: 404 });
  }

  found.sort((a, b) => a.index - b.index);

  const pdf = await ticketsPdf(found, settings);
  const name = found.length === 1 ? `${found[0].code}.pdf` : "madooza-passes.pdf";

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

async function readTokens(req: NextRequest): Promise<string[]> {
  const type = req.headers.get("content-type") ?? "";

  if (type.includes("application/json")) {
    const body = await req.json().catch(() => null);
    const list = Array.isArray(body?.tokens) ? body.tokens : [body?.token];
    return list.filter((t: unknown): t is string => typeof t === "string" && t.length > 0);
  }

  const form = await req.formData().catch(() => null);
  if (!form) return [];
  return form
    .getAll("token")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}
