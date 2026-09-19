import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { FEST } from "@/data/fest";

export async function GET() {
  const db = getDb();
  let interestCount = FEST.interestBase;

  if (db) {
    const snap = await db.collection("counters").doc("concertInterest").get();
    interestCount = snap.exists ? Number(snap.data()?.count ?? FEST.interestBase) : FEST.interestBase;
  }

  return NextResponse.json({ interestCount: interestCount.toLocaleString("en-IN") });
}
