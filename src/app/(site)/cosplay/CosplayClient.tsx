"use client";

import { useState } from "react";
import { openRazorpayCheckout } from "@/lib/razorpayClient";
import { formatInr } from "@/data/fest";
import type { FestSettings } from "@/lib/settings";

const CATEGORIES = [
  { value: "Anime", label: "Anime & Manga" },
  { value: "Comic", label: "Comic & Screen" },
  { value: "Original", label: "Original Design" },
  { value: "Group", label: "Group Act" },
];

const CATEGORY_CARDS = [
  { n: "CATEGORY 01", title: "ANIME & MANGA", body: "Anything from the shelves — shounen, shoujo, that one obscure 90s OVA nobody will recognise.", bg: "var(--purple)", fg: "var(--lilac)", nColor: "var(--teal)" },
  { n: "CATEGORY 02", title: "COMIC & SCREEN", body: "Capes, villains, sitcom characters, and the entire cast of whatever your family binge-watched.", bg: "var(--lilac)", fg: "var(--ink)", nColor: "var(--purple)" },
  { n: "CATEGORY 03", title: "ORIGINAL DESIGN", body: "You invented them. Bring a one-line backstory — the judges will absolutely ask.", bg: "var(--paper)", fg: "var(--ink)", nColor: "var(--purple)" },
  { n: "CATEGORY 04", title: "GROUP ACT", body: "Three to six people, one theme, 90 seconds on stage. Choreography optional but heavily rewarded.", bg: "var(--teal)", fg: "var(--ink)", nColor: "var(--purple)" },
];

const PRIZES = [
  { amount: "₹15K", bg: "var(--teal)", fg: "var(--ink)", body: <><strong>Best in Show</strong> &mdash; plus the trophy and a permanent spot on the arena wall</> },
  { amount: "₹8K", bg: "var(--lilac)", fg: "var(--ink)", amountColor: "var(--purple)", body: <><strong>Category winner &times;4</strong> &mdash; one per category, &#8377;8,000 each</> },
  { amount: "₹5K", bg: "var(--purple)", fg: "var(--lilac)", amountColor: "var(--teal)", body: <><strong>Best Group Act</strong> &mdash; split however your squad decides</> },
  { amount: "CROWD", bg: "var(--paper)", fg: "var(--ink)", amountColor: "var(--purple)", small: true, body: <><strong>People&apos;s Choice</strong> &mdash; voted live by the field, wins the full merch box</> },
];

type Entry = {
  name: string; school: string; phone: string; character: string; category: string;
  mode: "solo" | "team"; team: string; members: string;
};

export default function CosplayClient({ settings }: { settings: FestSettings }) {
  const [entry, setEntry] = useState<Entry>({
    name: "", school: "", phone: "", character: "", category: "Anime", mode: "solo", team: "", members: "",
  });
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState("");

  const canSubmit = entry.name.trim().length > 1 && entry.character.trim().length > 1 && entry.phone.trim().length >= 10;
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
      const orderRes = await fetch("/api/cosplay/order", { method: "POST" });
      if (!orderRes.ok) {
        const { error: msg } = await orderRes.json().catch(() => ({ error: "Could not start checkout" }));
        throw new Error(msg || "Could not start checkout");
      }
      const order = await orderRes.json();

      await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "MADOOZA Cosplay Contest",
        description: `${entryLabel} — ${entry.character}`,
        order_id: order.orderId,
        prefill: { name: entry.name, contact: entry.phone },
        theme: { color: "#35C6D4" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/cosplay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                entry,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment could not be verified");
            setDone(true);
            setStatus("idle");
            window.scrollTo(0, 0);
          } catch (e) {
            setStatus("error");
            setError(e instanceof Error ? e.message : "Something went wrong verifying payment");
          }
        },
        modal: { ondismiss: () => setStatus("idle") },
      });
    } catch (e) {
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
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--purple)" }}>03 / THE ARENA</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px" }}>COSPLAY CONTEST</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: "60ch", margin: 0 }}>
            Four categories. Solo or squad. A stage walk in front of the whole field at 2:30 PM, and &#8377;40,000
            split across the winners. Registration is {formatInr(settings.cosplayFee)} an entry, solo or squad, and
            closes two weeks before gates open &mdash; or when 120 entries fill up, whichever lands first.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "54px 20px 60px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18, marginBottom: 46 }}>
            {CATEGORY_CARDS.map((c) => (
              <div key={c.n} style={{ background: c.bg, color: c.fg, border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "7px 7px 0 var(--ink)", padding: "22px 20px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: c.nColor }}>{c.n}</div>
                <h3 className="font-display" style={{ fontSize: 20, margin: "10px 0 8px" }}>{c.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 26, alignItems: "start" }}>
            <div>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", margin: "0 0 8px", color: "var(--lilac)" }}>THE PRIZE POOL</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--lilac-text)", margin: "0 0 22px", maxWidth: "46ch" }}>
                Cash, trophies, and the merch drop before it goes on sale. Judged by the guest panel &mdash; one of
                whom is still in the vault.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {PRIZES.map((p) => (
                  <div key={p.amount} style={{ display: "flex", alignItems: "center", gap: 16, background: p.bg, color: p.fg, border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "16px 18px" }}>
                    <div className="font-display" style={{ fontSize: p.small ? 20 : 26, minWidth: 62, color: p.amountColor }}>{p.amount}</div>
                    <div style={{ fontSize: 14.5, lineHeight: 1.45 }}>{p.body}</div>
                  </div>
                ))}
              </div>
            </div>

            {!done ? (
              <div style={{ background: "var(--paper)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "10px 10px 0 var(--ink)", padding: "28px 26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <h2 className="font-display" style={{ fontSize: 22, margin: 0 }}>REGISTER</h2>
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
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
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
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 17px" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)" }}>{entryLabel} FEE</div>
                    <div className="font-display" style={{ fontSize: 24 }}>{formatInr(settings.cosplayFee)}</div>
                  </div>
                  <button
                    onClick={submitCos}
                    disabled={!canSubmit || status === "processing"}
                    className="font-display mz-pop"
                    style={{ fontSize: 15, color: "var(--lilac)", background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "16px 18px", cursor: canSubmit ? "pointer" : "not-allowed", width: "100%", opacity: canSubmit ? 1 : 0.6, ["--mz-shadow" as string]: "6px" }}
                  >
                    {status === "processing" ? "OPENING PAYMENT…" : `PAY ${formatInr(settings.cosplayFee)} · PUT ME IN THE ARENA`}
                  </button>
                  {status === "error" && <div style={{ fontSize: 13, color: "var(--crimson)" }}>{error}</div>}
                  <div style={{ fontSize: 10.5, lineHeight: 1.6, letterSpacing: "0.06em", color: "#7D63A8" }}>
                    {formatInr(settings.cosplayFee)} PER ENTRY &middot; A FETE OR CONCERT PASS IS STILL NEEDED &middot; PROPS UNDER 1.2M
                    &middot; NOTHING SHARP, NOTHING THAT FIRES
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: "var(--teal)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "10px 10px 0 var(--ink)", padding: "30px 26px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>ENTRY LOGGED</div>
                <h2 className="font-display" style={{ fontSize: 26, margin: "12px 0 14px", lineHeight: 1.1 }}>SEE YOU AT THE ARENA, {entry.name}</h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "0 0 18px" }}>
                  You&apos;re down as <strong>{entry.character}</strong> in <strong>{CATEGORIES.find((c) => c.value === entry.category)?.label}</strong>. Backstage call is 1:45 PM near the
                  science block; stage walk starts at 2:30. We&apos;ll message the exact slot the week before.
                </p>
                <div style={{ background: "var(--purple)", color: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, padding: "15px 16px", fontSize: 14.5, lineHeight: 1.55, marginBottom: 12 }}>
                  <strong style={{ color: "var(--teal)" }}>{formatInr(settings.cosplayFee)} entry fee received.</strong> Your
                  slot is held; the fee is non-refundable but transferable to another entrant until entries close.
                </div>
                <div style={{ background: "var(--paper)", border: "3px solid var(--ink)", borderRadius: 20, padding: 16, fontSize: 14.5, lineHeight: 1.55 }}>
                  Bring a repair kit. Every year somebody&apos;s armour gives up in the queue and the Art Club runs
                  out of hot glue by noon.
                </div>
                <button
                  onClick={() => {
                    setDone(false);
                    setEntry({ name: "", school: "", phone: "", character: "", category: "Anime", mode: "solo", team: "", members: "" });
                  }}
                  style={{ marginTop: 20, fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", background: "transparent", border: "2px solid var(--ink)", borderRadius: 14, padding: "13px 16px", cursor: "pointer", color: "var(--ink)" }}
                >
                  REGISTER SOMEONE ELSE
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
