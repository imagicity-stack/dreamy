import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  addGateStaff,
  listGateStaff,
  removeGateStaff,
  resetGatePin,
  setGateStaffActive,
} from "@/lib/gateStaff";

export const dynamic = "force-dynamic";

/** The fest office's list of people who may work the gate. Admin only. */
export async function GET() {
  const check = await requireAdmin();
  if ("response" in check) return check.response;
  return NextResponse.json({ staff: await listGateStaff() });
}

export async function POST(req: NextRequest) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const body = await req.json().catch(() => null);
  const result = await addGateStaff({
    name: String(body?.name ?? ""),
    email: String(body?.email ?? ""),
    pin: String(body?.pin ?? ""),
    by: check.user.email,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

  return NextResponse.json({ staff: await listGateStaff() });
}

/** Changing a PIN, or switching somebody off for the day. */
export async function PATCH(req: NextRequest) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const body = await req.json().catch(() => null);
  const uid = String(body?.uid ?? "");
  if (!uid) return NextResponse.json({ error: "Which one?" }, { status: 400 });

  if (typeof body?.pin === "string") {
    const result = await resetGatePin(uid, body.pin);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  }

  if (typeof body?.active === "boolean") {
    const result = await setGateStaffActive(uid, body.active);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ staff: await listGateStaff() });
}

export async function DELETE(req: NextRequest) {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const uid = new URL(req.url).searchParams.get("uid") ?? "";
  if (!uid) return NextResponse.json({ error: "Which one?" }, { status: 400 });

  const result = await removeGateStaff(uid);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

  return NextResponse.json({ staff: await listGateStaff() });
}
