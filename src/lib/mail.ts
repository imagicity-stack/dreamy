import nodemailer, { type Transporter } from "nodemailer";

/**
 * Sending mail, and knowing when we can't.
 *
 * One mailbox sends everything and one mailbox receives the council's copy,
 * both named in the environment rather than in the source, so the addresses can
 * change without a deploy touching code that knows about passes.
 *
 * Two rules hold here:
 *
 * 1. Mail never breaks a payment. Every failure is caught and logged, and the
 *    caller is told whether it went — a buyer who has paid must never see an
 *    error because a mail server was slow.
 * 2. Nothing is sent from inside a Firestore transaction or before a payment is
 *    recorded. The record is the truth; the mail is a copy of it.
 */

export type MailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  /** The council's inbox — gets a copy of everything that happens. */
  office: string;
  replyTo: string;
};

/** Reads the environment, or says which parts of it are missing. */
export function mailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const from = process.env.MAIL_FROM || user;
  const office = process.env.MAIL_TO || "";

  if (!user || !pass || !from || !office) return null;

  return {
    host,
    port: Number.isFinite(port) ? port : 465,
    user,
    pass,
    from,
    office,
    replyTo: process.env.MAIL_REPLY_TO || office,
  };
}

/** What the admin panel reports when mail isn't set up yet. */
export function missingMailConfig(): string[] {
  const missing: string[] = [];
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missing.push("SMTP_PASS");
  if (!process.env.MAIL_FROM && !process.env.SMTP_USER) missing.push("MAIL_FROM");
  if (!process.env.MAIL_TO) missing.push("MAIL_TO");
  return missing;
}

export function mailConfigured(): boolean {
  return mailConfig() !== null;
}

let transporter: Transporter | null = null;
let transporterKey = "";

/**
 * The SMTP connection, made once and kept. Google Workspace on 465 is implicit
 * TLS; 587 is STARTTLS, which nodemailer negotiates when `secure` is false.
 */
function getTransport(config: MailConfig): Transporter {
  const key = `${config.host}:${config.port}:${config.user}`;
  if (transporter && transporterKey === key) return transporter;

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    // A serverless invocation is short-lived; don't let a hanging connection
    // outlive the request that needed it.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  transporterKey = key;
  return transporter;
}

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
  /**
   * Set to reference the file from the HTML as <img src="cid:…">. Inline
   * attachments display where a remote image would be blocked, which is why
   * the QR travels with the mail rather than being fetched from the site.
   */
  cid?: string;
};

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  /** Plain-text alternative. Some clients show it, and spam filters read it. */
  text: string;
  attachments?: MailAttachment[];
};

export type MailResult = { sent: boolean; skipped?: string; error?: string };

/** Sends one message. Returns rather than throws, always. */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  const config = mailConfig();
  if (!config) return { sent: false, skipped: "mail is not configured" };
  if (!message.to.trim()) return { sent: false, skipped: "no recipient" };

  try {
    await getTransport(config).sendMail({
      from: config.from,
      to: message.to,
      replyTo: config.replyTo,
      subject: message.subject,
      html: message.html,
      text: message.text,
      attachments: message.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
        cid: a.cid,
        contentDisposition: a.cid ? ("inline" as const) : ("attachment" as const),
      })),
    });
    return { sent: true };
  } catch (e) {
    // Logged, never rethrown: the payment behind this mail is already recorded
    // and the buyer is owed a working page, not a stack trace.
    const error = e instanceof Error ? e.message : "unknown mail error";
    console.error("mail failed", message.subject, "->", message.to, error);
    return { sent: false, error };
  }
}

/** Sends the same message to several people, each as their own mail. */
export async function sendAll(messages: MailMessage[]): Promise<MailResult[]> {
  return Promise.all(messages.map(sendMail));
}

/** The office inbox, for callers building a notification. */
export function officeAddress(): string {
  return mailConfig()?.office ?? "";
}
