// Fest content and settings. These mirror the tweakable "props" from the
// design prototype (MADOOZA.dc.html) — edit here instead of a CMS panel.

export const FEST = {
  fetePrice: 499,
  cosplayFee: 400,
  concertCapacity: 2000,
  interestBase: 1246,
  lineupUnlocked: false,
  soldOut: false,
};

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
    reveal: "FULL REVEAL 01 NOV",
  },
  {
    id: "guest",
    slot: "SPECIAL GUEST",
    kicker: "GRAND OPENING · 10:30 AM",
    clue: "Left Hazaribagh at seventeen with a scholarship and a duffel bag. Comes back this November with a mic.",
    hint: "Alumnus · your phone screen knows this face · 2.4M people follow the chaos",
    reveal: "FULL REVEAL 07 NOV",
  },
  {
    id: "surprise",
    slot: "THE SURPRISE",
    kicker: "ENCORE · 5:45 PM",
    clue: "The seniors keep laughing about this one and refusing to explain. Requires 400kg of equipment.",
    hint: "Not a singer. Not a band. Loud. Bring earplugs you will not use.",
    reveal: "FULL REVEAL 14 NOV",
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

export const faqs = [
  { q: "Do I have to study at Elden Heights to come?", a: "No. MADOOZA is open to every school in Hazaribagh, to families, and to anyone in town with a pass. Outside-school visitors under 14 need an adult with them." },
  { q: "What is the difference between the two passes?", a: "The ₹499 Fete Pass covers the grounds from 9:00 AM to 4:00 PM — every stall, the cosplay arena, the day stages and all competitions, plus 5 MADOOZA coins and parking. It is on sale now. The Concert Pass adds the 4:30 PM concert and the front-of-stage pit, capped at 2,000 — its price goes up with the singer reveal." },
  { q: "Why is the Concert Pass price not announced?", a: "Because the act is not announced. The council is not putting a number on a show it cannot name yet. Put your name on the interest list and you get the name, the date and the price an hour before anyone else, plus 48 hours on the 2,000 seats." },
  { q: "How much does the cosplay contest cost?", a: "₹400 per entry — the same whether you walk solo or bring a squad of six. That is on top of a Fete or Concert Pass, which you need to be on the grounds at all. Non-refundable, but transferable to another entrant until 14 November." },
  { q: "Can I upgrade from a Fete Pass once concert passes open?", a: "Yes, at the gate or online, for the difference in price — but only while concert capacity lasts. If the 2,000 go early, the upgrade window closes and no amount of pleading with the council will reopen it." },
  { q: "Can I come in cosplay without competing?", a: "Please do. Props under 1.2 metres, nothing sharp, nothing that fires anything. Security will politely confiscate your very cool replica if it looks real." },
  { q: "How do MADOOZA coins work?", a: "Coins are the only currency inside the grounds. Buy them at the two coin counters near the gate, ₹10 a coin, refunds till 5 PM. No cash changes hands at stalls." },
  { q: "Is there parking?", a: "Yes, on the far field off the service gate, free with any pass. It fills by 11 AM, so carpool or get dropped at the main gate." },
  { q: "When are the guests revealed?", a: "Clues drop weekly on the Lineup page. Full reveals on 1, 7 and 14 November. Nobody in the council will break early, we tried." },
  { q: "When exactly is MADOOZA?", a: "November 2026 — a Saturday. The council is holding the date until the last guest reveal, then it goes up everywhere at once. Gates 9:00 AM, last encore 6:00 PM, whatever day it lands on." },
  { q: "What if it rains?", a: "The fete and arena move under the assembly canopy and the concert runs in the auditorium. The fest happens regardless." },
  { q: "Can my company set up a stall?", a: "Yes — sponsor and vendor slots are on the Sponsors page. Deadline for stall setup is 10 November." },
];
