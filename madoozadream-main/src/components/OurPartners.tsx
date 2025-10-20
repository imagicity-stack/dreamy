import { memo } from 'react';

const OurPartners = () => {
  // Partner logos - replace with actual partner logos
  const partners = [
    { name: "Partner 1", logo: "/partner1.png" },
    { name: "Partner 2", logo: "/partner2.png" },
    { name: "Partner 3", logo: "/partner3.png" },
    { name: "Partner 4", logo: "/partner4.png" },
    { name: "Partner 5", logo: "/partner5.png" },
    { name: "Partner 6", logo: "/partner6.png" },
  ];

  return (
    <section className="bg-black text-white py-12 md:py-20 px-4 md:px-8 lg:px-20 border-t-2 border-[#ffe300]">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-castle text-[#ffe300] uppercase tracking-wider">
            Our Partners
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mt-4">
            Powered by amazing collaborators
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {partners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center justify-center"
            >
              <div className="bg-white rounded-xl px-6 py-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#ffe300]/20 hover:border-[#ffe300] hover:scale-110 w-full h-32 flex items-center justify-center">
                <span className="text-black font-bold text-sm md:text-base lg:text-lg text-center">
                  {partner.name}
                </span>
                {/* Replace with actual logo images */}
                {/* <Image src={partner.logo} alt={partner.name} width={120} height={60} className="object-contain" /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(OurPartners);