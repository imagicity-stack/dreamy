export default function ScrollingBanner() {
  return (
    <div className="bg-[#03ff93] py-3 md:py-4 overflow-hidden whitespace-nowrap relative">
      {/* Scrolling content */}
      <div className="animate-scroll inline-flex items-center gap-4 md:gap-8">
        {/* Repeat the pattern multiple times for seamless scrolling */}
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-4 md:gap-8 flex-shrink-0 justify-center"
          >
            <span className="text-blue-700 font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-wide">
          COSPLAY
            </span>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center">
              <span className="text-blue-700 text-4xl md:text-6xl">☺</span>
            </div>
            <span className="text-blue-700 font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-wide">
              MUSIC
            </span>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center">
              <span className="text-blue-700 text-4xl md:text-6xl">☺</span>
            </div>
            <span className="text-blue-700 font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-wide">
              DANCE
            </span>
          </div>
        ))}
      </div>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
