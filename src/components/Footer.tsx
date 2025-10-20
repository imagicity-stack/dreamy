import Link from "next/link";
import {
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitch,
} from "lucide-react";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#245dff] py-12 md:py-20">
      <div className="flex justify-center flex-col items-center mx-auto px-4 md:px-6 lg:px-14">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between w-full items-center mb-8 md:mb-10 gap-6 lg:gap-4">
          {/* Logo */}
          <div className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tighter font-quicksand select-none order-1">
          <Image src="/MADOOZA.png" alt="DREAMHACK" width={150} height={40} />
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 flex justify-center order-3 lg:order-2">
            <ul className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 flex-wrap list-none p-0 m-0 justify-center">
              {["ABOUT", "BRAND", "CAREER", "NEWSROOM", "PARTNER"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-white no-underline font-bold text-sm sm:text-base md:text-lg tracking-wide hover:opacity-80 hover:text-[#5bf7f7] transition-all"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Social Media Icons */}
          <div className="flex gap-3 md:gap-5 flex-wrap items-center font-bold justify-center order-2 lg:order-3">
            <Link
              href="#"
              aria-label="Discord"
              className="text-white hover:text-[#5bf7f7] transition-all"
            >
              <MessageCircle
                size={20}
                strokeWidth={3}
                className="md:w-[22px] md:h-[22px]"
              />
            </Link>

            <Link
              href="#"
              aria-label="Instagram"
              className="text-white hover:text-[#5bf7f7] transition-all"
            >
              <Instagram
                size={20}
                strokeWidth={3}
                className="md:w-[22px] md:h-[22px]"
              />
            </Link>

            {/* X / Twitter Icon */}
            <Link
              href="#"
              aria-label="X (Twitter)"
              className="text-white hover:text-[#5bf7f7] transition-all"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="md:w-[22px] md:h-[22px]"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>

            {/* TikTok Icon */}
            <Link
              href="#"
              aria-label="TikTok"
              className="text-white hover:text-[#5bf7f7] transition-all"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="md:w-[22px] md:h-[22px]"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </Link>

            <Link
              href="#"
              aria-label="Facebook"
              className="text-white hover:text-[#5bf7f7] transition-all"
            >
              <Facebook
                size={20}
                strokeWidth={3}
                className="md:w-[22px] md:h-[22px]"
              />
            </Link>

            <Link
              href="#"
              aria-label="YouTube"
              className="text-white hover:text-[#5bf7f7] transition-all"
            >
              <Youtube
                size={20}
                strokeWidth={3}
                className="md:w-[22px] md:h-[22px]"
              />
            </Link>

            <Link
              href="#"
              aria-label="Twitch"
              className="text-white hover:text-[#5bf7f7] transition-all"
            >
              <Twitch
                size={20}
                strokeWidth={3}
                className="md:w-[22px] md:h-[22px]"
              />
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white pt-8 md:pt-10 w-full">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 list-none p-0 m-0">
            {[
              { name: "Privacy Policy", link: "/privacy-policy" },
              { name: "Terms and Conditions", link: "/terms-and-conditions" },
              { name: "Cancellation & Refund Policy", link: "/cancellation-refund-policy" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className="text-white text-sm sm:text-base md:text-lg lg:text-xl no-underline hover:text-[#5bf7f7] hover:opacity-90 transition-all"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
