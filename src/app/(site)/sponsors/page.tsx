const TIERS = [
  {
    name: "TITLE PARTNER", badge: "1 SLOT ONLY", price: "₹10,00,000", sub: "TEN LAKH · PRESENTED-BY RIGHTS",
    bg: "var(--teal)", fg: "var(--ink)", full: true,
    perks: [
      "Fest is billed “MADOOZA, presented by you” everywhere",
      "Your name locked to the concert and the sealed singer",
      "Logo on every banner, pass, tee and the stage backdrop",
      "Main stage mentions before each act, plus a speaking slot",
      "Prime stall at the arch and the front-of-stage pit box",
      "Back cover of the programme and the date-reveal campaign",
    ],
  },
  {
    name: "CO-PRESENTING PARTNER", price: "₹5,00,000", sub: "FIVE LAKH · 2 SLOTS", bg: "var(--lilac)", fg: "var(--ink)",
    perks: [
      "“In association with” billing on all print and digital",
      "Logo on passes, tees and the stage backdrop",
      "Stage mentions at the opening and the encore",
      "Double stall space in the main row",
    ],
  },
  {
    name: "STAGE / ARENA PARTNER", price: "₹2,50,000", sub: "2.5 LAKH · 2 SLOTS", bg: "var(--paper)", fg: "var(--ink)",
    perks: [
      "The main stage or the cosplay arena carries your name",
      "Logo on the backdrop and every reveal post",
      "Stall space in the main row",
      "You hand over the trophies on stage",
    ],
  },
  {
    name: "ZONE PARTNER", price: "₹1,00,000", sub: "ONE LAKH · 6 SLOTS", bg: "var(--violet-text)", fg: "var(--ink)", priceColor: "var(--bg)",
    perks: [
      "One named zone — food court, arcade, arena queue or fete lane",
      "Logo on the grounds map, gate signage and coin counters",
      "Stall space inside your zone",
      "Branded coin tokens for the zone",
    ],
  },
  {
    name: "ASSOCIATE PARTNER", price: "₹50,000", sub: "FIFTY THOUSAND · OPEN", bg: "var(--paper)", fg: "var(--ink)",
    perks: [
      "Logo on the sponsor wall and in the programme",
      "One contest or competition named after you",
      "Stall space on the fete lane",
      "Ten Concert Passes for your team",
    ],
  },
  {
    name: "IN-KIND & VENDORS", price: "TALK TO US", sub: "VALUED AGAINST A TIER", bg: "var(--bg)", fg: "var(--lilac)", border: "3px solid var(--purple)", priceColor: "var(--teal)",
    perks: [
      "Sound, lights, printing, water, transport, prizes",
      "Food and retail vendors — stall fee, no sponsorship",
      "Credit on the sponsor wall and in the programme",
      "Setup closes three weeks before gates",
    ],
  },
];

export default function SponsorsPage() {
  return (
    <main>
      <section style={{ background: "var(--purple)", borderBottom: "3px solid var(--ink)", padding: "54px 20px 46px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", inset: 0, backgroundImage: "radial-gradient(#150331 1.4px, transparent 1.5px)",
            backgroundSize: "11px 11px", opacity: 0.16, animation: "mzdrift 34s linear infinite", pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>07 / PARTNERS</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px", color: "var(--lilac)" }}>SPONSORS &amp; PRESS KIT</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#F0E4FA", maxWidth: "62ch", margin: 0 }}>
            Expected footfall of 4,000 across one day: students from eleven schools, their families, and most of the
            town&apos;s under-25s. Everything is student-run, which means every rupee is visible and every promise is
            kept in writing.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "54px 20px 60px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", margin: 0, color: "var(--lilac)" }}>PARTNER TIERS</h2>
            <span style={{ fontSize: 12, letterSpacing: "0.16em", color: "var(--muted-lilac)" }}>SIX WAYS IN &middot; GST EXTRA &middot; PAID IN TWO INSTALMENTS</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {TIERS.map((t) => (
              <div
                key={t.name}
                style={{
                  background: t.bg, color: t.fg, border: t.border ?? "3px solid var(--ink)", borderRadius: 20,
                  boxShadow: "8px 8px 0 var(--ink)", padding: "26px 22px", display: "flex", flexDirection: "column",
                  gridColumn: t.full ? "1 / -1" : undefined, minWidth: t.full ? 0 : undefined,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: t.full ? "var(--purple)" : "var(--purple)" }}>{t.name}</div>
                  {t.badge && (
                    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", background: "var(--ink)", color: "var(--teal)", borderRadius: 999, padding: "5px 11px" }}>{t.badge}</div>
                  )}
                </div>
                <div className="font-display" style={{ fontSize: t.full ? "clamp(34px, 5vw, 46px)" : 30, margin: "12px 0 4px", lineHeight: 1, color: t.priceColor }}>{t.price}</div>
                <div style={{ fontSize: t.full ? 12 : 11, fontWeight: 700, letterSpacing: "0.14em", color: t.full ? "#1C0540" : "#6B3AA0", marginBottom: 16 }}>{t.sub}</div>
                <div
                  style={
                    t.full
                      ? { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "9px 22px", fontSize: 14.5, lineHeight: 1.45 }
                      : { display: "flex", flexDirection: "column", gap: 9, fontSize: 14.5, lineHeight: 1.45 }
                  }
                >
                  {t.perks.map((p) => (
                    <div key={p}>{p}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 46, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 26, alignItems: "start" }}>
            <div style={{ background: "var(--paper)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "9px 9px 0 var(--ink)", padding: "26px 24px" }}>
              <h2 className="font-display" style={{ fontSize: 21, margin: "0 0 14px" }}>PRESS KIT</h2>
              <p style={{ fontSize: 15, lineHeight: 1.55, margin: "0 0 20px", color: "#3A1063" }}>
                Everything a paper, a page or a partner needs. Please don&apos;t stretch the logo &mdash; the council
                will notice.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a
                  href="/assets/madooza-badge.png"
                  download
                  className="mz-teal-btn"
                  style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", background: "#FFFFFF", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 16px", color: "var(--ink)", fontWeight: 700, fontSize: 15 }}
                >
                  <span>Badge logo &mdash; transparent PNG</span>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--purple)" }}>2000PX &darr;</span>
                </a>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", background: "#FFFFFF", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 16px", fontWeight: 700, fontSize: 15 }}>
                  <span>Fact sheet &amp; footfall numbers</span>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--purple)" }}>ON REQUEST</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", background: "#FFFFFF", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 16px", fontWeight: 700, fontSize: 15 }}>
                  <span>Palette: indigo, teal, crimson</span>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--purple)" }}>4A1382 &middot; 35C6D4 &middot; DF025C</span>
                </div>
              </div>
            </div>
            <div style={{ background: "var(--teal)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "9px 9px 0 var(--ink)", padding: "26px 24px" }}>
              <h2 className="font-display" style={{ fontSize: 21, margin: "0 0 14px" }}>TALK TO THE COUNCIL</h2>
              <p style={{ fontSize: 15, lineHeight: 1.55, margin: "0 0 20px" }}>
                Sponsorship, stalls, press passes and anything involving a contract. We reply within two days, faster
                if you mention food.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15.5, lineHeight: 1.5 }}>
                <div>
                  <strong style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--purple)", display: "block", marginBottom: 3 }}>SPONSORSHIP</strong>
                  <a href="mailto:contact@madooza.in" style={{ color: "var(--ink)", borderBottom: "2px solid var(--purple)" }}>contact@madooza.in</a>
                </div>
                <div>
                  <strong style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--purple)", display: "block", marginBottom: 3 }}>PRESS</strong>
                  <a href="mailto:contact@madooza.in" style={{ color: "var(--ink)", borderBottom: "2px solid var(--purple)" }}>contact@madooza.in</a>
                </div>
                <div>
                  <strong style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--purple)", display: "block", marginBottom: 3 }}>FEST OFFICE</strong>
                  +91 91222 80578 &middot; weekdays 4&ndash;7 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
