import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "./firebaseAdmin";

export type AdminUser = { uid: string; email: string };

/** Emails allowed into the panel, from ADMIN_EMAILS (comma separated). */
export function adminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

type AdminCheck = { user: AdminUser } | { response: NextResponse };

/**
 * Verifies the Firebase ID token on the request and confirms the account is an
 * admin — either by an `admin: true` custom claim or by the ADMIN_EMAILS
 * allowlist. This runs on the server for every admin call; the browser only
 * ever hides UI, it never grants access.
 */
export async function requireAdmin(req: Request): Promise<AdminCheck> {
  const app = getAdminApp();
  if (!app) {
    return {
      response: NextResponse.json({ error: "Firebase is not configured on the server" }, { status: 503 }),
    };
  }

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return { response: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }

  let decoded;
  try {
    // checkRevoked: a disabled or signed-out account loses access immediately.
    decoded = await getAuth(app).verifyIdToken(token, true);
  } catch {
    return { response: NextResponse.json({ error: "Session expired, sign in again" }, { status: 401 }) };
  }

  const email = (decoded.email ?? "").toLowerCase();
  const allowlist = adminAllowlist();
  const isAdmin = decoded.admin === true || (!!email && allowlist.includes(email));

  if (!isAdmin) {
    return {
      response: NextResponse.json(
        { error: "This account is not on the admin list" },
        { status: 403 },
      ),
    };
  }

  return { user: { uid: decoded.uid, email } };
}
