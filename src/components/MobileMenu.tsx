"use client";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/#aboutus", label: "ABOUT" },
  { href: "/#involvewithus", label: "INVOLVE WITH US" },
  { href: "/#creators", label: "CREATORS" },
  { href: "/#partners", label: "PARTNERS" },
  { href: "/#contactus", label: "CONTACT US" },
];

const legalLinks = [
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cancellation-refund-policy", label: "Cancellation & Refund" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-tap relative z-50 p-2 text-[#FFFFFF] transition-transform lg:hidden"
        aria-label="Toggle mobile menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#e22154] text-[#FFFFFF] border-l border-black/30 shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative flex h-full flex-col px-6 pt-16 pb-8">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close mobile menu"
            className="mobile-tap absolute top-4 right-4 text-2xl text-[#FFFFFF] transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            ✕
          </button>
          <nav className="mt-8 flex flex-col space-y-6 font-montserrat">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-tap text-xl font-bold uppercase text-[#FFFFFF] transition hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/20 pt-8">
            <nav className="flex flex-col space-y-3 text-sm font-montserrat">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-tap text-white/80 transition hover:text-[#FFFFFF] hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
