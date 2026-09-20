import Image from "next/image";
import Link from "next/link";
import { formatInr } from "@/data/fest";
import { publicContent } from "@/lib/content";
import { describeDate, visiblePages, type FestSettings } from "@/lib/settings";
import MobileMenu from "./MobileMenu";

async function tickerItems(settings: FestSettings): Promise<string[]> {
  const lines = await publicContent("ticker");
  return [
    describeDate(settings).ticker,
    ...lines.map((l) => String(l.text ?? "")).filter(Boolean),
    `FETE PASS ${formatInr(settings.fetePrice)} · CONCERT PASS SEALED`,
  ];
}

function Ticker({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
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
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 44 }}>
            {item}
            <span style={{ color: "var(--hot-pink)" }}>&#9679;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Announcement({ text }: { text: string }) {
  return (
    <div
      style={{
        background: "var(--crimson)",
        color: "var(--paper)",
        borderBottom: "3px solid var(--ink)",
        padding: "9px 20px",
        textAlign: "center",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.08em",
        lineHeight: 1.45,
      }}
    >
      {text}
    </div>
  );
}

export default async function Header({ settings }: { settings: FestSettings }) {
  const items = await tickerItems(settings);
  // Hidden pages drop out of the nav as well as off the site.
  const links = visiblePages(settings)
    .filter((p) => p.key !== "tickets")
    .map((p) => ({ href: p.href, label: p.label }));
  const ticketsVisible = visiblePages(settings).some((p) => p.key === "tickets");

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
      {settings.announcement.trim() && <Announcement text={settings.announcement.trim()} />}
      <Ticker items={items} />
      <nav
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 18,
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
          className="mz-nav-desktop"
          style={{
            gap: 4,
            flexWrap: "wrap",
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.12em",
            marginLeft: "auto",
          }}
        >
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="mz-nav-link">
              {l.label}
            </Link>
          ))}
          {ticketsVisible && (
            <Link
              href="/tickets"
              className="mz-pop"
              style={{
                color: settings.soldOut ? "var(--lilac)" : "var(--ink)",
                background: settings.soldOut ? "var(--crimson)" : "var(--teal)",
                border: "2px solid var(--ink)",
                borderRadius: 999,
                padding: "7px 12px",
                boxShadow: "3px 3px 0 var(--ink)",
                ["--mz-shadow" as string]: "3px",
                ["--mz-lift" as string]: "1px",
              }}
            >
              {settings.soldOut ? "SOLD OUT" : "GET A PASS"}
            </Link>
          )}
        </div>

        <MobileMenu links={links} showTickets={ticketsVisible} soldOut={settings.soldOut} />
      </nav>
    </header>
  );
}
