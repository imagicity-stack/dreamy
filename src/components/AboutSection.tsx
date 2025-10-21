import Image from "next/image";

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

      </div>
    </section>
  );
}
