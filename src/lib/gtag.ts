/**
 * Google Analytics 4, the other half of the measurement.
 *
 * Same shape as the Meta pixel next door and for the same reasons: the events
 * worth having are reported from code that already knows the truth, and a
 * missing gtag is a no-op rather than an error in the middle of a payment.
 */

/** Empty turns GA off entirely, which is what a preview deploy wants. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-4RD7WLG676";

type Gtag = (...args: unknown[]) => void;

function gtag(): Gtag | null {
  if (typeof window === "undefined") return null;
  const fn = (window as unknown as { gtag?: Gtag }).gtag;
  return typeof fn === "function" ? fn : null;
}

/** One GA4 event. Names and parameters follow Google's own recommended list. */
export function gtagEvent(event: string, params?: Record<string, unknown>): void {
  const g = gtag();
  if (!g) return;
  try {
    g("event", event, params ?? {});
  } catch {
    // Analytics never gets to break the page it is measuring.
  }
}
