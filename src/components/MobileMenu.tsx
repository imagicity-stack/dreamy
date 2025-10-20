"use client";
import Link from "next/link";
import { useState } from "react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-white p-2 relative z-50"
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
        className={`fixed top-0 right-0 h-full w-80 bg-[#ff1600] transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 p-6">
          <nav className="flex flex-col space-y-6">
            <Link
              href="#aboutus"
              className="text-white font-quicksand font-semibold text-xl hover:text-gray-200 transition"
              onClick={() => setIsOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="#involvewithus"
              className="text-white font-quicksand font-semibold text-xl hover:text-gray-200 transition"
              onClick={() => setIsOpen(false)}
            >
              INVOLVE WITH US
            </Link>
            <Link
              href="#creators"
              className="text-white font-quicksand font-semibold text-xl hover:text-gray-200 transition"
              onClick={() => setIsOpen(false)}
            >
              CREATORS
            </Link>
            <Link
              href="#contactus"
              className="text-white font-quicksand font-semibold text-xl hover:text-gray-200 transition"
              onClick={() => setIsOpen(false)}
            >
              CONTACT US
            </Link>
            <Link
              href="/cosplay"
              className="text-white font-quicksand font-semibold text-xl hover:text-gray-200 transition"
              onClick={() => setIsOpen(false)}
            >
              COSPLAY
            </Link>
          </nav>

          <div className="mt-auto mb-8">
            <Link
              href="#tickets"
              className="bg-[#ffe300] text-black px-6 py-3 font-bold text-lg rounded block text-center"
              onClick={() => setIsOpen(false)}
            >
              GET TICKETS
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
