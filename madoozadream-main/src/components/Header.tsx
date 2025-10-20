import { memo } from 'react';
import Link from "next/link";
import Image from "next/image";
import MobileMenu from './MobileMenu';


import ticket from '../../public/ticket.png';


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
          <Link href="#festivals">FESTIVALS</Link>
          <Link href="#contactus">CONTACT US</Link>
          <Link href="/cosplay">COSPLAY</Link>
          <Link href="/privacy-policy" className='underline'>PRIVACY POLICY</Link>
        </div>
        {/* Mobile menu */}
        <MobileMenu />
      </div>
      <div className="flex justify-between py-4 px-4 md:px-10 items-center bg-[#141414] text-white sticky top-0 w-full z-40">
              <h1 className="text-lg md:text-2xl font-medium">
                The Sound of Pure Madness.
              </h1>
              <div className="hidden lg:flex gap-12 font-tt-commons font-semibold text-[1.3rem] justify-center items-center">
                <div className="flex justify-center items-center gap-2">
                  <Image
                    src={ticket}
                    alt="Ticket"
                    width={ticket.width / 14}
                    className="rotate-45"
                  />
                  Hazaribagh
                </div>
             
                <Link href="#tickets" className="bg-[#ffe300] text-black px-7 font-bold py-1">
                  TICKETS
                </Link>
              </div>
              {/* Mobile CTA */}
              <div className="lg:hidden">
                <Link href="#tickets" className="bg-[#ffe300] text-black px-4 py-1 text-sm font-bold">
                  TICKETS
                </Link>
              </div>
            </div>
          
    </>
  );
};

export default memo(Header);