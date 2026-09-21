/**
 * What fills the page area while the next one is being rendered.
 *
 * Every public page is rendered per request, so a navigation always waits on
 * the server for something. Without this the browser sits on the old page for
 * that whole wait and the site feels like it is ignoring the click; with it the
 * header stays put, this appears instantly, and the page drops in when it is
 * ready. Nothing here is real content — it is deliberately shapeless so it
 * never reads as a page that failed to fill in.
 */
export default function Loading() {
  const bar = (width: string, height: number) => (
    <div
      style={{
        width,
        height,
        borderRadius: 10,
        background: "linear-gradient(90deg, #35143f 25%, #4a1382 37%, #35143f 63%)",
        backgroundSize: "400% 100%",
        animation: "mzshimmer 1.4s ease-in-out infinite",
      }}
    />
  );

  return (
    <main aria-busy="true" aria-live="polite">
      <section style={{ background: "var(--bg)", padding: "54px 20px 40px", borderBottom: "3px solid var(--ink)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
          {bar("140px", 14)}
          {bar("min(560px, 90%)", 52)}
          {bar("min(440px, 80%)", 16)}
          {bar("min(380px, 70%)", 16)}
        </div>
      </section>
      <section style={{ background: "var(--paper)", padding: "46px 20px 64px" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: 190,
                borderRadius: 20,
                border: "3px solid var(--ink)",
                background: "linear-gradient(90deg, #e7dcf4 25%, #f3ecfa 37%, #e7dcf4 63%)",
                backgroundSize: "400% 100%",
                animation: "mzshimmer 1.4s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
