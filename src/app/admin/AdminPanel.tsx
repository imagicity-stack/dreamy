"use client";

import { useEffect, useMemo, useState } from "react";
import { formatInr } from "@/data/fest";
import type { FestSettings } from "@/lib/settings";
import { RECORD_VIEWS, toCsv, type RecordView, type Row } from "./records";
import * as ui from "./adminUi";

type MerchMeta = { id: string; name: string; note: string };
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

type Tab = "overview" | "prices" | RecordView["key"];

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "OVERVIEW" },
  { key: "prices", label: "PRICES & SWITCHES" },
  ...RECORD_VIEWS.map((v) => ({ key: v.key as Tab, label: v.title.toUpperCase() })),
];

/**
 * The session cookie rides along on every one of these calls and the server
 * re-checks it each time, so this file holds no tokens and no credentials.
 * The API returns loosely typed JSON; each caller narrows what it needs.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function api(url: string, init?: RequestInit): Promise<any> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
  return data;
}

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="mz-pop"
            style={{
              ...ui.quietButton,
              background: tab === t.key ? "var(--teal)" : "var(--lilac)",
              boxShadow: tab === t.key ? "3px 3px 0 var(--ink)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview />}
      {tab === "prices" && <Prices />}
      {RECORD_VIEWS.filter((v) => v.key === tab).map((view) => (
        <Records key={view.key} view={view} />
      ))}
    </>
  );
}

function Overview() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/summary")
      .then(setSummary)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the numbers"));
  }, []);

  if (error) return <Notice text={error} />;
  if (!summary) return <Notice text="Counting…" />;

  const tiles = [
    { label: "PASSES SOLD", value: summary.passQty.toLocaleString("en-IN"), note: `${summary.passOrders} orders` },
    { label: "PASS REVENUE", value: formatInr(summary.passRevenue), note: "verified payments only" },
    { label: "COSPLAY ENTRIES", value: summary.cosplayEntries.toLocaleString("en-IN"), note: formatInr(summary.cosplayRevenue) + " in fees" },
    { label: "CONCERT INTEREST", value: summary.interestCounter.toLocaleString("en-IN"), note: `${summary.interestEntries} signed up here` },
    { label: "MERCH PRE-ORDERS", value: summary.merchOrders.toLocaleString("en-IN"), note: formatInr(summary.merchValue) + " of stock" },
    { label: "CONCERT CAPACITY", value: summary.concertCapacity.toLocaleString("en-IN"), note: "seats on the field" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
      {tiles.map((t) => (
        <div key={t.label} style={ui.card}>
          <div style={ui.kicker}>{t.label}</div>
          <div className="font-display" style={{ fontSize: 34, lineHeight: 1.1, margin: "10px 0 6px" }}>{t.value}</div>
          <div style={{ fontSize: 13, color: "#5B4480" }}>{t.note}</div>
        </div>
      ))}
    </div>
  );
}

function Prices() {
  const [settings, setSettings] = useState<FestSettings | null>(null);
  const [merch, setMerch] = useState<MerchMeta[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/settings")
      .then((data) => {
        setSettings(data.settings);
        setMerch(data.merch ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the settings"));
  }, []);

  async function save() {
    if (!settings) return;
    setStatus("saving");
    setError("");
    try {
      const data = await api("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSettings(data.settings);
      setStatus("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
      setStatus("error");
    }
  }

  if (error && !settings) return <Notice text={error} />;
  if (!settings) return <Notice text="Loading the settings…" />;

  const num = (key: "fetePrice" | "cosplayFee" | "concertCapacity" | "interestBase", label: string, hint: string) => (
    <div key={key}>
      <label style={ui.label}>{label}</label>
      <input
        className="mz-input"
        type="number"
        min={0}
        value={settings[key]}
        onChange={(e) => {
          setStatus("idle");
          setSettings({ ...settings, [key]: Number(e.target.value) });
        }}
      />
      <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>{hint}</div>
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={ui.card}>
        <div style={ui.kicker}>THE NUMBERS</div>
        <h2 className="font-display" style={{ fontSize: 22, margin: "10px 0 18px" }}>PRICES & CAPACITY</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
          {num("fetePrice", "FETE PASS (₹)", "Charged per pass at checkout.")}
          {num("cosplayFee", "COSPLAY ENTRY (₹)", "Solo or squad, same fee.")}
          {num("concertCapacity", "CONCERT SEATS", "Shown wherever the cap is quoted.")}
          {num("interestBase", "INTEREST LIST START", "Queue numbers count up from here.")}
        </div>
      </div>

      <div style={ui.card}>
        <div style={ui.kicker}>THE SHOP</div>
        <h2 className="font-display" style={{ fontSize: 22, margin: "10px 0 18px" }}>MERCH PRICES</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
          {merch.map((item) => (
            <div key={item.id}>
              <label style={ui.label}>{item.name.toUpperCase()} (₹)</label>
              <input
                className="mz-input"
                type="number"
                min={0}
                value={settings.merchPrices[item.id] ?? 0}
                onChange={(e) => {
                  setStatus("idle");
                  setSettings({
                    ...settings,
                    merchPrices: { ...settings.merchPrices, [item.id]: Number(e.target.value) },
                  });
                }}
              />
              <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={ui.card}>
        <div style={ui.kicker}>THE SWITCHES</div>
        <h2 className="font-display" style={{ fontSize: 22, margin: "10px 0 18px" }}>WHAT THE SITE SAYS</h2>
        <div style={{ display: "grid", gap: 14 }}>
          <Toggle
            on={settings.soldOut}
            label="Fete passes sold out"
            hint="Closes checkout and swaps the buy button for a sold-out notice."
            onChange={(v) => {
              setStatus("idle");
              setSettings({ ...settings, soldOut: v });
            }}
          />
          <Toggle
            on={settings.lineupUnlocked}
            label="Lineup unlocked"
            hint="Opens all three clue cards without anyone having to tap them."
            onChange={(v) => {
              setStatus("idle");
              setSettings({ ...settings, lineupUnlocked: v });
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button className="font-display mz-pop" style={ui.primaryButton} onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "SAVING…" : "SAVE CHANGES"}
        </button>
        {status === "saved" && (
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--teal)" }}>
            Saved. The site is already using these.
          </span>
        )}
        {status === "error" && <span style={{ fontSize: 13.5, color: "var(--crimson)" }}>{error}</span>}
      </div>
    </div>
  );
}

function Toggle({
  on,
  label,
  hint,
  onChange,
}: {
  on: boolean;
  label: string;
  hint: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 20, height: 20, marginTop: 2, accentColor: "var(--purple)" }}
      />
      <span>
        <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>{label}</span>
        <span style={{ display: "block", fontSize: 13, color: "#5B4480", marginTop: 3 }}>{hint}</span>
      </span>
    </label>
  );
}

function Records({ view }: { view: RecordView }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setRows(null);
    setError("");
    api(`/api/admin/records/${view.key}?limit=500`)
      .then((data) => setRows(data.rows ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load these records"));
  }, [view.key]);

  const csvHref = useMemo(() => {
    if (!rows?.length) return null;
    return "data:text/csv;charset=utf-8," + encodeURIComponent(toCsv(view.columns, rows));
  }, [rows, view.columns]);

  if (error) return <Notice text={error} />;
  if (!rows) return <Notice text="Reading Firestore…" />;

  return (
    <div style={ui.card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <div style={ui.kicker}>{rows.length} RECORD{rows.length === 1 ? "" : "S"}</div>
          <h2 className="font-display" style={{ fontSize: 22, margin: "10px 0 4px" }}>{view.title.toUpperCase()}</h2>
          <p style={{ fontSize: 14, color: "#5B4480", margin: 0 }}>{view.blurb}</p>
        </div>
        {csvHref && (
          <a href={csvHref} download={`madooza-${view.key}.csv`} style={ui.quietButton}>
            DOWNLOAD CSV
          </a>
        )}
      </div>

      {rows.length === 0 ? (
        <p style={{ fontSize: 15, marginTop: 20 }}>Nothing here yet.</p>
      ) : (
        <div style={{ ...ui.tableWrap, marginTop: 18 }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {view.columns.map((c) => (
                  <th key={c.label} style={ui.th}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={String(row.id ?? i)}>
                  {view.columns.map((c) => (
                    <td key={c.label} style={ui.td}>{c.get(row)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div style={ui.card}>
      <p style={{ fontSize: 15, margin: 0 }}>{text}</p>
    </div>
  );
}
