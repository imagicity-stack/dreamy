const SHOTS = [
  { id: "gal-hero", caption: "THE FIELD, TWO WEEKS OUT", height: 340, wide: true, placeholder: "Wide shot of the grounds" },
  { id: "gal-banner", caption: "ART CLUB, DAY FOUR", height: 340, placeholder: "Banner-painting shot" },
  { id: "gal-rehearsal", caption: "CHOIR REHEARSAL", height: 220, placeholder: "Rehearsal photo" },
  { id: "gal-cosplay", caption: "ARMOUR, MOSTLY CARDBOARD", height: 220, placeholder: "Costume work-in-progress" },
  { id: "gal-stall", caption: "MOMO ALLEY UNDER CONSTRUCTION", height: 220, placeholder: "Stall build photo" },
  { id: "gal-council", caption: "THE PEOPLE TO BLAME", height: 220, placeholder: "Council group photo" },
  { id: "gal-stage", caption: "RIGGING ARRIVES", height: 220, placeholder: "Stage rigging photo" },
];

export default function GalleryPage() {
  return (
    <main>
      <section style={{ background: "var(--bg)", padding: "54px 20px 40px", borderBottom: "3px solid var(--ink)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>06 / EVIDENCE</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px", color: "var(--lilac)" }}>GALLERY</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--lilac-text)", maxWidth: "58ch", margin: 0 }}>
            Nothing from the fest itself yet &mdash; that&apos;s the whole point of a first edition. Until fest day
            this page is the build-up: paint, plywood, rehearsals, and one very tired council.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--paper)", padding: "46px 20px 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {SHOTS.map((shot) => (
              <div key={shot.id} style={shot.wide ? { gridColumn: "span 2", minWidth: 0 } : undefined}>
                <div
                  style={{
                    height: shot.height, border: "3px solid var(--ink)", borderRadius: 20, overflow: "hidden",
                    boxShadow: "8px 8px 0 var(--ink)", background: "var(--lilac)", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "var(--purple)", fontSize: 13,
                    letterSpacing: "0.06em", textAlign: "center", padding: 16,
                  }}
                >
                  {shot.placeholder}
                </div>
                <div style={{ fontSize: 10.5, letterSpacing: "0.14em", color: "var(--purple)", marginTop: 10 }}>{shot.caption}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 38, background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "8px 8px 0 var(--ink)", padding: "26px 24px", color: "var(--lilac)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, alignItems: "center" }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 20, margin: "0 0 8px", color: "var(--teal)" }}>SHOT SOMETHING GOOD?</h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, margin: 0, color: "#F0E4FA" }}>
                Send it in after the fest and it goes up here with your name on it. Photos, phone video, blurry
                mosh-pit chaos &mdash; all welcome.
              </p>
            </div>
            <a
              href="mailto:contact@madooza.in"
              className="mz-pop font-display"
              style={{ fontSize: 14, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "15px 20px", textAlign: "center", justifySelf: "start", ["--mz-shadow" as string]: "6px" }}
            >
              SEND YOUR SHOTS
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
