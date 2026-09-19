"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FEST } from "@/data/fest";

const SEAT_LABELS: Record<string, string> = {
  "1": "1 seat",
  "2": "2 seats",
  "4": "3–4 seats",
  "8": "5+ seats",
};

type Ticket = { name: string; no: string; pick: string; guess: string; seats: string };

export default function ConcertPage() {
  const [interestCount, setInterestCount] = useState(FEST.interestBase.toLocaleString("en-IN"));
  const [form, setForm] = useState({ name: "", contact: "", pick: "", guess: "", seats: "1" });
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => d.interestCount && setInterestCount(d.interestCount))
      .catch(() => {});
  }, []);

  async function submit() {
    if (form.name.trim().length < 2 || form.contact.trim().length < 5 || form.pick.trim().length < 2) return;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/concert-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Could not join the list — try again");
      const data = await res.json();
      setTicket({
        name: form.name.trim().split(" ")[0].toUpperCase(),
        no: data.queueNumber,
        pick: form.pick.trim(),
        guess: form.guess.trim() || "Kept to yourself",
        seats: SEAT_LABELS[form.seats] || "1 seat",
      });
      if (data.queueNumber) setInterestCount(data.queueNumber);
      setStatus("idle");
      window.scrollTo(0, 0);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <main>
      <section style={{ background: "var(--near-black)", color: "var(--lilac)", borderBottom: "3px solid var(--teal)", padding: "54px 20px 64px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#35C6D4 1.1px, transparent 1.2px)",
            backgroundSize: "15px 15px",
            opacity: 0.08,
            animation: "mzdrift 34s linear infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -220,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(53,198,212,0.22) 0%, rgba(10,1,24,0) 66%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>05 / THE CONCERT</div>
          <h1 className="font-display" style={{ fontSize: "clamp(34px, 7.4vw, 78px)", lineHeight: 0.98, margin: "14px 0 0", color: "var(--teal)", textShadow: "5px 5px 0 var(--ink)" }}>
            GUESS WHO.
          </h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, color: "var(--lilac-text)", maxWidth: "56ch", margin: "18px 0 0" }}>
            One singer. One 4:30 PM slot on the main stage. No name, no poster, no price &mdash; not until the
            council is ready. Everything we will say is below.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 30, alignItems: "center", marginTop: 44 }}>
            <div style={{ position: "relative", minHeight: 380, display: "flex", alignItems: "flex-end", justifyContent: "center", border: "3px solid var(--teal)", borderRadius: 26, background: "#150331", overflow: "hidden", boxShadow: "10px 10px 0 var(--ink)" }}>
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 300,
                  height: 440,
                  background: "linear-gradient(180deg, rgba(53,198,212,0.30), rgba(53,198,212,0.02) 72%, rgba(53,198,212,0))",
                  clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "absolute", top: 16, left: 18, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "var(--teal-light)" }}>
                IDENTITY REDACTED
              </div>
              <div
                className="font-display"
                style={{ position: "absolute", top: "16%", right: 12, fontSize: 132, lineHeight: 1, color: "rgba(53,198,212,0.30)", pointerEvents: "none", animation: "mzpulse 3.4s ease-in-out infinite" }}
              >
                ?
              </div>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: -3 }}>
                <div style={{ width: 74, height: 74, borderRadius: "50%", background: "#000000" }} />
                <div style={{ width: 26, height: 16, background: "#000000", marginTop: -2 }} />
                <div style={{ width: 186, height: 210, background: "#000000", borderRadius: "92px 92px 18px 18px / 120px 120px 18px 18px" }} />
              </div>
              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(126px)", width: 7, height: 172, background: "#000000" }} />
              <div style={{ position: "absolute", bottom: 168, left: "50%", transform: "translateX(112px)", width: 34, height: 13, background: "#000000", borderRadius: 999 }} />
              <div style={{ position: "absolute", bottom: 174, left: "50%", transform: "translateX(96px)", width: 22, height: 22, borderRadius: "50%", background: "#000000" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#150331", border: "3px solid var(--teal)", borderRadius: 20, padding: "20px 22px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal-light)" }}>WHAT WE WILL CONFIRM</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14, fontSize: 15.5, lineHeight: 1.5, color: "#F0E4FA" }}>
                  <div style={{ display: "flex", gap: 11 }}><span style={{ color: "var(--teal)", fontWeight: 700 }}>&#9733;</span><span>Main stage, 4:30 PM, running to the 6:00 PM encore</span></div>
                  <div style={{ display: "flex", gap: 11 }}><span style={{ color: "var(--teal)", fontWeight: 700 }}>&#9733;</span><span>A national touring act, playing a full live set</span></div>
                  <div style={{ display: "flex", gap: 11 }}><span style={{ color: "var(--teal)", fontWeight: 700 }}>&#9733;</span><span>{FEST.concertCapacity.toLocaleString("en-IN")} seats on the field, front-of-stage pit included</span></div>
                  <div style={{ display: "flex", gap: 11 }}><span style={{ color: "var(--teal)", fontWeight: 700 }}>&#9733;</span><span>Sometime in November &mdash; the day drops with the name</span></div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
                <div style={{ background: "var(--teal)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "18px 20px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)" }}>PASS PRICE</div>
                  <div className="font-display" style={{ fontSize: 26, marginTop: 7 }}>SEALED</div>
                </div>
                <div style={{ background: "var(--crimson)", color: "#FFF0F5", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "18px 20px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "#FFD3E2" }}>THE NAME</div>
                  <div className="font-display" style={{ fontSize: 26, marginTop: 7 }}>SOON</div>
                </div>
              </div>
              <div style={{ fontSize: 11.5, lineHeight: 1.7, letterSpacing: "0.1em", color: "#9E86C6" }}>
                {interestCount} HAVE ALREADY PUT THEIR NAME DOWN
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "54px 20px 64px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {!ticket ? (
            <div style={{ background: "var(--paper)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 26, boxShadow: "12px 12px 0 var(--ink)", padding: "30px 28px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>NO PAYMENT, NO COMMITMENT</div>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 38px)", lineHeight: 1.04, margin: "10px 0 10px" }}>PUT YOUR NAME DOWN</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 24px", maxWidth: "54ch" }}>
                The interest list gets the name, the date and the price one hour before the rest of Hazaribagh, and a
                48-hour window on the {FEST.concertCapacity.toLocaleString("en-IN")} seats. Tell us who you&apos;re
                hoping for while you&apos;re here &mdash; the council reads every single one.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>YOUR NAME</label>
                  <input className="mz-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="First name is enough" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>PHONE OR EMAIL</label>
                  <input className="mz-input" value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} placeholder="Where the reveal should land" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>WHICH SINGER DO YOU WANT ON THAT STAGE</label>
                  <input className="mz-input" value={form.pick} onChange={(e) => setForm((f) => ({ ...f, pick: e.target.value }))} placeholder="One name &mdash; the artist you'd buy a pass for without thinking" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>
                    AND YOUR GUESS FOR WHO IT ACTUALLY IS <span style={{ letterSpacing: "0.1em", color: "#7D63A8" }}>&mdash; OPTIONAL</span>
                  </label>
                  <input className="mz-input" value={form.guess} onChange={(e) => setForm((f) => ({ ...f, guess: e.target.value }))} placeholder="Get it right and there's a merch box in it for you" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--purple)", marginBottom: 6 }}>HOW MANY SEATS WOULD YOU WANT</label>
                  <select className="mz-input" value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))}>
                    <option value="1">Just me</option>
                    <option value="2">Two of us</option>
                    <option value="4">Three or four</option>
                    <option value="8">Five or more &mdash; it&apos;s a whole group</option>
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={submit}
                    disabled={status === "submitting"}
                    className="font-display mz-pop"
                    style={{ fontSize: 16, color: "var(--teal)", background: "var(--near-black)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "17px 20px", cursor: "pointer", width: "100%", ["--mz-shadow" as string]: "6px" }}
                  >
                    {status === "submitting" ? "SENDING…" : "TELL ME THE SECOND IT DROPS"}
                  </button>
                  {status === "error" && <div style={{ fontSize: 13, color: "var(--pink)" }}>{error}</div>}
                  <div style={{ fontSize: 10.5, lineHeight: 1.7, letterSpacing: "0.06em", color: "#7D63A8" }}>
                    NO CARD, NO PAYMENT, NO PASS RESERVED &middot; ONE MESSAGE AT THE REVEAL AND NOTHING ELSE
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "var(--near-black)", color: "var(--lilac)", border: "3px solid var(--teal)", borderRadius: 26, boxShadow: "12px 12px 0 var(--ink)", padding: "32px 28px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal-light)" }}>YOU&apos;RE ON THE LIST</div>
              <h2 className="font-display" style={{ fontSize: "clamp(24px, 4vw, 36px)", lineHeight: 1.06, margin: "12px 0 16px", color: "var(--teal)" }}>
                NOTED, {ticket.name}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 20px", maxWidth: "56ch" }}>
                You&apos;re <strong style={{ color: "var(--teal)" }}>#{ticket.no}</strong> on the interest list, down for{" "}
                <strong>{ticket.seats}</strong>. When the name and price go up, you hear first &mdash; one hour ahead
                of the poster.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
                <div style={{ background: "#150331", border: "3px solid var(--purple)", borderRadius: 20, padding: "18px 20px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--teal)" }}>YOU ASKED FOR</div>
                  <div className="font-display" style={{ fontSize: 19, marginTop: 8, lineHeight: 1.2 }}>{ticket.pick}</div>
                </div>
                <div style={{ background: "#150331", border: "3px solid var(--purple)", borderRadius: 20, padding: "18px 20px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", color: "var(--teal)" }}>YOUR GUESS</div>
                  <div className="font-display" style={{ fontSize: 19, marginTop: 8, lineHeight: 1.2 }}>{ticket.guess}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
                <Link
                  href="/tickets"
                  className="mz-pop font-display"
                  style={{ fontSize: 14, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "5px 5px 0 var(--ink)", padding: "14px 18px", ["--mz-shadow" as string]: "5px" }}
                >
                  GRAB A FETE PASS MEANWHILE
                </Link>
                <button
                  onClick={() => {
                    setTicket(null);
                    setForm({ name: "", contact: "", pick: "", guess: "", seats: "1" });
                  }}
                  style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", background: "transparent", border: "2px solid var(--teal-light)", borderRadius: 14, padding: "13px 16px", cursor: "pointer", color: "var(--teal-light)" }}
                >
                  ADD SOMEONE ELSE
                </button>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginTop: 30 }}>
            <div style={{ background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "7px 7px 0 var(--ink)", padding: "22px 20px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)" }}>WHY THE SECRECY</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--lilac-text)", margin: "11px 0 0" }}>
                Contracts. The act is booked, the paperwork is not, and the council would rather say nothing than say
                it twice.
              </p>
            </div>
            <div style={{ background: "var(--lilac)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "7px 7px 0 var(--ink)", padding: "22px 20px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>WHEN IT DROPS</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: "11px 0 0" }}>
                With the final lineup reveal in November. Name, price, date and the pass sale all in the same hour.
              </p>
            </div>
            <div style={{ background: "var(--paper)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "7px 7px 0 var(--ink)", padding: "22px 20px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>CHASING CLUES</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: "11px 0 0" }}>
                There are three on the <Link href="/lineup">Lineup page</Link>. One of them is about this set. Good
                luck.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
