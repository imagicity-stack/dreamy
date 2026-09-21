import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb } from "@/lib/firebaseAdmin";
import { getCounters, liveUnits } from "@/lib/orders";
import { readInterest } from "@/lib/interest";
import { gateCounts } from "@/lib/tickets";
import { gatePinIsSet } from "@/lib/gateAuth";
import { webhookConfigured } from "@/lib/razorpay";
import { missingMailConfig } from "@/lib/mail";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

/**
 * Headline numbers for the panel's overview.
 *
 * Counts and money come from the counters the fulfilment transaction moves,
 * not from adding up documents: those are the same numbers capacity is
 * enforced against, so what the panel shows is what the checkout believes.
 * The collection sizes are still read, so a mismatch between the two is
 * visible rather than hidden.
 */
export async function GET() {
  const check = await requireAdmin();
  if ("response" in check) return check.response;

  const settings = await getSettings();
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Firestore is not configured" }, { status: 503 });
  }

  // Counted, not fetched: the overview should stay cheap however many passes
  // have been sold, and none of these numbers needs the documents themselves.
  const ORDER_STATUSES = ["created", "paid", "failed", "oversold", "refunded"] as const;

  const [counters, passes, cosplay, merch, interest, gate, gatePin, ...orderCounts] = await Promise.all([
    getCounters(),
    db.collection("passes").count().get(),
    db.collection("cosplayEntries").count().get(),
    db.collection("merchOrders").count().get(),
    readInterest(settings),
    gateCounts(),
    gatePinIsSet(),
    ...ORDER_STATUSES.map((status) => db.collection("orders").where("status", "==", status).count().get()),
  ]);

  const empty = { units: 0, orders: 0, refundedUnits: 0, lastSeq: 0, basePaise: 0, feePaise: 0, gstPaise: 0, feeGstPaise: 0, totalPaise: 0, refundedPaise: 0 };
  const fete = counters.fetePass ?? empty;
  const cos = counters.cosplayEntry ?? empty;
  const mer = counters.merch ?? empty;

  const sum = (key: "basePaise" | "feePaise" | "gstPaise" | "feeGstPaise" | "totalPaise" | "refundedPaise") =>
    fete[key] + cos[key] + mer[key];

  // Orders that never became passes, so the council can see what is stuck.
  const byStatus: Record<string, number> = {};
  let totalOrders = 0;
  ORDER_STATUSES.forEach((status, i) => {
    const count = orderCounts[i].data().count;
    totalOrders += count;
    if (count > 0) byStatus[status] = count;
  });

  return NextResponse.json({
    passOrders: fete.orders,
    passQty: liveUnits(fete),
    passRevenue: fete.totalPaise / 100,
    passCapacity: settings.fetePassCapacity,
    cosplayEntries: liveUnits(cos),
    cosplayRevenue: cos.totalPaise / 100,
    cosplayCapacity: settings.cosplayCapacity,
    merchOrders: mer.orders,
    merchItems: liveUnits(mer),
    merchValue: mer.totalPaise / 100,
    // Said as three numbers on purpose: what the site shows is the start the
    // council chose plus the people who actually signed up, and anyone reading
    // the panel should be able to see which is which.
    interestSignups: interest.signups,
    interestStart: interest.start,
    interestShown: interest.shown,
    concertCapacity: settings.concertCapacity,
    money: {
      basePaise: sum("basePaise"),
      feePaise: sum("feePaise"),
      gstPaise: sum("gstPaise"),
      feeGstPaise: sum("feeGstPaise"),
      totalPaise: sum("totalPaise"),
      refundedPaise: sum("refundedPaise"),
    },
    records: {
      passes: passes.data().count,
      cosplayEntries: cosplay.data().count,
      merchOrders: merch.data().count,
    },
    orders: { total: totalOrders, byStatus },
    gate: { ...gate, pinSet: gatePin },
    webhookConfigured: webhookConfigured(),
    mailMissing: missingMailConfig(),
  });
}
