import { revalidateTag, unstable_cache } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Keeping Firestore off the critical path.
 *
 * Every public page is rendered per request, because the council can change a
 * price or a headline at any moment and the next visitor should see it. Read
 * literally, that meant six or seven Firestore round trips per page view — the
 * settings, the page's words, the footer's words, the header ticker and two or
 * three content lists — each one a network hop from the Vercel function to
 * Google's servers. On a good day that is a few hundred milliseconds. When the
 * two happen to sit on different continents it is a couple of seconds, and the
 * site feels like it is thinking before every click.
 *
 * So reads go through Next's data cache, tagged, and every write in the panel
 * drops the tags it touched. Between edits a page render costs no round trips
 * at all; the moment somebody saves, the next request goes back to Firestore.
 * The promise — edit in the panel, live immediately, no deploy — is unchanged.
 *
 * The `revalidate` windows are a safety net for a tag we forgot to drop, not
 * the mechanism.
 */

export const CACHE_TAGS = {
  settings: "madooza:settings",
  copy: (key: string) => `madooza:copy:${key}`,
  content: (key: string) => `madooza:content:${key}`,
} as const;

/** Settings change the whole site, so they hold for a minute at most. */
const SETTINGS_TTL = 60;
/** Words and lists are edited far less often. */
const CONTENT_TTL = 300;

/**
 * Firestore hands back Timestamps and other class instances; the data cache
 * stores JSON. Converting on the way in keeps what comes back out of the cache
 * identical to what a fresh read would have given.
 */
export function serializeFirestore<T>(value: T): T {
  if (value instanceof Timestamp) return value.toDate().toISOString() as unknown as T;
  if (Array.isArray(value)) return value.map((v) => serializeFirestore(v)) as unknown as T;
  if (value && typeof value === "object" && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, serializeFirestore(v)]),
    ) as T;
  }
  return value;
}

/** Wraps a Firestore read so it is shared across requests until its tag drops. */
export function cachedRead<T>(
  parts: string[],
  tags: string[],
  ttl: number,
  read: () => Promise<T>,
): () => Promise<T> {
  return unstable_cache(async () => serializeFirestore(await read()), parts, {
    tags,
    revalidate: ttl,
  });
}

export function cachedSettingsRead<T>(read: () => Promise<T>) {
  return cachedRead(["settings"], [CACHE_TAGS.settings], SETTINGS_TTL, read);
}

export function cachedCopyRead<T>(key: string, read: () => Promise<T>) {
  return cachedRead(["copy", key], [CACHE_TAGS.copy(key)], CONTENT_TTL, read);
}

export function cachedContentRead<T>(key: string, read: () => Promise<T>) {
  return cachedRead(["content", key], [CACHE_TAGS.content(key)], CONTENT_TTL, read);
}

/**
 * Called by the write paths themselves rather than by the routes around them,
 * so a new editing endpoint cannot forget to do it.
 */
export function dropSettingsCache() {
  revalidateTag(CACHE_TAGS.settings);
}

export function dropCopyCache(key: string) {
  revalidateTag(CACHE_TAGS.copy(key));
}

export function dropContentCache(key: string) {
  revalidateTag(CACHE_TAGS.content(key));
}
