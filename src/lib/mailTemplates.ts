import { breakdownLines, formatPaise, type PriceBreakdown } from "./pricing";
import { HOST_NAME, ORGANIZER_NAME, ORGANIZER_ROLE } from "./legal";
import type { FestSettings } from "./festSettings";
import { describeDate } from "./festSettings";

/**
 * Every mail the fest sends, drawn in MADOOZA's colours.
 *
 * Email is not the web: no stylesheets, no flexbox, no custom fonts, and
 * Outlook throws away half of what is left. So this is tables and inline
 * styles, one 600px column, with the display typeface swapped for heavy
 * letter-spaced Helvetica — close enough in spirit, readable everywhere.
 *
 * Money rows are built from breakdownLines(), the same function the checkout
 * panel prints, so a receipt can never disagree with the screen the buyer saw.
 */

const INK = "#150331";
const BG = "#26084a";
const PURPLE = "#4a1382";
const TEAL = "#35c6d4";
const PAPER = "#f7f2fb";
const LILAC = "#efe3fb";
const MUTED = "#b79bd8";

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export type DetailRow = { label: string; value: string };

/** One scannable ticket inside an email: the QR, the code and who it is for. */
export type TicketBlock = {
  /** Matches the cid of the attached PNG. */
  cid: string;
  code: string;
  holderName: string;
  tierLabel: string;
  index: number;
  of: number;
  url: string;
};

export type EmailParts = {
  /** The subject line, also used as the preheader. */
  subject: string;
  /** Small caps line above the title. */
  kicker: string;
  title: string;
  /** One or two sentences under the title. */
  intro: string;
  /** The big code on a pass or an entry, when there is one. */
  code?: { label: string; value: string };
  /** Every code issued, when an order bought more than one. */
  codes?: string[];
  rows?: DetailRow[];
  /** Scannable passes, one card each. */
  tickets?: TicketBlock[];
  money?: { price: PriceBreakdown; baseLabel: string };
  /** Closing paragraph — what to do next, or what the office must do. */
  outro?: string;
  /** Turns the header band red for the things somebody has to act on. */
  tone?: "normal" | "alert";
};

function escape(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function detailRows(rows: DetailRow[]): string {
  return rows
    .map(
      (row, i) => `
      <tr>
        <td style="padding:${i === 0 ? "0" : "9px"} 0 9px 0;border-bottom:1px solid #e2d5f0;font:400 12px/1.4 ${SANS};letter-spacing:0.12em;color:#6b5292;text-transform:uppercase;">${escape(row.label)}</td>
        <td style="padding:${i === 0 ? "0" : "9px"} 0 9px 0;border-bottom:1px solid #e2d5f0;font:700 14px/1.4 ${SANS};color:${INK};text-align:right;">${escape(row.value)}</td>
      </tr>`,
    )
    .join("");
}

function moneyRows(price: PriceBreakdown, baseLabel: string): string {
  return breakdownLines(price, baseLabel)
    .map(
      (line) => `
      <tr>
        <td style="padding:8px 0;${line.strong ? `border-top:2px dashed ${INK};` : ""}font:${line.strong ? "700" : "400"} 12px/1.4 ${SANS};letter-spacing:0.1em;color:${line.strong ? INK : "#6b5292"};text-transform:uppercase;">${escape(line.label)}</td>
        <td style="padding:8px 0;${line.strong ? `border-top:2px dashed ${INK};` : ""}font:700 ${line.strong ? "20px" : "14px"}/1.4 ${SANS};color:${INK};text-align:right;">${escape(formatPaise(line.amountPaise))}</td>
      </tr>`,
    )
    .join("");
}

/**
 * A ticket, drawn as the thing it is: a stub with a QR on it.
 *
 * The QR is an inline attachment rather than a link to the site, because every
 * mail client blocks remote images by default and a pass nobody can see is not
 * a pass. The link underneath is the fallback for the client that blocks even
 * inline images, and the thing to open at the gate when the mail won't load.
 */
function ticketCard(ticket: TicketBlock): string {
  return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:3px solid ${INK};border-radius:18px;margin-bottom:14px;">
        <tr>
          <td style="padding:18px 20px 10px 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font:700 10px/1.4 ${SANS};letter-spacing:0.2em;color:#6b5292;text-transform:uppercase;">${escape(ticket.tierLabel)}</td>
                <td style="font:700 10px/1.4 ${SANS};letter-spacing:0.16em;color:#6b5292;text-align:right;text-transform:uppercase;">Admit one${ticket.of > 1 ? ` &middot; ${ticket.index} of ${ticket.of}` : ""}</td>
              </tr>
            </table>
            <div style="padding-top:6px;font:800 20px/1.2 ${SANS};color:${INK};">${escape(ticket.holderName)}</div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:4px 20px 6px 20px;">
            <img src="cid:${escape(ticket.cid)}" alt="QR code for ${escape(ticket.code)}" width="200" height="200" style="display:block;width:200px;height:200px;border:0;" />
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0 20px 8px 20px;">
            <div style="font:800 19px/1.2 ${SANS};letter-spacing:0.1em;color:${INK};">${escape(ticket.code)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 20px 18px 20px;border-top:2px dashed ${INK};">
            <div style="font:400 12px/1.6 ${SANS};color:#6b5292;text-align:center;">
              Show this at the gate. Can't see the code above?
              <a href="${escape(ticket.url)}" style="color:${PURPLE};font-weight:700;">Open your ticket</a>
            </div>
          </td>
        </tr>
      </table>`;
}

/** The shell every mail is poured into. Returns both the HTML and its plain twin. */
export function renderEmail(parts: EmailParts, settings: FestSettings): { html: string; text: string } {
  const band = parts.tone === "alert" ? "#df025c" : TEAL;
  const bandText = parts.tone === "alert" ? LILAC : INK;
  const date = describeDate(settings);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(parts.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};">
<!-- Preheader: the grey line of text an inbox shows beside the subject. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(parts.intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:24px 12px;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;">

        <tr>
          <td style="background:${band};border:3px solid ${INK};border-radius:18px 18px 0 0;padding:18px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font:800 22px/1 ${SANS};letter-spacing:0.08em;color:${bandText};">MADOOZA</td>
                <td style="font:700 10px/1.4 ${SANS};letter-spacing:0.18em;color:${bandText};text-align:right;text-transform:uppercase;">${escape(parts.kicker)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:${PAPER};border-left:3px solid ${INK};border-right:3px solid ${INK};padding:28px 24px 8px 24px;">
            <h1 style="margin:0 0 12px 0;font:800 26px/1.15 ${SANS};letter-spacing:0.01em;color:${INK};">${escape(parts.title)}</h1>
            <p style="margin:0 0 20px 0;font:400 15px/1.6 ${SANS};color:#453063;">${escape(parts.intro)}</p>
          </td>
        </tr>

        ${
          parts.tickets?.length
            ? `<tr>
          <td style="background:${PAPER};border-left:3px solid ${INK};border-right:3px solid ${INK};padding:0 24px 8px 24px;">
            ${parts.tickets.map(ticketCard).join("")}
          </td>
        </tr>`
            : ""
        }

        ${
          parts.code
            ? `<tr>
          <td style="background:${PAPER};border-left:3px solid ${INK};border-right:3px solid ${INK};padding:0 24px 20px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PURPLE};border:3px solid ${INK};border-radius:16px;">
              <tr>
                <td style="padding:18px 20px;text-align:center;">
                  <div style="font:700 10px/1.4 ${SANS};letter-spacing:0.22em;color:${TEAL};text-transform:uppercase;">${escape(parts.code.label)}</div>
                  <div style="padding-top:8px;font:800 30px/1.1 ${SANS};letter-spacing:0.06em;color:${LILAC};">${escape(parts.code.value)}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
            : ""
        }

        ${
          parts.codes && parts.codes.length > 1
            ? `<tr>
          <td style="background:${PAPER};border-left:3px solid ${INK};border-right:3px solid ${INK};padding:0 24px 20px 24px;">
            <div style="font:700 10px/1.4 ${SANS};letter-spacing:0.2em;color:#6b5292;text-transform:uppercase;padding-bottom:10px;">All ${parts.codes.length} codes — one person each</div>
            <div style="font:700 15px/1.9 ${SANS};letter-spacing:0.04em;color:${INK};">${parts.codes.map(escape).join(" &nbsp;·&nbsp; ")}</div>
          </td>
        </tr>`
            : ""
        }

        ${
          parts.rows && parts.rows.length
            ? `<tr>
          <td style="background:${PAPER};border-left:3px solid ${INK};border-right:3px solid ${INK};padding:0 24px 20px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows(parts.rows)}</table>
          </td>
        </tr>`
            : ""
        }

        ${
          parts.money
            ? `<tr>
          <td style="background:${PAPER};border-left:3px solid ${INK};border-right:3px solid ${INK};padding:0 24px 22px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px solid ${INK};border-radius:14px;">
              <tr><td style="padding:14px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${moneyRows(parts.money.price, parts.money.baseLabel)}</table>
              </td></tr>
            </table>
          </td>
        </tr>`
            : ""
        }

        ${
          parts.outro
            ? `<tr>
          <td style="background:${PAPER};border-left:3px solid ${INK};border-right:3px solid ${INK};border-bottom:3px solid ${INK};border-radius:0 0 18px 18px;padding:0 24px 26px 24px;">
            <p style="margin:0;font:400 14px/1.6 ${SANS};color:#453063;">${escape(parts.outro)}</p>
          </td>
        </tr>`
            : `<tr><td style="background:${PAPER};border-left:3px solid ${INK};border-right:3px solid ${INK};border-bottom:3px solid ${INK};border-radius:0 0 18px 18px;padding:0 24px 12px 24px;"></td></tr>`
        }

        <tr>
          <td style="padding:22px 6px 4px 6px;font:400 12px/1.7 ${SANS};color:${MUTED};">
            <strong style="color:${LILAC};">MADOOZA</strong> · ${escape(date.short)}<br>
            Hosted by ${escape(HOST_NAME)} · ${escape(ORGANIZER_ROLE)}: ${escape(ORGANIZER_NAME)}<br>
            ${escape(settings.contactEmail)} · ${escape(settings.contactPhone)}
          </td>
        </tr>
        <tr>
          <td style="padding:0 6px 10px 6px;font:400 11px/1.6 ${SANS};color:#8f74b5;">
            This is an automatic message from the MADOOZA site. Refunds are handled in person at the school office.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  // The plain-text twin. Not an afterthought: it is what a screen reader, a
  // watch and a spam filter read.
  const lines: string[] = [`MADOOZA — ${parts.kicker}`, "", parts.title.toUpperCase(), "", parts.intro, ""];
  if (parts.code) lines.push(`${parts.code.label}: ${parts.code.value}`, "");
  if (parts.tickets?.length) {
    for (const t of parts.tickets) {
      lines.push(
        `${t.tierLabel} — ${t.holderName}${t.of > 1 ? ` (${t.index} of ${t.of})` : ""}`,
        `  code: ${t.code}`,
        `  ticket: ${t.url}`,
      );
    }
    lines.push("");
  }
  if (parts.codes && parts.codes.length > 1) lines.push(`All codes: ${parts.codes.join(", ")}`, "");
  if (parts.rows?.length) {
    for (const row of parts.rows) lines.push(`${row.label}: ${row.value}`);
    lines.push("");
  }
  if (parts.money) {
    for (const line of breakdownLines(parts.money.price, parts.money.baseLabel)) {
      lines.push(`${line.label}: ${formatPaise(line.amountPaise)}`);
    }
    lines.push("");
  }
  if (parts.outro) lines.push(parts.outro, "");
  lines.push(
    `Hosted by ${HOST_NAME} · ${ORGANIZER_ROLE}: ${ORGANIZER_NAME}`,
    `${settings.contactEmail} · ${settings.contactPhone}`,
    "Refunds are handled in person at the school office.",
  );

  return { html, text: lines.join("\n") };
}
