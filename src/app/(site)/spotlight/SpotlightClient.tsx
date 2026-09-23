"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PriceLines from "@/components/PriceLines";
import FormNote from "@/components/FormNote";
import { LEGAL_PAGES } from "@/lib/legal";
import { formatPaise } from "@/lib/pricing";
import {
  CheckoutDismissed,
  downloadPasses,
  fetchQuote,
  startCheckout,
  type Quote,
} from "@/lib/checkoutClient";

export type Talent = { id: string; title: string; value: string; body: string };
export type Prize = { id: string; amount: string; title: string; note: string };
export type ActOption = {
  key: string;
  label: string;
  who: string;
  maxMinutes: number;
  priceRupees: number;
};

/** Good enough to catch a typo; the server checks it again. */
const EMAIL_RE = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/;

const PRIZE_SKINS = [
  { bg: "var(--teal)", fg: "var(--ink)", amountColor: undefined as string | undefined },
  { bg: "var(--lilac)", fg: "var(--ink)", amountColor: "var(--purple)" },
  { bg: "var(--purple)", fg: "var(--lilac)", amountColor: "var(--teal)" },
  { bg: "var(--paper)", fg: "var(--ink)", amountColor: "var(--purple)" },
];

/** The confirmation line names the talent and the act size, in bold. */
function fillTokens(text: string, values: { talent: string; actLabel: string }) {
  return text.split(/(\{talent\}|\{actLabel\})/).map((part, i) => {
    if (part === "{talent}") return <strong key={i}>{values.talent}</strong>;
    if (part === "{actLabel}") return <strong key={i}>{values.actLabel.toLowerCase()}</strong>;
    return part;
  });
}

type Entry = {
  name: string;
  age: string;
  city: string;
  phone: string;
  email: string;
  instagram: string;
  talent: string;
  act: string;
  minutes: string;
  crew: string;
  members: string;
  audition: string;
};

const label = {
  display: "block",
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.18em",
  color: "var(--purple)",
  marginBottom: 6,
} as const;

export default function SpotlightClient({
  words,
  talents,
  prizes,
  acts,
  sponsorsLive,
}: {
  words: Record<string, string>;
  talents: Talent[];
  prizes: Prize[];
  acts: ActOption[];
  sponsorsLive: boolean;
}) {
  const [entry, setEntry] = useState<Entry>({
    name: "", age: "", city: "", phone: "", email: "", instagram: "",
    talent: talents[0]?.value ?? "", act: acts[0]?.key ?? "solo", minutes: "",
    crew: "", members: "", audition: "",
  });
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [entryCode, setEntryCode] = useState("");
  const [entryTokens, setEntryTokens] = useState<string[]>([]);
  const [pdfState, setPdfState] = useState<"idle" | "working" | "saved" | "blocked">("idle");

  const chosenAct = acts.find((a) => a.key === entry.act) ?? acts[0];
  /** Anything bigger than a duo is more than one person to name. */
  const isGroup = entry.act !== "solo";

  // The price follows the act size, and it is the server's number rather than
  // one worked out here from a rate card the browser could edit.
  useEffect(() => {
    let live = true;
    fetchQuote("spotlight", { act: entry.act })
      .then((q) => live && setQuote(q))
      .catch(() => live && setQuote(null));
    return () => {
      live = false;
    };
  }, [entry.act]);

  const minutesNum = Number(entry.minutes);
  const minutesOk =
    entry.minutes.trim() === "" ||
    (Number.isFinite(minutesNum) && minutesNum > 0 && minutesNum <= (chosenAct?.maxMinutes ?? 7));

  const canSubmit =
    entry.name.trim().length > 1 &&
    entry.city.trim().length > 1 &&
    entry.phone.replace(/\D/g, "").length >= 10 &&
    EMAIL_RE.test(entry.email.trim()) &&
    !!entry.talent &&
    minutesOk &&
    !!quote;

  function set<K extends keyof Entry>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setEntry((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function submit() {
    if (!canSubmit) return;
    setStatus("processing");
    setError("");
    try {
      const receipt = await startCheckout({
        product: "spotlight",
        input: { act: entry.act },
        customer: {
          name: entry.name,
          phone: entry.phone,
          email: entry.email,
          city: entry.city,
          age: entry.age,
          instagram: entry.instagram.replace(/^@+/, ""),
          talent: entry.talent,
          act: entry.act,
          actLabel: chosenAct?.label ?? "",
          minutes: entry.minutes,
          crew: entry.crew,
          members: entry.members,
          audition: entry.audition,
        },
        title: "MADOOZA Spotlight",
      });
      setEntryCode(receipt.primaryCode);
      setEntryTokens(receipt.tickets.map((t) => t.token));
      setDone(true);
      setStatus("idle");
      window.scrollTo(0, 0);

      if (receipt.tickets.length) {
        setPdfState("working");
        const ok = await downloadPasses(receipt.tickets.map((t) => t.token), "madooza-spotlight-slot.pdf");
        setPdfState(ok ? "saved" : "blocked");
      }
    } catch (e) {
      if (e instanceof CheckoutDismissed) {
        setStatus("idle");
        return;
      }
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not start checkout");
    }
  }

  return (
    <main>
      {/* ---- hero ---- */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--lilac)",
          borderBottom: "3px solid var(--purple)",
          padding: "56px 20px 50px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* A stage wash: two soft beams from above, the only place on the site
            that gets them, because this is the only page that is about a stage. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(60% 80% at 22% -10%, rgba(53,198,212,0.22), transparent 60%), radial-gradient(55% 75% at 78% -10%, rgba(223,2,92,0.22), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>
            {words.heroEyebrow}
          </div>
          <h1
            className="font-display"
            style={{ fontSize: "clamp(32px, 7vw, 68px)", lineHeight: 0.98, margin: "14px 0 10px" }}
          >
            {words.heroTitle}
          </h1>
          <div
            className="font-display"
            style={{ fontSize: "clamp(14px, 2.4vw, 22px)", color: "var(--hot-pink)", letterSpacing: "0.02em" }}
          >
            {words.heroTagline}
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.62, maxWidth: "62ch", margin: "18px 0 0", color: "var(--lilac-text)" }}>
            {words.heroIntro}
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            {acts.map((a) => (
              <span
                key={a.key}
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  background: "rgba(239,227,251,0.08)",
                  border: "2px solid var(--purple)",
                  borderRadius: 999,
                  padding: "8px 13px",
                }}
              >
                {a.label.toUpperCase()} · ₹{a.priceRupees.toLocaleString("en-IN")}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- open to everyone ---- */}
      <section style={{ background: "var(--hot-pink)", color: "var(--ink)", borderBottom: "3px solid var(--ink)", padding: "30px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "center" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(20px, 3vw, 30px)", margin: 0, lineHeight: 1.08 }}>
            {words.openToTitle}
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: 0, maxWidth: "58ch" }}>{words.openToBody}</p>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "54px 20px 60px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {/* ---- the talents ---- */}
          <header style={{ marginBottom: 22 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", margin: "0 0 10px", color: "var(--lilac)" }}>
              {words.talentsTitle}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--lilac-text)", margin: 0, maxWidth: "58ch" }}>
              {words.talentsIntro}
            </p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(152px, 1fr))", gap: 12, marginBottom: 48 }}>
            {talents.map((t, i) => {
              // The wildcard is the argument the page is making, so it is the
              // one card that does not look like the others.
              const wild = i === talents.length - 1;
              return (
                <div
                  key={t.id}
                  style={{
                    background: wild ? "var(--teal)" : "var(--ink)",
                    color: wild ? "var(--ink)" : "var(--lilac)",
                    border: `2px solid ${wild ? "var(--ink)" : "#3B1568"}`,
                    borderRadius: 16,
                    padding: "15px 15px 16px",
                    boxShadow: wild ? "5px 5px 0 var(--purple)" : undefined,
                  }}
                >
                  <div
                    className="font-display"
                    style={{ fontSize: 14.5, color: wild ? "var(--ink)" : "var(--teal)", lineHeight: 1.15 }}
                  >
                    {t.title}
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.5, margin: "7px 0 0", color: wild ? "#12333A" : "var(--muted-lilac)" }}>
                    {t.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ---- how it works ---- */}
          <header style={{ marginBottom: 20 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", margin: "0 0 10px", color: "var(--lilac)" }}>
              {words.howTitle}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--lilac-text)", margin: 0, maxWidth: "58ch" }}>
              {words.howIntro}
            </p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16, marginBottom: 30 }}>
            {[
              { n: "01", title: words.stage1Title, body: words.stage1Body, bg: "var(--lilac)", fg: "var(--ink)" },
              { n: "02", title: words.stage2Title, body: words.stage2Body, bg: "var(--purple)", fg: "var(--lilac)" },
            ].map((step) => (
              <div
                key={step.n}
                style={{
                  background: step.bg,
                  color: step.fg,
                  border: "3px solid var(--ink)",
                  borderRadius: 20,
                  boxShadow: "7px 7px 0 var(--ink)",
                  padding: "22px 21px 24px",
                }}
              >
                <div className="font-display" style={{ fontSize: 30, lineHeight: 1, color: "var(--crimson)" }}>{step.n}</div>
                <h3 className="font-display" style={{ fontSize: 19, margin: "10px 0 9px" }}>{step.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>

          {/* The slot table: what each act size costs and how long it gets. */}
          <div
            style={{
              border: "3px solid var(--purple)",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 48,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 0.9fr",
                background: "var(--purple)",
                color: "var(--lilac)",
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: "0.16em",
                padding: "11px 16px",
              }}
            >
              <span>ACT</span>
              <span style={{ textAlign: "center" }}>STAGE TIME</span>
              <span style={{ textAlign: "right" }}>SLOT FEE</span>
            </div>
            {acts.map((a, i) => (
              <div
                key={a.key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 0.9fr",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 16px",
                  background: i % 2 ? "rgba(239,227,251,0.04)" : "transparent",
                  color: "var(--lilac)",
                  borderTop: i ? "1px solid #351059" : undefined,
                }}
              >
                <span>
                  <span className="font-display" style={{ fontSize: 15 }}>{a.label}</span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--muted-lilac)", marginTop: 2 }}>{a.who}</span>
                </span>
                <span style={{ textAlign: "center", fontSize: 13.5, color: "var(--teal)" }}>
                  up to {a.maxMinutes} min
                </span>
                <span className="font-display" style={{ textAlign: "right", fontSize: 17 }}>
                  ₹{a.priceRupees.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* ---- prizes and the form ---- */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 26, alignItems: "start" }}>
            <div>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", margin: "0 0 8px", color: "var(--lilac)" }}>
                {words.prizesTitle}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--lilac-text)", margin: "0 0 22px", maxWidth: "46ch" }}>
                {words.prizesIntro}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {prizes.map((p, i) => {
                  const skin = PRIZE_SKINS[i % PRIZE_SKINS.length];
                  // A word like STUDIO needs to be smaller than a figure like ₹15,000.
                  const wordy = p.amount.replace(/[^0-9]/g, "").length === 0;
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        background: skin.bg,
                        color: skin.fg,
                        border: "3px solid var(--ink)",
                        borderRadius: 20,
                        boxShadow: "6px 6px 0 var(--ink)",
                        padding: "16px 18px",
                      }}
                    >
                      <div className="font-display" style={{ fontSize: wordy ? 17 : 21, minWidth: 92, color: skin.amountColor }}>
                        {p.amount}
                      </div>
                      <div style={{ fontSize: 14.5, lineHeight: 1.45 }}>
                        <strong>{p.title}</strong>
                        {p.note ? <> &mdash; {p.note}</> : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              {sponsorsLive && (
                <div style={{ marginTop: 22, borderTop: "2px dashed var(--purple)", paddingTop: 18 }}>
                  <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--muted-lilac)", margin: "0 0 12px", maxWidth: "46ch" }}>
                    {words.sponsorNote}
                  </p>
                  <Link href="/sponsors" className="font-display" style={{ fontSize: 13, letterSpacing: "0.04em", color: "var(--teal)" }}>
                    {words.sponsorCtaLabel}
                  </Link>
                </div>
              )}
            </div>

            {!done ? (
              <div
                id="register"
                style={{
                  background: "var(--paper)",
                  color: "var(--ink)",
                  border: "3px solid var(--ink)",
                  borderRadius: 20,
                  boxShadow: "10px 10px 0 var(--ink)",
                  padding: "28px 26px",
                }}
              >
                <h2 className="font-display" style={{ fontSize: 22, margin: "0 0 20px" }}>{words.registerTitle}</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                  <div>
                    <label style={label}>YOUR NAME</label>
                    <input className="mz-input" value={entry.name} onChange={set("name")} placeholder="The name the compere reads out" />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12 }}>
                    <div>
                      <label style={label}>AGE</label>
                      <input className="mz-input" value={entry.age} onChange={set("age")} inputMode="numeric" placeholder="Optional" />
                    </div>
                    <div>
                      <label style={label}>CITY</label>
                      <input className="mz-input" value={entry.city} onChange={set("city")} placeholder="Hazaribagh, Ranchi, anywhere" />
                    </div>
                  </div>

                  <div>
                    <label style={label}>PHONE</label>
                    <input className="mz-input" value={entry.phone} onChange={set("phone")} type="tel" inputMode="tel" placeholder="10 digits — your call time comes here" />
                  </div>

                  <div>
                    <label style={label}>EMAIL</label>
                    <input className="mz-input" value={entry.email} onChange={set("email")} type="email" inputMode="email" autoCapitalize="off" placeholder="Where your slot pass is sent" />
                  </div>

                  <div>
                    <label style={label}>INSTAGRAM</label>
                    <input className="mz-input" value={entry.instagram} onChange={set("instagram")} autoCapitalize="off" placeholder="Optional — so we can tag you when the clips go up" />
                  </div>

                  <div>
                    <label style={label}>YOUR TALENT</label>
                    <select className="mz-input" value={entry.talent} onChange={set("talent")}>
                      {talents.map((t) => (
                        <option key={t.id} value={t.value}>{t.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={label}>HOW MANY OF YOU</label>
                    <select className="mz-input" value={entry.act} onChange={set("act")}>
                      {acts.map((a) => (
                        <option key={a.key} value={a.key}>
                          {a.label} — ₹{a.priceRupees.toLocaleString("en-IN")} · up to {a.maxMinutes} min
                        </option>
                      ))}
                    </select>
                  </div>

                  {isGroup && (
                    <div style={{ display: "grid", gap: 15, background: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, padding: 16 }}>
                      <div>
                        <label style={label}>ACT OR CREW NAME</label>
                        <input className="mz-input" value={entry.crew} onChange={set("crew")} placeholder="What to put on the running order" />
                      </div>
                      <div>
                        <label style={label}>WHO IS PERFORMING</label>
                        <textarea
                          className="mz-input"
                          value={entry.members}
                          onChange={set("members")}
                          rows={3}
                          placeholder="One name per line, including you"
                          style={{ resize: "vertical" }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={label}>
                      HOW LONG IS YOUR SET{chosenAct ? ` (MAX ${chosenAct.maxMinutes} MIN)` : ""}
                    </label>
                    <input
                      className="mz-input"
                      value={entry.minutes}
                      onChange={set("minutes")}
                      inputMode="decimal"
                      placeholder={chosenAct ? `Minutes — up to ${chosenAct.maxMinutes}` : "Minutes"}
                    />
                    {!minutesOk && (
                      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--crimson)", marginTop: 6 }}>
                        A {chosenAct?.label.toLowerCase()} slot is up to {chosenAct?.maxMinutes} minutes. Pick a bigger act
                        size if you need longer.
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={label}>AUDITION CLIP</label>
                    <input className="mz-input" value={entry.audition} onChange={set("audition")} inputMode="url" autoCapitalize="off" placeholder="Link to your video" />
                    <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "#5B4480", marginTop: 7 }}>
                      {words.auditionNote}
                    </div>
                  </div>

                  <div style={{ background: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, padding: "15px 17px" }}>
                    {quote ? (
                      <PriceLines price={quote.price} baseLabel={`${(chosenAct?.label ?? "SLOT").toUpperCase()} SLOT`} tone="light" />
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)" }}>SLOT FEE</span>
                        <span className="font-display" style={{ fontSize: 20 }}>…</span>
                      </div>
                    )}
                  </div>

                  <FormNote text={words.contactAccuracyNote} tone="light" />

                  {/* The single most misunderstood thing about this event. */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      background: "#FFE9F0",
                      border: "2px solid var(--crimson)",
                      borderRadius: 14,
                      padding: "11px 13px",
                    }}
                  >
                    <span aria-hidden style={{ fontSize: 14, lineHeight: 1.35 }}>🎟️</span>
                    <span style={{ fontSize: 12.5, lineHeight: 1.55, color: "#8A0B3C" }}>{words.passNote}</span>
                  </div>

                  <button
                    onClick={submit}
                    disabled={!canSubmit || status === "processing"}
                    className="font-display mz-pop"
                    style={{
                      fontSize: 15,
                      color: "var(--lilac)",
                      background: "var(--purple)",
                      border: "3px solid var(--ink)",
                      borderRadius: 20,
                      boxShadow: "6px 6px 0 var(--ink)",
                      padding: "16px 18px",
                      cursor: canSubmit ? "pointer" : "not-allowed",
                      width: "100%",
                      opacity: canSubmit ? 1 : 0.6,
                      ["--mz-shadow" as string]: "6px",
                    }}
                  >
                    {status === "processing"
                      ? words.submitProcessingLabel
                      : words.submitLabel.replace("{total}", quote ? formatPaise(quote.price.totalPaise) : "…")}
                  </button>

                  {status === "error" && <div style={{ fontSize: 13, color: "var(--crimson)" }}>{error}</div>}

                  <div style={{ fontSize: 10.5, lineHeight: 1.6, letterSpacing: "0.06em", color: "#7D63A8" }}>
                    {words.entryFinePrint}
                  </div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 10.5, letterSpacing: "0.1em" }}>
                    {LEGAL_PAGES.map((page) => (
                      <Link key={page.key} href={page.href} style={{ color: "var(--purple)", textDecoration: "underline" }}>
                        {page.label.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: "var(--teal)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "10px 10px 0 var(--ink)", padding: "30px 26px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>{words.doneEyebrow}</div>
                <h2 className="font-display" style={{ fontSize: 26, margin: "12px 0 14px", lineHeight: 1.1 }}>
                  {words.doneTitle} {entry.name}
                </h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "0 0 18px" }}>
                  {fillTokens(words.doneBody, {
                    talent: talents.find((t) => t.value === entry.talent)?.title ?? entry.talent,
                    actLabel: chosenAct?.label ?? "",
                  })}
                </p>

                {entryCode && (
                  <div style={{ background: "var(--paper)", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>SLOT CODE</span>
                    <span className="font-display" style={{ fontSize: 22 }}>{entryCode}</span>
                  </div>
                )}

                {entryTokens.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <button
                      onClick={async () => {
                        setPdfState("working");
                        const ok = await downloadPasses(entryTokens, "madooza-spotlight-slot.pdf");
                        setPdfState(ok ? "saved" : "blocked");
                      }}
                      disabled={pdfState === "working"}
                      className="font-display mz-pop"
                      style={{
                        width: "100%",
                        fontSize: 15,
                        color: "var(--lilac)",
                        background: "var(--purple)",
                        border: "3px solid var(--ink)",
                        borderRadius: 18,
                        boxShadow: "6px 6px 0 var(--ink)",
                        padding: "16px 18px",
                        cursor: "pointer",
                        ["--mz-shadow" as string]: "6px",
                      }}
                    >
                      {pdfState === "working" ? "PREPARING…" : "DOWNLOAD YOUR SLOT PASS (PDF)"}
                    </button>
                    <div style={{ fontSize: 13, lineHeight: 1.55, color: "#453063", marginTop: 10 }}>
                      {pdfState === "saved"
                        ? "Saved to your downloads — and sent to your email as well. Show the QR at the stage desk."
                        : pdfState === "blocked"
                          ? "Your browser wouldn't save it on its own — tap the button above. It has also gone to your email."
                          : "It's on its way to your email too, QR and all."}
                    </div>
                  </div>
                )}

                <div style={{ background: "var(--paper)", border: "3px solid var(--ink)", borderRadius: 20, padding: 16, fontSize: 14.5, lineHeight: 1.55 }}>
                  {words.passNote}
                </div>

                <button
                  onClick={() => {
                    setDone(false);
                    setEntryTokens([]);
                    setEntryCode("");
                    setPdfState("idle");
                    setEntry({
                      name: "", age: "", city: "", phone: "", email: "", instagram: "",
                      talent: talents[0]?.value ?? "", act: acts[0]?.key ?? "solo", minutes: "",
                      crew: "", members: "", audition: "",
                    });
                  }}
                  style={{ marginTop: 20, fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", background: "transparent", border: "2px solid var(--ink)", borderRadius: 14, padding: "13px 16px", cursor: "pointer", color: "var(--ink)" }}
                >
                  {words.doneResetButton}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
