"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PriceLines from "@/components/PriceLines";
import { isPageHidden, type FestSettings } from "@/lib/festSettings";
import { LEGAL_PAGES } from "@/lib/legal";
import { formatPaise } from "@/lib/pricing";
import { CheckoutDismissed, fetchQuote, startCheckout, type Quote } from "@/lib/checkoutClient";

export type Category = {
  id: string;
  title: string;
  value: string;
  body: string;
  image: { url: string } | null;
};

export type Prize = { id: string; amount: string; title: string; note: string };

/** Cycled so a fifth category still looks like it belongs to the set. */
const CARD_SKINS = [
  { bg: "var(--purple)", fg: "var(--lilac)", nColor: "var(--teal)" },
  { bg: "var(--lilac)", fg: "var(--ink)", nColor: "var(--purple)" },
  { bg: "var(--paper)", fg: "var(--ink)", nColor: "var(--purple)" },
  { bg: "var(--teal)", fg: "var(--ink)", nColor: "var(--purple)" },
];

const PRIZE_SKINS = [
  { bg: "var(--teal)", fg: "var(--ink)", amountColor: undefined as string | undefined },
  { bg: "var(--lilac)", fg: "var(--ink)", amountColor: "var(--purple)" },
  { bg: "var(--purple)", fg: "var(--lilac)", amountColor: "var(--teal)" },
  { bg: "var(--paper)", fg: "var(--ink)", amountColor: "var(--purple)" },
];

/** The confirmation line names the character and the category the entrant chose, in bold. */
function fillEntryTokens(text: string, values: { character: string; entryCategory: string }) {
  return text.split(/(\{character\}|\{entryCategory\})/).map((part, i) => {
    if (part === "{character}") return <strong key={i}>{values.character}</strong>;
    if (part === "{entryCategory}") return <strong key={i}>{values.entryCategory}</strong>;
    return part;
  });
}

type Entry = {
  name: string; school: string; phone: string; email: string; character: string; category: string;
  mode: "solo" | "team"; team: string; members: string;
};

export default function CosplayClient({
  settings,
  words,
  categories,
  prizes,
  carnivalTiersLive,
}: {
  settings: FestSettings;
  words: Record<string, string>;
  categories: Category[];
  prizes: Prize[];
  carnivalTiersLive: boolean;
}) {
  const [entry, setEntry] = useState<Entry>({
    name: "", school: "", phone: "", email: "", character: "", category: categories[0]?.value ?? "", mode: "solo", team: "", members: "",
  });
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [entryCode, setEntryCode] = useState("");

  // The fee, the convenience charge and the GST on it are priced by the server;
  // solo and squad cost the same today, but the quote is asked for either way
  // so the panel never has to know that.
  useEffect(() => {
    let live = true;
    fetchQuote("cosplayEntry", { mode: entry.mode })
      .then((q) => live && setQuote(q))
      .catch(() => live && setQuote(null));
    return () => {
      live = false;
    };
  }, [entry.mode]);

  // The fee note opens with a bold teal sentence and runs on in plain text.
  const feeBreak = words.doneFeeNote.indexOf(". ");
  const feeLead = feeBreak === -1 ? words.doneFeeNote : words.doneFeeNote.slice(0, feeBreak + 1);
  const feeRest = feeBreak === -1 ? "" : words.doneFeeNote.slice(feeBreak + 1);

  const canSubmit =
    entry.name.trim().length > 1 &&
    entry.character.trim().length > 1 &&
    entry.phone.trim().length >= 10 &&
    !!quote;
  const entryLabel = entry.mode === "team" ? "SQUAD ENTRY" : "SOLO ENTRY";

  function set<K extends keyof Entry>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEntry((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function submitCos() {
    if (!canSubmit) return;
    setStatus("processing");
    setError("");
    try {
      const receipt = await startCheckout({
        product: "cosplayEntry",
        input: { mode: entry.mode },
        // The whole entry rides along with the order, so a browser that dies
        // after paying still leaves the webhook everything it needs to register
        // the walk.
        customer: {
          name: entry.name,
          phone: entry.phone,
          email: entry.email,
          school: entry.school,
          character: entry.character,
          category: entry.category,
          mode: entry.mode,
          team: entry.team,
          members: entry.members,
        },
        title: "MADOOZA Cosplay Contest",
      });
      setEntryCode(receipt.primaryCode);
      setDone(true);
      setStatus("idle");
      window.scrollTo(0, 0);
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
      <section style={{ background: "var(--teal)", color: "var(--ink)", borderBottom: "3px solid var(--ink)", padding: "54px 20px 46px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(#150331 1.5px, transparent 1.6px)",
            backgroundSize: "12px 12px", opacity: 0.14, animation: "mzdrift 30s linear infinite", pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--purple)" }}>{words.heroEyebrow}</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px" }}>{words.heroTitle}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: "60ch", margin: 0 }}>
            {words.heroIntro}
          </p>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "54px 20px 60px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18, marginBottom: 46 }}>
            {categories.map((c, i) => {
              const skin = CARD_SKINS[i % CARD_SKINS.length];
              return (
                <div key={c.id} style={{ background: skin.bg, color: skin.fg, border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "7px 7px 0 var(--ink)", padding: "22px 20px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: skin.nColor }}>
                    {words.categoryCardKicker} {String(i + 1).padStart(2, "0")}
                  </div>
                  {c.image?.url && (
                    <div style={{ position: "relative", height: 130, margin: "12px 0 4px", border: "2px solid var(--ink)", borderRadius: 14, overflow: "hidden" }}>
                      <Image src={c.image.url} alt={c.title} fill sizes="(max-width: 700px) 100vw, 260px" style={{ objectFit: "cover" }} />
                    </div>
                  )}
                  <h3 className="font-display" style={{ fontSize: 20, margin: "10px 0 8px" }}>{c.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{c.body}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 26, alignItems: "start" }}>
            <div>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", margin: "0 0 8px", color: "var(--lilac)" }}>{words.prizesTitle}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--lilac-text)", margin: "0 0 22px", maxWidth: "46ch" }}>
                {words.prizesIntro}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {prizes.map((p, i) => {
                  const skin = PRIZE_SKINS[i % PRIZE_SKINS.length];
                  // A word like CROWD needs to be smaller than a figure like ₹15K.
                  const wordy = p.amount.length > 4;
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, background: skin.bg, color: skin.fg, border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "16px 18px" }}>
                      <div className="font-display" style={{ fontSize: wordy ? 20 : 26, minWidth: 62, color: skin.amountColor }}>{p.amount}</div>
                      <div style={{ fontSize: 14.5, lineHeight: 1.45 }}>
                        <strong>{p.title}</strong>{p.note ? <> &mdash; {p.note}</> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              {carnivalTiersLive && !isPageHidden(settings, "sponsors") && (
                <div style={{ marginTop: 22, borderTop: "2px dashed var(--purple)", paddingTop: 18 }}>
                  <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--muted-lilac)", margin: "0 0 12px", maxWidth: "46ch" }}>
                    {words.partnersNote}
                  </p>
                  <Link href="/sponsors" className="font-display" style={{ fontSize: 13, letterSpacing: "0.04em", color: "var(--teal)" }}>
                    {words.partnersCtaLabel}
                  </Link>
                </div>
              )}
            </div>

            {!done ? (
              <div style={{ background: "var(--paper)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "10px 10px 0 var(--ink)", padding: "28px 26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <h2 className="font-display" style={{ fontSize: 22, margin: 0 }}>{words.registerTitle}</h2>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", color: "var(--purple)" }}>{entryLabel}</div>
                </div>
                <div style={{ display: "flex", gap: 0, margin: "20px 0 22px", border: "3px solid var(--ink)", borderRadius: 999, overflow: "hidden" }}>
                  <button
                    onClick={() => setEntry((e) => ({ ...e, mode: "solo" }))}
                    className="font-display"
                    style={{ flex: 1, fontSize: 13, padding: "13px 8px", cursor: "pointer", border: "none", borderRight: "3px solid var(--ink)", background: entry.mode === "solo" ? "var(--teal)" : "var(--paper)", color: "var(--ink)" }}
                  >
                    SOLO
                  </button>
                  <button
                    onClick={() => setEntry((e) => ({ ...e, mode: "team" }))}
                    className="font-display"
                    style={{ flex: 1, fontSize: 13, padding: "13px 8px", cursor: "pointer", border: "none", background: entry.mode === "team" ? "var(--teal)" : "var(--paper)", color: "var(--ink)" }}
                  >
                    SQUAD
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>YOUR NAME</label>
                    <input className="mz-input" value={entry.name} onChange={set("name")} placeholder="Out-of-costume name, please" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>SCHOOL / COLLEGE</label>
                    <input className="mz-input" value={entry.school} onChange={set("school")} placeholder="Or 'independent' if you're out of school" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>PHONE</label>
                    <input className="mz-input" value={entry.phone} onChange={set("phone")} placeholder="10 digits — for slot timings on the day" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>EMAIL</label>
                    <input className="mz-input" value={entry.email} onChange={set("email")} placeholder="Optional — where the receipt goes" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>WHO ARE YOU COMING AS</label>
                    <input className="mz-input" value={entry.character} onChange={set("character")} placeholder="Character and source" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>CATEGORY</label>
                    <select
                      className="mz-input"
                      value={entry.category}
                      onChange={(e) => setEntry((prev) => ({ ...prev, category: e.target.value }))}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.value}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  {entry.mode === "team" && (
                    <div style={{ display: "grid", gap: 15, background: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, padding: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>SQUAD NAME</label>
                        <input className="mz-input" value={entry.team} onChange={set("team")} placeholder="Make it embarrassing" />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>MEMBERS (3–6)</label>
                        <textarea className="mz-input" value={entry.members} onChange={set("members")} rows={3} placeholder="One name per line, including you" style={{ resize: "vertical" }} />
                      </div>
                    </div>
                  )}
                  <div style={{ background: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, padding: "15px 17px" }}>
                    {quote ? (
                      <PriceLines price={quote.price} baseLabel={`${entryLabel} FEE`} tone="light" />
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)" }}>{entryLabel} FEE</span>
                        <span className="font-display" style={{ fontSize: 20 }}>…</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={submitCos}
                    disabled={!canSubmit || status === "processing"}
                    className="font-display mz-pop"
                    style={{ fontSize: 15, color: "var(--lilac)", background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "16px 18px", cursor: canSubmit ? "pointer" : "not-allowed", width: "100%", opacity: canSubmit ? 1 : 0.6, ["--mz-shadow" as string]: "6px" }}
                  >
                    {status === "processing"
                      ? words.submitProcessingLabel
                      : words.submitLabel.replace("{total}", quote ? formatPaise(quote.price.totalPaise) : "…")}
                  </button>
                  {status === "error" && <div style={{ fontSize: 13, color: "var(--crimson)" }}>{error}</div>}
                  <div style={{ fontSize: 10.5, lineHeight: 1.6, letterSpacing: "0.06em", color: "#7D63A8" }}>
                    {words.entryFinePrint}
                  </div>
                  {/* The entry fee is non-refundable, so say where that is written down. */}
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
                <h2 className="font-display" style={{ fontSize: 26, margin: "12px 0 14px", lineHeight: 1.1 }}>{words.doneTitle} {entry.name}</h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "0 0 18px" }}>
                  {fillEntryTokens(words.doneBody, {
                    character: entry.character,
                    entryCategory: categories.find((c) => c.value === entry.category)?.title ?? entry.category,
                  })}
                </p>
                <div style={{ background: "var(--purple)", color: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, padding: "15px 16px", fontSize: 14.5, lineHeight: 1.55, marginBottom: 12 }}>
                  <strong style={{ color: "var(--teal)" }}>{feeLead}</strong>{feeRest}
                </div>
                {entryCode && (
                  <div style={{ background: "var(--paper)", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>ENTRY CODE</span>
                    <span className="font-display" style={{ fontSize: 22 }}>{entryCode}</span>
                  </div>
                )}
                <div style={{ background: "var(--paper)", border: "3px solid var(--ink)", borderRadius: 20, padding: 16, fontSize: 14.5, lineHeight: 1.55 }}>
                  {words.doneRepairNote}
                </div>
                <button
                  onClick={() => {
                    setDone(false);
                    setEntry({ name: "", school: "", phone: "", email: "", character: "", category: categories[0]?.value ?? "", mode: "solo", team: "", members: "" });
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
