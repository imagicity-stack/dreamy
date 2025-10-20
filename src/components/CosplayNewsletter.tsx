import Image from "next/image";

export default function CosplayNewsletter() {
  return (
    <section className="bg-black py-8 sm:py-12 md:py-20 relative px-4 sm:px-6 md:px-8">
      {/* Main Container */}
      <div className="max-w-[1500px] mx-auto p-4 sm:p-8 md:p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 items-stretch relative z-10 rounded-xl sm:rounded-2xl overflow-hidden">
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
            JOIN THE MADVERSE
          </h2>

        

          {/* Judging Criteria Table */}
          <div className="w-full max-w-xl mb-6 sm:mb-8 bg-black/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-[#ffe300]">
            <h3 className="text-xl sm:text-2xl md:text-3xl text-[#ffe300] mb-3 sm:mb-4 font-castle">
              Judging Criteria
            </h3>
            <div className="space-y-2 font-sans sm:space-y-3">
              {[
                { criteria: "Costume Accuracy & Creativity", weight: "40%" },
                { criteria: "Stage Presence / Performance", weight: "25%" },
                { criteria: "Character Portrayal", weight: "20%" },
                { criteria: "Audience Engagement", weight: "15%" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-black/40 p-2 sm:p-3 rounded-md sm:rounded-lg border border-[#9dffff]/30"
                >
                  <span className="text-white text-sm sm:text-sm md:text-base">{item.criteria}</span>
                  <span className="text-[#ffe300] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-castle">
                    {item.weight}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#9dffff]/30">
              <h4 className="text-xl sm:text-xl md:text-2xl text-[#9dffff] mb-2 font-castle">
                Judging Panel:
              </h4>
              <p className="text-white font-sans text-sm sm:text-sm">
                1 creative representative from Imagicity, 1 faculty member, and 1
                local artist / influencer.
              </p>
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
