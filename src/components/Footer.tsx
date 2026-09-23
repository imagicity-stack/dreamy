import Image from "next/image";
import Link from "next/link";
import { getCopy } from "@/lib/copy";
import { HOST_NAME, LEGAL_PAGES, ORGANIZER_NAME, ORGANIZER_ROLE } from "@/lib/legal";
import { describeDate, getSettings, isPageHidden, type PageKey } from "@/lib/settings";

/** Label for a legal link: the council's wording if they have set one, else the default. */
function legalLabel(words: Record<string, string>, key: string, fallback: string): string {
  const slot = `legalLink${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  const value = words[slot];
  return value && value.trim() ? value : fallback;
}

/**
 * Instagram's glyph, drawn rather than fetched.
 *
 * It is three shapes — a rounded square, a circle and a dot — so an icon font
 * or an SVG file would both be more weight and one more thing that can fail to
 * load than the twelve lines it takes to draw.
 */
function InstagramMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.6" cy="6.4" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default async function Footer() {
  const settings = await getSettings();
  const words = await getCopy("footer");
  const date = describeDate(settings);

  // The footer used to carry its own copy of the site map. Hiding a page in the
  // panel left these links pointing at a 404, so they are filtered now.
  const live = (key: PageKey) => !isPageHidden(settings, key);

  return (
    <footer
      style={{
        background: "var(--ink)",
        borderTop: "3px solid var(--purple)",
        borderRadius: "50% 50% 0 0 / 42px 42px 0 0",
        marginTop: -22,
        position: "relative",
        padding: "70px 20px 30px",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 34,
        }}
      >
        <div>
          <div className="font-display" style={{ fontSize: 22, color: "var(--teal)", marginBottom: 10 }}>
            {words.brandWordmark}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--muted-lilac)", margin: 0, maxWidth: "30ch" }}>
            {words.brandBlurb}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
            <Image
              src="/assets/elden-heights-crest.png"
              alt="The Elden Heights School crest"
              width={50}
              height={50}
              style={{ objectFit: "contain", display: "block" }}
            />
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", color: "var(--lilac)", lineHeight: 1.6 }}>
              {words.schoolName}
              <br />
              <span style={{ color: "var(--muted-lilac)", letterSpacing: "0.1em" }}>{words.schoolMotto}</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--lilac)", marginBottom: 12 }}>
            {words.festColumnTitle}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            {live("lineup") && <Link href="/lineup" className="mz-footer-link">{words.festLinkLineup}</Link>}
            {live("concert") && <Link href="/concert" className="mz-footer-link">{words.festLinkConcert}</Link>}
            {live("cosplay") && <Link href="/cosplay" className="mz-footer-link">{words.festLinkCosplay}</Link>}
            {live("spotlight") && <Link href="/spotlight" className="mz-footer-link">{words.festLinkSpotlight}</Link>}
            {live("fete") && <Link href="/fete" className="mz-footer-link">{words.festLinkFete}</Link>}
            {live("gallery") && <Link href="/gallery" className="mz-footer-link">{words.festLinkGallery}</Link>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--lilac)", marginBottom: 12 }}>
            {words.getInColumnTitle}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            {live("tickets") && <Link href="/tickets" className="mz-footer-link">{words.getInLinkTickets}</Link>}
            {live("merch") && <Link href="/merch" className="mz-footer-link">{words.getInLinkMerch}</Link>}
            {live("sponsors") && <Link href="/sponsors" className="mz-footer-link">{words.getInLinkSponsors}</Link>}
            {live("faq") && <Link href="/faq" className="mz-footer-link">{words.getInLinkFaq}</Link>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--lilac)", marginBottom: 12 }}>
            {words.officeColumnTitle}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted-lilac)" }}>
            {words.officeAddressSchool}
            <br />
            {words.officeAddressCity}
            <br />
            <a href={`mailto:${settings.contactEmail}`} style={{ color: "var(--teal)" }}>
              {settings.contactEmail}
            </a>
            <br />
            {settings.contactPhone}
          </div>

          {settings.instagram && (
            <a
              href={`https://instagram.com/${settings.instagram}`}
              target="_blank"
              rel="noreferrer noopener"
              className="mz-footer-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                marginTop: 16,
                padding: "8px 13px 8px 10px",
                border: "2px solid var(--purple)",
                borderRadius: 999,
                fontSize: 13.5,
                letterSpacing: "0.02em",
              }}
            >
              <InstagramMark />
              @{settings.instagram}
            </a>
          )}
        </div>
      </div>
      <div
        style={{
          maxWidth: 1180,
          margin: "34px auto 0",
          paddingTop: 18,
          borderTop: "1px solid #351059",
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--muted-lilac)",
        }}
      >
        {/* The legal pages are never hidden from the panel: a site taking money
            has to keep them reachable from every page. */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
          {LEGAL_PAGES.map((page) => (
            <Link key={page.key} href={page.href} className="mz-footer-link" style={{ letterSpacing: "0.12em" }}>
              {legalLabel(words, page.key, page.label).toUpperCase()}
            </Link>
          ))}
        </div>
        <div style={{ lineHeight: 1.7, marginBottom: 12, letterSpacing: "0.1em" }}>
          Hosted by {HOST_NAME} &middot; {ORGANIZER_ROLE}: {ORGANIZER_NAME}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <span>{words.copyrightLine}</span>
          <span>{date.dayTile} &middot; {date.monthTile} &middot; {settings.festYear}</span>
        </div>
      </div>
    </footer>
  );
}
