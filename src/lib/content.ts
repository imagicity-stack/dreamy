import { cache } from "react";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "./firebaseAdmin";
import { deleteMedia } from "./media";
import { lineup, supportActs, merchItems, stalls } from "@/data/fest";

export { applyTokens } from "./festSettings";

/**
 * Editable content collections.
 *
 * Every list the council might want to change — guest artists, gallery shots,
 * merch, stalls, FAQs, the ticker — is described here once: its fields, and the
 * values it starts from. The admin panel renders an editor from that
 * description, and the site reads the same collections, so adding a new
 * editable list is a matter of adding an entry to CONTENT below.
 */

export type FieldType = "text" | "longtext" | "number" | "boolean" | "image";

export type ContentField = {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
};

export type ImageValue = { path: string; url: string } | null;

export type ContentRecord = {
  id: string;
  order: number;
  visible: boolean;
  [key: string]: unknown;
};

export type ContentCollectionDef = {
  key: string;
  title: string;
  itemNoun: string;
  blurb: string;
  /** Which field to show as the row's heading in the panel. */
  labelField: string;
  /** Folder inside the storage bucket for this collection's uploads. */
  imageFolder: string;
  fields: ContentField[];
  seed: Record<string, unknown>[];
};

/** The tiers as the council first wrote them, before anyone edited the page. */
const SPONSOR_TIER_SEED = [
  {
    name: "TITLE PARTNER",
    price: "\u20B910,00,000",
    sub: "TEN LAKH \u00B7 PRESENTED-BY RIGHTS",
    badge: "1 SLOT ONLY",
    featured: true,
    perks: [
      "Fest is billed \u201CMADOOZA, presented by you\u201D everywhere",
      "Your name locked to the concert and the sealed singer",
      "Logo on every banner, pass, tee and the stage backdrop",
      "Main stage mentions before each act, plus a speaking slot",
      "Prime stall at the arch and the front-of-stage pit box",
      "Back cover of the programme and the date-reveal campaign",
    ].join("\n"),
  },
  {
    name: "CO-PRESENTING PARTNER",
    price: "\u20B95,00,000",
    sub: "FIVE LAKH \u00B7 2 SLOTS",
    badge: "",
    featured: false,
    perks: [
      "\u201CIn association with\u201D billing on all print and digital",
      "Logo on passes, tees and the stage backdrop",
      "Stage mentions at the opening and the encore",
      "Double stall space in the main row",
    ].join("\n"),
  },
  {
    name: "STAGE / ARENA PARTNER",
    price: "\u20B92,50,000",
    sub: "2.5 LAKH \u00B7 2 SLOTS",
    badge: "",
    featured: false,
    perks: [
      "The main stage or the cosplay arena carries your name",
      "Logo on the backdrop and every reveal post",
      "Stall space in the main row",
      "You hand over the trophies on stage",
    ].join("\n"),
  },
  {
    name: "ZONE PARTNER",
    price: "\u20B91,00,000",
    sub: "ONE LAKH \u00B7 6 SLOTS",
    badge: "",
    featured: false,
    perks: [
      "One named zone \u2014 food court, arcade, arena queue or fete lane",
      "Logo on the grounds map, gate signage and coin counters",
      "Stall space inside your zone",
      "Branded coin tokens for the zone",
    ].join("\n"),
  },
  {
    name: "ASSOCIATE PARTNER",
    price: "\u20B950,000",
    sub: "FIFTY THOUSAND \u00B7 OPEN",
    badge: "",
    featured: false,
    perks: [
      "Logo on the sponsor wall and in the programme",
      "One contest or competition named after you",
      "Stall space on the fete lane",
      "Ten Concert Passes for your team",
    ].join("\n"),
  },
  {
    name: "IN-KIND & VENDORS",
    price: "TALK TO US",
    sub: "VALUED AGAINST A TIER",
    badge: "",
    featured: false,
    perks: [
      "Sound, lights, printing, water, transport, prizes",
      "Food and retail vendors \u2014 stall fee, no sponsorship",
      "Credit on the sponsor wall and in the programme",
      "Setup closes three weeks before gates",
    ].join("\n"),
  },
];

export const CONTENT: ContentCollectionDef[] = [
  {
    key: "lineup",
    title: "Guest artists",
    itemNoun: "artist",
    blurb: "The locked cards on the Lineup page. Reveal one by filling in the name and ticking Revealed.",
    labelField: "slot",
    imageFolder: "lineup",
    fields: [
      { name: "slot", label: "Slot title", type: "text", hint: "THE VOICE, SPECIAL GUEST…" },
      { name: "kicker", label: "Stage and time", type: "text", hint: "MAIN STAGE · 4:30 PM" },
      { name: "clue", label: "The clue", type: "longtext", hint: "Shown on the locked card." },
      { name: "hint", label: "The hint line", type: "text" },
      { name: "reveal", label: "Reveal badge", type: "text", hint: "FULL REVEAL · DROP 01" },
      { name: "revealed", label: "Revealed", type: "boolean", hint: "Shows the real name and photo instead of the clue." },
      { name: "name", label: "Artist name", type: "text", hint: "Only shown once Revealed is on." },
      { name: "bio", label: "Short bio", type: "longtext", hint: "Only shown once Revealed is on." },
      { name: "image", label: "Photo", type: "image" },
    ],
    seed: lineup.map((l) => ({ ...l, revealed: false, name: "", bio: "", image: null })),
  },
  {
    key: "supportActs",
    title: "Support acts",
    itemNoun: "act",
    blurb: "The day-stage list under the guest cards.",
    labelField: "name",
    imageFolder: "lineup",
    fields: [
      { name: "name", label: "Act", type: "text" },
      { name: "when", label: "Time", type: "text", hint: "12:15 PM" },
      { name: "note", label: "One-liner", type: "text" },
    ],
    seed: supportActs,
  },
  {
    key: "gallery",
    title: "Gallery shots",
    itemNoun: "shot",
    blurb: "The build-up photos. Upload an image and it replaces the placeholder tile.",
    labelField: "caption",
    imageFolder: "gallery",
    fields: [
      { name: "caption", label: "Caption", type: "text" },
      { name: "image", label: "Photo", type: "image" },
      { name: "placeholder", label: "Placeholder text", type: "text", hint: "Shown until a photo is uploaded." },
      { name: "height", label: "Tile height", type: "number", hint: "220 for a normal tile, 340 for a tall one." },
      { name: "wide", label: "Full width", type: "boolean", hint: "Spans two columns." },
    ],
    seed: [
      { caption: "THE FIELD, TWO WEEKS OUT", height: 340, wide: true, placeholder: "Wide shot of the grounds", image: null },
      { caption: "ART CLUB, DAY FOUR", height: 340, wide: false, placeholder: "Banner-painting shot", image: null },
      { caption: "CHOIR REHEARSAL", height: 220, wide: false, placeholder: "Rehearsal photo", image: null },
      { caption: "ARMOUR, MOSTLY CARDBOARD", height: 220, wide: false, placeholder: "Costume work-in-progress", image: null },
      { caption: "MOMO ALLEY UNDER CONSTRUCTION", height: 220, wide: false, placeholder: "Stall build photo", image: null },
      { caption: "THE PEOPLE TO BLAME", height: 220, wide: false, placeholder: "Council group photo", image: null },
      { caption: "RIGGING ARRIVES", height: 220, wide: false, placeholder: "Stage rigging photo", image: null },
    ],
  },
  {
    key: "merch",
    title: "Merch items",
    itemNoun: "item",
    blurb: "The shop. Prices here are what the pre-order totals up.",
    labelField: "name",
    imageFolder: "merch",
    fields: [
      { name: "name", label: "Item", type: "text" },
      { name: "price", label: "Price (₹)", type: "number" },
      { name: "note", label: "Description", type: "text" },
      { name: "image", label: "Photo", type: "image" },
    ],
    seed: merchItems.map((m) => ({ name: m.name, price: m.price, note: m.note, image: null })),
  },
  {
    key: "stalls",
    title: "Fete stalls",
    itemNoun: "stall",
    blurb: "The carnival zones and what they cost in coins.",
    labelField: "zone",
    imageFolder: "fete",
    fields: [
      { name: "zone", label: "Zone", type: "text" },
      { name: "coins", label: "Coins", type: "number" },
      { name: "run", label: "Run by", type: "text" },
      { name: "desc", label: "Description", type: "longtext" },
    ],
    seed: stalls,
  },
  {
    key: "faqs",
    title: "FAQ",
    itemNoun: "question",
    blurb: "Answers can use {fete}, {cosplay} and {seats} to quote the live prices.",
    labelField: "q",
    imageFolder: "faq",
    fields: [
      { name: "q", label: "Question", type: "text" },
      { name: "a", label: "Answer", type: "longtext", hint: "{fete}, {cosplay} and {seats} are replaced with the current values." },
    ],
    seed: [
      { q: "Do I have to study at Elden Heights to come?", a: "No. MADOOZA is open to every school in Hazaribagh, to families, and to anyone in town with a pass. Outside-school visitors under 14 need an adult with them." },
      { q: "What is the difference between the two passes?", a: "The {fete} Fete Pass covers the grounds from 9:00 AM to 4:00 PM — every stall, the cosplay arena, the day stages and all competitions, plus 5 MADOOZA coins and parking. It is on sale now. The Concert Pass adds the 4:30 PM concert and the front-of-stage pit, capped at {seats} — its price goes up with the singer reveal." },
      { q: "Why is the Concert Pass price not announced?", a: "Because the act is not announced. The council is not putting a number on a show it cannot name yet. Put your name on the interest list and you get the name, the date and the price an hour before anyone else, plus 48 hours on the {seats} seats." },
      { q: "How much does the cosplay contest cost?", a: "{cosplay} per entry — the same whether you walk solo or bring a squad of six. That is on top of a Fete or Concert Pass, which you need to be on the grounds at all. Non-refundable, but transferable to another entrant until entries close." },
      { q: "Can I upgrade from a Fete Pass once concert passes open?", a: "Yes, at the gate or online, for the difference in price — but only while concert capacity lasts. If the {seats} go early, the upgrade window closes and no amount of pleading with the council will reopen it." },
      { q: "Can I come in cosplay without competing?", a: "Please do. Props under 1.2 metres, nothing sharp, nothing that fires anything. Security will politely confiscate your very cool replica if it looks real." },
      { q: "How do MADOOZA coins work?", a: "Coins are the only currency inside the grounds. Buy them at the two coin counters near the gate, ₹10 a coin, refunds till 5 PM. No cash changes hands at stalls." },
      { q: "Is there parking?", a: "Yes, on the far field off the service gate, free with any pass. It fills by 11 AM, so carpool or get dropped at the main gate." },
      { q: "When are the guests revealed?", a: "Clues drop weekly on the Lineup page, then three full reveals — the third one takes the lid off the date as well. No calendar yet, on purpose: the council will not name a day it might have to move. Nobody will break early either, we tried." },
      { q: "What if it rains?", a: "The fete and arena move under the assembly canopy and the concert runs in the auditorium. The fest happens regardless." },
      { q: "Can my company set up a stall?", a: "Yes — sponsor and vendor slots are on the Sponsors page. Stall setup closes three weeks before gates; the exact cut-off goes out with the date." },
    ],
  },
  {
    key: "homeStats",
    title: "Home stat cards",
    itemNoun: "stat",
    blurb: "The four tilted numbers under “WHAT IS THIS MADNESS”.",
    labelField: "value",
    imageFolder: "home",
    fields: [
      { name: "value", label: "The number", type: "text", hint: "40+, 9H, ₹1.2L…" },
      { name: "note", label: "What it counts", type: "text" },
    ],
    seed: [
      { value: "40+", note: "stalls, booths and questionable games" },
      { value: "9H", note: "of non-stop programming, one field" },
      { value: "₹1.2L", note: "prize money across every contest" },
      { value: "3", note: "names still locked in the vault" },
    ],
  },
  {
    key: "sponsors",
    title: "Sponsor logos",
    itemNoun: "sponsor",
    blurb: "Real partners, once they sign. Upload a logo and it replaces the dashed placeholder on the home page and the sponsor wall.",
    labelField: "name",
    imageFolder: "sponsors",
    fields: [
      { name: "name", label: "Sponsor", type: "text" },
      { name: "tier", label: "Tier line", type: "text", hint: "TITLE PARTNER, STAGE PARTNER…" },
      { name: "logo", label: "Logo", type: "image", hint: "A transparent PNG sits best on the tiles." },
      { name: "href", label: "Website", type: "text", hint: "Optional. Makes the tile a link." },
      { name: "placeholder", label: "Placeholder text", type: "text", hint: "Shown until a logo is uploaded." },
    ],
    seed: [
      { name: "", tier: "TITLE PARTNER", logo: null, href: "", placeholder: "TITLE SPONSOR LOGO" },
      { name: "", tier: "STAGE PARTNER", logo: null, href: "", placeholder: "STAGE PARTNER LOGO" },
      { name: "", tier: "FOOD PARTNER", logo: null, href: "", placeholder: "FOOD PARTNER LOGO" },
      { name: "", tier: "MEDIA PARTNER", logo: null, href: "", placeholder: "MEDIA PARTNER LOGO" },
    ],
  },
  {
    key: "sponsorTiers",
    title: "Sponsor tiers",
    itemNoun: "tier",
    blurb: "The price list on the Sponsors page. One perk per line.",
    labelField: "name",
    imageFolder: "sponsors",
    fields: [
      { name: "name", label: "Tier", type: "text" },
      { name: "price", label: "Price", type: "text", hint: "₹10,00,000 — or TALK TO US." },
      { name: "sub", label: "Sub-line", type: "text", hint: "TEN LAKH · PRESENTED-BY RIGHTS" },
      { name: "badge", label: "Badge", type: "text", hint: "Optional pill, e.g. 1 SLOT ONLY." },
      { name: "perks", label: "What they get", type: "longtext", hint: "One perk per line." },
      { name: "featured", label: "Headline tier", type: "boolean", hint: "Spans the full width at the top." },
    ],
    seed: SPONSOR_TIER_SEED,
  },
  {
    key: "cosplayCategories",
    title: "Cosplay categories",
    itemNoun: "category",
    blurb: "The category cards and the dropdown on the entry form — they read the same list.",
    labelField: "title",
    imageFolder: "cosplay",
    fields: [
      { name: "title", label: "Category", type: "text", hint: "ANIME & MANGA" },
      { name: "value", label: "Saved as", type: "text", hint: "The short word stored with each entry, e.g. Anime." },
      { name: "body", label: "What counts", type: "longtext" },
      { name: "image", label: "Photo", type: "image", hint: "Optional. Fills the card behind the text." },
    ],
    seed: [
      { title: "ANIME & MANGA", value: "Anime", body: "Anything from the shelves — shounen, shoujo, that one obscure 90s OVA nobody will recognise.", image: null },
      { title: "COMIC & SCREEN", value: "Comic", body: "Capes, villains, sitcom characters, and the entire cast of whatever your family binge-watched.", image: null },
      { title: "ORIGINAL DESIGN", value: "Original", body: "You invented them. Bring a one-line backstory — the judges will absolutely ask.", image: null },
      { title: "GROUP ACT", value: "Group", body: "Three to six people, one theme, 90 seconds on stage. Choreography optional but heavily rewarded.", image: null },
    ],
  },
  {
    key: "cosplayPrizes",
    title: "Cosplay prizes",
    itemNoun: "prize",
    blurb: "The prize pool beside the entry form.",
    labelField: "amount",
    imageFolder: "cosplay",
    fields: [
      { name: "amount", label: "Amount", type: "text", hint: "₹15K, or a word like CROWD." },
      { name: "title", label: "What for", type: "text", hint: "Best in Show" },
      { name: "note", label: "The rest of the line", type: "text" },
    ],
    seed: [
      { amount: "₹15K", title: "Best in Show", note: "plus the trophy and a permanent spot on the arena wall" },
      { amount: "₹8K", title: "Category winner ×4", note: "one per category, ₹8,000 each" },
      { amount: "₹5K", title: "Best Group Act", note: "split however your squad decides" },
      { amount: "CROWD", title: "People's Choice", note: "voted live by the field, wins the full merch box" },
    ],
  },
  {
    key: "chaosCards",
    title: "Home doors",
    itemNoun: "door",
    blurb: "The cards under “PICK YOUR CHAOS”. A card whose page is hidden drops out on its own.",
    labelField: "title",
    imageFolder: "home",
    fields: [
      { name: "title", label: "Card title", type: "text" },
      { name: "pageKey", label: "Opens", type: "text", hint: "lineup, concert, cosplay, fete, merch, gallery, sponsors, faq or tickets." },
      { name: "kicker", label: "Corner label", type: "text", hint: "01 / STAGE" },
      { name: "body", label: "The pitch", type: "longtext", hint: "{fete}, {cosplay}, {seats} and {date} are replaced with the live values." },
    ],
    seed: [
      { title: "THE REVEAL", pageKey: "lineup", kicker: "01 / STAGE", body: "Three locked cards. Cryptic clues. Tap if your nerves can take it." },
      { title: "COSPLAY CONTEST", pageKey: "cosplay", kicker: "02 / ARENA", body: "Four categories, {cosplay} to enter, \u20B940,000 on the line. Foam swords allowed." },
      { title: "FETE & CARNIVAL", pageKey: "fete", kicker: "03 / GROUNDS", body: "Ring toss, momo alley, a haunted staff room. Everything runs on coins." },
      { title: "MERCH DROP", pageKey: "merch", kicker: "04 / SHOP", body: "Tees, totes, enamel pins. Pre-order now, collect at the gate." },
      { title: "GUESS WHO", pageKey: "concert", kicker: "05 / CONCERT", body: "One silhouette, no name, no price. Tell us who you want and we'll tell you when." },
    ],
  },
  {
    key: "coinFacts",
    title: "Coin rules",
    itemNoun: "rule",
    blurb: "The band of coin facts on the fete page.",
    labelField: "title",
    imageFolder: "fete",
    fields: [
      { name: "title", label: "The headline", type: "text", hint: "\u20B910 = 1 COIN" },
      { name: "note", label: "The explanation", type: "longtext" },
    ],
    seed: [
      { title: "\u20B910 = 1 COIN", note: "Two coin counters by the main arch. Cards and UPI accepted there." },
      { title: "5 FREE", note: "Every pass, fete or concert, starts with five coins loaded." },
      { title: "REFUND TILL 5", note: "Unspent coins go back to cash until 5:00 PM. After that they're souvenirs." },
      { title: "NO CASH", note: "If a stall asks for money, it isn't one of ours. Tell a volunteer." },
    ],
  },
  {
    key: "concertPoints",
    title: "Concert promises",
    itemNoun: "promise",
    blurb: "The starred lines under “WHAT WE WILL CONFIRM”. The date line is added after these on its own, because its wording changes with how much of the date is out — edit that one under WORDS.",
    labelField: "text",
    imageFolder: "concert",
    fields: [
      { name: "text", label: "The line", type: "text", hint: "{seats} and {date} are replaced with the live values." },
    ],
    seed: [
      { text: "Main stage, 4:30 PM, running to the 6:00 PM encore" },
      { text: "A national touring act, playing a full live set" },
      { text: "{seats} seats on the field, front-of-stage pit included" },
    ],
  },
  {
    key: "concertInfo",
    title: "Concert notes",
    itemNoun: "note",
    blurb: "The three cards below the interest-list sign-up.",
    labelField: "title",
    imageFolder: "concert",
    fields: [
      { name: "title", label: "Card label", type: "text" },
      { name: "body", label: "The note", type: "longtext" },
    ],
    seed: [
      { title: "WHY THE SECRECY", body: "Contracts. The act is booked, the paperwork is not, and the council would rather say nothing than say it twice." },
      { title: "WHEN IT DROPS", body: "With the final lineup reveal. Name, price, date and the pass sale all in the same hour \u2014 which is also the hour the rest of Hazaribagh finds out what day to keep free." },
      { title: "CHASING CLUES", body: "There are three on the Lineup page. One of them is about this set. Good luck." },
    ],
  },
  {
    key: "venueSchedule",
    title: "Venue times",
    itemNoun: "time",
    blurb: "The times across the venue card on the FAQ page.",
    labelField: "label",
    imageFolder: "faq",
    fields: [
      { name: "label", label: "What it is", type: "text", hint: "GATES" },
      { name: "time", label: "When", type: "text", hint: "9:00 AM" },
    ],
    seed: [
      { label: "GATES", time: "9:00 AM" },
      { label: "ARENA", time: "2:30 PM" },
      { label: "LAST ACT", time: "6:00 PM" },
    ],
  },
  {
    key: "fetePassIncludes",
    title: "Fete Pass includes",
    itemNoun: "line",
    blurb: "What the Fete Pass card lists. Untick Included for a line that reads as a cross.",
    labelField: "text",
    imageFolder: "tickets",
    fields: [
      { name: "text", label: "The line", type: "text", hint: "{fete}, {cosplay}, {seats} and {date} are replaced with the live values." },
      { name: "included", label: "Included", type: "boolean", hint: "Off draws it as a cross in grey." },
    ],
    seed: [
      { text: "Grounds entry 9:00 AM to 4:00 PM", included: true },
      { text: "All 40+ fete and carnival stalls", included: true },
      { text: "Cosplay arena, day stages and every competition", included: true },
      { text: "5 MADOOZA coins + free parking", included: true },
      { text: "Does not include the concert", included: false },
    ],
  },
  {
    key: "concertPassIncludes",
    title: "Concert Pass includes",
    itemNoun: "line",
    blurb: "What the Concert Pass card lists.",
    labelField: "text",
    imageFolder: "tickets",
    fields: [
      { name: "text", label: "The line", type: "text", hint: "{fete}, {cosplay}, {seats} and {date} are replaced with the live values." },
    ],
    seed: [
      { text: "Everything in the Fete Pass, all day" },
      { text: "Entry to the concert \u2014 the sealed singer, 4:30 PM" },
      { text: "Standing access to the front-of-stage pit" },
      { text: "Stays till the 6:00 PM encore, no re-entry queue" },
      { text: "Name and price drop together \u2014 the interest list opens now" },
    ],
  },
  {
    key: "ticker",
    title: "Header ticker",
    itemNoun: "line",
    blurb: "The scrolling strip at the very top of every page.",
    labelField: "text",
    imageFolder: "ticker",
    fields: [{ name: "text", label: "Line", type: "text" }],
    seed: [
      { text: "THE ELDEN HEIGHTS SCHOOL, HAZARIBAGH" },
      { text: "MUSIC · MOMENTS · MEMORIES" },
      { text: "ONE DAY. ZERO CHILL." },
    ],
  },
];

export function collectionDef(key: string): ContentCollectionDef | null {
  return CONTENT.find((c) => c.key === key) ?? null;
}

/** Coerces one submitted record to the collection's field types. */
export function normalizeRecord(def: ContentCollectionDef, raw: unknown): Record<string, unknown> {
  const input = (raw ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {
    order: Number.isFinite(Number(input.order)) ? Math.round(Number(input.order)) : 0,
    visible: typeof input.visible === "boolean" ? input.visible : true,
  };

  for (const field of def.fields) {
    const value = input[field.name];
    switch (field.type) {
      case "number":
        out[field.name] = Number.isFinite(Number(value)) ? Math.round(Number(value)) : 0;
        break;
      case "boolean":
        out[field.name] = value === true;
        break;
      case "image": {
        const img = value as { path?: unknown; url?: unknown } | null;
        out[field.name] =
          img && typeof img.url === "string" && img.url
            ? { path: String(img.path ?? ""), url: img.url }
            : null;
        break;
      }
      default:
        out[field.name] = String(value ?? "").slice(0, 4000);
    }
  }

  return out;
}

function seedRecords(def: ContentCollectionDef): ContentRecord[] {
  return def.seed.map((item, i) => ({
    ...(normalizeRecord(def, { ...item, order: i, visible: true }) as object),
    id: `${def.key}-seed-${i}`,
    order: i,
    visible: true,
  })) as ContentRecord[];
}

/**
 * Everything in a collection, newest edits included. Falls back to the seed
 * values when Firebase isn't configured or nothing has been saved yet, so the
 * site looks the same on day one as it did before any of this existed.
 */
/**
 * Marks a collection as having been taken over by the panel. Emptiness alone
 * cannot say this: an admin who deletes every row means the list to be empty,
 * and inferring "never seeded" from that would put the seed content straight
 * back on the site.
 */
const SEED_MARKER = "content_meta";

async function markSeeded(key: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.collection(SEED_MARKER).doc(key).set({ seededAt: FieldValue.serverTimestamp() }, { merge: true });
}

/** Whether the panel has taken this list over, seed rows or not. */
export async function isSeeded(key: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    const marker = await db.collection(SEED_MARKER).doc(key).get();
    if (marker.exists) return true;
    // Lists taken over before the marker existed have rows but no marker.
    const snap = await db.collection(`content_${key}`).limit(1).get();
    return !snap.empty;
  } catch {
    return false;
  }
}

export const listContent = cache(async (key: string): Promise<ContentRecord[]> => {
  const def = collectionDef(key);
  if (!def) return [];

  const db = getDb();
  if (!db) return seedRecords(def);

  try {
    const snap = await db.collection(`content_${def.key}`).get();
    if (snap.empty) {
      // Deliberately emptied stays empty; never touched falls back to the seed.
      return (await isSeeded(def.key)) ? [] : seedRecords(def);
    }
    return snap.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as object) }) as ContentRecord)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch {
    return seedRecords(def);
  }
});

/** What the public site renders: visible records only. */
export async function publicContent(key: string): Promise<ContentRecord[]> {
  return (await listContent(key)).filter((r) => r.visible !== false);
}

/** True when the collection is still showing seed values rather than saved ones. */
export async function createRecord(key: string, raw: unknown): Promise<ContentRecord | null> {
  const def = collectionDef(key);
  const db = getDb();
  if (!def || !db) return null;

  const existing = await db.collection(`content_${key}`).get();
  const nextOrder = existing.empty
    ? 0
    : Math.max(...existing.docs.map((d) => Number(d.data().order ?? 0))) + 1;

  const data = normalizeRecord(def, { ...(raw as object), order: nextOrder });
  const ref = await db.collection(`content_${key}`).add({ ...data, createdAt: FieldValue.serverTimestamp() });
  // A list built by hand is just as taken over as a seeded one, so emptying it
  // later must not bring the seed back either.
  await markSeeded(key);
  return { id: ref.id, ...data } as ContentRecord;
}

export async function updateRecord(key: string, id: string, raw: unknown): Promise<ContentRecord | null> {
  const def = collectionDef(key);
  const db = getDb();
  if (!def || !db) return null;

  const data = normalizeRecord(def, raw);
  await db.collection(`content_${key}`).doc(id).set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return { id, ...data } as ContentRecord;
}

/** Deletes a record and any image it owned, so the bucket doesn't fill with orphans. */
export async function deleteRecord(key: string, id: string): Promise<boolean> {
  const def = collectionDef(key);
  const db = getDb();
  if (!def || !db) return false;

  const ref = db.collection(`content_${key}`).doc(id);
  const snap = await ref.get();
  if (snap.exists) {
    for (const field of def.fields) {
      if (field.type !== "image") continue;
      const img = snap.data()?.[field.name] as { path?: string } | null;
      if (img?.path) await deleteMedia(img.path);
    }
  }
  await ref.delete();
  return true;
}

/** Writes the seed values in so they can be edited. Refuses if data exists. */
export async function seedCollection(key: string): Promise<number> {
  const def = collectionDef(key);
  const db = getDb();
  if (!def || !db) return 0;

  const existing = await db.collection(`content_${key}`).limit(1).get();
  if (!existing.empty) return 0;

  const batch = db.batch();
  def.seed.forEach((item, i) => {
    const ref = db.collection(`content_${key}`).doc();
    batch.set(ref, {
      ...normalizeRecord(def, { ...item, order: i, visible: true }),
      createdAt: FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
  await markSeeded(key);
  return def.seed.length;
}

/** Replaces {fete}, {cosplay} and {seats} in copy with the live settings. */
