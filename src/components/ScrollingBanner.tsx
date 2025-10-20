const items = ["COSPLAY", "MUSIC", "DANCE", "STALLS", "FOOD"];

export default function ScrollingBanner() {
  return (
    <div className="bg-[#03ff93] py-3 md:py-4 overflow-hidden relative">
      <div className="marquee inline-flex whitespace-nowrap">
        {[0, 1].map((loop) => (
          <div
            key={loop}
            className="flex items-center gap-6 md:gap-10 flex-shrink-0 px-4"
            aria-hidden={loop === 1}
          >
            {items.map((item) => (
              <span
                key={`${loop}-${item}`}
                className="text-blue-700 font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.3em]"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee {
          animation: scroll 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
