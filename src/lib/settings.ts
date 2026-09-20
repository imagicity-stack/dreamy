import { cache } from "react";
import { getDb } from "./firebaseAdmin";
import { DEFAULT_SETTINGS, normalizeSettings, type FestSettings } from "./festSettings";

/**
 * Reading and writing the live settings document. The shape, the defaults and
 * the date wording live in festSettings.ts and are re-exported from here, so
 * server code can go on importing all of it from one place.
 */

export * from "./festSettings";

export const SETTINGS_DOC = { collection: "settings", doc: "fest" } as const;

/**
 * Reads the live settings, once per request. Falls back to the seed values when
 * Firebase isn't configured or the document doesn't exist yet.
 */
export const getSettings = cache(async (): Promise<FestSettings> => {
  const db = getDb();
  if (!db) return DEFAULT_SETTINGS;

  try {
    const snap = await db.collection(SETTINGS_DOC.collection).doc(SETTINGS_DOC.doc).get();
    if (!snap.exists) return DEFAULT_SETTINGS;
    return normalizeSettings(snap.data());
  } catch {
    return DEFAULT_SETTINGS;
  }
});

/** Writes a validated, complete settings document and returns what was stored. */
export async function saveSettings(patch: unknown): Promise<FestSettings | null> {
  const db = getDb();
  if (!db) return null;

  // Read straight from Firestore rather than the request cache, so a save
  // always merges onto what is actually stored.
  const snap = await db.collection(SETTINGS_DOC.collection).doc(SETTINGS_DOC.doc).get();
  const current = normalizeSettings(snap.exists ? snap.data() : DEFAULT_SETTINGS);
  const merged = normalizeSettings({ ...current, ...((patch ?? {}) as Record<string, unknown>) });

  await db.collection(SETTINGS_DOC.collection).doc(SETTINGS_DOC.doc).set(merged, { merge: true });
  return merged;
}
