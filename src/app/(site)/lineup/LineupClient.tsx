"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { isPageHidden, type FestSettings } from "@/lib/festSettings";

export type ArtistCard = {
  id: string;
  slot: string;
  kicker: string;
  clue: string;
  hint: string;
  reveal: string;
  revealed: boolean;
  name: string;
  bio: string;
  image: { path: string; url: string } | null;
};

export type SupportAct = { id: string; name: string; when: string; note: string };

export default function LineupClient({
  settings,
  words,
  lineup,
  supportActs,
}: {
  settings: FestSettings;
  words: Record<string, string>;
  lineup: ArtistCard[];
  supportActs: SupportAct[];
}) {
  const [peeked, setPeeked] = useState<Record<string, boolean>>({});

  return (
    <main>
      <section
        style={{
          background: "var(--purple)",
          borderBottom: "3px solid var(--ink)",
          padding: "54px 20px 46px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#150331 1.4px, transparent 1.5px)",
            backgroundSize: "11px 11px",
            opacity: 0.16,
            animation: "mzdrift 34s linear infinite",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>{words.heroEyebrow}</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px", color: "var(--lilac)" }}>
            {words.heroTitle}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#F0E4FA", maxWidth: "60ch", margin: 0 }}>
            {words.heroIntro}
          </p>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "56px 20px 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 22 }}>
          {lineup.map((card) => {
            const open = settings.lineupUnlocked || !!peeked[card.id];
            const out = card.revealed && card.name.trim().length > 0;
            return (
              <div
                key={card.id}
                style={{
                  background: "var(--paper)",
                  color: "var(--ink)",
                  border: "3px solid var(--ink)",
                  borderRadius: 20,
                  boxShadow: "9px 9px 0 var(--ink)",
                  padding: "24px 22px 22px",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 380,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "var(--purple)" }}>{card.kicker}</div>
                  <Image src="/assets/madooza-badge.png" alt="" width={26} height={26} style={{ display: "block" }} />
                </div>
                <h2 className="font-display" style={{ fontSize: 27, margin: "12px 0 18px", lineHeight: 1.08 }}>{card.slot}</h2>

                {out && (
                  <div
                    style={{
                      flex: 1,
                      background: "var(--purple)",
                      border: "2px solid var(--ink)",
                      borderRadius: 14,
                      padding: card.image ? 0 : "20px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      overflow: "hidden",
                      animation: "mzclue .45s cubic-bezier(.2,.7,.3,1) both",
                    }}
                  >
                    {card.image && (
                      <Image
                        src={card.image.url}
                        alt={card.name}
                        width={560}
                        height={260}
                        style={{ width: "100%", height: 190, objectFit: "cover", borderBottom: "2px solid var(--ink)" }}
                      />
                    )}
                    <div style={{ padding: card.image ? "4px 18px 18px" : 0, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)" }}>{words.artistCardConfirmedLabel}</div>
                      <div className="font-display" style={{ fontSize: 24, lineHeight: 1.1, color: "var(--paper)" }}>{card.name}</div>
                      {card.bio && <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#F0E4FA", margin: 0 }}>{card.bio}</p>}
                    </div>
                  </div>
                )}

                {!out && !open && (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      background: "var(--bg)",
                      border: "2px solid var(--ink)",
                      borderRadius: 14,
                      padding: "26px 18px",
                      gap: 14,
                    }}
                  >
                    <div
                      className="font-display"
                      style={{
                        width: 46,
                        height: 46,
                        border: "3px solid var(--hot-pink)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--hot-pink)",
                        fontSize: 20,
                        animation: "mzpulse 2.4s ease-in-out infinite",
                      }}
                    >
                      <span style={{ animation: "mzflick 4.5s steps(1,end) infinite" }}>?</span>
                    </div>
                    <div style={{ fontSize: 12, letterSpacing: "0.16em", color: "var(--muted-lilac)" }}>{words.artistCardSealedNote}</div>
                  </div>
                )}

                {!out && open && (
                  <div
                    style={{
                      flex: 1,
                      background: "var(--purple)",
                      border: "2px solid var(--ink)",
                      borderRadius: 14,
                      padding: "20px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      animation: "mzclue .45s cubic-bezier(.2,.7,.3,1) both",
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)" }}>{words.artistCardClueLabel}</div>
                    <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "var(--paper)", margin: 0 }}>{card.clue}</p>
                    <div style={{ borderTop: "1px dashed var(--muted-lilac)", paddingTop: 12, marginTop: "auto" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)", marginBottom: 6 }}>{words.artistCardHintLabel}</div>
                      <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#F0E4FA", margin: 0 }}>{card.hint}</p>
                    </div>
                  </div>
                )}

                {!out && (
                <button
                  onClick={() => setPeeked((p) => ({ ...p, [card.id]: !p[card.id] }))}
                  className="font-display mz-pop"
                  style={{
                    marginTop: 16,
                    fontSize: 13,
                    letterSpacing: "0.02em",
                    color: "var(--ink)",
                    background: "var(--teal)",
                    border: "3px solid var(--ink)",
                    borderRadius: 20,
                    boxShadow: "5px 5px 0 var(--ink)",
                    padding: "13px 14px",
                    cursor: "pointer",
                    width: "100%",
                    ["--mz-shadow" as string]: "5px",
                    ["--mz-lift" as string]: "1px",
                  }}
                >
                  {words.artistCardPeekButton}
                </button>
                )}
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", color: "var(--purple)", marginTop: 12, textAlign: "center" }}>
                  {out ? words.artistCardAnnouncedLabel : card.reveal}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ background: "var(--paper)", color: "var(--ink)", borderTop: "3px solid var(--ink)", borderBottom: "3px solid var(--ink)", padding: "56px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--purple)" }}>{words.supportEyebrow}</div>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 38px)", margin: "12px 0 26px" }}>{words.supportTitle}</h2>
          <div style={{ display: "grid", gap: 0, borderTop: "2px solid var(--ink)" }}>
            {supportActs.map((act) => (
              <div
                key={act.id}
                style={{ display: "grid", gridTemplateColumns: "90px minmax(0,1fr)", gap: 18, alignItems: "baseline", padding: "18px 4px", borderBottom: "2px solid var(--ink)" }}
              >
                <div className="font-display" style={{ fontSize: 15, color: "var(--purple)" }}>{act.when}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 19 }}>{act.name}</div>
                  <div style={{ fontSize: 15, color: "#453063", marginTop: 3 }}>{act.note}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 }}>
            {!isPageHidden(settings, "tickets") && (
            <Link
              href="/tickets"
              className="mz-pop font-display"
              style={{ fontSize: 15, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 999, boxShadow: "6px 6px 0 var(--ink)", padding: "16px 28px", ["--mz-shadow" as string]: "6px" }}
            >
              {words.ticketsCtaLabel}
            </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
