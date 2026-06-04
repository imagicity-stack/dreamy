import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Instagram } from "lucide-react";

export default function ContactUs() {
  return (
    <section
      id="contactus"
      className="relative bg-[var(--ink)] py-20 md:py-28 px-4 scroll-mt-24 text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-neon opacity-20 pointer-events-none" />
      <div className="absolute -top-24 left-1/3 w-[420px] h-[420px] orb orb-magenta orb-drift" />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden border-2 border-black"
          style={{ boxShadow: "12px 12px 0 var(--magenta)" }}
        >
          <div className="relative order-2 lg:order-1 min-h-[320px] lg:min-h-[520px] bg-[var(--ink-2)]">
            <Image
              src="/raven.png"
              alt="Madooza mascot"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--magenta)]/60 via-transparent to-[var(--cyan)]/40 mix-blend-overlay" />
            <span className="absolute top-4 left-4 sticker sticker-cyan tilt-l wiggle">
              Talk to us
            </span>
          </div>

          <div className="bg-[var(--ink-2)] p-8 md:p-12 lg:p-14 flex flex-col justify-center order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-stripe-magenta opacity-5 pointer-events-none" />
            <div className="relative">
              <span className="sticker sticker-magenta">Get In Touch</span>
              <h2 className="mt-4 font-bowlby text-5xl md:text-6xl lg:text-7xl uppercase text-[var(--acid)] leading-[0.9]">
                Contact Us
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/75 max-w-md">
                Sponsor inquiry, performer pitch, press, or just want to say hi —
                drop us a line. We reply fast.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href="mailto:contact@madooza.com"
                  className="group flex items-center gap-4 border-2 border-black bg-[var(--ink-3)] p-4 transition-all hover:-translate-y-1"
                  style={{ boxShadow: "5px 5px 0 var(--cyan)" }}
                >
                  <Mail size={22} className="text-[var(--cyan)] flex-shrink-0" />
                  <div>
                    <p className="font-montserrat text-[0.6rem] tracking-[0.3em] uppercase text-white/55">
                      Email
                    </p>
                    <p className="font-quicksand font-bold text-base md:text-lg group-hover:text-[var(--cyan)]">
                      contact@madooza.com
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+919122289578"
                  className="group flex items-center gap-4 border-2 border-black bg-[var(--ink-3)] p-4 transition-all hover:-translate-y-1"
                  style={{ boxShadow: "5px 5px 0 var(--acid)" }}
                >
                  <Phone size={22} className="text-[var(--acid)] flex-shrink-0" />
                  <div>
                    <p className="font-montserrat text-[0.6rem] tracking-[0.3em] uppercase text-white/55">
                      Phone
                    </p>
                    <p className="font-quicksand font-bold text-base md:text-lg group-hover:text-[var(--acid)]">
                      +91 91222 89578
                    </p>
                  </div>
                </a>
                <Link
                  href="https://www.instagram.com/madooza.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 border-2 border-black bg-[var(--ink-3)] p-4 transition-all hover:-translate-y-1"
                  style={{ boxShadow: "5px 5px 0 var(--magenta)" }}
                >
                  <Instagram size={22} className="text-[var(--magenta)] flex-shrink-0" />
                  <div>
                    <p className="font-montserrat text-[0.6rem] tracking-[0.3em] uppercase text-white/55">
                      Instagram
                    </p>
                    <p className="font-quicksand font-bold text-base md:text-lg group-hover:text-[var(--magenta)]">
                      @madooza.in
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
