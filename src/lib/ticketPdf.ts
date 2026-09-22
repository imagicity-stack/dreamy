import PDFDocument from "pdfkit";
import { qrPng } from "./tickets";
import { describeDate, type FestSettings } from "./festSettings";
import { HOST_NAME, ORGANIZER_NAME, ORGANIZER_ROLE } from "./legal";

/**
 * The pass as a file — the copy that survives a flat battery.
 *
 * One page per pass, because one page is one person at the gate. It is a pass
 * and not a receipt: no prices, no tax lines. That is partly design (nobody
 * needs the GST split to get through a gate) and partly a limit worth naming —
 * the fonts built into a PDF have no rupee sign, and an invoice that cannot
 * print ₹ would be worse than no invoice. The email carries the money.
 *
 * A4 rather than anything cleverer, because the one thing somebody might do
 * with this file is print it.
 */

const INK = "#150331";
const TEAL = "#35c6d4";
const PURPLE = "#4a1382";
const PAPER = "#f7f2fb";
const MUTED = "#6b5292";

export type PdfTicket = {
  code: string;
  url: string;
  holderName: string;
  tierLabel: string;
  index: number;
  of: number;
};

export async function ticketsPdf(tickets: PdfTicket[], settings: FestSettings): Promise<Buffer> {
  const date = describeDate(settings);

  // Render every QR before starting the document: pdfkit's stream is
  // synchronous once it is going, and awaiting mid-page interleaves badly.
  const codes = await Promise.all(tickets.map((t) => qrPng(t.url)));

  const doc = new PDFDocument({ size: "A4", margin: 0, info: { Title: "MADOOZA pass" } });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  const W = 595.28;
  const H = 841.89;
  const cardX = 57;
  const cardW = W - cardX * 2;
  const cardH = 576;
  /** Centres the card on the page, so a printed pass isn't all top. */
  const top = Math.round((H - cardH - 70) / 2);

  tickets.forEach((ticket, i) => {
    if (i > 0) doc.addPage();

    doc.rect(0, 0, W, 841.89).fill(PAPER);

    // Header band
    doc.rect(cardX, top, cardW, 56).fill(TEAL);
    doc.fillColor(INK).font("Helvetica-Bold").fontSize(23).text("MADOOZA", cardX + 20, top + 18);
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        ticket.of > 1 ? `ADMIT ONE  ·  ${ticket.index} OF ${ticket.of}` : "ADMIT ONE",
        cardX,
        top + 23,
        { width: cardW - 20, align: "right", characterSpacing: 1.6 },
      );

    // The card
    doc.rect(cardX, top + 56, cardW, cardH - 56).fill("#ffffff");
    doc.lineWidth(3).strokeColor(INK).rect(cardX, top, cardW, cardH).stroke();

    doc
      .fillColor(MUTED)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(ticket.tierLabel.toUpperCase(), cardX + 20, top + 80, { characterSpacing: 2 });

    doc.fillColor(INK).font("Helvetica-Bold").fontSize(26).text(ticket.holderName, cardX + 20, top + 98, {
      width: cardW - 40,
      lineGap: 0,
    });

    // QR, centred and large: this is the only part that has to work.
    const qrSize = 250;
    const qrX = cardX + (cardW - qrSize) / 2;
    doc.image(codes[i], qrX, top + 154, { width: qrSize, height: qrSize });

    doc
      .fillColor(INK)
      .font("Helvetica-Bold")
      .fontSize(25)
      .text(ticket.code, cardX, top + 424, { width: cardW, align: "center", characterSpacing: 3 });

    // Tear line, then the details below it
    doc.moveTo(cardX + 16, top + 462).lineTo(cardX + cardW - 16, top + 462).lineWidth(1.5).dash(5, { space: 4 }).strokeColor(INK).stroke();
    doc.undash();

    const detail = (label: string, value: string, y: number) => {
      doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(8).text(label, cardX + 20, y, { characterSpacing: 1.6 });
      doc.fillColor(INK).font("Helvetica").fontSize(12).text(value, cardX + 20, y + 12, { width: cardW - 40 });
    };

    detail("WHEN", `${date.short}  ·  Gates 9:00 AM`, top + 480);
    detail("WHERE", `${HOST_NAME}, Hazaribagh, Jharkhand 825301`, top + 520);

    doc
      .fillColor(PURPLE)
      .font("Helvetica")
      .fontSize(9)
      .text(
        "Show this at the gate — on your phone or printed. It is scanned once; the code above is the same pass.",
        cardX + 20,
        top + 558,
        { width: cardW - 40 },
      );

    // Footer, off the card
    doc
      .fillColor(MUTED)
      .font("Helvetica")
      .fontSize(8.5)
      .text(
        `Hosted by ${HOST_NAME}  ·  ${ORGANIZER_ROLE}: ${ORGANIZER_NAME}\n${settings.contactEmail}  ·  ${settings.contactPhone}  ·  Refunds are handled in person at the school office.`,
        cardX,
        top + cardH + 22,
        { width: cardW, align: "center", lineGap: 3 },
      );
  });

  doc.end();
  return done;
}
