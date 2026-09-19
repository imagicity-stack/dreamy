import Image from "next/image";
import Link from "next/link";

const STATS = [
  { value: "40+", note: "stalls, booths and questionable games", bg: "var(--purple)", fg: "var(--lilac)", accent: "var(--teal)", rotate: "-1.4deg" },
  { value: "9H", note: "of non-stop programming, one field", bg: "var(--teal)", fg: "var(--ink)", accent: "var(--ink)", rotate: "1.2deg" },
  { value: "₹1.2L", note: "prize money across every contest", bg: "var(--paper)", fg: "var(--ink)", accent: "var(--purple)", rotate: "0.8deg" },
  { value: "3", note: "names still locked in the vault", bg: "var(--bg)", fg: "var(--lilac)", accent: "var(--teal)", rotate: "-0.9deg" },
];

const CHAOS_CARDS = [
  { href: "/lineup", kicker: "01 / STAGE", kickerColor: "var(--teal)", title: "THE REVEAL", body: "Three locked cards. Cryptic clues. Tap if your nerves can take it.", bg: "var(--purple)", fg: "var(--lilac)" },
  { href: "/cosplay", kicker: "02 / ARENA", kickerColor: "var(--purple)", title: "COSPLAY CONTEST", body: "Four categories, ₹400 to enter, ₹40,000 on the line. Foam swords allowed.", bg: "var(--teal)", fg: "var(--ink)" },
  { href: "/fete", kicker: "03 / GROUNDS", kickerColor: "var(--purple)", title: "FETE & CARNIVAL", body: "Ring toss, momo alley, a haunted staff room. Everything runs on coins.", bg: "var(--lilac)", fg: "var(--ink)" },
  { href: "/merch", kicker: "04 / SHOP", kickerColor: "#1C0540", title: "MERCH DROP", body: "Tees, totes, enamel pins. Pre-order now, collect at the gate.", bg: "var(--violet-text)", fg: "var(--ink)" },
  { href: "/concert", kicker: "05 / CONCERT", kickerColor: "var(--teal)", title: "GUESS WHO", body: "One silhouette, no name, no price. Tell us who you want and we'll tell you when.", bg: "var(--near-black)", fg: "var(--lilac)", titleColor: "var(--teal)", border: "3px solid var(--teal)" },
];

export default function HomePage() {
  return (
    <main>
      <section style={{ position: "relative", padding: "64px 20px 76px", background: "var(--bg)", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#EFE3FB 1.1px, transparent 1.2px)",
            backgroundSize: "13px 13px",
            opacity: 0.09,
            animation: "mzdrift 26s linear infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -140,
            left: "50%",
            transform: "translateX(-50%)",
            width: 760,
            height: 760,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(223,2,92,0.30) 0%, rgba(36,16,53,0) 68%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.28em",
              color: "var(--teal)",
              border: "2px solid #7D63A8",
              borderRadius: 999,
              padding: "8px 18px",
              marginBottom: 26,
            }}
          >
            FIRST EDITION &middot; A SCHOOL THAT THREW A CARNIVAL
          </div>

          <div style={{ position: "relative", width: "min(760px, 94%)", margin: "2px auto 10px", animation: "mzfloat 7.5s ease-in-out infinite" }}>
            <Image src="/assets/madooza-wordmark-hole.png" alt="MADOOZA" width={760} height={280} style={{ width: "100%", height: "auto", display: "block" }} priority />
            <div
              style={{
                position: "absolute",
                left: "46.62%",
                top: "10.49%",
                width: "23.28%",
                aspectRatio: "1",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(223,2,92,0.85) 38%, rgba(223,2,92,0) 72%)",
                animation: "mzhalo 3.1s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
            <Image
              src="/assets/madooza-badge.png"
              alt=""
              width={180}
              height={180}
              style={{ position: "absolute", left: "46.62%", top: "10.49%", width: "23.28%", height: "auto", display: "block", animation: "mzspin 13s linear infinite" }}
            />
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(26px, 5.4vw, 54px)",
              lineHeight: 1.02,
              margin: "6px 0 0",
              color: "var(--pink)",
              textShadow: "4px 4px 0 var(--ink)",
              letterSpacing: "0.01em",
            }}
          >
            THE VOICE OF HAZARIBAGH
          </h1>
          <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.34em", color: "var(--violet-text)", marginTop: 16 }}>
            MUSIC &middot; MOMENTS &middot; MEMORIES
          </div>
          <p style={{ maxWidth: 660, fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.6, color: "var(--lilac-text)", margin: "22px 0 0" }}>
            One Saturday, the Elden Heights grounds stop behaving like a school. Cosplayers take the corridors, the
            fete eats your pocket money, and somebody very famous walks out on stage at 4:30 &mdash; we&apos;re not
            telling you who yet.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 34 }}>
            <Link
              href="/concert"
              className="mz-pop font-display"
              style={{ fontSize: 16, color: "var(--teal)", background: "var(--near-black)", border: "3px solid var(--teal)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "16px 22px", ["--mz-shadow" as string]: "6px" }}
            >
              GUESS WHO &rarr;
            </Link>
            <Link
              href="/tickets"
              className="mz-pop font-display"
              style={{ fontSize: 16, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 999, boxShadow: "6px 6px 0 var(--ink)", padding: "17px 30px", display: "inline-block", ["--mz-shadow" as string]: "6px" }}
            >
              GRAB A PASS
            </Link>
            <Link
              href="/cosplay"
              className="mz-pop font-display"
              style={{ fontSize: 16, color: "var(--lilac)", background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 999, boxShadow: "6px 6px 0 var(--ink)", padding: "17px 30px", display: "inline-block", ["--mz-shadow" as string]: "6px" }}
            >
              ENTER THE COSPLAY ARENA
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              marginTop: 54,
              width: "100%",
              maxWidth: 760,
              background: "var(--paper)",
              border: "3px solid var(--ink)",
              borderRadius: 26,
              boxShadow: "9px 9px 0 var(--ink)",
              overflow: "hidden",
              textAlign: "left",
              color: "var(--ink)",
            }}
          >
            <div style={{ padding: "24px 26px 26px", containerType: "inline-size" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>IT ALL HAPPENS IN</div>
              <div className="font-display" style={{ fontSize: "clamp(30px, 15cqw, 56px)", lineHeight: 0.94, marginTop: 8 }}>NOVEMBER</div>
              <div className="font-display" style={{ fontSize: "clamp(22px, 3.4vw, 30px)", color: "var(--crimson)", lineHeight: 1, marginTop: 4 }}>2026</div>
            </div>
            <div style={{ background: "var(--purple)", color: "var(--lilac)", padding: "24px 26px 26px", display: "flex", flexDirection: "column", gap: 12, justifyContent: "center", borderLeft: "3px solid var(--ink)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)" }}>THE EXACT DATE</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="font-display" style={{ background: "var(--ink)", color: "var(--teal)", border: "2px solid var(--teal)", borderRadius: 12, padding: "8px 14px", fontSize: 22, animation: "mzpulse 1.6s ease-in-out infinite" }}>
                  ??
                </div>
                <div className="font-display" style={{ fontSize: 22, color: "var(--violet-text)" }}>&middot;</div>
                <div className="font-display" style={{ background: "var(--lilac)", color: "var(--ink)", border: "2px solid var(--ink)", borderRadius: 12, padding: "8px 14px", fontSize: 22 }}>
                  11
                </div>
                <div className="font-display" style={{ fontSize: 22, color: "var(--violet-text)" }}>&middot;</div>
                <div className="font-display" style={{ background: "var(--lilac)", color: "var(--ink)", border: "2px solid var(--ink)", borderRadius: 12, padding: "8px 14px", fontSize: 22 }}>
                  26
                </div>
              </div>
              <div style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--lilac-text)" }}>
                Sealed until the guests are out. The day drops with the final reveal &mdash; and passes open the same
                hour.
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--muted-lilac)", marginTop: 14 }}>
            ONE SATURDAY &middot; GATES 9:00 AM &middot; LAST ENCORE 6:00 PM
          </div>
        </div>
      </section>

      <section
        style={{
          background: "var(--paper)",
          color: "var(--ink)",
          borderTop: "3px solid var(--ink)",
          borderBottom: "3px solid var(--ink)",
          borderRadius: "50% 50% 0 0 / 48px 48px 0 0",
          marginTop: -34,
          position: "relative",
          zIndex: 2,
          padding: "78px 20px 62px",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 44, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--purple)", marginBottom: 14 }}>
              WHAT IS THIS MADNESS
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(28px, 4.2vw, 44px)", lineHeight: 1.05, margin: "0 0 18px" }}>
              A COLLEGE FEST THAT SNUCK INTO A SCHOOL
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.62, margin: "0 0 14px", maxWidth: "52ch" }}>
              MADOOZA is the Elden Heights answer to a question nobody asked: what if a fete, a carnival, a cosplay
              convention and a proper stage night all happened on the same field, on the same day, run entirely by
              students?
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.62, margin: 0, maxWidth: "52ch" }}>
              Open to every school in Hazaribagh, to parents who claim they&apos;re &quot;just dropping off&quot;, and
              to anyone in town who hears the soundcheck and follows it. One pass. Everything inside.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
              <Link href="/tickets" style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: "0.14em", color: "var(--ink)", borderBottom: "3px solid var(--teal)", paddingBottom: 2 }}>
                PASSES &rarr;
              </Link>
              <Link href="/faq" style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: "0.14em", color: "var(--ink)", borderBottom: "3px solid var(--teal)", paddingBottom: 2 }}>
                HOW TO GET THERE &rarr;
              </Link>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
            {STATS.map((s) => (
              <div
                key={s.value}
                style={{
                  background: s.bg,
                  color: s.fg,
                  border: "3px solid var(--ink)",
                  borderRadius: 20,
                  boxShadow: "6px 6px 0 var(--ink)",
                  padding: "20px 16px",
                  transform: `rotate(${s.rotate})`,
                }}
              >
                <div className="font-display" style={{ fontSize: 34, color: s.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 14, lineHeight: 1.4, marginTop: 6 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "66px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 30 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(26px, 3.8vw, 40px)", margin: 0, color: "var(--lilac)" }}>
              PICK YOUR CHAOS
            </h2>
            <span style={{ fontSize: 12, letterSpacing: "0.16em", color: "var(--muted-lilac)" }}>FIVE DOORS, ONE FIELD</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {CHAOS_CARDS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="mz-pop"
                style={{
                  display: "block",
                  background: c.bg,
                  border: c.border ?? "3px solid var(--ink)",
                  borderRadius: 20,
                  boxShadow: "8px 8px 0 var(--ink)",
                  padding: "26px 22px",
                  color: c.fg,
                  ["--mz-shadow" as string]: "8px",
                  ["--mz-lift" as string]: "3px",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: c.kickerColor }}>{c.kicker}</div>
                <h3 className="font-display" style={{ fontSize: 23, margin: "12px 0 10px", color: c.titleColor ?? c.fg }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.5, margin: 0 }}>{c.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--purple)", borderTop: "3px solid var(--ink)", borderBottom: "3px solid var(--ink)", padding: "60px 20px", position: "relative", overflow: "hidden" }}>
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
        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>STILL SEALED</div>
          <h2 className="font-display" style={{ fontSize: "clamp(26px, 4vw, 42px)", margin: "12px 0 8px", color: "var(--lilac)" }}>
            WE KNOW WHO&apos;S COMING. YOU DON&apos;T.
          </h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#F0E4FA", maxWidth: "58ch", margin: "0 auto 30px" }}>
            A playback singer, a name from your screen, and one act the seniors keep laughing about. Clues drop
            weekly.
          </p>
          <Link
            href="/lineup"
            className="mz-pop font-display"
            style={{ fontSize: 15, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 999, boxShadow: "6px 6px 0 var(--ink)", padding: "16px 28px", display: "inline-block", ["--mz-shadow" as string]: "6px" }}
          >
            GO CRACK THE CLUES
          </Link>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "58px 20px 70px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", color: "var(--muted-lilac)", marginBottom: 18 }}>
            BACKED BY PEOPLE WHO SAID YES
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
            {["TITLE SPONSOR LOGO", "STAGE PARTNER LOGO", "FOOD PARTNER LOGO", "MEDIA PARTNER LOGO"].map((label) => (
              <div
                key={label}
                style={{
                  height: 78,
                  border: "2px dashed #7D63A8",
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  color: "#9B82C0",
                  textAlign: "center",
                  padding: 8,
                }}
              >
                {label}
              </div>
            ))}
            <Link
              href="/sponsors"
              className="mz-pop font-display"
              style={{ height: 78, background: "var(--lilac)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "5px 5px 0 var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, textAlign: "center", padding: 8, ["--mz-shadow" as string]: "5px" }}
            >
              BE ON THIS WALL
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
