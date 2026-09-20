import { FEST } from "@/data/fest";

/**
 * The shape of everything the admin panel can change that isn't a list of
 * records (those live in content.ts), and how the fest's date is worded.
 *
 * Kept apart from settings.ts deliberately: nothing here touches Firestore or
 * firebase-admin, so a client component can import describeDate() without the
 * Admin SDK following it into the browser bundle.
 */

export type DateMode = "sealed" | "month" | "full";

export type FestSettings = {
  fetePrice: number;
  cosplayFee: number;
  concertCapacity: number;
  interestBase: number;
  lineupUnlocked: boolean;
  soldOut: boolean;
  /** How much of the fest date to give away. */
  dateMode: DateMode;
  festDay: number;
  festMonth: number;
  festYear: number;
  countdownEnabled: boolean;
  /** ISO datetime the countdown runs to. */
  countdownTarget: string;
  countdownLabel: string;
  /** Page keys currently taken off the site. */
  hiddenPages: string[];
  /** Strip across the top of every page. Empty means no banner. */
  announcement: string;
  /** Browser tab title and the description search engines show. */
  siteTitle: string;
  siteDescription: string;
  /** Written on the sponsors page, the FAQ, the gallery and the footer. */
  contactEmail: string;
  contactPhone: string;
};

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Every page that can be hidden from the panel, and its nav entry. */
export const PAGES = [
  { key: "lineup", href: "/lineup", label: "LINEUP" },
  { key: "concert", href: "/concert", label: "CONCERT" },
  { key: "cosplay", href: "/cosplay", label: "COSPLAY" },
  { key: "fete", href: "/fete", label: "FETE" },
  { key: "merch", href: "/merch", label: "MERCH" },
  { key: "gallery", href: "/gallery", label: "GALLERY" },
  { key: "sponsors", href: "/sponsors", label: "SPONSORS" },
  { key: "faq", href: "/faq", label: "FAQ + VENUE" },
  { key: "tickets", href: "/tickets", label: "TICKETS" },
] as const;

export type PageKey = (typeof PAGES)[number]["key"];

export const DEFAULT_SETTINGS: FestSettings = {
  fetePrice: FEST.fetePrice,
  cosplayFee: FEST.cosplayFee,
  concertCapacity: FEST.concertCapacity,
  interestBase: FEST.interestBase,
  lineupUnlocked: FEST.lineupUnlocked,
  soldOut: FEST.soldOut,
  dateMode: "sealed",
  festDay: 0,
  festMonth: 0,
  festYear: 2026,
  countdownEnabled: false,
  countdownTarget: "",
  countdownLabel: "UNTIL THE GATES OPEN",
  hiddenPages: [],
  announcement: "",
  siteTitle: "MADOOZA — The Voice of Hazaribagh",
  siteDescription:
    "MADOOZA — The Elden Heights School's fest. Cosplay, fete, carnival stalls and a sealed concert reveal, in Hazaribagh.",
  contactEmail: "contact@madooza.in",
  contactPhone: "+91 91222 80578",
};

function asNumber(value: unknown, fallback: number, max = 1_000_000): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const rounded = Math.round(n);
  if (rounded < 0 || rounded > max) return fallback;
  return rounded;
}

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asText(value: unknown, fallback: string, max = 300): string {
  return typeof value === "string" ? value.slice(0, max) : fallback;
}

/** Coerces whatever is in Firestore into a complete, sane settings object. */
export function normalizeSettings(raw: unknown): FestSettings {
  const data = (raw ?? {}) as Record<string, unknown>;
  const mode = data.dateMode;

  return {
    fetePrice: asNumber(data.fetePrice, DEFAULT_SETTINGS.fetePrice),
    cosplayFee: asNumber(data.cosplayFee, DEFAULT_SETTINGS.cosplayFee),
    concertCapacity: asNumber(data.concertCapacity, DEFAULT_SETTINGS.concertCapacity),
    interestBase: asNumber(data.interestBase, DEFAULT_SETTINGS.interestBase),
    lineupUnlocked: asBool(data.lineupUnlocked, DEFAULT_SETTINGS.lineupUnlocked),
    soldOut: asBool(data.soldOut, DEFAULT_SETTINGS.soldOut),
    dateMode: mode === "month" || mode === "full" ? mode : "sealed",
    festDay: asNumber(data.festDay, DEFAULT_SETTINGS.festDay, 31),
    festMonth: asNumber(data.festMonth, DEFAULT_SETTINGS.festMonth, 12),
    festYear: asNumber(data.festYear, DEFAULT_SETTINGS.festYear, 2999),
    countdownEnabled: asBool(data.countdownEnabled, DEFAULT_SETTINGS.countdownEnabled),
    countdownTarget: asText(data.countdownTarget, DEFAULT_SETTINGS.countdownTarget, 40),
    countdownLabel: asText(data.countdownLabel, DEFAULT_SETTINGS.countdownLabel, 60),
    hiddenPages: Array.isArray(data.hiddenPages)
      ? (data.hiddenPages as unknown[])
          .map(String)
          .filter((k) => PAGES.some((p) => p.key === k))
      : [],
    announcement: asText(data.announcement, DEFAULT_SETTINGS.announcement),
    siteTitle: asText(data.siteTitle, DEFAULT_SETTINGS.siteTitle, 120),
    siteDescription: asText(data.siteDescription, DEFAULT_SETTINGS.siteDescription, 400),
    contactEmail: asText(data.contactEmail, DEFAULT_SETTINGS.contactEmail, 120),
    contactPhone: asText(data.contactPhone, DEFAULT_SETTINGS.contactPhone, 60),
  };
}


export function isPageHidden(settings: FestSettings, key: PageKey): boolean {
  return settings.hiddenPages.includes(key);
}

export function visiblePages(settings: FestSettings) {
  return PAGES.filter((p) => !settings.hiddenPages.includes(p.key));
}

export type DateDisplay = {
  mode: DateMode;
  /** The three tiles in the sealed-date treatment. */
  dayTile: string;
  monthTile: string;
  yearTile: string;
  /** Big word in the home hero. */
  headline: string;
  /** Two short lines under the headline. */
  subline: string;
  /** One-line form for badges and pass cards. */
  short: string;
  /** The line that leads the header ticker. */
  ticker: string;
  /** Sentence used in body copy. */
  sentence: string;
  /** True while the day is still held back. */
  sealed: boolean;
};

/**
 * The fest's date, said in whichever way the council has authorised. One place
 * decides it, so revealing the month — or the whole date — is a single setting
 * rather than an edit to every page.
 */
export function describeDate(settings: FestSettings): DateDisplay {
  const year = String(settings.festYear);
  const shortYear = year.slice(-2);
  const monthName = settings.festMonth >= 1 ? MONTHS[settings.festMonth - 1] : "";
  const monthTile = settings.festMonth >= 1 ? String(settings.festMonth).padStart(2, "0") : "??";
  const dayTile = settings.festDay >= 1 ? String(settings.festDay).padStart(2, "0") : "??";

  if (settings.dateMode === "full" && settings.festDay >= 1 && settings.festMonth >= 1) {
    const date = new Date(Date.UTC(settings.festYear, settings.festMonth - 1, settings.festDay));
    const weekday = date.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" }).toUpperCase();
    const full = `${settings.festDay} ${monthName.toUpperCase()} ${year}`;
    return {
      mode: "full",
      dayTile,
      monthTile,
      yearTile: shortYear,
      headline: full,
      subline: weekday,
      short: full,
      ticker: `${full} · ${weekday} · GATES 9:00 AM`,
      sentence: `${weekday.toLowerCase()} ${settings.festDay} ${monthName} ${year}`,
      sealed: false,
    };
  }

  if (settings.dateMode === "month" && settings.festMonth >= 1) {
    return {
      mode: "month",
      dayTile: "??",
      monthTile,
      yearTile: shortYear,
      headline: monthName.toUpperCase(),
      subline: `${year} · DAY STILL SEALED`,
      short: `${monthName.toUpperCase()} ${year}`,
      ticker: `${monthName.toUpperCase()} ${year} · THE DAY DROPS WITH THE FINAL REVEAL`,
      sentence: `${monthName} ${year}`,
      sealed: true,
    };
  }

  return {
    mode: "sealed",
    dayTile: "??",
    monthTile: "??",
    yearTile: shortYear,
    headline: year,
    subline: "ON A DAY WE REFUSE TO NAME",
    short: "DATE TO BE ANNOUNCED",
    ticker: `${year} · DATE SEALED, DROPS WITH THE FINAL REVEAL`,
    sentence: `sometime in ${year}`,
    sealed: true,
  };
}
