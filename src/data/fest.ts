// Fest content, plus the seed values for the settings the admin panel edits.
// At runtime prices and switches come from Firestore (see src/lib/settings.ts);
// FEST below is what a fresh Firestore document is seeded with.

export const FEST = {
  fetePrice: 499,
  cosplayFee: 400,
  // Spotlight is priced by how many people are on stage, because a band of
  // eight takes a soundcheck, a changeover and a stage the size of a solo
  // singer's eight times over.
  spotlightSolo: 299,
  spotlightDuo: 399,
  spotlightGroup: 599,
  spotlightLargeGroup: 799,
  spotlightBand: 899,
  concertCapacity: 2000,
  interestBase: 1246,
  /** Charged on top of every online payment, with GST on the fee itself. */
  convenienceFeePercent: 2,
  gstPercent: 18,
  lineupUnlocked: false,
  soldOut: false,
};

/**
 * The fest's day is deliberately unannounced until the last guest reveal.
 * Every place that would print a date pulls its wording from here, so the
 * real date only has to be typed in one file when it finally drops.
 */
export function formatInr(n: number): string {
  return "₹" + Number(n).toLocaleString("en-IN");
}

export type LineupCard = {
  id: string;
  slot: string;
  kicker: string;
  clue: string;
  hint: string;
  reveal: string;
};

export const lineup: LineupCard[] = [
  {
    id: "voice",
    slot: "THE VOICE",
    kicker: "MAIN STAGE · 4:30 PM",
    clue: "You have cried to a song this person recorded in one take. Reality shows begged; the answer was a polite no.",
    hint: "Playback singer · 4 languages · one very famous cough at the 2023 awards",
    reveal: "FULL REVEAL · DROP 01",
  },
  {
    id: "guest",
    slot: "SPECIAL GUEST",
    kicker: "GRAND OPENING · 10:30 AM",
    clue: "Left Hazaribagh at seventeen with a scholarship and a duffel bag. Comes back this year with a mic.",
    hint: "Alumnus · your phone screen knows this face · 2.4M people follow the chaos",
    reveal: "FULL REVEAL · DROP 02",
  },
  {
    id: "surprise",
    slot: "THE SURPRISE",
    kicker: "ENCORE · 5:45 PM",
    clue: "The seniors keep laughing about this one and refusing to explain. Requires 400kg of equipment.",
    hint: "Not a singer. Not a band. Loud. Bring earplugs you will not use.",
    reveal: "FINAL REVEAL · DROP 03",
  },
];

export const supportActs = [
  { name: "Battle of Bands finalists", when: "12:15 PM", note: "Nine schools, one drum kit, zero mercy" },
  { name: "DJ Nightshift", when: "3:15 PM", note: "Hazaribagh’s own, back from a Ranchi residency" },
  { name: "The Elden Heights Choir", when: "10:50 AM", note: "Forty voices, one very nervous conductor" },
  { name: "Open Mic Hour", when: "11:30 AM", note: "Slots go live on the day. Be brave." },
];

export type MerchItem = { id: string; name: string; price: number; note: string };

export const merchItems: MerchItem[] = [
  { id: "tee", name: "Riot Tee", price: 549, note: "Oversized cotton, logo screenprint" },
  { id: "hoodie", name: "Vault Hoodie", price: 1249, note: "Heavy fleece, clue printed inside the hood" },
  { id: "tote", name: "Fete Tote", price: 349, note: "Canvas, survives 40 stalls" },
  { id: "pins", name: "Pin Set of 4", price: 249, note: "Enamel. Crown, star, mic, momo." },
  { id: "cap", name: "Stage Crew Cap", price: 449, note: "Corduroy, embroidered star" },
  { id: "poster", name: "Reveal Poster", price: 199, note: "A2 riso-style print, numbered" },
];

export type Stall = { zone: string; coins: number; run: string; desc: string };

export const stalls: Stall[] = [
  { zone: "MOMO ALLEY", coins: 3, run: "Class XI-B", desc: "Steamed, fried, and one suspicious chocolate variant." },
  { zone: "RING OF DOOM", coins: 2, run: "Sports Committee", desc: "Ring toss where every prize is slightly too large to carry." },
  { zone: "HAUNTED STAFF ROOM", coins: 5, run: "Drama Club", desc: "Report cards, flickering tube light, a screaming Principal." },
  { zone: "TATTOO PARLOUR", coins: 2, run: "Art Club", desc: "Airbrush and glitter. Washes off before Monday. Mostly." },
  { zone: "PIE THE PREFECT", coins: 4, run: "Student Council", desc: "Exactly what it says. Queue starts early." },
  { zone: "RETRO ARCADE", coins: 3, run: "Robotics Club", desc: "Four cabinets the seniors built out of scrap and spite." },
  { zone: "CHAI LABORATORY", coins: 2, run: "Chem Dept", desc: "Beaker service. Kulhad on request. Yes it is safe." },
  { zone: "LUCKY DIP VAULT", coins: 4, run: "Alumni Cell", desc: "One box holds a signed guitar. The rest hold erasers." },
];

/**
 * The answers quote live prices, so they're built per request from the
 * settings the admin panel edits rather than frozen into the file.
 */
