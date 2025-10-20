"use client";

export default function CosplayBanner() {
  const messages = [
    "COSPLAY ARENA",
    "STEP INTO CHARACTER",
    "MADVERSE AWAITS",
    "₹299 ENTRY",
    "WIN UP TO ₹3000",
    "PHOTO BOOTHS",
    "LIVE PERFORMANCE",
    "CROWD VOTING",
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#ff1a00] via-[#7300ff] to-[#ffe300] py-3 sm:py-4 md:py-6 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* Duplicate the messages array for seamless scrolling */}
        {[...messages, ...messages, ...messages].map((message, index) => (
          <div
            key={index}
            className="inline-flex items-center mx-3 sm:mx-4 md:mx-8"
          >
            <span className="text-white font-castle font-extrabold text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl uppercase tracking-wider drop-shadow-lg">
              {message}
            </span>
            <span className="text-[#ffe300] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mx-3 sm:mx-4 md:mx-8">
              •
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
