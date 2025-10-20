import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#245dff] py-12 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 md:px-6">
        <div className="text-white">
          <Image src="/MADOOZA.png" alt="MADOOZA" width={150} height={40} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="https://www.instagram.com/madooza.in/"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
            className="text-white transition-all hover:text-[#5bf7f7]"
          >
            <Instagram size={24} strokeWidth={3} />
          </Link>
        </div>

        <div className="w-full border-t border-white pt-6 md:pt-8">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {[
              { name: "Privacy Policy", link: "/privacy-policy" },
              { name: "Terms and Conditions", link: "/terms-and-conditions" },
              { name: "Cancellation & Refund Policy", link: "/cancellation-refund-policy" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className="text-white text-sm sm:text-base md:text-lg lg:text-xl no-underline transition-all hover:text-[#5bf7f7] hover:opacity-90"
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
