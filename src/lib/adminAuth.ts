import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "./firebaseAdmin";

/**
 * Admin sign-in happens entirely on the server. The browser posts an email and
 * password to /api/admin/login, the server exchanges them for a Firebase ID
 * token, turns that into a session cookie with the Admin SDK, and sends it back
 * HttpOnly. No Firebase SDK, token or key ever runs in the browser.
 */

export const SESSION_COOKIE = "madooza_admin";

/** How long a sign-in lasts before the panel asks again. */
export const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

export type AdminUser = { uid: string; email: string };

/** Emails allowed into the panel, from ADMIN_EMAILS (comma separated). */
export function adminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Which server-side settings the panel still needs before it can work. */
export function missingAdminConfig(): string[] {
  const missing: string[] = [];
  if (!getAdminApp()) missing.push("FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY");
  if (!process.env.FIREBASE_API_KEY) missing.push("FIREBASE_API_KEY");
  if (adminAllowlist().length === 0) missing.push("ADMIN_EMAILS");
  return missing;
}

function isAdminClaim(claims: { admin?: unknown; email?: string; email_verified?: unknown }): boolean {
  if (claims.admin === true) return true;

  // The allowlist is a list of addresses, not of people. Anyone can register an
  // address they don't own, so the address only counts once Firebase has seen
  // the owner confirm it. A custom claim is granted deliberately and needs no
  // such proof.
  const email = (claims.email ?? "").toLowerCase();
  if (!email || claims.email_verified !== true) return false;
  return adminAllowlist().includes(email);
}

export type SignInResult =
  | { ok: true; user: AdminUser; cookie: string }
  | { ok: false; status: number; error: string };

/**
 * Verifies an email and password against Firebase Auth using the Identity
 * Toolkit REST API — the Admin SDK can mint tokens but cannot check a password
 * — then mints a session cookie for the accounts that are on the admin list.
 */
export async function signInAdmin(email: string, password: string): Promise<SignInResult> {
  const app = getAdminApp();
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!app || !apiKey) {
    return { ok: false, status: 503, error: "The server is not configured for admin sign-in yet" };
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const reason = String(data?.error?.message ?? "");
    if (reason.startsWith("TOO_MANY_ATTEMPTS")) {
      return { ok: false, status: 429, error: "Too many attempts. Wait a few minutes and try again." };
    }
    // Deliberately vague otherwise: don't confirm which half was wrong.
    return { ok: false, status: 401, error: "That email and password don't match an account." };
  }

  const idToken = String(data?.idToken ?? "");
  if (!idToken) {
    return { ok: false, status: 502, error: "Firebase did not return a token" };
  }

  const auth = getAuth(app);
  const decoded = await auth.verifyIdToken(idToken);
  if (!isAdminClaim(decoded)) {
    return { ok: false, status: 403, error: "This account is not on the admin list." };
  }

  const cookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
  return {
    ok: true,
    user: { uid: decoded.uid, email: (decoded.email ?? "").toLowerCase() },
    cookie,
  };
}

export type AdminGate =
  | { status: "not-configured"; missing: string[] }
  | { status: "signed-out" }
  | { status: "denied"; reason: string }
  | { status: "ok"; user: AdminUser };

/** The single place that decides whether the caller may see admin data. */
export async function adminGate(): Promise<AdminGate> {
  const missing = missingAdminConfig();
  if (missing.length > 0) return { status: "not-configured", missing };

  const app = getAdminApp()!;
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!session) return { status: "signed-out" };

  try {
    // checkRevoked: a disabled or signed-out account loses access immediately.
    const claims = await getAuth(app).verifySessionCookie(session, true);
    if (!isAdminClaim(claims)) {
      return { status: "denied", reason: "This account is no longer on the admin list." };
    }
    return { status: "ok", user: { uid: claims.uid, email: (claims.email ?? "").toLowerCase() } };
  } catch {
    return { status: "signed-out" };
  }
}

/** The API-route form of the gate: a user, or the response to return instead. */
export async function requireAdmin(): Promise<{ user: AdminUser } | { response: NextResponse }> {
  const gate = await adminGate();
  switch (gate.status) {
    case "ok":
      return { user: gate.user };
    case "not-configured":
      return {
        response: NextResponse.json(
          { error: `The server is missing ${gate.missing.join(", ")}` },
          { status: 503 },
        ),
      };
    case "denied":
      return { response: NextResponse.json({ error: gate.reason }, { status: 403 }) };
    default:
      return { response: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }
}

/** Cookie options shared by sign-in and sign-out. */
export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
