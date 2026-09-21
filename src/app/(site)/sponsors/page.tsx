import Image from "next/image";
import { notFound } from "next/navigation";
import { getSettings, isPageHidden } from "@/lib/settings";
import { publicContent, type ContentRecord } from "@/lib/content";
import { getCopy } from "@/lib/copy";

export const dynamic = "force-dynamic";

/** The card backgrounds, cycled so a new tier still looks like the set. */
const TIER_SKINS = [
  { bg: "var(--lilac)", fg: "var(--ink)" },
  { bg: "var(--paper)", fg: "var(--ink)" },
  { bg: "var(--violet-text)", fg: "var(--ink)", priceColor: "var(--bg)" },
  { bg: "var(--paper)", fg: "var(--ink)" },
  { bg: "var(--bg)", fg: "var(--lilac)", border: "3px solid var(--purple)", priceColor: "var(--teal)" },
];

const FEATURED_SKIN = { bg: "var(--teal)", fg: "var(--ink)", priceColor: undefined as string | undefined, border: undefined as string | undefined };

function text(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

/**
 * Both ladders draw the same card, so the markup lives here once. Featured tiers
 * span the full row, so they are drawn first whatever their position in the panel.
 */
function TierGrid({ records }: { records: ContentRecord[] }) {
  const tiers = [...records].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
    {tiers.map((t, i) => {
      const featured = !!t.featured;
      const skin = featured ? FEATURED_SKIN : TIER_SKINS[i % TIER_SKINS.length];
      const perks = text(t, "perks").split("\n").map((line) => line.trim()).filter(Boolean);
      const badge = text(t, "badge");
            return (
        <div
          key={t.id}
          style={{
            background: skin.bg, color: skin.fg, border: skin.border ?? "3px solid var(--ink)", borderRadius: 20,
            boxShadow: "8px 8px 0 var(--ink)", padding: "26px 22px", display: "flex", flexDirection: "column",
            gridColumn: featured ? "1 / -1" : undefined, minWidth: featured ? 0 : undefined,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", color: "var(--purple)" }}>{text(t, "name")}</div>
            {badge && (
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", background: "var(--ink)", color: "var(--teal)", borderRadius: 999, padding: "5px 11px" }}>{badge}</div>
            )}
          </div>
          <div className="font-display" style={{ fontSize: featured ? "clamp(34px, 5vw, 46px)" : 30, margin: "12px 0 4px", lineHeight: 1, color: skin.priceColor }}>{text(t, "price")}</div>
          <div style={{ fontSize: featured ? 12 : 11, fontWeight: 700, letterSpacing: "0.14em", color: featured ? "#1C0540" : "#6B3AA0", marginBottom: 16 }}>{text(t, "sub")}</div>
          <div
            style={
              featured
                ? { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "9px 22px", fontSize: 14.5, lineHeight: 1.45 }
                : { display: "flex", flexDirection: "column", gap: 9, fontSize: 14.5, lineHeight: 1.45 }
            }
          >
            {perks.map((perk) => (
              <div key={perk}>{perk}</div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
  );
}

export default async function SponsorsPage() {
  const settings = await getSettings();
  const words = await getCopy("sponsors");
  if (isPageHidden(settings, "sponsors")) notFound();

  const [tierRecords, cosplayTiers, sponsors] = await Promise.all([
    publicContent("sponsorTiers"),
    publicContent("cosplayTiers"),
    publicContent("sponsors"),
  ]);

  const signed = sponsors.filter((s) => text(s, "name") || (s.logo as { url?: string } | null)?.url);

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
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)" }}>{words.heroEyebrow}</div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 6vw, 60px)", lineHeight: 1.02, margin: "14px 0 16px", color: "var(--lilac)" }}>{words.heroTitle}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#F0E4FA", maxWidth: "62ch", margin: 0 }}>
            {words.heroIntro}
          </p>
        </div>
      </section>

      <section style={{ background: "var(--bg)", padding: "54px 20px 60px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", margin: 0, color: "var(--lilac)" }}>{words.tiersTitle}</h2>
            <span style={{ fontSize: 12, letterSpacing: "0.16em", color: "var(--muted-lilac)" }}>{words.tiersNote}</span>
          </div>
          <TierGrid records={tierRecords} />

          {cosplayTiers.length > 0 && (
            <div style={{ marginTop: 46, border: "3px solid var(--purple)", borderRadius: 24, padding: "30px 24px 32px", background: "#150331" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", margin: 0, color: "var(--teal)" }}>{words.cosplayTiersTitle}</h2>
                <span style={{ fontSize: 12, letterSpacing: "0.16em", color: "var(--muted-lilac)" }}>{words.cosplayTiersNote}</span>
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--lilac-text)", maxWidth: "62ch", margin: "0 0 24px" }}>
                {words.cosplayTiersIntro}
              </p>
              <TierGrid records={cosplayTiers} />
            </div>
          )}

          {signed.length > 0 && (
            <div style={{ marginTop: 46 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", color: "var(--teal)", marginBottom: 16 }}>
                {words.signedEyebrow}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16 }}>
                {signed.map((s) => {
                  const logo = s.logo as { url?: string } | null;
                  const href = text(s, "href");
                  const name = text(s, "name");
                  const tile = (
                    <div
                      style={{
                        background: "var(--paper)", border: "3px solid var(--ink)", borderRadius: 20,
                        boxShadow: "6px 6px 0 var(--ink)", padding: 18, height: 132, display: "flex",
                        flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
                      }}
                    >
                      {logo?.url ? (
                        <Image src={logo.url} alt={name || "Sponsor logo"} width={150} height={64} style={{ objectFit: "contain", maxHeight: 64, width: "auto" }} />
                      ) : (
                        <span className="font-display" style={{ fontSize: 17, color: "var(--ink)", textAlign: "center" }}>{name}</span>
                      )}
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "var(--purple)" }}>{text(s, "tier")}</span>
                    </div>
                  );
                  return href ? (
                    <a key={s.id} href={href} target="_blank" rel="noopener noreferrer">{tile}</a>
                  ) : (
                    <div key={s.id}>{tile}</div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: 46, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 26, alignItems: "start" }}>
            <div style={{ background: "var(--paper)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "9px 9px 0 var(--ink)", padding: "26px 24px" }}>
              <h2 className="font-display" style={{ fontSize: 21, margin: "0 0 14px" }}>{words.pressKitTitle}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.55, margin: "0 0 20px", color: "#3A1063" }}>
                {words.pressKitIntro}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a
                  href="/assets/madooza-badge.png"
                  download
                  className="mz-teal-btn"
                  style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", background: "#FFFFFF", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 16px", color: "var(--ink)", fontWeight: 700, fontSize: 15 }}
                >
                  <span>{words.pressKitBadgeLabel}</span>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--purple)" }}>{words.pressKitBadgeMeta}</span>
                </a>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", background: "#FFFFFF", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 16px", fontWeight: 700, fontSize: 15 }}>
                  <span>{words.pressKitFactSheetLabel}</span>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--purple)" }}>{words.pressKitFactSheetMeta}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", background: "#FFFFFF", border: "3px solid var(--ink)", borderRadius: 20, padding: "14px 16px", fontWeight: 700, fontSize: 15 }}>
                  <span>{words.pressKitPaletteLabel}</span>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--purple)" }}>{words.pressKitPaletteMeta}</span>
                </div>
              </div>
            </div>
            <div style={{ background: "var(--teal)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: 20, boxShadow: "9px 9px 0 var(--ink)", padding: "26px 24px" }}>
              <h2 className="font-display" style={{ fontSize: 21, margin: "0 0 14px" }}>{words.contactTitle}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.55, margin: "0 0 20px" }}>
                {words.contactIntro}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15.5, lineHeight: 1.5 }}>
                <div>
                  <strong style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--purple)", display: "block", marginBottom: 3 }}>{words.contactSponsorshipLabel}</strong>
                  <a href={`mailto:${settings.contactEmail}`} style={{ color: "var(--ink)", borderBottom: "2px solid var(--purple)" }}>{settings.contactEmail}</a>
                </div>
                <div>
                  <strong style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--purple)", display: "block", marginBottom: 3 }}>{words.contactPressLabel}</strong>
                  <a href={`mailto:${settings.contactEmail}`} style={{ color: "var(--ink)", borderBottom: "2px solid var(--purple)" }}>{settings.contactEmail}</a>
                </div>
                <div>
                  <strong style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--purple)", display: "block", marginBottom: 3 }}>{words.contactOfficeLabel}</strong>
                  {settings.contactPhone} &middot; {words.contactOfficeHours}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
