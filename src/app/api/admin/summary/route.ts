import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb } from "@/lib/firebaseAdmin";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** Headline numbers for the panel's overview: counts, seats and money taken. */
export async function GET() {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const settings = await getSettings();
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Firestore is not configured" }, { status: 503 });
  }

  const [passes, cosplay, interest, merch, counter] = await Promise.all([
    db.collection("passes").get(),
    db.collection("cosplayEntries").get(),
    db.collection("concertInterest").get(),
    db.collection("merchOrders").get(),
    db.collection("counters").doc("concertInterest").get(),
  ]);

  const passQty = passes.docs.reduce((sum, d) => sum + Number(d.data().qty ?? 0), 0);
  const passRevenue = passes.docs.reduce((sum, d) => sum + Number(d.data().total ?? 0), 0);
  const cosplayRevenue = cosplay.docs.reduce((sum, d) => sum + Number(d.data().fee ?? 0), 0);
  const merchValue = merch.docs.reduce((sum, d) => sum + Number(d.data().total ?? 0), 0);

  return NextResponse.json({
    passOrders: passes.size,
    passQty,
    passRevenue,
    cosplayEntries: cosplay.size,
    cosplayRevenue,
    interestEntries: interest.size,
    interestCounter: counter.exists
      ? Number(counter.data()?.count ?? settings.interestBase)
      : settings.interestBase,
    merchOrders: merch.size,
    merchValue,
    concertCapacity: settings.concertCapacity,
  });
}
