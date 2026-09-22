"use client";

import { useEffect, useState } from "react";
import { api, message } from "./api";
import Notice from "./Notice";
import * as ui from "./adminUi";

/**
 * Who may work the gate.
 *
 * Adding somebody here creates a real Firebase Auth account for them, so this
 * list and the accounts in the Firebase console are the same thing: switching
 * somebody off in either place stops them scanning, and a phone already signed
 * in loses access at its next request rather than at the end of the day.
 *
 * The PIN is the account's password, and Firebase will not take fewer than six
 * characters — so gate PINs are six to eight digits. It is shown once, here,
 * when it is set; after that nobody can read it back, only replace it.
 */

type Staff = {
  uid: string;
  email: string;
  name: string;
  active: boolean;
  createdAt: string | null;
  lastSignInAt: string | null;
  scans: number;
};

function when(iso: string | null): string {
  if (!iso) return "never";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

/** Six digits, avoiding the ones that are a pain to read out across a field. */
function suggestPin(): string {
  return String(Math.floor(100000 + Math.random() * 899999));
}

export default function GateTab() {
  const [staff, setStaff] = useState<Staff[] | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", pin: suggestPin() });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [resetting, setResetting] = useState<string | null>(null);
  const [newPin, setNewPin] = useState("");

  useEffect(() => {
    api("/api/admin/gate-staff")
      .then((d) => setStaff(d.staff))
      .catch((e) => setError(message(e, "Could not load the gate list")));
  }, []);

  async function add() {
    setBusy(true);
    setNote("");
    setError("");
    try {
      const d = await api("/api/admin/gate-staff", { method: "POST", body: JSON.stringify(form) });
      setStaff(d.staff);
      setNote(`${form.name} can sign in at /gate with ${form.email} and PIN ${form.pin}. Write it down — it cannot be read back.`);
      setForm({ name: "", email: "", pin: suggestPin() });
    } catch (e) {
      setError(message(e, "Could not add them"));
    } finally {
      setBusy(false);
    }
  }

  async function patch(body: Record<string, unknown>, said: string) {
    setError("");
    try {
      const d = await api("/api/admin/gate-staff", { method: "PATCH", body: JSON.stringify(body) });
      setStaff(d.staff);
      setNote(said);
    } catch (e) {
      setError(message(e, "Could not do that"));
    }
  }

  async function remove(person: Staff) {
    if (!confirm(`Take ${person.name} off the gate list? Their login stops working immediately.`)) return;
    setError("");
    try {
      const d = await api(`/api/admin/gate-staff?uid=${encodeURIComponent(person.uid)}`, { method: "DELETE" });
      setStaff(d.staff);
      setNote(`${person.name} removed.`);
    } catch (e) {
      setError(message(e, "Could not remove them"));
    }
  }

  if (error && !staff) return <Notice text={error} />;
  if (!staff) return <Notice text="Loading the gate list…" />;

  const canAdd = form.name.trim().length > 1 && form.email.includes("@") && /^\d{6,8}$/.test(form.pin);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={ui.card}>
        <div style={ui.kicker}>ADD SOMEBODY</div>
        <p style={{ fontSize: 13.5, color: "#5B4480", margin: "10px 0 16px", lineHeight: 1.6 }}>
          They sign in at <strong>/gate</strong> with this email and PIN. An address that already has a
          Firebase account — a teacher who is also an admin — is reused, and its password becomes this PIN.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <div>
            <label style={ui.label}>NAME</label>
            <input
              className="mz-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="As the scan log should read"
            />
          </div>
          <div>
            <label style={ui.label}>EMAIL</label>
            <input
              className="mz-input"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="their login id"
              autoCapitalize="off"
            />
          </div>
          <div>
            <label style={ui.label}>PIN (6–8 DIGITS)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="mz-input"
                value={form.pin}
                onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, "").slice(0, 8) }))}
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, pin: suggestPin() }))}
                title="Another PIN"
                style={{
                  flexShrink: 0,
                  padding: "0 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--purple)",
                  background: "var(--lilac)",
                  border: "3px solid var(--ink)",
                  borderRadius: 16,
                  cursor: "pointer",
                }}
              >
                NEW
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={add}
          disabled={busy || !canAdd}
          className="font-display mz-pop"
          style={{
            marginTop: 16,
            fontSize: 13,
            color: "var(--lilac)",
            background: "var(--purple)",
            border: "3px solid var(--ink)",
            borderRadius: 16,
            boxShadow: "4px 4px 0 var(--ink)",
            padding: "13px 20px",
            cursor: canAdd ? "pointer" : "not-allowed",
            opacity: canAdd ? 1 : 0.6,
            ["--mz-shadow" as string]: "4px",
          }}
        >
          {busy ? "ADDING…" : "ADD TO THE GATE"}
        </button>

        {note && (
          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: "14px 0 0", color: "#3D7A45" }}>{note}</p>
        )}
        {error && <p style={{ fontSize: 13.5, margin: "12px 0 0", color: "var(--crimson)" }}>{error}</p>}
      </div>

      <div style={ui.card}>
        <div style={ui.kicker}>ON THE GATE ({staff.filter((s) => s.active).length} ACTIVE)</div>

        {staff.length === 0 ? (
          <p style={{ fontSize: 13.5, color: "#5B4480", margin: "12px 0 0", lineHeight: 1.6 }}>
            Nobody yet. Until somebody is on this list, the scanner cannot be signed into at all.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {staff.map((person) => (
              <div
                key={person.uid}
                style={{
                  border: "2px solid #E0D2F0",
                  borderRadius: 16,
                  padding: "13px 14px",
                  opacity: person.active ? 1 : 0.62,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15.5 }}>
                      {person.name}{" "}
                      {!person.active && (
                        <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--crimson)" }}>OFF</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#5B4480", marginTop: 3, wordBreak: "break-word" }}>
                      {person.email}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#7D63A8", marginTop: 5 }}>
                      {person.scans.toLocaleString("en-IN")} scanned in · last signed in {when(person.lastSignInAt)}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
                    <SmallButton onClick={() => { setResetting(person.uid); setNewPin(suggestPin()); }}>
                      NEW PIN
                    </SmallButton>
                    <SmallButton
                      onClick={() =>
                        patch(
                          { uid: person.uid, active: !person.active },
                          `${person.name} is ${person.active ? "off" : "back on"} the gate.`,
                        )
                      }
                    >
                      {person.active ? "SWITCH OFF" : "SWITCH ON"}
                    </SmallButton>
                    <SmallButton tone="danger" onClick={() => remove(person)}>
                      REMOVE
                    </SmallButton>
                  </div>
                </div>

                {resetting === person.uid && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <input
                      className="mz-input"
                      style={{ flex: "1 1 140px", width: "auto" }}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      inputMode="numeric"
                    />
                    <SmallButton
                      onClick={async () => {
                        await patch(
                          { uid: person.uid, pin: newPin },
                          `${person.name}'s PIN is now ${newPin}. Tell them — it cannot be read back.`,
                        );
                        setResetting(null);
                      }}
                    >
                      SET IT
                    </SmallButton>
                    <SmallButton onClick={() => setResetting(null)}>CANCEL</SmallButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SmallButton({
  children,
  onClick,
  tone = "normal",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "normal" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: tone === "danger" ? "var(--crimson)" : "var(--purple)",
        background: "transparent",
        border: `2px solid ${tone === "danger" ? "var(--crimson)" : "var(--purple)"}`,
        borderRadius: 12,
        padding: "9px 11px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
