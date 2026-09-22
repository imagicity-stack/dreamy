import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "./firebaseAdmin";
import { gateStaffMember, noteGateSignIn, type GateStaff } from "./gateStaff";

/**
 * Signing in to work the gate.
 *
 * It used to be one shared PIN for everybody, which meant the scan log could
 * only record whatever name a volunteer typed into a box. Now each person has
 * their own account: the fest office adds them by email and gives them a PIN,
 * and the sign-in is checked against Firebase Auth the same way the admin
 * panel's is — the Admin SDK can mint tokens but cannot verify a password, so
 * the password goes to the Identity Toolkit and comes back as a token we turn
 * into a session cookie.
 *
 * The cookie is Firebase's own and is verified with checkRevoked on every
 * request, so taking somebody off the list, disabling them, or changing their
 * PIN ends their session at once rather than at the end of the day.
 */

const COOKIE = "mz_gate";
/** A fest is one day; a shift is not. */
const SESSION_MS = 16 * 60 * 60 * 1000;

export type GateSession = { uid: string; volunteer: string; email: string };

export type GateSignIn =
  | { ok: true; cookie: string; maxAge: number; session: GateSession }
  | { ok: false; status: number; error: string };

/** Checks an email and PIN, and returns the cookie that lets them scan. */
export async function signInGate(email: string, pin: string): Promise<GateSignIn> {
  const app = getAdminApp();
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!app || !apiKey) {
    return { ok: false, status: 503, error: "The gate is not set up yet. Ask the fest office." };
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password: pin.trim(), returnSecureToken: true }),
    },
  );
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const reason = String(data?.error?.message ?? "");
    if (reason.startsWith("TOO_MANY_ATTEMPTS")) {
      return { ok: false, status: 429, error: "Too many tries. Wait a few minutes." };
    }
    if (reason.startsWith("USER_DISABLED")) {
      return { ok: false, status: 403, error: "That account has been switched off. Ask the fest office." };
    }
    // Deliberately vague: never confirm which half was wrong.
    return { ok: false, status: 401, error: "That email and PIN don't match." };
  }

  const idToken = String(data?.idToken ?? "");
  if (!idToken) return { ok: false, status: 502, error: "Firebase did not return a token" };

  const auth = getAuth(app);
  const decoded = await auth.verifyIdToken(idToken);

  // Being able to sign in is not the same as being on the gate list: an admin's
  // own account must not become a scanner just because it exists.
  const staff = await gateStaffMember(decoded.uid);
  if (!staff) {
    return { ok: false, status: 403, error: "This account is not on the gate list." };
  }

  const cookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MS });
  await noteGateSignIn(decoded.uid);

  return {
    ok: true,
    cookie,
    maxAge: SESSION_MS / 1000,
    session: { uid: staff.uid, volunteer: staff.name, email: staff.email },
  };
}

/**
 * Who is scanning, or null. Read on every gate request, so a volunteer removed
 * from the list mid-shift stops being able to admit people immediately.
 */
export async function readGateSession(): Promise<GateSession | null> {
  const app = getAdminApp();
  const value = (await cookies()).get(COOKIE)?.value;
  if (!app || !value) return null;

  try {
    const claims = await getAuth(app).verifySessionCookie(value, true);
    const staff = await gateStaffMember(claims.uid);
    if (!staff) return null;
    return { uid: staff.uid, volunteer: staff.name, email: staff.email };
  } catch {
    return null;
  }
}

/** What the panel and the sign-in screen need to know before anybody tries. */
export async function gateReady(): Promise<boolean> {
  return !!getAdminApp() && !!process.env.FIREBASE_API_KEY;
}

export const GATE_COOKIE = COOKIE;
export type { GateStaff };
