import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="aboutus"
      className="bg-black py-12 md:py-20 scroll-mt-24 text-white"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-montserrat text-xs uppercase tracking-[0.6em] text-[#48cdd3]">
            Why Madooza
          </span>
          <h2 className="font-travel-sans text-3xl sm:text-4xl md:text-5xl uppercase text-[#FFF700]">
            About Madooza
          </h2>
          <p className="max-w-3xl text-sm sm:text-base md:text-lg text-white/80">
            Madooza is Hazaribagh’s first creative explosion where art, food, music, and ideas collide. Built by
            the Madooza team, it gives local creators, brands, and students a premium stage that still feels deeply rooted in the city’s
            energy.
          </p>
        </div>

        <div className="grid items-stretch gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-8">
            <div className="relative overflow-hidden rounded-3xl border border-[#e22154]/40 bg-[#1a0010]/70 p-8 md:p-10 shadow-[0_0_35px_rgba(226,33,84,0.2)]">
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#e22154]/40 via-transparent to-transparent opacity-70"
                aria-hidden
              />
              <div className="relative space-y-4">
                <h3 className="font-travel-sans text-2xl sm:text-3xl uppercase text-[#ffe300]">
                  The Movement
                </h3>
                <p className="text-sm sm:text-base text-white/80">
                  Madooza is not just another fest. It is a playground for creators, entrepreneurs, and dreamers who want to make
                  noise in Hazaribagh, giving them a space that feels both premium and welcoming.
                </p>
                <p className="text-sm sm:text-base text-white/80">
                  From vibrant food stalls to live exhibitions, performances, and interactive zones, every corner is designed to
                  spark curiosity, collaboration, and unforgettable memories.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
                <h4 className="font-montserrat text-base font-semibold uppercase tracking-wide text-[#48cdd3]">
                  Immersive Zones
                </h4>
                <p className="mt-3 text-sm text-white/70">
                  Live stages, art alleys, gaming corners, and food pop-ups crafted to keep every sense buzzing from day to night.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
                <h4 className="font-montserrat text-base font-semibold uppercase tracking-wide text-[#e22154]">
                  Creator-First
                </h4>
                <p className="mt-3 text-sm text-white/70">
                  Local brands and artists get the spotlight, resources, and networking opportunities to scale their craft.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm sm:col-span-2">
                <h4 className="font-montserrat text-base font-semibold uppercase tracking-wide text-[#f6cd4a]">
                  Community Energy
                </h4>
                <p className="mt-3 text-sm text-white/70">
                  Built with and for the people of Hazaribagh, ensuring the vibe stays raw, real, and community-driven.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#f6cd4a]/40 bg-[#f6cd4a]/10 px-4 py-6 text-center">
                <p className="text-3xl font-travel-sans text-[#f6cd4a]">50+</p>
                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/70">Creators &amp; Brands</p>
              </div>
              <div className="rounded-2xl border border-[#48cdd3]/40 bg-[#48cdd3]/10 px-4 py-6 text-center">
                <p className="text-3xl font-travel-sans text-[#48cdd3]">20+</p>
                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/70">Experiences &amp; Zones</p>
              </div>
              <div className="rounded-2xl border border-[#e22154]/40 bg-[#e22154]/10 px-4 py-6 text-center">
                <p className="text-3xl font-travel-sans text-[#e22154]">1</p>
                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/70">City. Pure Madness.</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="/aboutUs.jpg"
              alt="Friends enjoying at Madooza"
              width={900}
              height={900}
              className="h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              aria-hidden
            />
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <p className="font-montserrat text-xs uppercase tracking-[0.4em] text-[#ffe300]">
                This is Madooza
              </p>
              <p className="font-travel-sans text-2xl sm:text-3xl text-white">
                The Sound of Pure Madness
              </p>
              <p className="text-sm text-white/70">
                Crafted for the dreamers, makers, and fans turning Hazaribagh into a creative capital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
