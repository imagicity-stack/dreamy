import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { missingMailConfig } from "@/lib/mail";
import { sendTestEmail } from "@/lib/notify";

export const dynamic = "force-dynamic";

/**
 * "Does the mailbox actually work?" — the question worth answering before a
 * fest day rather than during one. Sends one real mail through the real
 * transport, and reports what came back.
 */
export async function POST(req: NextRequest) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const missing = missingMailConfig();
  if (missing.length) {
    return NextResponse.json(
      { error: `Mail is not configured yet — still waiting on ${missing.join(", ")}.` },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const to = typeof body?.to === "string" ? body.to : undefined;

  const result = await sendTestEmail(to);
  if (!result.sent) {
    return NextResponse.json({ error: result.error || result.skipped || "Could not send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
