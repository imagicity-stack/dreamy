import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  const db = getDb();
  let interestCount = settings.interestBase;

  if (db) {
    const snap = await db.collection("counters").doc("concertInterest").get();
    interestCount = snap.exists ? Number(snap.data()?.count ?? settings.interestBase) : settings.interestBase;
  }

  return NextResponse.json({ interestCount: interestCount.toLocaleString("en-IN") });
}
