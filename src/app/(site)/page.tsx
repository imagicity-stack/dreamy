import Image from "next/image";
import Link from "next/link";
import { describeDate, getSettings, isPageHidden, type PageKey } from "@/lib/settings";
import { applyTokens, publicContent } from "@/lib/content";
import { getCopy } from "@/lib/copy";
import { SealedDateTiles } from "@/components/SealedDate";
import Countdown from "@/components/Countdown";

export const dynamic = "force-dynamic";

/** The tilt and colours are the set's look, so they stay in code. */
const STAT_SKINS = [
  { bg: "var(--purple)", fg: "var(--lilac)", accent: "var(--teal)", rotate: "-1.4deg" },
  { bg: "var(--teal)", fg: "var(--ink)", accent: "var(--ink)", rotate: "1.2deg" },
  { bg: "var(--paper)", fg: "var(--ink)", accent: "var(--purple)", rotate: "0.8deg" },
  { bg: "var(--bg)", fg: "var(--lilac)", accent: "var(--teal)", rotate: "-0.9deg" },
];

/** The doors' colours cycle by position, the way the stat cards do. */
const CHAOS_SKINS: { bg: string; fg: string; kickerColor: string; titleColor?: string; border?: string }[] = [
  { bg: "var(--purple)", fg: "var(--lilac)", kickerColor: "var(--teal)" },
  { bg: "var(--teal)", fg: "var(--ink)", kickerColor: "var(--purple)" },
  { bg: "var(--lilac)", fg: "var(--ink)", kickerColor: "var(--purple)" },
  { bg: "var(--violet-text)", fg: "var(--ink)", kickerColor: "#1C0540" },
  { bg: "var(--near-black)", fg: "var(--lilac)", kickerColor: "var(--teal)", titleColor: "var(--teal)", border: "3px solid var(--teal)" },
];

export default async function HomePage() {
  const settings = await getSettings();
  const words = await getCopy("home");
  const date = describeDate(settings);
  const [stats, sponsors, doors] = await Promise.all([
    publicContent("homeStats"),
    publicContent("sponsors"),
    publicContent("chaosCards"),
  ]);

  // A hidden page still had a door on the home page, which landed visitors on a
  // 404. Every link out of here is filtered through the same check now.
  const live = (key: PageKey) => !isPageHidden(settings, key);
  const CHAOS_CARDS = doors.filter((c) => live(String(c.pageKey ?? "") as PageKey));

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
            {words.heroBadge}
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
            {words.heroTitle}
          </h1>
          <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.34em", color: "var(--violet-text)", marginTop: 16 }}>
            {words.heroTagline}
          </div>
          <p style={{ maxWidth: 660, fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.6, color: "var(--lilac-text)", margin: "22px 0 0" }}>
            {words.heroIntro}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 34 }}>
            {live("concert") && (
            <Link
              href="/concert"
              className="mz-pop font-display"
              style={{ fontSize: 16, color: "var(--teal)", background: "var(--near-black)", border: "3px solid var(--teal)", borderRadius: 20, boxShadow: "6px 6px 0 var(--ink)", padding: "16px 22px", ["--mz-shadow" as string]: "6px" }}
            >
              {words.heroConcertCta}
            </Link>
            )}
            {live("tickets") && (
            <Link
              href="/tickets"
              className="mz-pop font-display"
              style={{ fontSize: 16, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 999, boxShadow: "6px 6px 0 var(--ink)", padding: "17px 30px", display: "inline-block", ["--mz-shadow" as string]: "6px" }}
            >
              {words.heroTicketsCta}
            </Link>
            )}
            {live("cosplay") && (
            <Link
              href="/cosplay"
              className="mz-pop font-display"
              style={{ fontSize: 16, color: "var(--lilac)", background: "var(--purple)", border: "3px solid var(--ink)", borderRadius: 999, boxShadow: "6px 6px 0 var(--ink)", padding: "17px 30px", display: "inline-block", ["--mz-shadow" as string]: "6px" }}
            >
              {words.heroCosplayCta}
            </Link>
            )}
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
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>{words.dateCardEyebrow}</div>
              <div className="font-display" style={{ fontSize: "clamp(30px, 15cqw, 56px)", lineHeight: 0.94, marginTop: 8 }}>{date.headline}</div>
              <div className="font-display" style={{ fontSize: "clamp(18px, 2.8vw, 26px)", color: "var(--crimson)", lineHeight: 1.05, marginTop: 6 }}>
                {date.subline}
              </div>
              {date.sealed && (
                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--purple)", marginTop: 10, maxWidth: "26ch" }}>
                  {words.dateCardSealedNote}
                </div>
              )}
            </div>
            <div style={{ background: "var(--purple)", color: "var(--lilac)", padding: "24px 26px 26px", display: "flex", flexDirection: "column", gap: 12, justifyContent: "center", borderLeft: "3px solid var(--ink)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--teal)" }}>{words.dateCardExactEyebrow}</div>
              <SealedDateTiles date={date} />
              {date.sealed && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", color: "var(--teal)" }}>
                  <span style={{ animation: "mzflick 3.4s linear infinite" }}>&#9679;</span>
                  {date.mode === "month" ? words.dateCardDaySealedLabel : words.dateCardMonthSealedLabel}
                </div>
              )}
              {settings.countdownEnabled && settings.countdownTarget ? (
                <Countdown target={settings.countdownTarget} label={settings.countdownLabel} />
              ) : (
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--lilac-text)" }}>
                  {words.dateCardSealedBlurb}
                </div>
              )}
            </div>
          </div>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--muted-lilac)", marginTop: 14 }}>
            {words.heroHoursNote}
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
              {words.aboutEyebrow}
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(28px, 4.2vw, 44px)", lineHeight: 1.05, margin: "0 0 18px" }}>
              {words.aboutTitle}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.62, margin: "0 0 14px", maxWidth: "52ch" }}>
              {words.aboutBodyOne}
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.62, margin: 0, maxWidth: "52ch" }}>
              {words.aboutBodyTwo}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
              {live("tickets") && (
                <Link href="/tickets" style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: "0.14em", color: "var(--ink)", borderBottom: "3px solid var(--teal)", paddingBottom: 2 }}>
                  {words.aboutPassesLink}
                </Link>
              )}
              {live("faq") && (
                <Link href="/faq" style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: "0.14em", color: "var(--ink)", borderBottom: "3px solid var(--teal)", paddingBottom: 2 }}>
                  {words.aboutDirectionsLink}
                </Link>
              )}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
            {stats.map((stat, i) => {
              const skin = STAT_SKINS[i % STAT_SKINS.length];
              return (
                <div
                  key={stat.id}
                  style={{
                    background: skin.bg,
                    color: skin.fg,
                    border: "3px solid var(--ink)",
                    borderRadius: 20,
                    boxShadow: "6px 6px 0 var(--ink)",
                    padding: "20px 16px",
                    transform: `rotate(${skin.rotate})`,
                  }}
                >
                  <div className="font-display" style={{ fontSize: 34, color: skin.accent, lineHeight: 1 }}>{String(stat.value ?? "")}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.4, marginTop: 6 }}>{String(stat.note ?? "")}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "66px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 30 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(26px, 3.8vw, 40px)", margin: 0, color: "var(--lilac)" }}>
              {words.chaosTitle}
            </h2>
            <span style={{ fontSize: 12, letterSpacing: "0.16em", color: "var(--muted-lilac)" }}>{words.chaosSubtitle}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {CHAOS_CARDS.map((c, i) => {
              const skin = CHAOS_SKINS[i % CHAOS_SKINS.length];
              return (
              <Link
                key={c.id}
                href={`/${String(c.pageKey ?? "")}`}
                className="mz-pop"
                style={{
                  display: "block",
                  background: skin.bg,
                  border: skin.border ?? "3px solid var(--ink)",
                  borderRadius: 20,
                  boxShadow: "8px 8px 0 var(--ink)",
                  padding: "26px 22px",
                  color: skin.fg,
                  ["--mz-shadow" as string]: "8px",
                  ["--mz-lift" as string]: "3px",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: skin.kickerColor }}>{String(c.kicker ?? "")}</div>
                <h3 className="font-display" style={{ fontSize: 23, margin: "12px 0 10px", color: skin.titleColor ?? skin.fg }}>
                  {String(c.title ?? "")}
                </h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.5, margin: 0 }}>{applyTokens(String(c.body ?? ""), settings)}</p>
              </Link>
              );
            })}
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
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>{words.sealedEyebrow}</div>
          <h2 className="font-display" style={{ fontSize: "clamp(26px, 4vw, 42px)", margin: "12px 0 8px", color: "var(--lilac)" }}>
            {words.sealedTitle}
          </h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#F0E4FA", maxWidth: "58ch", margin: "0 auto 30px" }}>
            {words.sealedIntro}
          </p>
          {live("lineup") && (
          <Link
            href="/lineup"
            className="mz-pop font-display"
            style={{ fontSize: 15, color: "var(--ink)", background: "var(--teal)", border: "3px solid var(--ink)", borderRadius: 999, boxShadow: "6px 6px 0 var(--ink)", padding: "16px 28px", display: "inline-block", ["--mz-shadow" as string]: "6px" }}
          >
            {words.sealedCta}
          </Link>
          )}
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "58px 20px 70px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", color: "var(--muted-lilac)", marginBottom: 18 }}>
            {words.sponsorsEyebrow}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
            {sponsors.map((sponsor) => {
              const logo = sponsor.logo as { url?: string } | null;
              const name = String(sponsor.name ?? "");
              const signed = !!(logo?.url || name);
              return (
              <div
                key={sponsor.id}
                style={{
                  height: 78,
                  border: signed ? "3px solid var(--ink)" : "2px dashed #7D63A8",
                  background: signed ? "var(--paper)" : undefined,
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  color: signed ? "var(--ink)" : "#9B82C0",
                  textAlign: "center",
                  padding: 8,
                  overflow: "hidden",
                }}
              >
                {logo?.url ? (
                  <Image src={logo.url} alt={name || "Sponsor logo"} width={140} height={58} style={{ objectFit: "contain", maxHeight: 58, width: "auto" }} />
                ) : (
                  name || String(sponsor.placeholder ?? "")
                )}
              </div>
              );
            })}
            {live("sponsors") && (
            <Link
              href="/sponsors"
              className="mz-pop font-display"
              style={{ height: 78, background: "var(--lilac)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "5px 5px 0 var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, textAlign: "center", padding: 8, ["--mz-shadow" as string]: "5px" }}
            >
              {words.sponsorsCta}
            </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
