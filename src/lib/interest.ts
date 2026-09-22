import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "./firebaseAdmin";
import type { FestSettings } from "./festSettings";

/**
 * The number on the concert page — "X have already put their name down".
 *
 * It is two things added together, and both halves are deliberate:
 *
 *   start    a number the council sets in the panel. A list that opens at zero
 *            looks like a list nobody wants to be on, so the fest starts its
 *            count somewhere. This is a presentation choice, not a count of
 *            anybody, and the panel says so plainly.
 *   signups  every real person who has filled in the form. Only ever counted
 *            up, never set by hand.
 *
 * The sum is worked out on every read rather than stored. That is the whole
 * point of this file: the old version added the start to the counter once, on
 * the first signup, and from then on the setting did nothing — a council that
 * changed it saw no change and had no way to tell why. Now the start is live,
 * and moving it shifts the public number immediately without touching the
 * record of who actually signed up.
 */

const COUNTER = { collection: "counters", doc: "concertInterest" } as const;
const ENTRIES = "concertInterest";

export type InterestCount = {
  /** Real people who used the form. */
  signups: number;
  /** Where the council chose to start counting. */
  start: number;
  /** What the site shows: the two added together. */
  shown: number;
};

function asCount(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

/**
 * How many real signups there are. Reads the counter, and falls back to
 * counting the documents when the counter has not been written in this shape
 * yet — which also repairs a counter left over from the version that stored
 * start and signups added together.
 */
async function readSignups(): Promise<number> {
  const db = getDb();
  if (!db) return 0;

  try {
    const snap = await db.collection(COUNTER.collection).doc(COUNTER.doc).get();
    const stored = snap.exists ? asCount(snap.data()?.signups) : null;
    if (stored !== null) return stored;

    // No `signups` field: count the entries themselves. Accurate, and it costs
    // one aggregate query on the first read after the upgrade.
    const count = await db.collection(ENTRIES).count().get();
    return count.data().count;
  } catch {
    return 0;
  }
}

/** The three numbers, for the public page and for the panel. */
export async function readInterest(settings: FestSettings): Promise<InterestCount> {
  const signups = await readSignups();
  const start = Math.max(0, Math.floor(settings.interestBase));
  return { signups, start, shown: start + signups };
}

/**
 * Records one signup and returns the queue number to show them.
 *
 * The counter moves inside a transaction so two people pressing at once get
 * two different numbers; the start is added afterwards, outside the stored
 * value, so it stays a setting rather than becoming part of the tally.
 */
export async function addInterestSignup(
  settings: FestSettings,
  entry: {
    name: string;
    phone: string;
    email: string;
    pick: string;
    guess: string;
    seats: string;
  },
): Promise<{ queueNumber: number; signups: number; persisted: boolean }> {
  const start = Math.max(0, Math.floor(settings.interestBase));
  const db = getDb();
  if (!db) {
    // Nothing to write to: give them the next number as it would have been.
    return { queueNumber: start + 1, signups: 1, persisted: false };
  }

  // Read outside the transaction so the repair path above has its fallback
  // ready; the transaction then re-reads and wins any race.
  const fallback = await readSignups();
  const counterRef = db.collection(COUNTER.collection).doc(COUNTER.doc);

  const signups = await db.runTransaction(async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists ? asCount(snap.data()?.signups) : null;
    const next = (current ?? fallback) + 1;
    tx.set(counterRef, { signups: next, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return next;
  });

  const queueNumber = start + signups;

  await db.collection(ENTRIES).add({
    queueNumber,
    signupNumber: signups,
    name: entry.name,
    phone: entry.phone,
    email: entry.email,
    pick: entry.pick,
    guess: entry.guess,
    seats: entry.seats,
    createdAt: FieldValue.serverTimestamp(),
  });

  return { queueNumber, signups, persisted: true };
}
