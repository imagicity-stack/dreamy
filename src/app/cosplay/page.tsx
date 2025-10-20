"use client";
import Link from "next/link";
import Image from "next/image";
import smilGif from "../../../public/Winky Smile.gif";
import { useState } from "react";
import Footer from "@/components/Footer";
import CosplayBanner from "@/components/CosplayBanner";
import CosplayNewsletter from "@/components/CosplayNewsletter";
import Prize from "@/components/Prize";
import Highlights from "@/components/Highlights";

const festivals = [
  {
    name: "Bring Your Stall",
   
    desc: "Bring your brand, food, or art to life. Set up your stall and be part of Hazaribagh’s biggest youth carnival.",
    color: "bg-red-500",
    logo: "/D2.png",
    text: "white",
    color2: "yellow-300",
  },
  {
    name: "Cosplay Event",
    desc: "Step into your favorite character and own the stage. Be part of Hazaribagh’s first ever cosplay celebration.",
    color: "bg-orange-500",
    logo: "/D3.png",
    text: "white",
    color2: "[#A1FFFD]",
  },
  {
    name: "PERFORMERS",
    date: "Feb 21 – 23, 2025",
    desc: "Show your talent — dance, sing, rap, paint, or perform live. This is your spotlight.",
    color: "bg-[#A1FFFD]",
    logo: "/D5.png",
    text: "black",
    color2: "pink-600",
  },
  {
    name: "VOLUNTEERS",
    desc: "Join the crew that’s making this madness possible. Let’s build Madooza together.",
    color: "bg-blue-500",
    logo: "/D1.png",
    text: "white",
    color2: "yellow-300",
  },
  {
    name: "WANT TO SPOONSOR",
    date: "May 16 – 18, 2025",
    desc: "Each sub section will have a basic form (take reference from the existing site) and before applying a check box- I have read the terms and conditions.",
    color: "bg-green-400",
    logo: "/D4.png",
    text: "black",
    color2: "blue-600",
  },
];

const highlights = [
  {
    title: "PART 1  EXPO ZONE",
    subtitle: "Participants freely showcase their characters across the campus for photo-ops and crowd engagement.",
    color: "bg-[#ff1a00]",
    textColor: "text-[#ffe300]",
    image: "/gaming.webp",
  },
  {
    title: "PART 2  THE MAD PARADE",
    subtitle: "A high-energy stage walk where the top 10 cosplayers perform or pose live, followed by crowd voting and final judging.",
    color: "bg-[#7300ff]",
    textColor: "text-[#9dffff]",
    image: "/expo.png",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      
     
       
      <div className="w-full h-[65vh] sm:h-[75vh] md:h-[80vh] bg-blue-500 relative overflow-hidden">
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4">
          <div className="flex flex-col items-center justify-center w-full max-w-[95vw]">
            <h1 className="relative text-[#ffe300] text-[clamp(48px,12vw,220px)] sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[200px] font-castle drop-shadow-2xl tracking-tight z-10 leading-none text-center">
              COSPLAY
              <Image
                src={smilGif}
                alt="Winky Smile"
                width={150}
                height={150}
                className="absolute -top-1 sm:-top-3 md:-top-6 -right-2 sm:-right-6 md:-right-14 z-0 pointer-events-none w-[clamp(20px,5vw,140px)] h-[clamp(20px,5vw,140px)] sm:w-12 sm:h-12 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-36 xl:h-36"
              />
              <Image
                src={smilGif}
                alt="Winky Smile"
                width={150}
                height={150}
                className="absolute -bottom-1 sm:-bottom-3 md:-bottom-6 -left-2 sm:-left-6 md:-left-12 z-0 pointer-events-none w-[clamp(20px,5vw,140px)] h-[clamp(20px,5vw,140px)] sm:w-12 sm:h-12 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-36 xl:h-36"
              />
            </h1>
          </div>
          <p className="text-[#9dffff] font-extrabold font-tt-commons text-[clamp(11px,3vw,32px)] sm:text-base md:text-xl lg:text-2xl xl:text-3xl -mt-2 sm:-mt-4 md:-mt-8 lg:-mt-16 text-center px-4 max-w-full">
            THE SOUND OF PURE MADNESS
          </p>
          <div className="w-5 h-8 sm:w-6 sm:h-10 md:w-9 md:h-14 border-2 md:border-4 border-white rounded-full flex justify-center items-end p-1 md:p-2 mt-1 sm:mt-2">
            <div className="w-1 h-2 md:w-2 md:h-4 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
      <CosplayBanner/>
       <section className="bg-black text-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20">
  {/* Header */}
  <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-12 md:mb-16">
    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-castle tracking-wider mb-4 sm:mb-6 leading-none">
      Step Into the MADVERSE
    </h2>
    <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-2 sm:px-4 md:px-6 lg:px-10">
Welcome to the wildest corner of MADOOZA — the Cosplay Arena, where imagination takes
the stage and reality calls in sick. For the first time in Hazaribagh, heroes, villains, and absolute
mad-minds will walk together in one grand celebration of fandom, art, and chaos. Whether
you’re a die-hard anime fan, a Bollywood icon in disguise, or just someone with a crazy idea
and cardboard armor — this is your moment.
The Cosplay Arena isn’t just a dress-up segment; it’s a full-scale experience. Participants will
roam the MADOOZA grounds in character, interact with the crowd, strike poses at our neon
photo booths, and finally battle it out on stage during the MAD PARADE — the ultimate cosplay
showdown where the audience decides who rules the MADVERSE.   </p>
  </div>

  {/* Product Grid */}
  
     <div className="flex justify-center mt-6 sm:mt-8">
          <Link
            href="#"
            className="bg-lime-400 text-black px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-sm font-bold text-base sm:text-lg md:text-xl hover:bg-lime-300 transition-all duration-300 hover:scale-105"
          >
            BUY NOW ↗
          </Link>
        </div>
</section>
     
      
      <section className="bg-black">
      <section className="py-8 sm:py-10 bg-black md:py-12 w-full md:w-10/12 px-4 sm:px-6 md:px-8 lg:px-0 mx-auto">
          {/* Creators Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-lg uppercase tracking-wide font-castle text-[#ffe300] mb-2 sm:mb-4">
              EVENT FORMAT
            </h2>
          
          </div>

          {/* Creator Cards */}
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 sm:gap-8 md:gap-12 max-w-5xl mx-auto">
            {highlights.map((item, index) => (
              <div
                key={index}
                className={`${item.color} flex flex-col items-center w-full md:w-1/2 text-center duration-300 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-all border-2 sm:border-4 border-white/20 hover:border-white/40`}
              >
                <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 pb-4 sm:pb-6">
                  <h3
                    className={`${item.textColor} text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-extrabold uppercase tracking-wider font-castle mb-2 sm:mb-3 md:mb-4`}
                  >
                    {item.title}
                  </h3>
                  <p className={`${item.textColor} text-sm sm:text-base md:text-lg lg:text-xl font-bold opacity-90`}>
                    {item.subtitle}
                  </p>
                </div>

                <div className="relative w-full flex justify-center items-end flex-1">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={600}
                    className="object-cover w-full h-full min-h-[200px] sm:min-h-[250px] md:min-h-[350px] lg:min-h-[400px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        
        </section>

        <Prize  />
     
      <CosplayBanner />

      {/* Rules & Guidelines Section */}
     

      
      <CosplayNewsletter />
       <section className="bg-black text-white py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-castle text-[#ffe300] mb-6 sm:mb-8 md:mb-12 text-center">
            Rules & Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Rule Card 1 */}
            <div className="bg-gradient-to-br from-[#7300ff]/20 to-[#ff1a00]/20 border-2 border-[#ffe300]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#ffe300] transition-all hover:scale-105">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚫</div>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                No dangerous props, sharp objects, or offensive content.
              </p>
            </div>

            {/* Rule Card 2 */}
            <div className="bg-gradient-to-br from-[#ff1a00]/20 to-[#7300ff]/20 border-2 border-[#9dffff]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#9dffff] transition-all hover:scale-105">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎭</div>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Keep performances school safe.
              </p>
            </div>

            {/* Rule Card 3 */}
            <div className="bg-gradient-to-br from-[#7300ff]/20 to-[#ff1a00]/20 border-2 border-[#ffe300]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#ffe300] transition-all hover:scale-105">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⏰</div>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Arrive at least 1 hour before event start for costume check-in.
              </p>
            </div>

            {/* Rule Card 4 */}
            <div className="bg-gradient-to-br from-[#ff1a00]/20 to-[#7300ff]/20 border-2 border-[#9dffff]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#9dffff] transition-all hover:scale-105">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🤝</div>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Respect all fellow participants and volunteers.
              </p>
            </div>

            {/* Rule Card 5 */}
            <div className="bg-gradient-to-br from-[#7300ff]/20 to-[#ff1a00]/20 border-2 border-[#ff1a00]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#ff1a00] transition-all hover:scale-105 md:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎉</div>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                <span className="text-[#ff1a00]">
                  Have fun — the madder, the better.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <Highlights />
      <Footer />
      

    </div>
  );
}