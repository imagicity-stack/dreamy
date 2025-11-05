"use client";

import Link from "next/link";
import { useState } from "react";

const primaryLinks = [
  { href: "/#aboutus", label: "ABOUT" },
  { href: "/#involvewithus", label: "INVOLVE WITH US" },
  { href: "/#creators", label: "CREATORS" },
  { href: "/#partners", label: "PARTNERS" },
  { href: "/#contactus", label: "CONTACT US" },
];

const secondaryLinks = [
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cancellation-refund-policy", label: "Cancellation & Refund" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((open) => !open);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="mobile-tap relative z-50 p-2 text-white transition-transform lg:hidden"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label="Toggle mobile menu"
        type="button"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-40 flex flex-col bg-[#e22154] text-white lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-end px-6 pt-6">
            <button
              onClick={closeMenu}
              className="mobile-tap text-2xl transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Close mobile menu"
              type="button"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-start px-6 pb-10 pt-8 font-montserrat">
            <div className="flex flex-col space-y-6 text-xl font-bold uppercase">
              {primaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className="mobile-tap" onClick={closeMenu}>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto border-t border-white/20 pt-6 text-sm">
              <nav className="flex flex-col space-y-3">
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="mobile-tap text-white/80 transition hover:text-white hover:underline"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
