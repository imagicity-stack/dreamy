import { cache } from "react";
import { getDb } from "./firebaseAdmin";
import { FEST, merchItems, type MerchItem } from "@/data/fest";

/**
 * Everything the admin panel can change. The values in `src/data/fest.ts` are
 * only the seed: at runtime the site reads this document from Firestore, so a
 * price change in the panel takes effect without a deploy.
 */
export type FestSettings = {
  fetePrice: number;
  cosplayFee: number;
  concertCapacity: number;
  interestBase: number;
  lineupUnlocked: boolean;
  soldOut: boolean;
  merchPrices: Record<string, number>;
};

export const SETTINGS_DOC = { collection: "settings", doc: "fest" } as const;

export const DEFAULT_SETTINGS: FestSettings = {
  fetePrice: FEST.fetePrice,
  cosplayFee: FEST.cosplayFee,
  concertCapacity: FEST.concertCapacity,
  interestBase: FEST.interestBase,
  lineupUnlocked: FEST.lineupUnlocked,
  soldOut: FEST.soldOut,
  merchPrices: Object.fromEntries(merchItems.map((m) => [m.id, m.price])),
};

function asPrice(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const rounded = Math.round(n);
  if (rounded < 0 || rounded > 1_000_000) return fallback;
  return rounded;
}

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/** Coerces whatever is in Firestore into a complete, sane settings object. */
export function normalizeSettings(raw: unknown): FestSettings {
  const data = (raw ?? {}) as Record<string, unknown>;
  const rawMerch = (data.merchPrices ?? {}) as Record<string, unknown>;

  return {
    fetePrice: asPrice(data.fetePrice, DEFAULT_SETTINGS.fetePrice),
    cosplayFee: asPrice(data.cosplayFee, DEFAULT_SETTINGS.cosplayFee),
    concertCapacity: asPrice(data.concertCapacity, DEFAULT_SETTINGS.concertCapacity),
    interestBase: asPrice(data.interestBase, DEFAULT_SETTINGS.interestBase),
    lineupUnlocked: asBool(data.lineupUnlocked, DEFAULT_SETTINGS.lineupUnlocked),
    soldOut: asBool(data.soldOut, DEFAULT_SETTINGS.soldOut),
    // Only ids the catalogue actually has — an unknown key can't sneak a price in.
    merchPrices: Object.fromEntries(
      merchItems.map((m) => [m.id, asPrice(rawMerch[m.id], m.price)]),
    ),
  };
}

/**
 * Reads the live settings, once per request — the layout and the page both ask
 * for them. Falls back to the seed values when Firebase isn't configured or the
 * document doesn't exist yet, so the site still renders.
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
  const merged = normalizeSettings({
    ...current,
    ...((patch ?? {}) as Record<string, unknown>),
    merchPrices: {
      ...current.merchPrices,
      ...(((patch as Record<string, unknown>)?.merchPrices ?? {}) as Record<string, unknown>),
    },
  });

  await db.collection(SETTINGS_DOC.collection).doc(SETTINGS_DOC.doc).set(merged, { merge: true });
  return merged;
}

/** The merch catalogue with the live prices applied. */
export function merchWithPrices(settings: FestSettings): MerchItem[] {
  return merchItems.map((m) => ({ ...m, price: settings.merchPrices[m.id] ?? m.price }));
}
