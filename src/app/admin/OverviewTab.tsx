"use client";

import { useEffect, useState } from "react";
import { formatInr } from "@/data/fest";
import { api, message } from "./api";
import Notice from "./Notice";
import * as ui from "./adminUi";

type Summary = {
  passOrders: number;
  passQty: number;
  passRevenue: number;
  cosplayEntries: number;
  cosplayRevenue: number;
  interestEntries: number;
  interestCounter: number;
  merchOrders: number;
  merchValue: number;
  concertCapacity: number;
};

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

  const tiles = [
    { label: "PASSES SOLD", value: summary.passQty.toLocaleString("en-IN"), note: `${summary.passOrders} orders` },
    { label: "PASS REVENUE", value: formatInr(summary.passRevenue), note: "verified payments only" },
    {
      label: "COSPLAY ENTRIES",
      value: summary.cosplayEntries.toLocaleString("en-IN"),
      note: formatInr(summary.cosplayRevenue) + " in fees",
    },
    {
      label: "CONCERT INTEREST",
      value: summary.interestCounter.toLocaleString("en-IN"),
      note: `${summary.interestEntries} signed up here`,
    },
    {
      label: "MERCH PRE-ORDERS",
      value: summary.merchOrders.toLocaleString("en-IN"),
      note: formatInr(summary.merchValue) + " of stock",
    },
    { label: "CONCERT CAPACITY", value: summary.concertCapacity.toLocaleString("en-IN"), note: "seats on the field" },
  ];

  return (
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
  );
}
