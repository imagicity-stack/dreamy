"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { ContentCollectionDef, ContentField, ContentRecord } from "@/lib/content";
import { api, message, upload } from "./api";
import Notice from "./Notice";
import * as ui from "./adminUi";

/**
 * One editor for every content list. The fields come from the collection's own
 * description on the server, so a new editable list needs no new UI here.
 */
export default function ContentTab({
  collections,
  mediaReady,
}: {
  collections: { key: string; title: string }[];
  mediaReady: boolean;
}) {
  const [active, setActive] = useState(collections[0]?.key ?? "");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {!mediaReady && (
        <div style={{ ...ui.card, background: "var(--lilac)" }}>
          <div style={ui.kicker}>PHOTOS ARE OFF</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: "10px 0 0" }}>
            Set <code>FIREBASE_STORAGE_BUCKET</code> in the deployment for uploads to work. Everything else on this
            tab saves fine without it.
          </p>
        </div>
      )}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {collections.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            style={{
              ...ui.quietButton,
              fontSize: 11,
              background: active === c.key ? "var(--purple)" : "var(--paper)",
              color: active === c.key ? "var(--paper)" : "var(--ink)",
            }}
          >
            {c.title.toUpperCase()}
          </button>
        ))}
      </div>
      {active && <CollectionEditor key={active} collectionKey={active} />}
    </div>
  );
}

function CollectionEditor({ collectionKey }: { collectionKey: string }) {
  const [def, setDef] = useState<ContentCollectionDef | null>(null);
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api(`/api/admin/content/${collectionKey}`);
      setDef(data.def);
      setRecords(data.records ?? []);
      setSaved(!!data.saved);
      setError("");
    } catch (e) {
      setError(message(e, "Could not load this list"));
    }
  }, [collectionKey]);

  useEffect(() => {
    load();
  }, [load]);

  async function run(fn: () => Promise<unknown>): Promise<boolean> {
    setBusy(true);
    setError("");
    try {
      await fn();
      await load();
      return true;
    } catch (e) {
      setError(message(e, "That didn't work"));
      return false;
    } finally {
      setBusy(false);
    }
  }

  const move = (index: number, delta: number) => {
    const next = [...records];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    run(() =>
      api(`/api/admin/content/${collectionKey}`, {
        method: "PATCH",
        body: JSON.stringify({ order: next.map((r) => r.id) }),
      }),
    );
  };

  if (error && !def) return <Notice text={error} />;
  if (!def) return <Notice text="Loading…" />;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={ui.card}>
        <div style={ui.kicker}>{records.length} {def.itemNoun.toUpperCase()}{records.length === 1 ? "" : "S"}</div>
        <h2 className="font-display" style={{ fontSize: 22, margin: "10px 0 6px" }}>{def.title.toUpperCase()}</h2>
        <p style={{ fontSize: 14, color: "#5B4480", margin: 0 }}>{def.blurb}</p>

        {!saved && (
          <div
            style={{
              marginTop: 16,
              background: "var(--lilac)",
              border: "2px solid var(--ink)",
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              gap: 14,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1.5, flex: 1, minWidth: 220 }}>
              These are the values the site ships with. Copy them in to start editing them.
            </span>
            <button
              className="font-display mz-pop"
              style={ui.primaryButton}
              disabled={busy}
              onClick={() =>
                run(() =>
                  api(`/api/admin/content/${collectionKey}`, {
                    method: "POST",
                    body: JSON.stringify({ action: "seed" }),
                  }),
                )
              }
            >
              {busy ? "COPYING…" : "MAKE EDITABLE"}
            </button>
          </div>
        )}
        {error && <div style={{ fontSize: 13.5, color: "var(--crimson)", marginTop: 12 }}>{error}</div>}
      </div>

      {records.map((record, i) => (
        <RecordCard
          key={record.id}
          def={def}
          record={record}
          index={i}
          total={records.length}
          editable={saved}
          open={editing === record.id}
          busy={busy}
          onToggle={() => setEditing(editing === record.id ? null : record.id)}
          onMove={(delta) => move(i, delta)}
          onSave={(values) =>
            run(async () => {
              await api(`/api/admin/content/${collectionKey}/${record.id}`, {
                method: "PUT",
                body: JSON.stringify({ record: { ...values, order: record.order } }),
              });
              setEditing(null);
            })
          }
          onDelete={() =>
            run(() => api(`/api/admin/content/${collectionKey}/${record.id}`, { method: "DELETE" }))
          }
        />
      ))}

      {saved && (
        <NewRecord
          def={def}
          busy={busy}
          onCreate={(values) =>
            run(() =>
              api(`/api/admin/content/${collectionKey}`, {
                method: "POST",
                body: JSON.stringify({ record: values }),
              }),
            )
          }
        />
      )}
    </div>
  );
}

function RecordCard({
  def,
  record,
  index,
  total,
  editable,
  open,
  busy,
  onToggle,
  onMove,
  onSave,
  onDelete,
}: {
  def: ContentCollectionDef;
  record: ContentRecord;
  index: number;
  total: number;
  editable: boolean;
  open: boolean;
  busy: boolean;
  onToggle: () => void;
  onMove: (delta: number) => void;
  onSave: (values: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(record);
  const [confirming, setConfirming] = useState(false);

  // Keyed on the id, not the object: a reload hands back a fresh object for the
  // same record, and re-syncing on that would discard unsaved edits.
  useEffect(() => setValues(record), [record.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const label = String(record[def.labelField] ?? "Untitled") || "Untitled";
  const hidden = record.visible === false;

  return (
    <div style={{ ...ui.card, opacity: hidden ? 0.62 : 1 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={ui.kicker}>{hidden ? "HIDDEN" : `#${index + 1}`}</div>
          <h3 className="font-display" style={{ fontSize: 18, margin: "8px 0 0", lineHeight: 1.2 }}>{label}</h3>
        </div>
        {editable && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button style={ui.quietButton} disabled={busy || index === 0} onClick={() => onMove(-1)} aria-label="Move up">↑</button>
            <button style={ui.quietButton} disabled={busy || index === total - 1} onClick={() => onMove(1)} aria-label="Move down">↓</button>
            <button style={ui.quietButton} onClick={onToggle}>{open ? "CLOSE" : "EDIT"}</button>
          </div>
        )}
      </div>

      {open && editable && (
        <div style={{ marginTop: 18, display: "grid", gap: 16 }}>
          {def.fields.map((field) => (
            <Field
              key={field.name}
              field={field}
              folder={def.imageFolder}
              value={values[field.name]}
              onChange={(v) => setValues((cur) => ({ ...cur, [field.name]: v }))}
            />
          ))}

          <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={values.visible !== false}
              onChange={(e) => setValues((cur) => ({ ...cur, visible: e.target.checked }))}
              style={{ width: 19, height: 19, accentColor: "var(--purple)" }}
            />
            <span style={{ fontSize: 14.5, fontWeight: 700 }}>Show this on the site</span>
          </label>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <button className="font-display mz-pop" style={ui.primaryButton} disabled={busy} onClick={() => onSave(values)}>
              {busy ? "SAVING…" : "SAVE"}
            </button>
            {confirming ? (
              <>
                <span style={{ fontSize: 13.5 }}>Delete this for good?</span>
                <button style={{ ...ui.quietButton, background: "var(--crimson)", color: "var(--paper)" }} onClick={onDelete}>
                  YES, DELETE
                </button>
                <button style={ui.quietButton} onClick={() => setConfirming(false)}>KEEP IT</button>
              </>
            ) : (
              <button style={ui.quietButton} onClick={() => setConfirming(true)}>DELETE</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NewRecord({
  def,
  busy,
  onCreate,
}: {
  def: ContentCollectionDef;
  busy: boolean;
  onCreate: (values: Record<string, unknown>) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>({});

  if (!open) {
    return (
      <button className="font-display mz-pop" style={{ ...ui.primaryButton, justifySelf: "start" }} onClick={() => setOpen(true)}>
        + ADD {def.itemNoun.toUpperCase()}
      </button>
    );
  }

  return (
    <div style={ui.card}>
      <div style={ui.kicker}>NEW</div>
      <h3 className="font-display" style={{ fontSize: 18, margin: "8px 0 18px" }}>ADD {def.itemNoun.toUpperCase()}</h3>
      <div style={{ display: "grid", gap: 16 }}>
        {def.fields.map((field) => (
          <Field
            key={field.name}
            field={field}
            folder={def.imageFolder}
            value={values[field.name]}
            onChange={(v) => setValues((cur) => ({ ...cur, [field.name]: v }))}
          />
        ))}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            className="font-display mz-pop"
            style={ui.primaryButton}
            disabled={busy}
            onClick={async () => {
              // Only clear once it is actually saved, so a failure leaves the
              // typing intact to retry.
              if (await onCreate(values)) {
                setValues({});
                setOpen(false);
              }
            }}
          >
            {busy ? "ADDING…" : "ADD IT"}
          </button>
          <button style={ui.quietButton} onClick={() => setOpen(false)}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}

function Field({
  field,
  folder,
  value,
  onChange,
}: {
  field: ContentField;
  folder: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "boolean") {
    return (
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: 19, height: 19, marginTop: 2, accentColor: "var(--purple)" }}
        />
        <span>
          <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>{field.label}</span>
          {field.hint && <span style={{ display: "block", fontSize: 12.5, color: "#5B4480", marginTop: 3 }}>{field.hint}</span>}
        </span>
      </label>
    );
  }

  if (field.type === "image") {
    return <ImageField field={field} folder={folder} value={value as { path: string; url: string } | null} onChange={onChange} />;
  }

  return (
    <div>
      <label style={ui.label}>{field.label.toUpperCase()}</label>
      {field.type === "longtext" ? (
        <textarea
          className="mz-input"
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          style={{ resize: "vertical" }}
        />
      ) : (
        <input
          className="mz-input"
          type={field.type === "number" ? "number" : "text"}
          value={field.type === "number" ? Number(value ?? 0) : String(value ?? "")}
          onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
        />
      )}
      {field.hint && <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>{field.hint}</div>}
    </div>
  );
}

function ImageField({
  field,
  folder,
  value,
  onChange,
}: {
  field: ContentField;
  folder: string;
  value: { path: string; url: string } | null;
  onChange: (value: unknown) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      <label style={ui.label}>{field.label.toUpperCase()}</label>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
        {value?.url && (
          <Image
            src={value.url}
            alt=""
            width={120}
            height={90}
            style={{
              width: 120,
              height: 90,
              objectFit: "cover",
              border: "2px solid var(--ink)",
              borderRadius: 12,
              background: "var(--lilac)",
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setError("");
              try {
                onChange(await upload(file, folder));
              } catch (err) {
                setError(message(err, "Could not upload that"));
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
            style={{ fontSize: 13 }}
          />
          {busy && <span style={{ fontSize: 13, color: "var(--purple)" }}>Uploading…</span>}
          {error && <span style={{ fontSize: 13, color: "var(--crimson)" }}>{error}</span>}
          {value?.url && (
            <button style={{ ...ui.quietButton, alignSelf: "flex-start" }} onClick={() => onChange(null)}>
              REMOVE IMAGE
            </button>
          )}
          <span style={{ fontSize: 12, color: "#5B4480" }}>
            {field.hint ?? "JPEG, PNG, WebP or AVIF, up to 8MB."}
          </span>
        </div>
      </div>
    </div>
  );
}
