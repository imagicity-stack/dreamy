import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { getSettings } from "@/lib/settings";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const contact = String(body?.contact ?? "").trim();
  const pick = String(body?.pick ?? "").trim();
  const guess = String(body?.guess ?? "").trim();
  const seats = String(body?.seats ?? "1");

  if (name.length < 2 || contact.length < 5 || pick.length < 2) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const settings = await getSettings();
  const db = getDb();
  let queueNumber = settings.interestBase + 1;

  if (db) {
    const counterRef = db.collection("counters").doc("concertInterest");
    queueNumber = await db.runTransaction(async (tx) => {
      const snap = await tx.get(counterRef);
      const current = snap.exists ? Number(snap.data()?.count ?? settings.interestBase) : settings.interestBase;
      const next = current + 1;
      tx.set(counterRef, { count: next }, { merge: true });
      return next;
    });

    await db.collection("concertInterest").add({
      queueNumber,
      name,
      contact,
      pick,
      guess: guess || "Kept to yourself",
      seats,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  return NextResponse.json({
    queueNumber: queueNumber.toLocaleString("en-IN"),
    persisted: !!db,
  });
}
