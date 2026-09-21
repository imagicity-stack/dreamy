"use client";

import { useCallback, useEffect, useState } from "react";
import type { CopyGroup } from "@/lib/copyText";
import { api, message } from "./api";
import Notice from "./Notice";
import * as ui from "./adminUi";

/**
 * The site's writing, a page at a time. Every slot is described on the server,
 * so a new piece of editable copy needs no new UI here.
 */
export default function WordsTab({ groups }: { groups: { key: string; title: string }[] }) {
  const [active, setActive] = useState(groups[0]?.key ?? "");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {groups.map((g) => (
          <button
            key={g.key}
            onClick={() => setActive(g.key)}
            style={{
              ...ui.quietButton,
              fontSize: 11,
              background: active === g.key ? "var(--purple)" : "var(--paper)",
              color: active === g.key ? "var(--paper)" : "var(--ink)",
            }}
          >
            {g.title.toUpperCase()}
          </button>
        ))}
      </div>
      {active && <GroupEditor key={active} groupKey={active} />}
    </div>
  );
}

function GroupEditor({ groupKey }: { groupKey: string }) {
  const [def, setDef] = useState<CopyGroup | null>(null);
  const [words, setWords] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api(`/api/admin/copy/${groupKey}`);
      setDef(data.def);
      setWords(data.words ?? {});
      setError("");
    } catch (e) {
      setError(message(e, "Could not load this page's words"));
    }
  }, [groupKey]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    setStatus("saving");
    setError("");
    try {
      const data = await api(`/api/admin/copy/${groupKey}`, {
        method: "PUT",
        body: JSON.stringify({ words }),
      });
      setWords(data.words ?? words);
      setStatus("saved");
    } catch (e) {
      setError(message(e, "Could not save"));
      setStatus("error");
    }
  }

  if (error && !def) return <Notice text={error} />;
  if (!def) return <Notice text="Loading…" />;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={ui.card}>
        <div style={ui.kicker}>{def.slots.length} PIECES OF TEXT</div>
        <h2 className="font-display" style={{ fontSize: 22, margin: "10px 0 4px" }}>{def.title.toUpperCase()}</h2>
        <p style={{ fontSize: 14, color: "#5B4480", margin: "0 0 4px" }}>{def.blurb}</p>
        <p style={{ fontSize: 13, color: "#5B4480", margin: 0 }}>
          Write <code>{"{fete}"}</code>, <code>{"{cosplay}"}</code> or <code>{"{seats}"}</code> anywhere and the live
          price or capacity is filled in as the page is read.
        </p>

        <div style={{ display: "grid", gap: 18, marginTop: 22 }}>
          {def.slots.map((slot) => (
            <div key={slot.key}>
              <label style={ui.label}>{slot.label.toUpperCase()}</label>
              {slot.type === "longtext" ? (
                <textarea
                  className="mz-input"
                  rows={3}
                  value={words[slot.key] ?? ""}
                  onChange={(e) => {
                    setStatus("idle");
                    setWords((cur) => ({ ...cur, [slot.key]: e.target.value }));
                  }}
                  style={{ resize: "vertical" }}
                />
              ) : (
                <input
                  className="mz-input"
                  value={words[slot.key] ?? ""}
                  onChange={(e) => {
                    setStatus("idle");
                    setWords((cur) => ({ ...cur, [slot.key]: e.target.value }));
                  }}
                />
              )}
              {slot.hint && <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>{slot.hint}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button className="font-display mz-pop" style={ui.primaryButton} onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "SAVING…" : "SAVE THE WORDS"}
        </button>
        {status === "saved" && (
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--teal)" }}>
            Saved. The page is already using these.
          </span>
        )}
        {status === "error" && <span style={{ fontSize: 13.5, color: "var(--crimson)" }}>{error}</span>}
      </div>
    </div>
  );
}
