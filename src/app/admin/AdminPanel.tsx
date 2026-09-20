"use client";

import { useState } from "react";
import OverviewTab from "./OverviewTab";
import SettingsTab from "./SettingsTab";
import ContentTab from "./ContentTab";
import RecordsTab from "./RecordsTab";
import * as ui from "./adminUi";

type TabKey = "overview" | "settings" | "content" | "data";

const TABS: { key: TabKey; label: string; blurb: string }[] = [
  { key: "overview", label: "OVERVIEW", blurb: "How the fest is selling." },
  { key: "settings", label: "SETTINGS", blurb: "Prices, the date, the countdown and which pages are live." },
  { key: "content", label: "CONTENT", blurb: "Artists, photos, merch, stalls and the FAQ." },
  { key: "data", label: "SIGN-UPS", blurb: "Everyone who has bought, entered or registered." },
];

/**
 * The control room's four rooms. Everything below is a client component talking
 * to /api/admin/*, where the session cookie is checked again on every call.
 */
export default function AdminPanel({
  collections,
  pages,
  mediaReady,
}: {
  collections: { key: string; title: string }[];
  pages: { key: string; label: string }[];
  mediaReady: boolean;
}) {
  const [tab, setTab] = useState<TabKey>("overview");
  const current = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
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
      <p style={{ fontSize: 13, color: "var(--muted-lilac)", margin: "0 0 20px" }}>{current.blurb}</p>

      {tab === "overview" && <OverviewTab />}
      {tab === "settings" && <SettingsTab pages={pages} />}
      {tab === "content" && <ContentTab collections={collections} mediaReady={mediaReady} />}
      {tab === "data" && <RecordsTab />}
    </>
  );
}
