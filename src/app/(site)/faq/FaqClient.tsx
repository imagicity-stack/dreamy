"use client";

import { useState } from "react";
import Image from "next/image";


export default function FaqClient({ faqs, contactEmail }: { faqs: { q: string; a: string }[]; contactEmail: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main>
      <section style={{ background: "var(--bg)", padding: "54px 20px 40px", borderBottom: "3px solid var(--ink)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>08 / THE SMALL PRINT</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px", color: "var(--lilac)" }}>FAQ + VENUE</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--lilac-text)", maxWidth: "58ch", margin: 0 }}>
            The questions the council keeps getting asked in the corridor, answered once, properly.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--paper)", color: "var(--ink)", padding: "46px 20px 60px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 34, alignItems: "start" }}>
          <div style={{ borderTop: "3px solid var(--ink)" }}>
            {faqs.map((f, i) => (
              <div key={f.q} style={{ borderBottom: "3px solid var(--ink)" }}>
                <button
                  onClick={() => setOpen((cur) => (cur === i ? null : i))}
                  style={{ width: "100%", display: "flex", gap: 14, alignItems: "flex-start", textAlign: "left", background: "transparent", border: "none", padding: "18px 4px", cursor: "pointer", color: "var(--ink)" }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "var(--purple)", paddingTop: 4 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontWeight: 700, fontSize: 17.5, lineHeight: 1.35, flex: 1 }}>{f.q}</span>
                  <span className="font-display" style={{ fontSize: 16, color: "var(--purple)" }}>{open === i ? "−" : "+"}</span>
                </button>
                {open === i && (
                  <div style={{ padding: "0 4px 20px 44px", fontSize: 15.5, lineHeight: 1.6, color: "#3A1063", maxWidth: "60ch" }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "var(--purple)", color: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "9px 9px 0 var(--ink)", padding: "26px 24px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)" }}>THE VENUE</div>
              <Image src="/assets/elden-heights-crest.png" alt="" width={64} height={64} style={{ objectFit: "contain", display: "block", margin: "14px 0 8px" }} />
              <h2 className="font-display" style={{ fontSize: 22, margin: "4px 0 14px", lineHeight: 1.15 }}>THE ELDEN HEIGHTS SCHOOL</h2>
              <div style={{ fontSize: 15.5, lineHeight: 1.6, color: "#F0E4FA" }}>
                Main grounds, senior block and the assembly canopy<br />Hazaribagh, Jharkhand 825301
              </div>
              <div style={{ borderTop: "1px dashed var(--muted-lilac)", margin: "18px 0", paddingTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--teal)" }}>GATES</div>
                  <div className="font-display" style={{ fontSize: 17, marginTop: 4 }}>9:00 AM</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--teal)" }}>ARENA</div>
                  <div className="font-display" style={{ fontSize: 17, marginTop: 4 }}>2:30 PM</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--teal)" }}>LAST ACT</div>
                  <div className="font-display" style={{ fontSize: 17, marginTop: 4 }}>6:00 PM</div>
                </div>
              </div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--lilac-text)" }}>
                <strong style={{ color: "var(--lilac)" }}>Getting there:</strong> ten minutes from the Hazaribagh bus
                stand, autos run to the main gate all day. Parking is on the far field, entry through the service
                gate off the back road.
              </div>
            </div>
            <div style={{ background: "var(--teal)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "9px 9px 0 var(--ink)", padding: "24px 22px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>ON THE DAY</div>
              <h3 className="font-display" style={{ fontSize: 19, margin: "10px 0 12px" }}>HELP DESK &amp; LOST THINGS</h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, margin: "0 0 14px" }}>
                Volunteers in gold armbands, help desk beside the coin counter, first aid at the sports room. Lost
                phones end up at the help desk within the hour, they always do.
              </p>
              <a href="tel:+919122280578" className="font-display" style={{ fontSize: 14, color: "var(--ink)", borderBottom: "3px solid var(--ink)" }}>CALL THE FEST OFFICE</a>
            </div>
            <div style={{ background: "var(--bg)", color: "var(--lilac)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "9px 9px 0 var(--ink)", padding: "24px 22px" }}>
              <h3 className="font-display" style={{ fontSize: 19, margin: "0 0 12px", color: "var(--teal)" }}>STILL STUCK?</h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, margin: "0 0 14px", color: "var(--lilac-text)" }}>
                Ask anything and a very real student will answer, usually between classes.
              </p>
              <a href={`mailto:${contactEmail}`} className="font-display" style={{ fontSize: 14, color: "var(--teal)" }}>{contactEmail}</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
