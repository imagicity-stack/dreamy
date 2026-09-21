import { formatPaise } from "./pricing";
import { renderEmail, type DetailRow, type TicketBlock } from "./mailTemplates";
import {
  officeAddress,
  sendAll,
  sendMail,
  type MailAttachment,
  type MailMessage,
  type MailResult,
} from "./mail";
import { issueTickets, qrPng, type IssuedTicket } from "./tickets";
import { getSettings } from "./settings";
import type { Receipt } from "./orders";

/**
 * What the fest tells people, and when.
 *
 * Every event on the site sends the council's inbox a copy, because a fest is
 * run by people who need to know a pass was sold without opening a dashboard;
 * and when we know the buyer's address, it sends them the same facts written
 * for them rather than for the office.
 *
 * Nothing here is allowed to fail loudly. These are called after the record is
 * written and, on a route, from inside after(), so a slow mail server delays
 * nobody's confirmation page.
 */

const PRODUCT_WORDS: Record<string, { buyerTitle: string; officeNoun: string; codeLabel: string }> = {
  fetePass: { buyerTitle: "YOU'RE IN", officeNoun: "Fete Pass", codeLabel: "PASS CODE" },
  cosplayEntry: { buyerTitle: "THE ARENA HAS YOUR NAME", officeNoun: "Cosplay entry", codeLabel: "ENTRY CODE" },
  merch: { buyerTitle: "ORDER PAID", officeNoun: "Merch order", codeLabel: "COLLECTION CODE" },
};

function words(product: string) {
  return PRODUCT_WORDS[product] ?? { buyerTitle: "THANK YOU", officeNoun: "Order", codeLabel: "CODE" };
}

function buyerRows(receipt: Receipt): DetailRow[] {
  const rows: DetailRow[] = [{ label: "Name", value: receipt.customer.name }];
  const extra = receipt.customer.extra ?? {};
  if (extra.character) rows.push({ label: "Walking as", value: extra.character });
  if (extra.category) rows.push({ label: "Category", value: extra.category });
  if (extra.team) rows.push({ label: "Squad", value: extra.team });
  if (receipt.product === "merch") {
    for (const line of receipt.lines) {
      rows.push({ label: `${line.qty} × ${line.label}`, value: formatPaise(line.amountPaise) });
    }
  } else if (receipt.units > 1) {
    rows.push({ label: "Quantity", value: String(receipt.units) });
  }
  rows.push({ label: "Payment", value: receipt.paymentId });
  return rows;
}

function officeRows(receipt: Receipt): DetailRow[] {
  const extra = receipt.customer.extra ?? {};
  const rows: DetailRow[] = [
    { label: "Name", value: receipt.customer.name },
    { label: "Phone", value: receipt.customer.phone },
  ];
  if (receipt.customer.email) rows.push({ label: "Email", value: receipt.customer.email });
  if (receipt.customer.school) rows.push({ label: "School", value: receipt.customer.school });
  if (extra.character) rows.push({ label: "Character", value: extra.character });
  if (extra.category) rows.push({ label: "Category", value: extra.category });
  if (extra.mode) rows.push({ label: "Mode", value: extra.mode });
  if (extra.team) rows.push({ label: "Squad", value: extra.team });
  if (extra.members) rows.push({ label: "Squad members", value: extra.members });
  if (receipt.product === "merch") {
    for (const line of receipt.lines) {
      rows.push({ label: `${line.qty} × ${line.label}`, value: formatPaise(line.amountPaise) });
    }
  }
  rows.push(
    { label: "Units", value: String(receipt.units) },
    { label: "Codes", value: receipt.codes.join(", ") || "—" },
    { label: "Order", value: receipt.orderId },
    { label: "Payment", value: receipt.paymentId },
  );
  return rows;
}

/**
 * Turns a paid order into scannable tickets and their QR images.
 *
 * Only passes get them: a cosplay entry is a slot at a desk and a merch order
 * is a bag at a tent, neither of which is a turnstile. Returns empty for
 * everything else, and the mail falls back to its plain code block.
 */
async function ticketsFor(receipt: Receipt): Promise<{ blocks: TicketBlock[]; files: MailAttachment[] }> {
  if (receipt.product !== "fetePass") return { blocks: [], files: [] };

  let issued: IssuedTicket[] = [];
  try {
    issued = await issueTickets(receipt);
  } catch (e) {
    // A pass without a QR is still a pass — the code and the gate list work.
    console.error("could not issue tickets for", receipt.orderId, e);
    return { blocks: [], files: [] };
  }

  const blocks: TicketBlock[] = [];
  const files: MailAttachment[] = [];

  for (const ticket of issued) {
    const cid = `qr-${ticket.code.toLowerCase()}@madooza`;
    try {
      files.push({
        filename: `${ticket.code}.png`,
        content: await qrPng(ticket.url),
        contentType: "image/png",
        cid,
      });
    } catch {
      continue; // No image, no card: better a missing stub than a broken one.
    }
    blocks.push({
      cid,
      code: ticket.code,
      holderName: ticket.holderName,
      tierLabel: ticket.tierLabel,
      index: ticket.index,
      of: ticket.of,
      url: ticket.url,
    });
  }

  return { blocks, files };
}

/** A paid pass, entry or merch order: the buyer's receipt and the office's copy. */
export async function notifyOrderPaid(receipt: Receipt): Promise<MailResult[]> {
  const settings = await getSettings();
  const w = words(receipt.product);
  const office = officeAddress();
  const messages: MailMessage[] = [];

  // Issued before either mail is built, so the office's copy can say whether
  // the buyer's passes are scannable.
  const { blocks, files } = await ticketsFor(receipt);

  if (office) {
    const doc = renderEmail(
      {
        subject: `${w.officeNoun} · ${receipt.customer.name} · ${formatPaise(receipt.amount.totalPaise)}`,
        kicker: "NEW SALE",
        title: `${w.officeNoun.toUpperCase()} PAID`,
        intro: `${receipt.customer.name} paid ${formatPaise(receipt.amount.totalPaise)} for ${receipt.description}. It is recorded in the panel; this is your copy.`,
        rows: officeRows(receipt),
        money: { price: receipt.amount, baseLabel: receipt.product === "merch" ? "ITEMS" : "TICKETS" },
        outro: receipt.customer.email
          ? `A receipt has gone to ${receipt.customer.email} as well${blocks.length ? `, with ${blocks.length === 1 ? "a scannable ticket" : `${blocks.length} scannable tickets`}` : ""}.`
          : `No email address was given, so the buyer has only the confirmation on screen${blocks.length ? ` — their ${blocks.length === 1 ? "ticket is" : "tickets are"} still scannable at the gate by name or code` : ""}, and their phone number is the way to reach them.`,
      },
      settings,
    );
    messages.push({
      to: office,
      subject: `${w.officeNoun} · ${receipt.customer.name} · ${formatPaise(receipt.amount.totalPaise)}`,
      html: doc.html,
      text: doc.text,
    });
  }

  if (receipt.customer.email) {
    const isMerch = receipt.product === "merch";
    const doc = renderEmail(
      {
        subject: `${w.codeLabel === "PASS CODE" ? "Your MADOOZA pass" : `Your MADOOZA ${w.officeNoun.toLowerCase()}`} — ${receipt.primaryCode}`,
        kicker: w.codeLabel,
        title: w.buyerTitle,
        intro: isMerch
          ? `Paid and reserved. Bring the code below to the merch tent on the day and it will be waiting for you.`
          : receipt.product === "cosplayEntry"
            ? `Your entry is in. Keep the code below — it is how the arena desk finds you on the day.`
            : blocks.length
              ? `That's ${receipt.units === 1 ? "your pass" : `all ${receipt.units} passes`} sorted. Show the code${receipt.units === 1 ? "" : "s"} below at the gate and we'll scan ${receipt.units === 1 ? "it" : "them"} — screenshot ${receipt.units === 1 ? "it" : "them"} now, so a flat battery or no signal can't stop you getting in.`
              : `That's ${receipt.units === 1 ? "your pass" : `all ${receipt.units} passes`} sorted. Show the code below at the gate, or just give your name.`,
        code: blocks.length ? undefined : { label: w.codeLabel, value: receipt.primaryCode },
        codes: blocks.length ? undefined : receipt.codes,
        tickets: blocks,
        rows: buyerRows(receipt),
        money: { price: receipt.amount, baseLabel: isMerch ? "ITEMS" : "TICKETS" },
        outro: `Keep this mail — the payment reference on it is what the fest office needs if anything has to be sorted out.`,
      },
      settings,
    );
    messages.push({
      to: receipt.customer.email,
      subject: `${receipt.product === "fetePass" ? "Your MADOOZA pass" : `Your MADOOZA ${w.officeNoun.toLowerCase()}`} — ${receipt.primaryCode}`,
      html: doc.html,
      text: doc.text,
      attachments: files,
    });
  }

  return sendAll(messages);
}

/** Somebody put their name down for the concert reveal. */
export async function notifyConcertInterest(entry: {
  queueNumber: number;
  name: string;
  contact: string;
  pick: string;
  guess: string;
  seats: string;
}): Promise<MailResult[]> {
  const settings = await getSettings();
  const office = officeAddress();
  const messages: MailMessage[] = [];
  const queue = entry.queueNumber.toLocaleString("en-IN");

  if (office) {
    const doc = renderEmail(
      {
        subject: `Concert interest #${queue} · ${entry.name}`,
        kicker: "INTEREST LIST",
        title: "ANOTHER NAME DOWN",
        intro: `${entry.name} joined the concert interest list at number ${queue}.`,
        rows: [
          { label: "Queue number", value: queue },
          { label: "Name", value: entry.name },
          { label: "Contact", value: entry.contact },
          { label: "Hoping for", value: entry.pick },
          { label: "Their guess", value: entry.guess },
          { label: "Seats wanted", value: entry.seats },
        ],
        outro: `The list is ${queue} long now, against ${settings.concertCapacity.toLocaleString("en-IN")} seats.`,
      },
      settings,
    );
    messages.push({ to: office, subject: `Concert interest #${queue} · ${entry.name}`, html: doc.html, text: doc.text });
  }

  // The contact field takes a phone or an email, so only mail the ones we can.
  if (/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(entry.contact)) {
    const doc = renderEmail(
      {
        subject: `You're number ${queue} on the MADOOZA list`,
        kicker: "INTEREST LIST",
        title: `YOU'RE NUMBER ${queue}`,
        intro: `You're on the list for the concert. When the name drops, you hear it an hour before the rest of Hazaribagh — and you get a 48-hour window on the seats.`,
        rows: [
          { label: "Queue number", value: queue },
          { label: "You're hoping for", value: entry.pick },
          { label: "Seats you'd want", value: entry.seats },
        ],
        outro: `We won't use your details for anything else. Ask at the fest office any time and you're off the list.`,
      },
      settings,
    );
    messages.push({ to: entry.contact, subject: `You're number ${queue} on the MADOOZA list`, html: doc.html, text: doc.text });
  }

  return sendAll(messages);
}

/** Paid, but the last pass went while they were paying. The office owes a refund. */
export async function notifyOversold(args: {
  orderId: string;
  paymentId: string;
  product: string;
}): Promise<MailResult> {
  const settings = await getSettings();
  const office = officeAddress();
  if (!office) return { sent: false, skipped: "no office address" };

  const doc = renderEmail(
    {
      subject: `REFUND NEEDED · oversold ${args.product} · ${args.paymentId}`,
      kicker: "NEEDS A HUMAN",
      title: "PAID, BUT SOLD OUT",
      intro: `A payment came in after the last ${args.product} was gone. Nothing has been issued, and the buyer has been told the office will refund them in full.`,
      rows: [
        { label: "Order", value: args.orderId },
        { label: "Payment", value: args.paymentId },
        { label: "Product", value: args.product },
      ],
      outro: `Refund this in the Razorpay dashboard against the payment reference above, then tell the buyer. The order is marked "oversold" in the payments ledger.`,
      tone: "alert",
    },
    settings,
  );
  return sendMail({ to: office, subject: `REFUND NEEDED · oversold ${args.product} · ${args.paymentId}`, html: doc.html, text: doc.text });
}

/** Razorpay says a payment failed. Worth knowing; nothing to do. */
export async function notifyPaymentFailed(args: {
  orderId: string;
  paymentId: string;
  reason: string;
}): Promise<MailResult> {
  const settings = await getSettings();
  const office = officeAddress();
  if (!office) return { sent: false, skipped: "no office address" };

  const doc = renderEmail(
    {
      subject: `Payment failed · ${args.orderId}`,
      kicker: "PAYMENT FAILED",
      title: "A CHECKOUT DIDN'T GO THROUGH",
      intro: `Razorpay refused a payment. No pass was issued and no money was taken — this is a note, not a job.`,
      rows: [
        { label: "Order", value: args.orderId },
        { label: "Payment", value: args.paymentId || "—" },
        { label: "Reason", value: args.reason },
      ],
      outro: `If somebody rings saying they were charged, check the payments ledger against this order id before promising anything.`,
    },
    settings,
  );
  return sendMail({ to: office, subject: `Payment failed · ${args.orderId}`, html: doc.html, text: doc.text });
}

/** A refund came back through the webhook. */
export async function notifyRefund(args: {
  orderId: string;
  refundId: string;
  amountPaise: number;
  buyerEmail?: string;
  buyerName?: string;
}): Promise<MailResult[]> {
  const settings = await getSettings();
  const office = officeAddress();
  const messages: MailMessage[] = [];
  const amount = formatPaise(args.amountPaise);

  if (office) {
    const doc = renderEmail(
      {
        subject: `Refund processed · ${amount} · ${args.orderId}`,
        kicker: "REFUND",
        title: "A REFUND WENT THROUGH",
        intro: `${amount} has been refunded. The pass or entry behind it is marked dead and its place is back on sale.`,
        rows: [
          { label: "Order", value: args.orderId },
          { label: "Refund", value: args.refundId || "—" },
          { label: "Amount", value: amount },
          { label: "Buyer", value: args.buyerName || "—" },
        ],
      },
      settings,
    );
    messages.push({ to: office, subject: `Refund processed · ${amount} · ${args.orderId}`, html: doc.html, text: doc.text });
  }

  if (args.buyerEmail) {
    const doc = renderEmail(
      {
        subject: `Your MADOOZA refund of ${amount}`,
        kicker: "REFUND",
        title: "YOUR REFUND IS ON ITS WAY",
        intro: `${amount} has been sent back to the card, account or UPI ID you paid from. Banks take 7 to 10 working days to show it.`,
        rows: [
          { label: "Amount", value: amount },
          { label: "Reference", value: args.refundId || args.orderId },
        ],
        outro: `Anything that doesn't look right: the fest office, in person, with this reference. That is where refunds are settled.`,
      },
      settings,
    );
    messages.push({ to: args.buyerEmail, subject: `Your MADOOZA refund of ${amount}`, html: doc.html, text: doc.text });
  }

  return sendAll(messages);
}

/** "Does the mailbox work?" — sent from the panel. */
export async function sendTestEmail(to?: string): Promise<MailResult> {
  const settings = await getSettings();
  const target = to?.trim() || officeAddress();
  if (!target) return { sent: false, skipped: "no recipient" };

  const doc = renderEmail(
    {
      subject: "MADOOZA mail is working",
      kicker: "TEST",
      title: "MAIL IS WORKING",
      intro: `Somebody pressed the test button in the MADOOZA admin panel and this arrived, which means the mailbox, the app password and the from-address are all set up correctly.`,
      rows: [
        { label: "Sent at", value: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
        { label: "Going to", value: target },
      ],
      outro: `Every pass, cosplay entry, merch order and interest-list signup sends a mail like this from now on.`,
    },
    settings,
  );
  return sendMail({ to: target, subject: "MADOOZA mail is working", html: doc.html, text: doc.text });
}
