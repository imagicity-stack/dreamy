"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavLink = { href: string; label: string };

/**
 * The small-screen menu: a panel that slides in from the right over a scrim.
 * The full nav is too wide to wrap sensibly below about 900px, so it is hidden
 * there and this takes over.
 */
export default function MobileMenu({ links, showTickets, soldOut }: { links: NavLink[]; showTickets: boolean; soldOut: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Following a link should close the menu behind you.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="mz-nav-toggle mz-pop"
        aria-expanded={open}
        aria-controls="mz-mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          flexDirection: "column",
          width: 44,
          height: 40,
          marginLeft: "auto",
          background: open ? "var(--lilac)" : "var(--purple)",
          border: "2px solid var(--ink)",
          borderRadius: 12,
          boxShadow: "3px 3px 0 var(--ink)",
          cursor: "pointer",
          ["--mz-shadow" as string]: "3px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: 20,
              height: 2.5,
              borderRadius: 2,
              background: open ? "var(--ink)" : "var(--teal)",
              transition: "transform 0.22s ease, opacity 0.18s ease",
              transform:
                open && i === 0
                  ? "translateY(7.5px) rotate(45deg)"
                  : open && i === 2
                    ? "translateY(-7.5px) rotate(-45deg)"
                    : "none",
              opacity: open && i === 1 ? 0 : 1,
            }}
          />
        ))}
      </button>

      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10, 1, 24, 0.66)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.28s ease",
          zIndex: 60,
        }}
      />

      <div
        id="mz-mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(320px, 86vw)",
          background: "var(--bg)",
          borderLeft: "3px solid var(--ink)",
          boxShadow: "-12px 0 0 rgba(10, 1, 24, 0.35)",
          transform: open ? "translateX(0)" : "translateX(101%)",
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: 61,
          display: "flex",
          flexDirection: "column",
          padding: "20px 18px 26px",
          overflowY: "auto",
          visibility: open ? "visible" : "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span className="font-display" style={{ fontSize: 15, color: "var(--teal)", letterSpacing: "0.1em" }}>
            MADOOZA
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              width: 34,
              height: 34,
              fontSize: 18,
              lineHeight: 1,
              color: "var(--ink)",
              background: "var(--lilac)",
              border: "2px solid var(--ink)",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 22 }}>
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="mz-drawer-link"
                aria-current={active ? "page" : undefined}
                style={{
                  color: active ? "var(--ink)" : "var(--lilac)",
                  background: active ? "var(--teal)" : "transparent",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  padding: "13px 12px",
                  borderRadius: 12,
                  borderBottom: "2px solid rgba(239, 227, 251, 0.12)",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {showTickets && (
          <Link
            href="/tickets"
            className="font-display mz-pop"
            style={{
              marginTop: 22,
              textAlign: "center",
              color: soldOut ? "var(--lilac)" : "var(--ink)",
              background: soldOut ? "var(--crimson)" : "var(--teal)",
              border: "3px solid var(--ink)",
              borderRadius: 999,
              boxShadow: "5px 5px 0 var(--ink)",
              padding: "15px 18px",
              fontSize: 15,
              ["--mz-shadow" as string]: "5px",
            }}
          >
            {soldOut ? "SOLD OUT" : "GET A PASS"}
          </Link>
        )}
      </div>
    </>
  );
}
