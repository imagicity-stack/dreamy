export interface Artist {
  name: string;
  role: string;
  category: "Headliner" | "DJ" | "Band" | "Creator" | "Performer";
  image?: string;
  about: string;
  accent: "magenta" | "cyan" | "acid" | "violet" | "orange" | "lime";
  day: "Day 1";
  time?: string;
}

export const artists: Artist[] = [
  {
    name: "TBA — Headliner #1",
    role: "Live Set · Main Stage",
    category: "Headliner",
    image: "/creator1.png",
    about:
      "An unannounced powerhouse closing the night. Expect bass, fireworks, and the loudest singalong Hazaribagh has ever heard.",
    accent: "magenta",
    day: "Day 1",
    time: "21:30",
  },
  {
    name: "TBA — Headliner #2",
    role: "Special Guest",
    category: "Headliner",
    image: "/creator.png",
    about:
      "A surprise act we cannot name yet. Their soundcheck alone will be worth the ticket.",
    accent: "cyan",
    day: "Day 1",
    time: "20:00",
  },
  {
    name: "The MADverse Band",
    role: "Indie Fusion",
    category: "Band",
    image: "/creator1.png",
    about:
      "Six musicians blending Bhojpuri folk with synthwave. Trust us, it works.",
    accent: "acid",
    day: "Day 1",
    time: "18:30",
  },
  {
    name: "DJ Halftone",
    role: "Selector",
    category: "DJ",
    image: "/dj.png",
    about: "Bass-house and break beats from dusk till the lights come back up.",
    accent: "violet",
    day: "Day 1",
    time: "22:30",
  },
  {
    name: "The Cosplay Parade",
    role: "Live Performance · MAD Parade",
    category: "Performer",
    image: "/cosplay.png",
    about:
      "Forty cosplayers, one stage. Anime, gaming, pop culture, pure imagination — and crowd voting in real time.",
    accent: "orange",
    day: "Day 1",
    time: "17:00",
  },
  {
    name: "Featured Creator 01",
    role: "Content Creator",
    category: "Creator",
    image: "/creator.png",
    about:
      "Reveal soon. Following them now means flexing later.",
    accent: "lime",
    day: "Day 1",
    time: "16:00",
  },
];

export interface ScheduleSlot {
  start: string;
  end?: string;
  title: string;
  zone: "Main Stage" | "MAD Parade" | "Bazaar" | "Food Court" | "Art Alley";
  tag: "Live" | "Cosplay" | "Food" | "Talk" | "Stalls" | "DJ";
  desc?: string;
}

export const scheduleDay1: ScheduleSlot[] = [
  { start: "14:00", title: "Gates Open · Bazaar Opens", zone: "Bazaar", tag: "Stalls", desc: "First wave of food, art and merch stalls go live." },
  { start: "15:00", title: "Opening Anthem · Crowd Warm-Up", zone: "Main Stage", tag: "Live" },
  { start: "16:00", title: "Featured Creator Meet & Greet", zone: "Art Alley", tag: "Talk" },
  { start: "17:00", title: "The MAD Parade · Cosplay Round 1", zone: "MAD Parade", tag: "Cosplay" },
  { start: "18:00", title: "Open Mic · Poets, Storytellers", zone: "Art Alley", tag: "Talk" },
  { start: "18:30", title: "The MADverse Band — Live Set", zone: "Main Stage", tag: "Live" },
  { start: "19:30", title: "Food Court Late Service Begins", zone: "Food Court", tag: "Food" },
  { start: "20:00", title: "Headliner #2 — Special Guest", zone: "Main Stage", tag: "Live" },
  { start: "21:30", title: "Headliner #1 — The Closer", zone: "Main Stage", tag: "Live" },
  { start: "22:30", title: "DJ Halftone · After Set", zone: "Main Stage", tag: "DJ" },
  { start: "00:00", title: "Lights Down · Gates Close", zone: "Bazaar", tag: "Stalls" },
];

export interface TicketTier {
  name: string;
  price: number;
  blurb: string;
  perks: string[];
  accent: "acid" | "magenta" | "cyan" | "violet";
  highlight?: boolean;
}

export const ticketTiers: TicketTier[] = [
  {
    name: "Early Bird Pass",
    price: 480,
    blurb: "Standard entry · the smartest move you’ll make this month.",
    perks: [
      "Full-day access · all zones",
      "Entry into the MAD Parade arena",
      "Madooza wristband",
      "Surprise stickers at the gate",
    ],
    accent: "acid",
    highlight: true,
  },
  {
    name: "Squad Pass · ×4",
    price: 1800,
    blurb: "Four wristbands at a sweetheart group price.",
    perks: [
      "Everything in Early Bird",
      "Group photo print at the booth",
      "Free queue jump at one food stall",
      "Group sticker pack",
    ],
    accent: "magenta",
  },
  {
    name: "Madooza VIP",
    price: 1200,
    blurb: "Front of stage, fast lanes, and the merch.",
    perks: [
      "Priority entry · no queue",
      "Front-of-stage barrier access",
      "Limited Madooza tee",
      "Drink token · backstage glance",
    ],
    accent: "cyan",
  },
];

export interface Sponsor {
  name: string;
  tier: "Headline" | "Stage" | "Zone" | "Community";
  blurb?: string;
  accent: "acid" | "magenta" | "cyan" | "violet" | "lime";
}

export const sponsors: Sponsor[] = [
  { name: "Be the first.", tier: "Headline", blurb: "Headline title sponsor slot is open.", accent: "acid" },
  { name: "Stage Sponsor 01", tier: "Stage", accent: "magenta" },
  { name: "Stage Sponsor 02", tier: "Stage", accent: "cyan" },
  { name: "Bazaar Zone", tier: "Zone", accent: "violet" },
  { name: "Food Court", tier: "Zone", accent: "lime" },
  { name: "MAD Parade", tier: "Zone", accent: "magenta" },
  { name: "Art Alley", tier: "Zone", accent: "cyan" },
  { name: "Community Crew", tier: "Community", accent: "acid" },
];

export interface FAQ {
  q: string;
  a: string;
}

export const faqs: FAQ[] = [
  {
    q: "Where is Madooza happening?",
    a: "We’re landing in Hazaribagh, Jharkhand. The exact venue drops on the Venue page closer to the date.",
  },
  {
    q: "What’s the age policy?",
    a: "Open to all 14+. Anyone under 14 must be accompanied by a guardian with a valid pass.",
  },
  {
    q: "Can I bring my camera?",
    a: "Phones and pocket cameras yes. Pro rigs (DSLR + lens kit) need a media pass — DM us.",
  },
  {
    q: "Is there parking?",
    a: "Yes, on-site parking is available with marshals from 13:00 onwards.",
  },
  {
    q: "Will there be food?",
    a: "Twenty-plus local food vendors. Veg, non-veg, late-night street, regional specials — all in one zone.",
  },
];

export const galleryImages = [
  "/D1.png",
  "/D2.png",
  "/D3.png",
  "/D4.png",
  "/D5.png",
  "/cosplay.png",
  "/dj.png",
  "/gaming.webp",
  "/raven.png",
  "/expo.png",
  "/creator.png",
  "/creator1.png",
];
