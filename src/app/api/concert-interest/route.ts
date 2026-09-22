import { after, NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { addInterestSignup } from "@/lib/interest";
import { notifyConcertInterest } from "@/lib/notify";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const pick = String(body?.pick ?? "").trim();
  const guess = String(body?.guess ?? "").trim();
  const seats = String(body?.seats ?? "1");

  // Both, not either: the reveal goes out by mail and the 48-hour window on the
  // seats is worth a text, and a list the fest cannot reach twice is not a list.
  if (
    name.length < 2 ||
    phone.replace(/\D/g, "").length < 10 ||
    !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email) ||
    pick.length < 2
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const settings = await getSettings();
  const entry = { name, phone, email, pick, guess: guess || "Kept to yourself", seats };

  // The queue number is the council's starting number plus the number of real
  // signups — worked out in one place, in interest.ts.
  const { queueNumber, persisted } = await addInterestSignup(settings, entry);

  // The council reads every one of these, so every one of them gets mailed
  // over — after the response, so the page answers at once.
  after(() => notifyConcertInterest({ queueNumber, ...entry }));

  return NextResponse.json({
    queueNumber: queueNumber.toLocaleString("en-IN"),
    persisted,
  });
}
