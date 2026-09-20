"use client";

import { useEffect, useMemo, useState } from "react";
import { RECORD_VIEWS, toCsv, type RecordView, type Row } from "./records";
import { api, message } from "./api";
import Notice from "./Notice";
import * as ui from "./adminUi";

/** The read-only side: what people have bought, entered and signed up for. */
export default function RecordsTab() {
  const [active, setActive] = useState<RecordView["key"]>(RECORD_VIEWS[0].key);
  const view = RECORD_VIEWS.find((v) => v.key === active) ?? RECORD_VIEWS[0];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {RECORD_VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setActive(v.key)}
            style={{
              ...ui.quietButton,
              fontSize: 11,
              background: active === v.key ? "var(--purple)" : "var(--paper)",
              color: active === v.key ? "var(--paper)" : "var(--ink)",
            }}
          >
            {v.title.toUpperCase()}
          </button>
        ))}
      </div>
      <Records key={view.key} view={view} />
    </div>
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
      .catch((e) => setError(message(e, "Could not load these records")));
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
