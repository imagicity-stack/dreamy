import Image from "next/image";
import Link from "next/link";
import { describeDate, getSettings, isPageHidden, type PageKey } from "@/lib/settings";

export default async function Footer() {
  const settings = await getSettings();
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
            MADOOZA
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--muted-lilac)", margin: 0, maxWidth: "30ch" }}>
            The Voice of Hazaribagh. Built, painted, wired and shouted about by the students of The Elden Heights
            School.
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
              THE ELDEN HEIGHTS SCHOOL
              <br />
              <span style={{ color: "var(--muted-lilac)", letterSpacing: "0.1em" }}>TOWARDS ETERNAL GLORY</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--lilac)", marginBottom: 12 }}>
            THE FEST
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            {live("lineup") && <Link href="/lineup" className="mz-footer-link">Lineup &amp; reveal</Link>}
            {live("concert") && <Link href="/concert" className="mz-footer-link">The concert &middot; guess who</Link>}
            {live("cosplay") && <Link href="/cosplay" className="mz-footer-link">Cosplay contest</Link>}
            {live("fete") && <Link href="/fete" className="mz-footer-link">Fete &amp; stalls</Link>}
            {live("gallery") && <Link href="/gallery" className="mz-footer-link">Gallery</Link>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--lilac)", marginBottom: 12 }}>
            GET IN
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            {live("tickets") && <Link href="/tickets" className="mz-footer-link">Passes &amp; tickets</Link>}
            {live("merch") && <Link href="/merch" className="mz-footer-link">Merch shop</Link>}
            {live("sponsors") && <Link href="/sponsors" className="mz-footer-link">Sponsors &amp; press kit</Link>}
            {live("faq") && <Link href="/faq" className="mz-footer-link">FAQ + venue</Link>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--lilac)", marginBottom: 12 }}>
            FEST OFFICE
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted-lilac)" }}>
            The Elden Heights School
            <br />
            Hazaribagh, Jharkhand
            <br />
            <a href={`mailto:${settings.contactEmail}`} style={{ color: "var(--teal)" }}>
              {settings.contactEmail}
            </a>
            <br />
            {settings.contactPhone}
          </div>
        </div>
      </div>
      <div
        style={{
          maxWidth: 1180,
          margin: "34px auto 0",
          paddingTop: 18,
          borderTop: "1px solid #351059",
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--muted-lilac)",
        }}
      >
        <span>&copy; {settings.festYear} MADOOZA &middot; STUDENT COUNCIL, ELDEN HEIGHTS</span>
        <span>{date.dayTile} &middot; {date.monthTile} &middot; {settings.festYear}</span>
      </div>
    </footer>
  );
}
