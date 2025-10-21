import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  const images = [
    {
      src: "/involve/perfomers.jpg",
      alt: "Man with Microphone",
      gradient: "from-red-600 to-red-800",
    },
    {
      src: "/involve/volunteer.jpg",
      alt: "Cosplayer",
      gradient: "from-purple-600 to-purple-800",
    },
    {
      src: "/involve/sponsorship.png",
      alt: "Group Celebration",
      gradient: "from-pink-600 to-red-600",
    },
    {
      src: "/involve/cosplay.jpg",
      alt: "DJ Performing",
      gradient: "from-purple-600 to-blue-600",
    },
    { src: "/involve/stall.jpg", alt: "gun", gradient: "from-purple-600 to-blue-600" },
  ];

  return (
    <section
      id="aboutus"
      className="bg-[#ff7a00] py-12 md:py-20 scroll-mt-24"
    >
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 lg:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl mb-6 md:mb-8">
          {/* Left Image */}
          <div className="relative order-2 lg:order-1">
            <Image
              src="/aboutUs.jpg" // replace with your own
              alt="Gaming Friends"
              width={500}
              height={200}
              className="w-full h-full object-cover min-h-[200px] lg:min-h-0"
            />
          </div>

          {/* Right Text Block */}
          <div className="bg-[#aef9ff] relative flex flex-col justify-center p-6 md:p-10 lg:p-16 text-black order-1 lg:order-2">
            <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-6 leading-tight">
              ABOUT MADOOZA
            </h2>

            <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6">
              Madooza is not just another fest. It’s Hazaribagh’s first creative explosion where art, food,
              music, and ideas collide.
              Conceptualized and organized by IMAGICITY, Madooza is built to give local creators, brands,
              and students a platform that feels premium yet rooted.
              From vibrant food stalls to live exhibitions, performances, and interactive zones, every corner of
              Madooza is designed to spark curiosity and collaboration.
              It’s a space where creativity meets opportunity — for entrepreneurs, artists, and dreamers ready
              to make noise in Hazaribagh
            </p>

            <p className="font-semibold mb-4 md:mb-6">This is 
              MADOOZA
            </p>
            <p className="font-extrabold text-base md:text-lg mb-6 md:mb-8">
              The sound of pure madness
            </p>

           
          </div>
        </div>

        {/* Bottom Image Grid */}
        <div className="relative">
          {/* Left Button */}
          <button
            onClick={() => {
              const carousel = document.querySelector("[data-carousel]");
              if (carousel) carousel.scrollLeft -= 300;
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black text-white p-2 md:p-3 rounded-full hover:bg-gray-900 transition hidden sm:block"
            aria-label="Scroll left"
          >
            ←
          </button>

          {/* Carousel */}
          <div
            data-carousel
            className="overflow-x-auto -mx-2 px-2"
            role="region"
            aria-label="Image carousel"
          >
            <div className="flex gap-2 md:gap-4 snap-x snap-mandatory">
              {[...images, ...images].map((img, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 rounded-lg overflow-hidden relative w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4"
                  role="listitem"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={400}
                    height={300}
                    className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <button
            onClick={() => {
              const carousel = document.querySelector("[data-carousel]");
              if (carousel) carousel.scrollLeft += 300;
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black text-white p-2 md:p-3 rounded-full hover:bg-gray-900 transition hidden sm:block"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
