import Image from "next/image";
import Link from "next/link";

export default function Footer() {
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
            <Link href="/lineup" className="mz-footer-link">Lineup &amp; reveal</Link>
            <Link href="/concert" className="mz-footer-link">The concert &middot; guess who</Link>
            <Link href="/cosplay" className="mz-footer-link">Cosplay contest</Link>
            <Link href="/fete" className="mz-footer-link">Fete &amp; stalls</Link>
            <Link href="/gallery" className="mz-footer-link">Gallery</Link>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--lilac)", marginBottom: 12 }}>
            GET IN
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            <Link href="/tickets" className="mz-footer-link">Passes &amp; tickets</Link>
            <Link href="/merch" className="mz-footer-link">Merch shop</Link>
            <Link href="/sponsors" className="mz-footer-link">Sponsors &amp; press kit</Link>
            <Link href="/faq" className="mz-footer-link">FAQ + venue</Link>
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
            <a href="mailto:contact@madooza.in" style={{ color: "var(--teal)" }}>
              contact@madooza.in
            </a>
            <br />
            +91 91222 80578
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
        <span>&copy; 2026 MADOOZA &middot; STUDENT COUNCIL, ELDEN HEIGHTS</span>
        <span>?? &middot; 11 &middot; 2026</span>
      </div>
    </footer>
  );
}
