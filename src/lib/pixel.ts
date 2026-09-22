/**
 * Meta Pixel, as a function rather than a script tag copied into pages.
 *
 * The events that matter to an ad account are the ones that cost money to
 * learn: a checkout opened, a purchase completed, an interest list joined.
 * Those all happen in code that already exists — one checkout function, one
 * interest form — so they are reported from there rather than from a tag
 * manager guessing at button clicks.
 *
 * Every call here is safe to make when the pixel is off, blocked, or still
 * loading: fbq is queued by its own snippet, and a missing fbq is a no-op
 * rather than a thrown error in the middle of somebody's payment.
 */

/** Empty turns the pixel off entirely, which is what a preview deploy wants. */
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1092847986552708";

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[] };

function fbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const fn = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof fn === "function" ? fn : null;
}

/**
 * One of Meta's own event names, with its parameters.
 *
 * `eventID` is worth passing on anything that costs money: it is how Meta
 * de-duplicates a browser event against the same event sent server-side, so
 * adding the Conversions API later does not double-count every sale. The order
 * id is already unique per purchase, so it is the natural id to use.
 */
export function track(event: string, params?: Record<string, unknown>, eventID?: string): void {
  const f = fbq();
  if (!f) return;
  try {
    f("track", event, params ?? {}, eventID ? { eventID } : undefined);
  } catch {
    // Analytics never gets to break the page it is measuring.
  }
}

/** Paise to the major units Meta expects — it wants 499.00, not 49900. */
export function toAmount(paise: number): number {
  return Math.round(paise) / 100;
}
