import { cache } from "react";
import { getDb } from "./firebaseAdmin";
import { applyTokens, getSettings } from "./settings";
import { COPY_GROUPS, type CopyGroup } from "./copyText";
import { cachedCopyRead, dropCopyCache } from "./cache";

/**
 * The site's writing.
 *
 * Lists of things live in content.ts; this is the prose around them — the
 * heading on each page, the paragraph under it, the copy between the sections.
 * Each page has a group of named slots, described once in copyText.ts with the
 * words the site launched with. A group is read as a plain object of slot to
 * string, so a page reads `words.heroTitle` and neither knows nor cares whether
 * that came from Firestore or from the seed.
 */

export type { CopySlot, CopyGroup } from "./copyText";
export { COPY_GROUPS } from "./copyText";

export type Words = Record<string, string>;

export function copyGroup(key: string): CopyGroup | null {
  return COPY_GROUPS.find((g) => g.key === key) ?? null;
}

/** The words as written in the source, before anyone edits them. */
export function copyDefaults(key: string): Words {
  const group = copyGroup(key);
  if (!group) return {};
  return Object.fromEntries(group.slots.map((slot) => [slot.key, slot.value]));
}

function merge(group: CopyGroup, stored: unknown): Words {
  const saved = (stored ?? {}) as Record<string, unknown>;
  const words: Words = {};
  for (const slot of group.slots) {
    const value = saved[slot.key];
    // A slot the council has emptied is still an edit, so "" is kept. Only a
    // slot that was never saved falls back to the seed.
    words[slot.key] = typeof value === "string" ? value : slot.value;
  }
  return words;
}

/**
 * Reads one page's words, once per request, with {fete}, {cosplay} and {seats}
 * already replaced. Falls back to the seed when Firebase isn't configured.
 */
export const getCopy = cache(async (key: string): Promise<Words> => {
  const group = copyGroup(key);
  if (!group) return {};

  const settings = await getSettings();
  const db = getDb();

  let words = copyDefaults(key);
  if (db) {
    const read = cachedCopyRead(key, async () => {
      try {
        const snap = await db.collection("copy").doc(key).get();
        return snap.exists ? merge(group, snap.data()) : null;
      } catch {
        // Leave the seed in place rather than showing a page with no words on it.
        return null;
      }
    });
    const stored = await read();
    if (stored) words = stored;
  }

  return Object.fromEntries(
    Object.entries(words).map(([slot, text]) => [slot, applyTokens(text, settings)]),
  );
});

/** Writes one page's words and returns what was stored, tokens left intact. */
export async function saveCopy(key: string, patch: unknown): Promise<Words | null> {
  const group = copyGroup(key);
  const db = getDb();
  if (!group || !db) return null;

  const incoming = (patch ?? {}) as Record<string, unknown>;
  const next: Words = {};
  for (const slot of group.slots) {
    const value = incoming[slot.key];
    next[slot.key] = typeof value === "string" ? value.slice(0, 4000) : slot.value;
  }

  await db.collection("copy").doc(key).set(next, { merge: true });
  dropCopyCache(key);
  return next;
}

/** What the panel shows: the stored words, un-tokenised so they stay editable. */
export async function rawCopy(key: string): Promise<Words> {
  const group = copyGroup(key);
  if (!group) return {};

  const db = getDb();
  if (!db) return copyDefaults(key);

  try {
    const snap = await db.collection("copy").doc(key).get();
    return snap.exists ? merge(group, snap.data()) : copyDefaults(key);
  } catch {
    return copyDefaults(key);
  }
}
