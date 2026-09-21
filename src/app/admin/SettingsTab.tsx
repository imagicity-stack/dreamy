"use client";

import { useEffect, useState } from "react";
import type { FestSettings } from "@/lib/festSettings";
import { api, message } from "./api";
import Notice from "./Notice";
import * as ui from "./adminUi";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type NumericKey =
  | "fetePrice"
  | "cosplayFee"
  | "concertCapacity"
  | "interestBase"
  | "fetePassCapacity"
  | "cosplayCapacity";

type RateKey = "convenienceFeePercent" | "gstPercent";

export default function SettingsTab({ pages }: { pages: { key: string; label: string }[] }) {
  const [settings, setSettings] = useState<FestSettings | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/settings")
      .then((data) => setSettings(data.settings))
      .catch((e) => setError(message(e, "Could not load the settings")));
  }, []);

  function edit(patch: Partial<FestSettings>) {
    setStatus("idle");
    setSettings((cur) => (cur ? { ...cur, ...patch } : cur));
  }

  async function save() {
    if (!settings) return;
    setStatus("saving");
    setError("");
    try {
      const data = await api("/api/admin/settings", { method: "PUT", body: JSON.stringify(settings) });
      setSettings(data.settings);
      setStatus("saved");
    } catch (e) {
      setError(message(e, "Could not save"));
      setStatus("error");
    }
  }

  if (error && !settings) return <Notice text={error} />;
  if (!settings) return <Notice text="Loading the settings…" />;

  const number = (key: NumericKey, label: string, hint: string) => (
    <div key={key}>
      <label style={ui.label}>{label}</label>
      <input
        className="mz-input"
        type="number"
        min={0}
        value={settings[key]}
        onChange={(e) => edit({ [key]: Number(e.target.value) } as Partial<FestSettings>)}
      />
      <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>{hint}</div>
    </div>
  );

  // Rates carry decimals, so they get their own input rather than the integer one.
  const rate = (key: RateKey, label: string, hint: string) => (
    <div key={key}>
      <label style={ui.label}>{label}</label>
      <input
        className="mz-input"
        type="number"
        min={0}
        max={100}
        step={0.01}
        value={settings[key]}
        onChange={(e) => edit({ [key]: Number(e.target.value) } as Partial<FestSettings>)}
      />
      <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>{hint}</div>
    </div>
  );

  // What a ₹-priced thing actually costs once the fee and its GST are on it.
  const feeOn = (amount: number) => {
    const fee = Math.round(amount * 100 * settings.convenienceFeePercent) / 100;
    const gst = Math.round(fee * settings.gstPercent) / 100;
    return (amount * 100 + fee + gst) / 100;
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Section kicker="THE NUMBERS" title="PRICES & CAPACITY">
        <Grid>
          {number("fetePrice", "FETE PASS (₹)", "The pass price, before the convenience fee below.")}
          {number("cosplayFee", "COSPLAY ENTRY (₹)", "Solo or squad, same fee.")}
          {number("concertCapacity", "CONCERT SEATS", "Shown wherever the cap is quoted.")}
          {number("interestBase", "INTEREST LIST START", "Queue numbers count up from here.")}
          {number("fetePassCapacity", "FETE PASSES ON SALE", "Hard cap — checkout closes when it is reached. 0 means no limit.")}
          {number("cosplayCapacity", "COSPLAY ENTRIES ON SALE", "Hard cap on arena entries. 0 means no limit.")}
        </Grid>
        <p style={{ fontSize: 13, color: "#5B4480", margin: "16px 0 0" }}>
          Merch prices moved to the Content tab, alongside their photos.
        </p>
      </Section>

      <Section kicker="CHECKOUT" title="CONVENIENCE FEE & GST">
        <Grid>
          {rate("convenienceFeePercent", "CONVENIENCE FEE (%)", "Added to every online payment, on top of the price.")}
          {rate("gstPercent", "GST ON THE FEE (%)", "Charged on the convenience fee itself, not on the ticket.")}
        </Grid>
        <p style={{ fontSize: 13, color: "#5B4480", margin: "16px 0 0", lineHeight: 1.6 }}>
          {/* Said in rupees, because a percentage of a percentage is not
              something anyone should have to picture on a Tuesday. */}
          A ₹{settings.fetePrice.toLocaleString("en-IN")} Fete Pass is charged at{" "}
          <strong>₹{feeOn(settings.fetePrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>, and a ₹
          {settings.cosplayFee.toLocaleString("en-IN")} cosplay entry at{" "}
          <strong>₹{feeOn(settings.cosplayFee).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>. Every
          checkout shows the buyer this split before they pay.
        </p>
      </Section>

      <Section kicker="THE DATE" title="HOW MUCH TO GIVE AWAY">
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { value: "sealed", label: "Sealed", hint: "Tiles read ?? · ?? and the site says the date is coming." },
            { value: "month", label: "Month only", hint: "Names the month, keeps the day sealed." },
            { value: "full", label: "Full date", hint: "Day, month and weekday everywhere." },
          ].map((option) => (
            <label key={option.value} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
              <input
                type="radio"
                name="dateMode"
                checked={settings.dateMode === option.value}
                onChange={() => edit({ dateMode: option.value as FestSettings["dateMode"] })}
                style={{ width: 18, height: 18, marginTop: 2, accentColor: "var(--purple)" }}
              />
              <span>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>{option.label}</span>
                <span style={{ display: "block", fontSize: 13, color: "#5B4480", marginTop: 3 }}>{option.hint}</span>
              </span>
            </label>
          ))}
        </div>

        <Grid style={{ marginTop: 20 }}>
          <div>
            <label style={ui.label}>DAY</label>
            <input
              className="mz-input"
              type="number"
              min={0}
              max={31}
              value={settings.festDay}
              onChange={(e) => edit({ festDay: Number(e.target.value) })}
            />
            <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>0 while it is still a secret.</div>
          </div>
          <div>
            <label style={ui.label}>MONTH</label>
            <select
              className="mz-input"
              value={settings.festMonth}
              onChange={(e) => edit({ festMonth: Number(e.target.value) })}
            >
              <option value={0}>Not decided</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={ui.label}>YEAR</label>
            <input
              className="mz-input"
              type="number"
              min={2024}
              max={2100}
              value={settings.festYear}
              onChange={(e) => edit({ festYear: Number(e.target.value) })}
            />
          </div>
        </Grid>
      </Section>

      <Section kicker="THE CLOCK" title="COUNTDOWN">
        <Toggle
          on={settings.countdownEnabled}
          label="Run a countdown on the home page"
          hint="Replaces the line under the date tiles with a live clock."
          onChange={(v) => edit({ countdownEnabled: v })}
        />
        <Grid style={{ marginTop: 18 }}>
          <div>
            <label style={ui.label}>COUNTS DOWN TO</label>
            <input
              className="mz-input"
              type="datetime-local"
              value={toLocalInput(settings.countdownTarget)}
              onChange={(e) => edit({ countdownTarget: fromLocalInput(e.target.value) })}
            />
            <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>Your own clock, saved with its time zone.</div>
          </div>
          <div>
            <label style={ui.label}>LABEL ABOVE IT</label>
            <input
              className="mz-input"
              value={settings.countdownLabel}
              onChange={(e) => edit({ countdownLabel: e.target.value })}
            />
            <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>UNTIL THE GATES OPEN, UNTIL THE REVEAL…</div>
          </div>
        </Grid>
      </Section>

      <Section kicker="THE SITE" title="PAGES">
        <p style={{ fontSize: 14, color: "#5B4480", margin: "0 0 14px" }}>
          A hidden page disappears from the menu and stops opening for visitors.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
          {pages.map((page) => {
            const hidden = settings.hiddenPages.includes(page.key);
            return (
              <label key={page.key} style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={!hidden}
                  onChange={(e) =>
                    edit({
                      hiddenPages: e.target.checked
                        ? settings.hiddenPages.filter((k) => k !== page.key)
                        : [...settings.hiddenPages, page.key],
                    })
                  }
                  style={{ width: 19, height: 19, accentColor: "var(--purple)" }}
                />
                <span style={{ fontSize: 14.5, fontWeight: 700 }}>{page.label}</span>
              </label>
            );
          })}
        </div>
      </Section>

      <Section kicker="THE SWITCHES" title="WHAT THE SITE SAYS">
        <div style={{ display: "grid", gap: 16 }}>
          <Toggle
            on={settings.soldOut}
            label="Fete passes sold out"
            hint="Closes checkout and swaps the buy button for a sold-out notice."
            onChange={(v) => edit({ soldOut: v })}
          />
          <Toggle
            on={settings.merchOpen}
            label="Merch pre-orders open"
            hint="Turn this off to leave the shop up but stop taking orders. Hiding the page in Pages removes it entirely."
            onChange={(v) => edit({ merchOpen: v })}
          />
          {!settings.merchOpen && (
            <div>
              <label style={ui.label}>WHAT THE CLOSED SHOP SAYS</label>
              <input
                className="mz-input"
                value={settings.merchClosedNote}
                onChange={(e) => edit({ merchClosedNote: e.target.value })}
              />
            </div>
          )}
          <Toggle
            on={settings.lineupUnlocked}
            label="Lineup unlocked"
            hint="Opens every clue card without anyone having to tap it."
            onChange={(v) => edit({ lineupUnlocked: v })}
          />
          <div>
            <label style={ui.label}>ANNOUNCEMENT BANNER</label>
            <input
              className="mz-input"
              value={settings.announcement}
              onChange={(e) => edit({ announcement: e.target.value })}
              placeholder="Leave empty for no banner"
            />
            <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>
              Sits above the ticker on every page, in crimson. Use it sparingly.
            </div>
          </div>
        </div>
      </Section>

      <Section kicker="THE OFFICE" title="HOW PEOPLE REACH YOU">
        <p style={{ fontSize: 14, color: "#5B4480", margin: "0 0 14px" }}>
          Written on the sponsors page, the FAQ, the gallery and the footer.
        </p>
        <Grid>
          <div>
            <label style={ui.label}>EMAIL</label>
            <input className="mz-input" value={settings.contactEmail} onChange={(e) => edit({ contactEmail: e.target.value })} />
          </div>
          <div>
            <label style={ui.label}>PHONE</label>
            <input className="mz-input" value={settings.contactPhone} onChange={(e) => edit({ contactPhone: e.target.value })} />
          </div>
        </Grid>
      </Section>

      <Section kicker="THE LISTING" title="TITLE & DESCRIPTION">
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={ui.label}>BROWSER TAB TITLE</label>
            <input className="mz-input" value={settings.siteTitle} onChange={(e) => edit({ siteTitle: e.target.value })} />
          </div>
          <div>
            <label style={ui.label}>SEARCH DESCRIPTION</label>
            <textarea
              className="mz-input"
              rows={3}
              value={settings.siteDescription}
              onChange={(e) => edit({ siteDescription: e.target.value })}
              style={{ resize: "vertical" }}
            />
            <div style={{ fontSize: 12, color: "#5B4480", marginTop: 6 }}>
              The date sentence is appended automatically, so it stays right as the reveal moves.
            </div>
          </div>
        </div>
      </Section>

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

function Section({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <div style={ui.card}>
      <div style={ui.kicker}>{kicker}</div>
      <h2 className="font-display" style={{ fontSize: 22, margin: "10px 0 18px" }}>{title}</h2>
      {children}
    </div>
  );
}

function Grid({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 18, ...style }}>
      {children}
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

/** <input type="datetime-local"> wants local wall-clock time, not an ISO string. */
function toLocalInput(iso: string): string {
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return "";
  const d = new Date(ms - new Date(ms).getTimezoneOffset() * 60_000);
  return d.toISOString().slice(0, 16);
}

function fromLocalInput(value: string): string {
  if (!value) return "";
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : "";
}
