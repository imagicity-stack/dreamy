import path from "path";
import PDFDocument from "pdfkit";
import { qrPng } from "./tickets";
import { describeDate, type FestSettings } from "./festSettings";
import { HOST_NAME, ORGANIZER_NAME, ORGANIZER_ROLE } from "./legal";

/**
 * The pass as a file — the copy that survives a flat battery.
 *
 * One page per pass, because one page is one person at the gate, drawn as the
 * thing it is: a stub with a punched tear line, the fest's sticker shadow, and
 * the logo sitting on a band of the exact purple its own circle is filled with,
 * so the two meet without a seam.
 *
 * It is a pass and not a receipt: no prices, no tax lines. That is partly
 * design — nobody needs the GST split to get through a gate — and partly a
 * limit worth naming, because the fonts built into a PDF have no rupee sign.
 * The money stays in the email.
 *
 * A4, because the one thing somebody might do with this file is print it.
 */

const INK = "#150331";
const BG = "#26064a";
const TEAL = "#35c6d4";
const PINK = "#e8135f";
const PURPLE = "#4a1382";
const PAPER = "#f4eefb";
const MUTED = "#6b5292";
const LILAC = "#efe3fb";

const LOGO = path.join(process.cwd(), "public", "assets", "madooza-logo.png");

export type PdfTicket = {
  code: string;
  url: string;
  holderName: string;
  tierLabel: string;
  index: number;
  of: number;
  /** Which door this opens. A cosplay entry is a desk, not a turnstile. */
  product?: string;
};

export async function ticketsPdf(tickets: PdfTicket[], settings: FestSettings): Promise<Buffer> {
  const date = describeDate(settings);

  // Every QR is rendered before the document starts: pdfkit's stream runs
  // synchronously once it is going, and awaiting mid-page interleaves badly.
  const codes = await Promise.all(tickets.map((t) => qrPng(t.url)));

  const doc = new PDFDocument({
    size: "A4",
    margin: 0,
    info: { Title: "MADOOZA pass", Author: "MADOOZA" },
  });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  const W = 595.28;
  const H = 841.89;

  const cardX = 62;
  const cardW = W - cardX * 2;
  const cardH = 674;
  const top = Math.round((H - cardH) / 2) - 22;
  const radius = 24;
  const headerH = 122;
  /** Where the stub is torn off, and where the notches bite in. */
  const tearY = top + 514;

  tickets.forEach((ticket, i) => {
    if (i > 0) doc.addPage();

    // A cosplay entry is a desk in the arena, not a turnstile at the gate, and
    // the page has to say so everywhere rather than in one place.
    const arena = ticket.product === "cosplayEntry";

    doc.rect(0, 0, W, H).fill(PAPER);

    // The fest's sticker shadow: a hard offset block, no blur anywhere.
    doc.roundedRect(cardX + 9, top + 9, cardW, cardH, radius).fill(INK);
    doc.roundedRect(cardX, top, cardW, cardH, radius).fill("#ffffff");

    // ---- header band, clipped to the card's rounded corners ----
    doc.save();
    doc.roundedRect(cardX, top, cardW, cardH, radius).clip();
    doc.rect(cardX, top, cardW, headerH).fill(BG);

    // The logo's own circle is this exact purple, so it lands on the band
    // without an edge — the reason the band is painted first.
    doc.image(LOGO, cardX + 8, top - 2, { width: 122, height: 122 });

    doc
      .fillColor(TEAL)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(arena ? "ARENA ENTRY" : "ADMIT ONE", cardX, top + 44, {
        width: cardW - 26,
        align: "right",
        characterSpacing: 2.4,
      });
    doc
      .fillColor(LILAC)
      .font("Helvetica-Bold")
      .fontSize(17)
      .text(
        ticket.of > 1 ? `${ticket.index} OF ${ticket.of}` : arena ? "COSPLAY" : "FETE PASS",
        cardX,
        top + 60,
        { width: cardW - 26, align: "right", characterSpacing: 1 },
      );
    doc.restore();

    // ---- who it is for ----
    doc
      .fillColor(PINK)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(ticket.tierLabel.toUpperCase(), cardX + 28, top + headerH + 24, { characterSpacing: 2.6 });

    doc
      .fillColor(INK)
      .font("Helvetica-Bold")
      .fontSize(28)
      .text(ticket.holderName, cardX + 28, top + headerH + 42, { width: cardW - 56, lineGap: -2 });

    // ---- the QR, on its own plate ----
    const plateW = 244;
    const plateX = cardX + (cardW - plateW) / 2;
    const plateY = top + headerH + 86;
    doc.roundedRect(plateX, plateY, plateW, plateW, 16).fill("#ffffff");
    doc.lineWidth(2.5).strokeColor(INK).roundedRect(plateX, plateY, plateW, plateW, 16).stroke();
    doc.image(codes[i], plateX + 14, plateY + 14, { width: plateW - 28, height: plateW - 28 });

    doc
      .fillColor(INK)
      .font("Helvetica-Bold")
      .fontSize(24)
      .text(ticket.code, cardX, plateY + plateW + 16, {
        width: cardW,
        align: "center",
        characterSpacing: 3.5,
      });

    // ---- the tear ----
    doc
      .moveTo(cardX + 22, tearY)
      .lineTo(cardX + cardW - 22, tearY)
      .lineWidth(1.6)
      .dash(4, { space: 5 })
      .strokeColor("#c9b6e4")
      .stroke();
    doc.undash();

    // Notches punched out of both edges, paper showing through.
    doc.circle(cardX, tearY, 13).fill(PAPER);
    doc.circle(cardX + cardW, tearY, 13).fill(PAPER);

    // ---- the stub: where and when ----
    const colX = cardX + 28;
    const colW = (cardW - 56) / 2;

    const detail = (label: string, value: string, x: number, y: number, width: number) => {
      doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(8).text(label, x, y, { characterSpacing: 1.8 });
      doc.fillColor(INK).font("Helvetica").fontSize(11.5).text(value, x, y + 13, { width, lineGap: 1 });
    };

    detail(
      "WHEN",
      `${date.short}\n${arena ? "Report to the arena desk" : "Gates 9:00 AM"}`,
      colX,
      tearY + 30,
      colW - 12,
    );
    detail(
      "WHERE",
      `${HOST_NAME}\nHazaribagh, Jharkhand 825301`,
      colX + colW + 12,
      tearY + 30,
      colW - 12,
    );

    // A teal zigzag, the same mark the logo wears.
    const zigY = tearY + 96;
    const zigW = cardW - 56;
    doc.moveTo(colX, zigY);
    for (let x = 0; x < zigW; x += 16) {
      doc.lineTo(colX + x + 8, zigY - 6).lineTo(colX + x + 16, zigY);
    }
    doc.lineWidth(2).strokeColor(TEAL).stroke();

    doc
      .fillColor(PURPLE)
      .font("Helvetica")
      .fontSize(9.5)
      .text(
        arena
          ? "Show this at the cosplay arena desk. It is scanned once — the code above is the same entry. A Fete Pass is still needed to be on the grounds."
          : "Show this at the gate, on your phone or printed. It is scanned once — the code above is the same pass.",
        colX,
        zigY + 14,
        { width: cardW - 56, align: "center" },
      );

    // ---- who is behind it, off the card ----
    doc
      .fillColor(MUTED)
      .font("Helvetica")
      .fontSize(8.5)
      .text(
        `Hosted by ${HOST_NAME}  ·  ${ORGANIZER_ROLE}: ${ORGANIZER_NAME}\n${settings.contactEmail}  ·  ${settings.contactPhone}  ·  Refunds are handled in person at the school office.`,
        cardX,
        top + cardH + 26,
        { width: cardW, align: "center", lineGap: 3 },
      );
  });

  doc.end();
  return done;
}
