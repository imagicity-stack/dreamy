import Image from "next/image";
import Link from "next/link";
import { DATE_REVEAL, formatInr } from "@/data/fest";
import type { FestSettings } from "@/lib/settings";

function tickerItems(settings: FestSettings): string[] {
  return [
    DATE_REVEAL.ticker,
    "THE ELDEN HEIGHTS SCHOOL, HAZARIBAGH",
    "MUSIC · MOMENTS · MEMORIES",
    "ONE DAY. ZERO CHILL.",
    `FETE PASS ${formatInr(settings.fetePrice)} · CONCERT PASS SEALED`,
  ];
}

const NAV_LINKS = [
  { href: "/lineup", label: "LINEUP" },
  { href: "/concert", label: "CONCERT" },
  { href: "/cosplay", label: "COSPLAY" },
  { href: "/fete", label: "FETE" },
  { href: "/merch", label: "MERCH" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/sponsors", label: "SPONSORS" },
  { href: "/faq", label: "FAQ + VENUE" },
];

function Ticker({ settings }: { settings: FestSettings }) {
  const base = tickerItems(settings);
  const items = [...base, ...base];
  return (
    <div
      style={{
        background: "var(--teal)",
        color: "var(--ink)",
        borderBottom: "3px solid var(--ink)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "7px 0",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          gap: 44,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.18em",
          animation: "mzslide 34s linear infinite",
          paddingRight: 44,
        }}
      >
        {items.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 44 }}>
            {item}
            <span style={{ color: "var(--hot-pink)" }}>&#9679;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Header({ settings }: { settings: FestSettings }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "3px solid var(--ink)",
      }}
    >
      <Ticker settings={settings} />
      <nav
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          className="font-display"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontSize: 17,
            color: "var(--lilac)",
            letterSpacing: "0.02em",
          }}
        >
          <Image
            src="/assets/madooza-badge.png"
            alt=""
            width={36}
            height={36}
            className="mz-badge-logo"
            style={{ objectFit: "contain", display: "block" }}
          />
          MADOOZA
        </Link>
        <div
          style={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.12em",
            marginLeft: "auto",
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="mz-nav-link">
              {l.label}
            </Link>
          ))}
          <Link
            href="/tickets"
            className="mz-pop"
            style={{
              color: "var(--ink)",
              background: "var(--teal)",
              border: "2px solid var(--ink)",
              borderRadius: 999,
              padding: "7px 12px",
              boxShadow: "3px 3px 0 var(--ink)",
              ["--mz-shadow" as string]: "3px",
              ["--mz-lift" as string]: "1px",
            }}
          >
            GET A PASS
          </Link>
        </div>
      </nav>
    </header>
  );
}
