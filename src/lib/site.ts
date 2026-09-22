/**
 * Where the site lives, as an absolute origin with no trailing slash.
 *
 * Absolute URLs are needed in three places that leave the browser entirely —
 * a QR a phone camera reads, a link in an email, and the sitemap a crawler
 * fetches — so this cannot be a relative path and cannot be guessed at
 * request time from a Host header.
 *
 * NEXT_PUBLIC_SITE_URL is the answer in production (https://madooza.com).
 * Vercel's own production domain is the fallback, so a preview deploy that
 * nobody has configured still produces working links rather than broken ones.
 */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (configured) return configured;

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "https://madooza.com";
}
