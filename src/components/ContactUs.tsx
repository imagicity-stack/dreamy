import Image from "next/image";

export default function ContactUs() {
  return (
    <section
      id="contactus"
      className="bg-black py-12 md:py-20 relative px-4 scroll-mt-24"
    >
      {/* Main Container */}
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch relative z-10 rounded-2xl overflow-hidden">
        {/* Left Section - Image */}
        <div className="relative order-2 lg:order-1">
          <Image
            src="/raven.png" // <-- Replace with your own image
            alt="Cosplay Character"
            width={900}
            height={500}
            className="object-cover w-full h-full min-h-[300px] lg:min-h-0 lg:rounded-l-2xl"
          />
        </div>

        {/* Right Section - Newsletter Content */}
        <div className="bg-[#ff1a00] p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center lg:rounded-r-2xl relative order-1 lg:order-2">
          {/* Heading */}
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-lg leading-tight uppercase mb-4 md:mb-6 tracking-wide font-castle">
            CONTACT US
          </h2>

          {/* Paragraph */}
          <div className="text-white font-sans text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mb-6 md:mb-8">
            <p className="mb-4 font-semibold text-lg md:text-xl">Get in Touch</p>
            <p className="mb-4">
              Have a question or want to collaborate with Madooza? Reach out to us:
            </p>
            <div className="space-y-2 font-semibold">
      <p className="break-all font-sans">📩 madooza&#64;imagicity.in</p>
              <p>📞 +91-9122289578</p>
            </div>
            <button className="mt-6 cursor-pointer px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-yellow-300 transition-colors duration-300">
              Get in Touch  
            </button>
          </div>

          {/* Small Cartoon Character */}
          <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-32 h-32 md:w-40 md:h-40 z-10">
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
