import { memo } from 'react';

const Highlights = () => {
  const highlights = [
    {
      icon: "📸",
      title: "Neon Photo Booths",
      desc: "Neon photo booths & selfie zones",
      borderColor: "border-[#ff1a00]",
      bgColor: "bg-[#ff1a00]/10",
    },
    {
      icon: "🎬",
      title: "Pro Coverage",
      desc: "Professional photos + aftermovie coverage by Imagicity",
      borderColor: "border-[#7300ff]",
      bgColor: "bg-[#7300ff]/10",
    },
    {
      icon: "🎤",
      title: "Live Energy",
      desc: "Crowd interactions, live music, and anchor-led energy",
      borderColor: "border-[#ffe300]",
      bgColor: "bg-[#ffe300]/10",
    },
    {
      icon: "📱",
      title: "Social Fame",
      desc: "Winning entries featured on the official MADOOZA Instagram",
      borderColor: "border-[#9dffff]",
      bgColor: "bg-[#9dffff]/10",
    },
  ];

  return (
    <section className="bg-black text-white py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-castle text-[#ffe300] mb-3 sm:mb-4">
            HIGHLIGHTS
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl">
            What Makes This Event Unforgettable
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Card */}
              <div
                className={`${item.bgColor} ${item.borderColor} border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 h-full hover:scale-105 transition-all duration-300`}
              >
                {/* Icon */}
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-castle font-normal text-[#ffe300] mb-2 sm:mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                  {item.desc}
                </p>

                {/* Decorative Element */}
                <div className="mt-3 sm:mt-4 flex gap-2">
                  <div className="w-8 sm:w-10 md:w-12 h-1 bg-[#ff1a00] rounded-full"></div>
                  <div className="w-6 sm:w-7 md:w-8 h-1 bg-[#9dffff] rounded-full"></div>
                  <div className="w-3 sm:w-4 h-1 bg-[#ffe300] rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <p className="text-[#9dffff] text-base sm:text-lg md:text-xl lg:text-2xl font-castle px-4">
            ✨ THIS IS MORE THAN COSPLAY — THIS IS THE MADVERSE ✨
          </p>
        </div>
      </div>
    </section>
  );
};

export default memo(Highlights);