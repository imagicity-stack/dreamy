import Image from "next/image";

export default function Prize() {
  return (
    <section className="bg-black py-8 sm:py-12 md:py-20 relative px-4 sm:px-6 md:px-8">
      {/* Main Container */}
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch relative z-10 overflow-hidden">
        {/* Left Section - Image */}
        <div className="relative order-2 lg:order-1">
          <Image
            src="/raven.png"
            alt="Cosplay Character"
            width={900}
            height={500}
            className="object-cover w-full h-full min-h-[250px] sm:min-h-[300px] lg:min-h-0 lg:rounded-l-2xl"
          />
        </div>

        {/* Right Section - Contact Content */}
        <div className="bg-[#7300ff] p-4 sm:p-6 md:p-10 lg:p-16 flex flex-col justify-center items-center text-center lg:rounded-r-2xl relative order-1 lg:order-2">
          {/* Heading */}
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight uppercase mb-3 sm:mb-4 md:mb-6 tracking-wide font-castle">
            PRIZES & TITLES
          </h2>

          {/* Prizes List */}
          <div className="w-full max-w-xl mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            {/* 1st Place */}
            <div className="bg-gradient-to-r from-[#ffe300] to-[#ff1a00] p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-[#ffe300]">
              <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-4xl font-castle text-black mb-2">
                🥇 1st Place – The Mad Legend
              </h2>
              <p className="text-black font-sans text-sm sm:text-base md:text-lg">
                ₹3000 + Amazon gift voucher + certificate + feature reel
              </p>
            </div>

            {/* 2nd Place */}
            <div className="bg-gradient-to-r from-[#9dffff] to-[#7300ff] p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-[#9dffff]">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-4xl font-castle text-black mb-2">
                🥈 2nd Place – The Mad Icon
              </h2>
              <p className="text-black font-sans text-sm sm:text-base md:text-lg">
                ₹2000 + certificate + feature reel
              </p>
            </div>

            {/* 3rd Place */}
            <div className="bg-gradient-to-r from-[#ff1a00] to-[#7300ff] p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-[#ff1a00]">
              <h4 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-4xl font-castle text-white mb-2">
                🥉 3rd Place – Crowd Favorite
              </h4>
              <p className="text-white font-sans text-sm sm:text-base md:text-lg">
                ₹500 + food coupon + certificate
              </p>
            </div>

            {/* Bonus Titles */}
            <div className="bg-black/50 border-2 border-[#ffe300] rounded-lg sm:rounded-xl p-3 sm:p-4">
              <h4 className="text-md  sm:text-lg md:text-2xl text-[#ffe300] mb-2 sm:mb-3 font-castle">
                🎖️ Bonus Titles
              </h4>
              <div className="flex flex-wrap font-sans justify-center gap-2">
                <span className="bg-[#7300ff] px-2 sm:px-3 py-1 rounded-full text-white text-xs md:text-sm">
                  Best Group Cosplay
                </span>
                <span className="bg-[#ff1a00] px-2 sm:px-3 py-1 rounded-full text-white text-xs md:text-sm">
                  Most Creative Design
                </span>
                <span className="bg-[#9dffff] px-2 sm:px-3 py-1 rounded-full text-black text-xs md:text-sm">
                  Judge&apos;s Choice
                </span>
              </div>
            </div>
          </div>

        

          

          {/* Small Cartoon Character */}
          <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 z-10">
            <Image
              src="/comic.png"
              alt="Mascot"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
