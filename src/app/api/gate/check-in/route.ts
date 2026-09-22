import { NextRequest, NextResponse } from "next/server";
import { readGateSession } from "@/lib/gateAuth";
import { checkIn } from "@/lib/tickets";
import { countScan } from "@/lib/gateStaff";

export const dynamic = "force-dynamic";

/**
 * One scan, one answer. The volunteer's name comes from their signed session,
 * never from the request, so the scan log cannot be written in someone else's
 * name.
 */
export async function POST(req: NextRequest) {
  const session = await readGateSession();
  if (!session) return NextResponse.json({ error: "Sign in again" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const token = String(body?.token ?? "").trim();
  if (!token) return NextResponse.json({ error: "Nothing scanned" }, { status: 400 });

  // A scan of a full ticket URL is the ordinary case: a camera app reads the
  // whole link. Take the last path segment and treat everything else the same.
  const value = token.includes("/t/") ? token.split("/t/").pop()!.split(/[?#]/)[0] : token;

  const result = await checkIn(value, session.volunteer);
  // Counted per person, so the panel can show who worked which gate.
  if (result.result === "admitted") await countScan(session.uid);
  return NextResponse.json(result);
}
