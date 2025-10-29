"use client";

const items = ["COSPLAY", "MUSIC", "DANCE", "STALLS", "FOOD"];

export default function ScrollingBanner() {
  return (
    <div className="bg-[#00f5ff] py-6 md:py-10 px-4 overflow-hidden relative shadow-[0_0_25px_rgba(0,0,0,0.25)]">
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
                className="text-black font-montserrat text-2xl sm:text-3xl md:text-4xl tracking-[0.3em]"
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
