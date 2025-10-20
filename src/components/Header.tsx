import { memo } from 'react';
import Link from "next/link";
import Image from "next/image";
import MobileMenu from './MobileMenu';

const navLinks = [
  { href: "/#aboutus", label: "ABOUT" },
  { href: "/#involvewithus", label: "INVOLVE WITH US" },
  { href: "/#creators", label: "CREATORS" },
  { href: "/#contactus", label: "CONTACT US" },
  { href: "/cosplay", label: "COSPLAY" },
];

const Header = () => {
  return (
    <>
     <div className="fixed top-0 left-0 right-0 z-50 w-full bg-[#ff1600] h-16 flex text-white justify-between p-2 px-4 md:px-10 items-center">
        <div className="text-xl md:text-2xl font-quicksand font-extrabold">
            <Link href="/">
              <Image src="/MADOOZA.png" alt="DREAMHACK" width={150} height={40} />
            </Link>
          </div>
        <div className="hidden lg:flex gap-12 font-quicksand font-semibold text-[1.3rem]">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} prefetch>
              {link.label}
            </Link>
          ))}
        </div>
        {/* Mobile menu */}
        <MobileMenu />
      </div>

    </>
  );
};

export default memo(Header);
