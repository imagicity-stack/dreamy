import Link from "next/link";
import { notFound } from "next/navigation";
import { applyTokens, publicContent } from "@/lib/content";
import { getCopy } from "@/lib/copy";
import { getSettings, isPageHidden } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function FetePage() {
  const settings = await getSettings();
  if (isPageHidden(settings, "fete")) notFound();

  const words = await getCopy("fete");

  const coinFacts = (await publicContent("coinFacts")).map((r) => ({
    id: r.id,
    title: applyTokens(String(r.title ?? ""), settings),
    note: applyTokens(String(r.note ?? ""), settings),
  }));

  const stalls = (await publicContent("stalls")).map((r) => ({
    id: r.id,
    zone: String(r.zone ?? ""),
    coins: Number(r.coins ?? 0),
    run: String(r.run ?? ""),
    desc: String(r.desc ?? ""),
  }));

  return (
    <main>
      <section style={{ background: "var(--lilac)", color: "var(--ink)", borderBottom: "3px solid var(--ink)", padding: "54px 20px 46px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--purple)" }}>{words.heroEyebrow}</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px" }}>{words.heroTitle}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: "60ch", margin: 0 }}>
            {words.heroIntro}
          </p>
        </div>
      </section>

      <section style={{ background: "var(--teal)", color: "var(--ink)", borderBottom: "3px solid var(--ink)", padding: "34px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
          {coinFacts.map((f) => (
            <div key={f.id}>
              <div className="font-display" style={{ fontSize: 22 }}>{f.title}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.5, marginTop: 6 }}>{f.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "54px 20px 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 38px)", margin: "0 0 26px", color: "var(--lilac)" }}>{words.stallsTitle}</h2>
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
                <div style={{ fontSize: 10.5, letterSpacing: "0.14em", color: "var(--purple)", marginTop: "auto" }}>{words.stallRunByLabel} {stall.run}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "8px 8px 0 var(--ink)", padding: "28px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, alignItems: "center" }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 21, margin: "0 0 10px", color: "var(--teal)" }}>{words.applyTitle}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "#F0E4FA", margin: 0 }}>
                {words.applyIntro}
              </p>
            </div>
            {!isPageHidden(settings, "sponsors") && (
            <Link
              href="/sponsors"
              className="mz-pop font-display"
              style={{ fontSize: 14, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "15px 20px", textAlign: "center", justifySelf: "start", ["--mz-shadow" as string]: "6px" }}
            >
              {words.applyCtaLabel}
            </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
