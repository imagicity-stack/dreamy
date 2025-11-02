import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#e22154] py-6 md:py-8 border-t border-[#e22154]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full justify-center md:w-auto md:justify-start">
            <Image src="/MADOOZA.png" alt="MADOOZA" width={200} height={60} />
          </div>

          <div className="flex w-full justify-center md:w-auto">
            <Link
              href="https://www.instagram.com/madooza.in/"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center text-[#FFFFFF] transition-all hover:text-[#ff9bb6]"
            >
              <Instagram size={24} strokeWidth={3} />
            </Link>
          </div>

          <div className="flex w-full justify-center md:w-auto md:justify-end">
            <ul className="flex flex-wrap items-center justify-center gap-4 text-center text-sm sm:text-base md:text-sm lg:text-base text-[#FFFFFF]">
              {[
                { name: "Privacy Policy", link: "/privacy-policy" },
                { name: "Terms & Conditions", link: "/terms-and-conditions" },
                { name: "Cancellation & Refund", link: "/cancellation-refund-policy" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="transition-all hover:text-[#ff9bb6]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-white/40 pt-4 text-center text-xs sm:text-sm text-white/80">
          Madooza 2025 powered by Imagicity © All rights reserved.
        </div>
      </div>
    </footer>
  );
}
