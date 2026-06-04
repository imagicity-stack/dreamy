import Link from "next/link";
import Image from "next/image";
import { Instagram, ArrowUpRight } from "lucide-react";

const navColumns = [
  {
    title: "The Fest",
    links: [
      { label: "About", href: "/about" },
      { label: "Lineup", href: "/lineup" },
      { label: "Schedule", href: "/schedule" },
      { label: "Venue", href: "/venue" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Tickets", href: "/tickets" },
      { label: "Cosplay", href: "/cosplay" },
      { label: "Performers", href: "/performer" },
      { label: "Stalls", href: "/stall" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Sponsor", href: "/sponsor" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Cancellation & Refund", href: "/cancellation-refund-policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[var(--ink-2)] border-t-2 border-[var(--magenta)] overflow-hidden">
      <div className="absolute inset-0 bg-grid-neon opacity-15 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] orb orb-magenta orb-drift" />
      <div className="absolute -top-40 -right-40 w-[400px] h-[400px] orb orb-cyan orb-drift" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-12 lg:gap-16">
          <div>
            <Image
              src="/MADOOZA.png"
              alt="MADOOZA"
              width={220}
              height={60}
              className="w-[180px] h-auto"
            />
            <p className="mt-6 font-quaron text-3xl text-rainbow leading-tight">
              The Sound of Pure Madness.
            </p>
            <p className="mt-4 text-sm text-white/65 max-w-sm">
              Built in Hazaribagh. Powered by creators. Made for the loudest twelve hours
              of the year.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="https://www.instagram.com/madooza.in/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-12 w-12 items-center justify-center border-2 border-black bg-[var(--magenta)] text-white hover:bg-[var(--acid)] hover:text-[var(--ink)] transition-colors"
                style={{ boxShadow: "4px 4px 0 #000" }}
              >
                <Instagram size={22} strokeWidth={2.5} />
              </Link>
              <Link
                href="/tickets"
                className="btn-acid text-xs"
              >
                <span>Tickets</span>
                <ArrowUpRight size={14} strokeWidth={3} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {navColumns.map((col) => (
              <div key={col.title}>
                <h3 className="font-montserrat text-xs tracking-[0.35em] uppercase text-[var(--cyan)] mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group inline-flex items-center gap-1 text-sm text-white/80 hover:text-[var(--acid)] transition-colors"
                      >
                        {l.label}
                        <ArrowUpRight
                          size={14}
                          className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/55 font-montserrat tracking-[0.18em] uppercase">
          <p>© 2025 Madooza. All rights reserved.</p>
          <p>Hazaribagh · Jharkhand · Saturday 13 December</p>
        </div>
      </div>
    </footer>
  );
}
