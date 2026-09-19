import Link from "next/link";
import { stalls } from "@/data/fest";

const COIN_FACTS = [
  { title: "₹10 = 1 COIN", note: "Two coin counters by the main arch. Cards and UPI accepted there." },
  { title: "5 FREE", note: "Every pass, fete or concert, starts with five coins loaded." },
  { title: "REFUND TILL 5", note: "Unspent coins go back to cash until 5:00 PM. After that they're souvenirs." },
  { title: "NO CASH", note: "If a stall asks for money, it isn't one of ours. Tell a volunteer." },
];

export default function FetePage() {
  return (
    <main>
      <section style={{ background: "var(--lilac)", color: "var(--ink)", borderBottom: "3px solid var(--ink)", padding: "54px 20px 46px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--purple)" }}>05 / THE GROUNDS</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px" }}>FETE &amp; CARNIVAL</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: "60ch", margin: 0 }}>
            Forty-plus stalls run by clubs, classes and a few very ambitious parents. Everything inside the grounds
            runs on MADOOZA coins &mdash; no cash at any counter, so nobody has to make change while a band is
            playing.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--teal)", color: "var(--ink)", borderBottom: "3px solid var(--ink)", padding: "34px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
          {COIN_FACTS.map((f) => (
            <div key={f.title}>
              <div className="font-display" style={{ fontSize: 22 }}>{f.title}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.5, marginTop: 6 }}>{f.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "54px 20px 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 38px)", margin: "0 0 26px", color: "var(--lilac)" }}>WHERE YOUR COINS WILL GO</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))", gap: 18 }}>
            {stalls.map((stall) => (
              <div
                key={stall.zone}
                className="mz-pop"
                style={{ background: "var(--paper)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "7px 7px 0 var(--ink)", padding: "20px 18px", display: "flex", flexDirection: "column", gap: 10, ["--mz-shadow" as string]: "7px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <h3 className="font-display" style={{ fontSize: 17, margin: 0, lineHeight: 1.15 }}>{stall.zone}</h3>
                  <div style={{ background: "var(--purple)", color: "var(--teal)", border: "2px solid var(--ink)", borderRadius: 14, padding: "5px 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                    {stall.coins} {stall.coins === 1 ? "COIN" : "COINS"}
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: "#3A1063" }}>{stall.desc}</p>
                <div style={{ fontSize: 10.5, letterSpacing: "0.14em", color: "var(--purple)", marginTop: "auto" }}>RUN BY {stall.run}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "8px 8px 0 var(--ink)", padding: "28px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, alignItems: "center" }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 21, margin: "0 0 10px", color: "var(--teal)" }}>WANT A STALL?</h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "#F0E4FA", margin: 0 }}>
                Clubs, classes and outside vendors can still apply. Fifteen slots left, and the council reviews
                applications every Friday until the stall list closes, three weeks before gates.
              </p>
            </div>
            <Link
              href="/sponsors"
              className="mz-pop font-display"
              style={{ fontSize: 14, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "15px 20px", textAlign: "center", justifySelf: "start", ["--mz-shadow" as string]: "6px" }}
            >
              APPLY FOR A SLOT
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
