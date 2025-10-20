import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

const eventFormat = [
  {
    title: "Part 1: Expo Zone",
    description:
      "Participants freely showcase their characters across the campus for photo-ops and crowd engagement.",
  },
  {
    title: "Part 2: The MAD Parade",
    description:
      "A high-energy stage walk where the top 10 cosplayers perform or pose live, followed by crowd voting and final judging.",
  },
];

const participationDetails = [
  "Open for students (of any school) and local youth participants.",
  "₹299 entry for externals.",
  "Costumes can be from anime, gaming, movies, pop culture, or pure imagination.",
  "Limited slots — registration on the website.",
];

const prizes = [
  {
    title: "🥇 1st Place – The Mad Legend",
    description: "₹3000 + Amazon gift voucher + certificate + feature reel",
    accent: "from-[#ffe300] to-[#ff1a00] text-black",
  },
  {
    title: "🥈 2nd Place – The Mad Icon",
    description: "₹2000 + certificate + feature reel",
    accent: "from-[#9dffff] to-[#7300ff] text-black",
  },
  {
    title: "🥉 3rd Place – Crowd Favorite",
    description: "₹500 + food coupon + certificate",
    accent: "from-[#ff1a00] to-[#7300ff] text-white",
  },
];

const judgingCriteria = [
  { criteria: "Costume Accuracy & Creativity", weight: "40%" },
  { criteria: "Stage Presence / Performance", weight: "25%" },
  { criteria: "Character Portrayal", weight: "20%" },
  { criteria: "Audience Engagement", weight: "15%" },
];

const rules = [
  "No dangerous props, sharp objects, or offensive content.",
  "Keep performances school-safe.",
  "Arrive at least 1 hour before event start for costume check-in.",
  "Respect all fellow participants and volunteers.",
  "Have fun — the madder, the better.",
];

const highlights = [
  "Neon photo booths & selfie zones.",
  "Professional photos + aftermovie coverage by Imagicity.",
  "Crowd interactions, live music, and anchor-led energy.",
  "Winning entries featured on the official MADOOZA Instagram.",
];

export default function CosplayPage() {
  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7300ff] via-[#ff1a00] to-[#ffe300] text-black py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.4em] text-[#ffe300] font-oswald mb-4">
            Cosplay Arena
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald uppercase text-white drop-shadow-xl">
            🎭 Cosplay Arena – Step Into the MADVERSE
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed font-quicksand">
            Welcome to the wildest corner of MADOOZA — the Cosplay Arena, where imagination takes the stage and reality calls in sick.
            For the first time in Hazaribagh, heroes, villains, and absolute mad-minds will walk together in one grand celebration of fandom,
            art, and chaos. Whether you&apos;re a die-hard anime fan, a Bollywood icon in disguise, or just someone with a crazy idea and cardboard armor — this is your moment.
          </p>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed font-quicksand">
            The Cosplay Arena isn&apos;t just a dress-up segment; it&apos;s a full-scale experience. Participants will roam the MADOOZA grounds in character,
            interact with the crowd, strike poses at our neon photo booths, and finally battle it out on stage during the MAD PARADE — the ultimate cosplay showdown
            where the audience decides who rules the MADVERSE.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Event Format</h2>
            <div className="space-y-4">
              {eventFormat.map((item) => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-oswald text-white uppercase mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300 font-quicksand leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1a062a] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Participation Details</h2>
              <ul className="space-y-3 text-sm sm:text-base text-gray-200 font-quicksand leading-relaxed list-disc list-inside">
                {participationDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
            <div className="mt-6 rounded-xl border border-[#ffe300]/30 bg-[#ffe300]/10 p-4 text-sm sm:text-base text-[#ffe300] font-quicksand leading-relaxed">
              ₹299 entry covers arena access, stage participation, and certification for all registered cosplayers.
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#080510]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-10 xl:gap-16 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">Prizes &amp; Titles</h2>
            <div className="space-y-4">
              {prizes.map((prize) => (
                <div
                  key={prize.title}
                  className={`bg-gradient-to-r ${prize.accent} rounded-xl border border-white/10 p-4 sm:p-6 shadow-lg`}
                >
                  <h3 className="text-xl sm:text-2xl font-oswald uppercase mb-2">{prize.title}</h3>
                  <p className="text-sm sm:text-base font-quicksand leading-relaxed">
                    {prize.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-black/40 border border-[#ffe300]/40 rounded-xl p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-oswald text-[#ffe300] uppercase mb-3">Bonus Titles</h3>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm font-quicksand text-black">
                <span className="bg-[#ffe300] px-3 py-1 rounded-full uppercase tracking-wide">Best Group Cosplay</span>
                <span className="bg-[#ff1a00] px-3 py-1 rounded-full uppercase tracking-wide text-white">Most Creative Design</span>
                <span className="bg-[#9dffff] px-3 py-1 rounded-full uppercase tracking-wide">Judge&apos;s Choice</span>
              </div>
            </div>
          </div>

          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Judging Criteria</h2>
            <div className="space-y-3">
              {judgingCriteria.map((item) => (
                <div
                  key={item.criteria}
                  className="flex items-center justify-between bg-black/40 border border-[#9dffff]/30 rounded-lg px-4 py-3"
                >
                  <span className="text-sm sm:text-base font-quicksand text-gray-200">{item.criteria}</span>
                  <span className="text-lg sm:text-xl font-oswald text-[#9dffff]">{item.weight}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4">
              <h3 className="text-lg sm:text-xl font-oswald text-[#ffe300] uppercase mb-2">Judging Panel</h3>
              <p className="text-sm sm:text-base text-gray-300 font-quicksand leading-relaxed">
                1 creative representative from Imagicity, 1 faculty member, and 1 local artist / influencer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12">
          <div className="bg-[#1a062a] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Rules &amp; Guidelines</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-200 font-quicksand leading-relaxed list-disc list-inside">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-4">Highlights</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-200 font-quicksand leading-relaxed list-disc list-inside">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
