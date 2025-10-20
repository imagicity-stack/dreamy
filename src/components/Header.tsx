import { memo } from 'react';
import Link from "next/link";
import Image from "next/image";
import MobileMenu from './MobileMenu';


const Header = () => {
  return (
    <>
     <div className="w-full bg-[#ff1600] h-16 flex text-white justify-between p-2 px-4 md:px-10 items-center relative">
        <div className="text-xl md:text-2xl font-tt-commons font-extrabold">
            <Link href="/">
              <Image src="/MADOOZA.png" alt="DREAMHACK" width={150} height={40} />
            </Link>
          </div>
        <div className="hidden lg:flex gap-12 font-tt-commons font-semibold text-[1.3rem]">
          <Link href="#aboutus">ABOUT</Link>
          <Link href="#involvewithus">INVOLVE WITH US</Link>
          <Link href="#creators">CREATORS</Link>
          <Link href="#contactus">CONTACT US</Link>
          <Link href="/cosplay">COSPLAY</Link>
        </div>
        {/* Mobile menu */}
        <MobileMenu />
      </div>

    </>
  );
};

export default memo(Header);
