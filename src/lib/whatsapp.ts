/**
 * The pass, delivered over WhatsApp.
 *
 * This talks to Meta's WhatsApp Business Cloud API directly. There is no
 * alternative worth having: WhatsApp is not email, nothing may be sent without
 * Meta's consent, and the libraries that drive a logged-in phone session get
 * the number permanently banned.
 *
 * Three things follow from that, and they shape everything below.
 *
 * A business cannot start a conversation in free text. It may only send a
 * *template* that Meta approved in advance, supplying the variable parts as
 * ordered parameters. So the wording lives in the Meta dashboard and this file
 * only fills in the blanks — see WHATSAPP_TEMPLATE for the order they go in.
 *
 * The pass has to reach Meta before it can reach the buyer. It is uploaded to
 * the media endpoint and sent by id rather than by link, because the alternative
 * is a URL Meta's servers can fetch, and the whole point of the token on a pass
 * is that nothing unauthenticated can print somebody else's ticket.
 *
 * And none of it may ever break a payment. Every function here answers with a
 * result rather than throwing, and the caller treats a failure as "they still
 * have the email and the download" — which they do.
 */

/** Graph API version. Meta retires one roughly two years after release, so this
 *  is configurable: set it to whatever the Meta dashboard currently offers. */
const VERSION = process.env.WHATSAPP_API_VERSION || "v21.0";

/** The country the fest is in, for numbers typed without a code. */
const DEFAULT_COUNTRY_CODE = "91";

export type WhatsAppResult =
  | { sent: true; messageId: string }
  | { sent: false; skipped: string }
  | { sent: false; error: string };

type Config = { token: string; phoneNumberId: string; template: string; language: string };

function config(): Config | null {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return null;
  return {
    token,
    phoneNumberId,
    template: process.env.WHATSAPP_TEMPLATE || "madooza_pass",
    language: process.env.WHATSAPP_TEMPLATE_LANG || "en",
  };
}

/** Whether the fest has finished its Meta setup. */
export function whatsappReady(): boolean {
  return config() !== null;
}

/**
 * A phone number in the form Meta wants: digits only, country code included,
 * no plus sign.
 *
 * The forms ask for ten digits and people type whatever they like — spaces,
 * dashes, a +91, a leading 0 out of habit. Ten bare digits are read as Indian,
 * which is the only assumption here and the right one for a school fest in
 * Hazaribagh. Anything that cannot be resolved returns null rather than a
 * guess, because a guessed number is somebody else's phone.
 */
export function toWhatsAppNumber(raw: string, countryCode = DEFAULT_COUNTRY_CODE): string | null {
  let digits = (raw || "").replace(/\D/g, "");
  if (!digits) return null;

  // 00 as the international prefix, the way it is still dialled and printed.
  if (digits.startsWith("00")) digits = digits.slice(2);
  // A trunk 0 belongs to domestic dialling and never to an E.164 number. It is
  // stripped whatever the length, because keeping it only when the rest happens
  // to be ten digits lets a mistyped number through looking plausible.
  digits = digits.replace(/^0+/, "");

  if (digits.length === 10) digits = countryCode + digits;

  // Shorter than a country code plus a subscriber number, or longer than E.164
  // allows, means it was mistyped rather than unusual.
  return digits.length >= 11 && digits.length <= 15 ? digits : null;
}

/**
 * Puts a file on Meta's servers and returns the id to send it by.
 *
 * The id is Meta's copy, not a link anybody can follow, and it stays valid long
 * enough to be attached to a message immediately after upload — which is the
 * only thing it is used for here.
 */
async function uploadMedia(
  cfg: Config,
  file: Buffer,
  filename: string,
  contentType: string,
): Promise<{ id: string } | { error: string }> {
  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("type", contentType);
  form.append("file", new Blob([new Uint8Array(file)], { type: contentType }), filename);

  try {
    const res = await fetch(`https://graph.facebook.com/${VERSION}/${cfg.phoneNumberId}/media`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}` },
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.id) return { error: describe(data, res.status) };
    return { id: String(data.id) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not reach WhatsApp" };
  }
}

export type PassMessage = {
  /** However the buyer typed it; normalised here. */
  phone: string;
  /** Template body parameter 1. */
  name: string;
  /** Template body parameter 2. */
  code: string;
  /** Template body parameter 3. */
  url: string;
  /** The pass itself, attached to the template's document header. */
  pdf?: { file: Buffer; filename: string };
};

/**
 * Sends one approved template to one buyer.
 *
 * The template must be created in the Meta dashboard with a DOCUMENT header and
 * exactly three body variables, in this order:
 *
 *   {{1}} the holder's name
 *   {{2}} the pass code, e.g. MDZ-F-0042
 *   {{3}} the link to the pass
 *
 * If the upload fails the message still goes, without the attachment: a pass
 * code and a working link are a usable ticket, and a silent nothing is not.
 */
export async function sendPass(message: PassMessage): Promise<WhatsAppResult> {
  const cfg = config();
  if (!cfg) return { sent: false, skipped: "WhatsApp is not configured" };

  const to = toWhatsAppNumber(message.phone);
  if (!to) return { sent: false, skipped: "No usable phone number" };

  const components: unknown[] = [];

  if (message.pdf) {
    const media = await uploadMedia(cfg, message.pdf.file, message.pdf.filename, "application/pdf");
    if ("id" in media) {
      components.push({
        type: "header",
        parameters: [{ type: "document", document: { id: media.id, filename: message.pdf.filename } }],
      });
    } else {
      console.error("[whatsapp] pass upload failed, sending without it:", media.error);
    }
  }

  components.push({
    type: "body",
    parameters: [message.name, message.code, message.url].map((text) => ({ type: "text", text })),
  });

  try {
    const res = await fetch(`https://graph.facebook.com/${VERSION}/${cfg.phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "template",
        template: {
          name: cfg.template,
          language: { code: cfg.language },
          components,
        },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { sent: false, error: describe(data, res.status) };

    const id = data?.messages?.[0]?.id;
    return id ? { sent: true, messageId: String(id) } : { sent: false, error: "WhatsApp accepted it but named no message" };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "Could not reach WhatsApp" };
  }
}

/**
 * Meta's errors are the useful part of a failure — a template not approved, a
 * number not on WhatsApp, an expired token all look identical otherwise.
 */
function describe(data: unknown, status: number): string {
  const error = (data as { error?: { message?: string; code?: number; error_subcode?: number } })?.error;
  if (!error?.message) return `WhatsApp refused it (HTTP ${status})`;
  const code = error.code ? ` [${error.code}${error.error_subcode ? `/${error.error_subcode}` : ""}]` : "";

  // Meta answers "object does not exist or does not support this operation"
  // whenever the id in the URL is not a WhatsApp phone number. A Meta Pixel id
  // and a phone number id are both sixteen anonymous digits from different
  // corners of the same dashboard, so this is the mistake that actually gets
  // made — and Meta's own wording gives no hint which field to look at.
  const wrongObject = error.code === 100 && error.error_subcode === 33;
  const hint = wrongObject
    ? " — check WHATSAPP_PHONE_NUMBER_ID: it must be the phone number id from WhatsApp Manager, not the Meta Pixel id or the phone number itself"
    : "";

  return `${error.message}${code}${hint}`;
}
