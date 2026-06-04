"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, Ticket } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/lineup", label: "Lineup" },
  { href: "/schedule", label: "Schedule" },
  { href: "/venue", label: "Venue" },
  { href: "/gallery", label: "Gallery" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/tickets", label: "Tickets" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-black/85 backdrop-blur-lg border-b-2 border-[var(--magenta)]"
            : "bg-black/40 backdrop-blur border-b border-white/5"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-2 z-10">
            <Image
              src="/MADOOZA.png"
              alt="MADOOZA"
              width={150}
              height={40}
              className="w-[110px] md:w-[140px] h-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.slice(0, -1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className={`nav-link font-montserrat uppercase text-[0.78rem] xl:text-[0.85rem] tracking-[0.18em] text-white/85 hover:text-white ${
                  isActive(link.href) ? "active text-white" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/tickets"
              className="hidden lg:inline-flex items-center gap-2 bg-[var(--acid)] text-[var(--ink)] border-2 border-black px-4 py-2 font-montserrat text-xs xl:text-sm tracking-[0.16em] shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <Ticket size={14} strokeWidth={3} />
              <span>Tickets</span>
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden text-white p-2 -mr-2 z-10"
            aria-label="Open menu"
          >
            <Menu size={26} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-[88%] max-w-sm bg-[var(--ink-2)] border-l-2 border-[var(--magenta)] shadow-[-12px_0_60px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="absolute inset-0 bg-grid-neon opacity-30 pointer-events-none" aria-hidden />

          <div className="relative flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Image
                src="/MADOOZA.png"
                alt="MADOOZA"
                width={140}
                height={40}
                className="w-[110px] h-auto"
              />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-white p-2 -mr-2 hover:text-[var(--acid)] transition-colors"
                aria-label="Close menu"
              >
                <X size={26} strokeWidth={2.5} />
              </button>
            </div>

            <nav className="flex flex-col px-6 py-6 gap-1 overflow-y-auto">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-baseline justify-between border-b border-white/10 py-4 font-quaron text-3xl uppercase transition-all hover:pl-2 ${
                    isActive(link.href)
                      ? "text-[var(--acid)]"
                      : "text-white hover:text-[var(--cyan)]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="font-montserrat text-xs text-white/40 tracking-[0.3em]">
                    0{idx + 1}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto px-6 pb-8">
              <Link
                href="/tickets"
                className="btn-acid w-full justify-center"
              >
                <Ticket size={18} strokeWidth={3} />
                <span>Grab Your Pass</span>
              </Link>
              <p className="mt-5 text-center font-montserrat text-[0.65rem] tracking-[0.3em] text-white/40">
                MADOOZA · HAZARIBAGH · 2025
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
