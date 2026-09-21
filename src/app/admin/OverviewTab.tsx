"use client";

import { useEffect, useState } from "react";
import { formatInr } from "@/data/fest";
import { formatPaise } from "@/lib/pricing";
import { api, message } from "./api";
import Notice from "./Notice";
import * as ui from "./adminUi";

type Summary = {
  passOrders: number;
  passQty: number;
  passRevenue: number;
  passCapacity: number;
  cosplayEntries: number;
  cosplayRevenue: number;
  cosplayCapacity: number;
  interestEntries: number;
  interestCounter: number;
  merchOrders: number;
  merchItems: number;
  merchValue: number;
  concertCapacity: number;
  money: {
    basePaise: number;
    feePaise: number;
    gstPaise: number;
    feeGstPaise: number;
    totalPaise: number;
    refundedPaise: number;
  };
  records: { passes: number; cosplayEntries: number; merchOrders: number };
  orders: { total: number; byStatus: Record<string, number> };
  webhookConfigured: boolean;
  mailMissing: string[];
};

/** "142 of 500" when there is a cap, "no limit" when there isn't. */
function capacityNote(sold: number, capacity: number): string {
  if (capacity <= 0) return "no limit set";
  return `${Math.max(0, capacity - sold).toLocaleString("en-IN")} of ${capacity.toLocaleString("en-IN")} left`;
}

export default function OverviewTab() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/summary")
      .then(setSummary)
      .catch((e) => setError(message(e, "Could not load the numbers")));
  }, []);

  if (error) return <Notice text={error} />;
  if (!summary) return <Notice text="Counting…" />;

  const { money } = summary;

  const tiles = [
    {
      label: "PASSES SOLD",
      value: summary.passQty.toLocaleString("en-IN"),
      note: `${summary.passOrders} orders · ${capacityNote(summary.passQty, summary.passCapacity)}`,
    },
    { label: "PASS REVENUE", value: formatInr(summary.passRevenue), note: "captured payments only" },
    {
      label: "COSPLAY ENTRIES",
      value: summary.cosplayEntries.toLocaleString("en-IN"),
      note: `${formatInr(summary.cosplayRevenue)} in fees · ${capacityNote(summary.cosplayEntries, summary.cosplayCapacity)}`,
    },
    {
      label: "CONCERT INTEREST",
      value: summary.interestCounter.toLocaleString("en-IN"),
      note: `${summary.interestEntries} signed up here`,
    },
    {
      label: "MERCH SOLD",
      value: summary.merchItems.toLocaleString("en-IN"),
      note: `${summary.merchOrders} paid orders · ${formatInr(summary.merchValue)}`,
    },
    { label: "CONCERT CAPACITY", value: summary.concertCapacity.toLocaleString("en-IN"), note: "seats on the field" },
  ];

  // What was charged, split the way it has to be accounted for: the fest's own
  // money, the convenience fee, and the GST collected on that fee.
  const moneyRows = [
    { label: "TICKETS AND ITEMS", value: money.basePaise },
    { label: "GST ON TICKETS", value: money.gstPaise },
    { label: "CONVENIENCE FEES", value: money.feePaise },
    { label: "GST ON FEES", value: money.feeGstPaise },
    { label: "TAKEN THROUGH RAZORPAY", value: money.totalPaise, strong: true },
    ...(money.refundedPaise > 0 ? [{ label: "REFUNDED", value: -money.refundedPaise }] : []),
  ];

  const stuck = Object.entries(summary.orders.byStatus).filter(([status]) => status !== "paid");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {summary.mailMissing.length > 0 && (
        <Notice
          text={`No mail is being sent: ${summary.mailMissing.join(", ")} ${summary.mailMissing.length === 1 ? "is" : "are"} not set. Passes still sell and are still recorded — nobody is told about them by email.`}
        />
      )}

      {!summary.webhookConfigured && (
        <Notice text="RAZORPAY_WEBHOOK_SECRET is not set, so Razorpay cannot confirm payments to us. A buyer who loses their connection mid-payment will not get their pass until someone issues it by hand." />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
        {tiles.map((t) => (
          <div key={t.label} style={ui.card}>
            <div style={ui.kicker}>{t.label}</div>
            <div className="font-display" style={{ fontSize: 34, lineHeight: 1.1, margin: "10px 0 6px" }}>
              {t.value}
            </div>
            <div style={{ fontSize: 13, color: "#5B4480" }}>{t.note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div style={ui.card}>
          <div style={ui.kicker}>MONEY TAKEN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
            {moneyRows.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  paddingTop: row.strong ? 9 : 0,
                  borderTop: row.strong ? "1px dashed #C9B6E4" : undefined,
                  fontWeight: row.strong ? 700 : 400,
                }}
              >
                <span style={{ fontSize: 11, letterSpacing: "0.14em", color: "#5B4480" }}>{row.label}</span>
                <span style={{ fontSize: 14 }}>{formatPaise(row.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={ui.card}>
          <div style={ui.kicker}>CHECKOUTS</div>
          <div className="font-display" style={{ fontSize: 34, lineHeight: 1.1, margin: "10px 0 6px" }}>
            {(summary.orders.byStatus.paid ?? 0).toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 13, color: "#5B4480" }}>paid, of {summary.orders.total} started</div>
          {stuck.length > 0 && (
            <div style={{ fontSize: 12.5, color: "#5B4480", marginTop: 12, lineHeight: 1.7 }}>
              {/* Anything not "paid" is a checkout that needs a human: abandoned,
                  declined, or paid-but-sold-out and owed a refund. */}
              {stuck.map(([status, count]) => (
                <div key={status}>
                  <strong>{count}</strong> {status}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
