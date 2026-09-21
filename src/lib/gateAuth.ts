import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "./firebaseAdmin";

/**
 * Who is allowed to admit people.
 *
 * The gate is worked by volunteers on their own phones, so this is a PIN rather
 * than an account each: something a teacher can read out on the morning and
 * change if a phone goes missing. It buys the one property that matters —
 * somebody who finds the /gate URL cannot burn a day's tickets with it.
 *
 * The PIN is never stored, only its hash with a per-fest salt, and it is kept
 * out of the settings document on purpose: that object is handed to client
 * components on every page, and a PIN that ships to the browser is not a PIN.
 */

const GATE_DOC = { collection: "settings", doc: "gate" } as const;
const COOKIE = "mz_gate";
/** A fest is one day; a shift is not. */
const SESSION_HOURS = 16;

type GateConfig = {
  pinHash: string;
  salt: string;
  /** Signs session cookies. Rotating it signs every phone out. */
  sessionSecret: string;
};

function hashPin(pin: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${pin}`).digest("hex");
}

async function readConfig(): Promise<GateConfig | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const snap = await db.collection(GATE_DOC.collection).doc(GATE_DOC.doc).get();
    if (!snap.exists) return null;
    const data = snap.data() as Partial<GateConfig>;
    if (!data?.pinHash || !data.salt || !data.sessionSecret) return null;
    return { pinHash: data.pinHash, salt: data.salt, sessionSecret: data.sessionSecret };
  } catch {
    return null;
  }
}

/** True once a PIN has been set, so the panel can say when it hasn't. */
export async function gatePinIsSet(): Promise<boolean> {
  return (await readConfig()) !== null;
}

/**
 * Sets the gate PIN. A new session secret is minted each time, so changing the
 * PIN signs out every phone that was using the old one — which is the point of
 * changing it.
 */
export async function setGatePin(pin: string): Promise<{ ok: true } | { error: string }> {
  const db = getDb();
  if (!db) return { error: "Firestore is not configured" };

  const clean = pin.trim();
  if (!/^\d{4,8}$/.test(clean)) return { error: "The PIN must be 4 to 8 digits." };

  const salt = randomBytes(16).toString("hex");
  await db.collection(GATE_DOC.collection).doc(GATE_DOC.doc).set(
    {
      pinHash: hashPin(clean, salt),
      salt,
      sessionSecret: randomBytes(32).toString("hex"),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  return { ok: true };
}

function sign(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

/**
 * Checks the PIN and returns a signed session value.
 *
 * The cookie carries who is on the gate and when it expires, signed — so it can
 * be read back without a database round trip on every scan, and cannot be
 * edited into a longer session or a different name.
 */
export async function openGateSession(
  pin: string,
  volunteer: string,
): Promise<{ value: string; maxAge: number } | { error: string }> {
  const config = await readConfig();
  if (!config) return { error: "No gate PIN has been set yet. Ask the fest office." };

  if (!safeEqual(hashPin(pin.trim(), config.salt), config.pinHash)) {
    return { error: "That PIN is not right." };
  }

  const name = volunteer.trim().slice(0, 40) || "Gate";
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const payload = `${encodeURIComponent(name)}.${expires}`;

  return {
    value: `${payload}.${sign(config.sessionSecret, payload)}`,
    maxAge: SESSION_HOURS * 3600,
  };
}

export type GateSession = { volunteer: string };

/** Reads the cookie, or null when there isn't a valid one. */
export async function readGateSession(): Promise<GateSession | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;

  const [name, expiresRaw, signature] = raw.split(".");
  if (!name || !expiresRaw || !signature) return null;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return null;

  const config = await readConfig();
  if (!config) return null;

  if (!safeEqual(sign(config.sessionSecret, `${name}.${expiresRaw}`), signature)) return null;

  return { volunteer: decodeURIComponent(name) };
}

export const GATE_COOKIE = COOKIE;
