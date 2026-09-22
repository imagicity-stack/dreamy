import { getAuth } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminApp, getDb } from "./firebaseAdmin";

/**
 * Who is allowed to work the gate.
 *
 * The fest office keeps a list of people, by name and email, and gives each of
 * them a PIN. Creating one here creates a real Firebase Auth account, so the
 * list in the panel and the accounts in the Firebase console are the same
 * thing: disabling somebody in either place stops them scanning, and a session
 * already open on their phone dies at its next request.
 *
 * The PIN is the account's password. Firebase will not take a password under
 * six characters, so a gate PIN is six digits — which is also long enough that
 * guessing it at a gate is not worth anybody's afternoon.
 */

const STAFF = "gates";

export type GateStaff = {
  uid: string;
  email: string;
  name: string;
  active: boolean;
  createdAt: string | null;
  lastSignInAt: string | null;
  scans: number;
};

export type StaffResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

export function isValidPin(pin: string): boolean {
  return /^\d{6,8}$/.test(pin.trim());
}

function normalEmail(value: string): string {
  return value.trim().toLowerCase();
}

function asIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  const d = value as { toDate?: () => Date };
  return typeof d.toDate === "function" ? d.toDate().toISOString() : null;
}

/** Everybody on the list, newest first. */
export async function listGateStaff(): Promise<GateStaff[]> {
  const db = getDb();
  if (!db) return [];

  const snap = await db.collection(STAFF).get();
  return snap.docs
    .map((doc) => {
      const d = doc.data();
      return {
        uid: doc.id,
        email: String(d.email ?? ""),
        name: String(d.name ?? ""),
        active: d.active !== false,
        createdAt: asIso(d.createdAt),
        lastSignInAt: asIso(d.lastSignInAt),
        scans: Number(d.scans ?? 0),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Adds somebody, or re-points an existing account at this fest.
 *
 * An address that already has a Firebase account — a teacher who is also an
 * admin, say — is reused rather than refused, and its password is set to the
 * new PIN. The alternative is an error message nobody at a fest office can act
 * on.
 */
export async function addGateStaff(args: {
  name: string;
  email: string;
  pin: string;
  by: string;
}): Promise<StaffResult<GateStaff>> {
  const app = getAdminApp();
  const db = getDb();
  if (!app || !db) return { ok: false, status: 503, error: "Firebase is not configured" };

  const name = args.name.trim().slice(0, 60);
  const email = normalEmail(args.email);
  const pin = args.pin.trim();

  if (name.length < 2) return { ok: false, status: 400, error: "Give them a name." };
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
    return { ok: false, status: 400, error: "That email address doesn't look right." };
  }
  if (!isValidPin(pin)) {
    return { ok: false, status: 400, error: "The PIN must be 6 to 8 digits." };
  }

  const auth = getAuth(app);
  let uid: string;

  try {
    const existing = await auth.getUserByEmail(email).catch(() => null);
    if (existing) {
      uid = existing.uid;
      await auth.updateUser(uid, { password: pin, displayName: name, disabled: false });
    } else {
      const created = await auth.createUser({ email, password: pin, displayName: name });
      uid = created.uid;
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not create the account";
    return { ok: false, status: 400, error: message };
  }

  await db.collection(STAFF).doc(uid).set(
    {
      email,
      name,
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      createdBy: args.by,
    },
    { merge: true },
  );

  return {
    ok: true,
    value: { uid, email, name, active: true, createdAt: null, lastSignInAt: null, scans: 0 },
  };
}

/** Changes somebody's PIN without disturbing anything else about them. */
export async function resetGatePin(uid: string, pin: string): Promise<StaffResult<true>> {
  const app = getAdminApp();
  if (!app) return { ok: false, status: 503, error: "Firebase is not configured" };
  if (!isValidPin(pin)) return { ok: false, status: 400, error: "The PIN must be 6 to 8 digits." };

  try {
    await getAuth(app).updateUser(uid, { password: pin });
    return { ok: true, value: true };
  } catch {
    return { ok: false, status: 400, error: "Could not change that PIN" };
  }
}

/**
 * Turns somebody off, or back on.
 *
 * The Firebase account is disabled too, not just the row here, so a phone that
 * is already signed in loses access at its next request rather than at the end
 * of the day.
 */
export async function setGateStaffActive(uid: string, active: boolean): Promise<StaffResult<true>> {
  const app = getAdminApp();
  const db = getDb();
  if (!app || !db) return { ok: false, status: 503, error: "Firebase is not configured" };

  try {
    await getAuth(app).updateUser(uid, { disabled: !active });
    if (!active) await getAuth(app).revokeRefreshTokens(uid);
    await db.collection(STAFF).doc(uid).set({ active }, { merge: true });
    return { ok: true, value: true };
  } catch {
    return { ok: false, status: 400, error: "Could not change that account" };
  }
}

/**
 * Takes somebody off the gate list.
 *
 * The Firebase account is disabled rather than deleted: the address may belong
 * to a teacher who is also an admin, and a fest office removing a volunteer
 * from a gate should not be able to delete somebody's login by accident.
 */
export async function removeGateStaff(uid: string): Promise<StaffResult<true>> {
  const app = getAdminApp();
  const db = getDb();
  if (!app || !db) return { ok: false, status: 503, error: "Firebase is not configured" };

  try {
    await getAuth(app).updateUser(uid, { disabled: true });
    await getAuth(app).revokeRefreshTokens(uid);
  } catch {
    // The account may already be gone; the list entry still has to go.
  }
  await db.collection(STAFF).doc(uid).delete();
  return { ok: true, value: true };
}

/** True when this uid is on the list and switched on. */
export async function gateStaffMember(uid: string): Promise<GateStaff | null> {
  const db = getDb();
  if (!db) return null;

  const snap = await db.collection(STAFF).doc(uid).get();
  if (!snap.exists) return null;

  const d = snap.data()!;
  if (d.active === false) return null;

  return {
    uid,
    email: String(d.email ?? ""),
    name: String(d.name ?? ""),
    active: true,
    createdAt: asIso(d.createdAt),
    lastSignInAt: asIso(d.lastSignInAt),
    scans: Number(d.scans ?? 0),
  };
}

/** Records that somebody signed in, and counts what they scan. */
export async function noteGateSignIn(uid: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.collection(STAFF).doc(uid).set({ lastSignInAt: FieldValue.serverTimestamp() }, { merge: true });
}

export async function countScan(uid: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.collection(STAFF).doc(uid).set({ scans: FieldValue.increment(1) }, { merge: true });
  } catch {
    // A missed tally is not worth failing a check-in over.
  }
}

/** Whether anybody can work the gate yet, for the panel's warnings. */
export async function gateStaffCount(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const snap = await db.collection(STAFF).where("active", "==", true).count().get();
  return snap.data().count;
}
