import type { FestSettings } from "./festSettings";
import { describeDate, feeRates } from "./festSettings";
import { formatInr } from "@/data/fest";
import { formatPaise, formatPercent, priceWithFees, rupeesToPaise } from "./pricing";

/**
 * The site's legal pages: privacy, terms, refunds.
 *
 * These are deliberately NOT in the admin panel's copy editor. Everything in
 * copyText.ts is the fest's writing — headings and blurbs a council member can
 * reword between classes. What is below is the school's word to a visitor who
 * has paid money, and to the payment gateway that asks to see it, so it changes
 * by a reviewed commit rather than by a text box. Live values (prices, the
 * contact details, the date) are still read from settings, so nothing here goes
 * stale when the panel changes them.
 */

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  key: LegalKey;
  eyebrow: string;
  title: string;
  intro: string;
  /** Shown under the title; the date this text last changed. */
  updated: string;
  sections: LegalSection[];
  /** The closing "who to talk to" card. */
  contactTitle: string;
  contactBody: string;
};

export type LegalKey = "privacy" | "terms" | "refunds";

/** The three pages, in the order they appear in the footer. */
export const LEGAL_PAGES = [
  { key: "privacy", href: "/privacy", label: "Privacy policy" },
  { key: "terms", href: "/terms", label: "Terms & conditions" },
  { key: "refunds", href: "/refunds", label: "Refund policy" },
] as const;

/** The date the wording below was last changed. Update it when you edit. */
export const LEGAL_UPDATED = "21 September 2026";

/** The school hosting the fest, and the company running it. */
export const HOST_NAME = "The Elden Heights School";
export const HOST_ADDRESS = "Hazaribagh, Jharkhand 825301, India";
export const ORGANIZER_NAME = "FLYKRAFT SYNERGIES PRIVATE LIMITED";
export const ORGANIZER_ROLE = "Event Organizer";

/**
 * Where every refund conversation happens. One sentence, written once, so the
 * three pages that have to say it cannot drift apart.
 */
export const OFFICE_LINE =
  `the fest office at ${HOST_NAME}, ${HOST_ADDRESS}, in person during school office hours on any working day`;

/** The pages, built against the live settings so prices and contacts stay current. */
export function legalDocs(settings: FestSettings): Record<LegalKey, LegalDoc> {
  const fete = formatInr(settings.fetePrice);
  const cosplay = formatInr(settings.cosplayFee);
  // Quoted with the fee on, because the price a policy names should be the one
  // that leaves the buyer's account.
  const rates = feeRates(settings);
  const feteTotal = formatPaise(priceWithFees(rupeesToPaise(settings.fetePrice), rates).totalPaise);
  const cosplayTotal = formatPaise(priceWithFees(rupeesToPaise(settings.cosplayFee), rates).totalPaise);
  const date = describeDate(settings);
  const email = settings.contactEmail;
  const phone = settings.contactPhone;

  const whoWeAre =
    `MADOOZA is hosted by ${HOST_NAME}, ${HOST_ADDRESS}, and is organised and operated by ` +
    `${ORGANIZER_NAME} (${ORGANIZER_ROLE}). In the text below, "we", "us" and "the organisers" mean ` +
    `the school and the Event Organizer together. "You" means anyone who uses this site, buys a pass, ` +
    `enters the cosplay contest, pre-orders merch or comes to the fest.`;

  return {
    privacy: {
      key: "privacy",
      eyebrow: "LEGAL / PRIVACY",
      title: "PRIVACY POLICY",
      intro:
        "What this site asks you for, why it asks, where it goes, and how to have it taken back out. " +
        "Written to be read, not to be survived.",
      updated: LEGAL_UPDATED,
      contactTitle: "QUESTIONS ABOUT YOUR DATA?",
      contactBody:
        `Write to ${email} or call ${phone}. You can also walk into ${OFFICE_LINE}, and ask in person.`,
      sections: [
        {
          id: "who",
          heading: "1. Who this policy is from",
          blocks: [
            { kind: "p", text: whoWeAre },
            {
              kind: "p",
              text:
                `This policy covers this website and the sign-up, pass and pre-order forms on it. ` +
                `It does not cover other websites we link to — Razorpay's checkout, a sponsor's site, ` +
                `a social media page — each of which has a privacy policy of its own.`,
            },
          ],
        },
        {
          id: "collect",
          heading: "2. What we collect",
          blocks: [
            { kind: "p", text: "Only what a form on this site asks you to type, and nothing behind your back:" },
            {
              kind: "list",
              items: [
                `Fete Pass purchases — your name, your school (optional), your phone number, how many passes you bought, the amount paid, the Razorpay order and payment reference, and the pass code we issue you.`,
                `Cosplay contest entries — your name, your school (optional), your phone number, whether you are walking solo or as a squad, your category, and the entry fee payment reference.`,
                `The concert interest list — your name, one contact detail you choose to give, who you are hoping the act is, how many seats you would want, and the queue number we give you.`,
                `Merch orders — your name and phone number, the items and quantities you bought, the amount paid, the Razorpay payment reference, and the collection code we issue you.`,
                `Anything you send us — the contents of an email, a message or a phone call, if you start one.`,
              ],
            },
          ],
        },
        {
          id: "dont-collect",
          heading: "3. What we never collect",
          blocks: [
            {
              kind: "p",
              text:
                `Card numbers, UPI IDs, bank details, CVVs and passwords never reach our servers. Payments ` +
                `are entered on Razorpay's own checkout and stay with Razorpay; all we are told is that a ` +
                `payment succeeded, for how much, and under which reference.`,
            },
            {
              kind: "p",
              text:
                `This site has no visitor accounts and builds no analytics profile of you. The only cookie ` +
                `we set ourselves is the sign-in cookie for the council's own admin panel and gate scanner, ` +
                `and only for a council member or volunteer who signs into one.`,
            },
          ],
        },
        {
          id: "advertising",
          heading: "4. Advertising measurement",
          blocks: [
            {
              kind: "p",
              text:
                `The public pages carry the Meta Pixel, so that when the fest pays to advertise on Instagram ` +
                `or Facebook it can tell whether the advertising worked. It records that a page was viewed, ` +
                `that a checkout was opened, and that a purchase was completed along with its amount — and ` +
                `it sets cookies of Meta's own to do so.`,
            },
            {
              kind: "p",
              text:
                `Your name, your email address, your phone number and your pass codes are never sent to Meta. ` +
                `Nor is it on the pages where those things appear: your own pass page, the gate scanner and ` +
                `the admin panel carry no pixel at all.`,
            },
            {
              kind: "p",
              text:
                `What Meta does with what it collects is governed by Meta's own privacy policy, not ours. ` +
                `Blocking it is entirely your right and costs you nothing on this site — a browser set to ` +
                `refuse third-party cookies or trackers, or any of the usual blocking extensions, will stop ` +
                `it, and every page, pass and payment goes on working exactly as before.`,
            },
          ],
        },
        {
          id: "why",
          heading: "5. Why we use it",
          blocks: [
            {
              kind: "list",
              items: [
                "To issue your pass code and check it at the gate on the day.",
                "To run the cosplay contest — your category, your slot, and calling your name out.",
                "To hold a seat for you when concert passes open, and to tell you first when they do.",
                "To have the merch you paid for waiting at the tent when you come to collect it.",
                "To reach you if something changes: a time, a date, a stage, a cancellation.",
                "To count how many passes, entries and pre-orders there are, so the fest can be planned and accounted for.",
              ],
            },
            {
              kind: "p",
              text:
                `We do not use your details to advertise to you, and we do not use them for anything you ` +
                `did not hand them over for.`,
            },
          ],
        },
        {
          id: "who-sees",
          heading: "6. Who can see it",
          blocks: [
            {
              kind: "list",
              items: [
                `A small number of student council members and the supervising staff of ${HOST_NAME}, through a password-protected panel that is not linked from this site.`,
                `${ORGANIZER_NAME}, as the ${ORGANIZER_ROLE.toLowerCase()}, for running the event and its accounts.`,
                `Razorpay Software Private Limited, which processes payments and holds the payment details we never see.`,
                `Google Firebase (Firestore), where the records are stored, and Vercel, where the site runs.`,
                `A government authority, police or court, where the law requires us to hand something over.`,
              ],
            },
            {
              kind: "p",
              text:
                `That is the whole list. Your details are never sold, rented or traded, and they are not ` +
                `passed to sponsors, vendors or anyone else who asks nicely.`,
            },
          ],
        },
        {
          id: "students",
          heading: "7. Students and anyone under 18",
          blocks: [
            {
              kind: "p",
              text:
                `This is a school fest, so many of the people filling in these forms are children. If you ` +
                `are under 18, fill in a form only with your parent's or guardian's knowledge, and give a ` +
                `contact number they can be reached on.`,
            },
            {
              kind: "p",
              text:
                `A parent or guardian can ask to see, correct or delete anything we hold about their child ` +
                `by writing to ${email} or by asking at ${OFFICE_LINE}. We will act on it without arguing ` +
                `about it.`,
            },
          ],
        },
        {
          id: "keep",
          heading: "8. How long we keep it",
          blocks: [
            {
              kind: "list",
              items: [
                `Pass, cosplay and merch records — through this edition of the fest and the school's accounting of it, and no more than 12 months after the fest, after which they are deleted or stripped of names.`,
                `The concert interest list — until the concert is over, or until you ask to be taken off it, whichever is sooner.`,
                `Payment references — for as long as tax and audit law requires us to be able to show what was paid.`,
              ],
            },
          ],
        },
        {
          id: "rights",
          heading: "9. What you can ask us to do",
          blocks: [
            {
              kind: "p",
              text:
                `You can ask for a copy of what we hold about you, ask us to correct it, ask us to delete ` +
                `it, or ask to be taken off the interest list. Write to ${email} from the contact you ` +
                `signed up with, or come to ${OFFICE_LINE}. We will answer within 30 days.`,
            },
            {
              kind: "p",
              text:
                `Deleting a pass record before the fest means the pass can no longer be checked at the gate, ` +
                `so we will say so before we do it and let you decide.`,
            },
          ],
        },
        {
          id: "security",
          heading: "10. How it is kept",
          blocks: [
            {
              kind: "p",
              text:
                `The site is served over HTTPS. Every key that can read or write the records is held on the ` +
                `server and never sent to a browser. The admin panel is behind a school-issued account, an ` +
                `allow-list of addresses, and a session that is re-checked on every request. No method is ` +
                `perfect, but nothing about this site asks you to trust a browser with anything private.`,
            },
          ],
        },
        {
          id: "changes",
          heading: "11. Changes to this policy",
          blocks: [
            {
              kind: "p",
              text:
                `If this policy changes, the new version goes up on this page with a new date at the top. ` +
                `If a change affects what we do with details you have already given us, we will say so on ` +
                `the site rather than quietly swapping the text.`,
            },
          ],
        },
      ],
    },

    terms: {
      key: "terms",
      eyebrow: "LEGAL / TERMS",
      title: "TERMS & CONDITIONS",
      intro:
        "The rules of the site, the pass, the arena and the grounds. Buying a pass or entering the " +
        "contest means you have read these and agreed to them.",
      updated: LEGAL_UPDATED,
      contactTitle: "SOMETHING HERE UNCLEAR?",
      contactBody:
        `Ask before you buy, not after. Write to ${email}, call ${phone}, or come to ${OFFICE_LINE}.`,
      sections: [
        {
          id: "who",
          heading: "1. Who you are dealing with",
          blocks: [
            { kind: "p", text: whoWeAre },
            {
              kind: "p",
              text:
                `By using this site, buying a pass, registering for the cosplay contest, joining the ` +
                `interest list, pre-ordering merch or entering the grounds, you accept these terms. If you ` +
                `are under 18, you accept them with your parent's or guardian's agreement.`,
            },
          ],
        },
        {
          id: "event",
          heading: "2. The fest, its date and its lineup",
          blocks: [
            {
              kind: "p",
              text:
                `MADOOZA is a one-day fest at ${HOST_NAME}, ${HOST_ADDRESS}. At the time of writing the ` +
                `fest is scheduled for ${date.sentence}, and the site says exactly as much of the date as ` +
                `has been announced.`,
            },
            {
              kind: "p",
              text:
                `The lineup, the running order, the stage times and the list of stalls are announced as ` +
                `plans, not promises. Acts drop out, weather happens, schools move exam dates. We may ` +
                `change any of them, and a change of act, time or stall is not by itself a reason for a ` +
                `refund. What a cancellation or a postponement of the whole fest means for your money is ` +
                `set out in the refund policy.`,
            },
          ],
        },
        {
          id: "passes",
          heading: "3. Passes and entry",
          blocks: [
            {
              kind: "list",
              items: [
                `The Fete Pass is ${fete} and covers the daytime fest — the grounds, the stalls, the stages and the cosplay arena as a spectator. Food, drink and anything bought at a stall are paid for separately in MADOOZA coins.`,
                `Your pass code is issued the moment payment clears. Bring it — a screenshot is fine — or give your name at the gate, where the volunteers have the list.`,
                `One pass admits one person. A pass may be passed on to someone else before the fest, but not shared or reused once it has been used at the gate.`,
                `Visitors under 14 who are not students of the school need an accompanying adult with a pass of their own.`,
                `The concert is a ticketed show of its own, with its own price and its own capacity of ${settings.concertCapacity.toLocaleString("en-IN")} seats. A Fete Pass does not include it. Fete Pass holders may upgrade at the gate for the difference, while seats last.`,
                `We may refuse entry, or ask anyone to leave, for unsafe or abusive behaviour, for a prohibited item, or for a pass that is not theirs. No refund is due in those cases.`,
              ],
            },
          ],
        },
        {
          id: "cosplay",
          heading: "4. The cosplay contest",
          blocks: [
            {
              kind: "list",
              items: [
                `Entry is ${cosplay} per entry, solo or squad, and is on top of a pass — the fee is not entry to the grounds.`,
                `The fee is not refundable, but an entry may be transferred to another entrant until entries close. Transfers are arranged at the fest office, not online.`,
                `Costumes must be your own work or credited as bought or commissioned, and must be safe: no live blades, no sharpened edges, no open flame, no pyrotechnics, nothing that fires a projectile, and nothing that blocks a corridor or an exit.`,
                `Categories, judging criteria and prizes are as published on the cosplay page. The judges' decision is final, and prizes cannot be exchanged for cash.`,
                `Anything on stage — the walk, the act, the music cue — must be suitable for a school audience. We may stop a performance that is not.`,
              ],
            },
          ],
        },
        {
          id: "coins",
          heading: "5. MADOOZA coins",
          blocks: [
            {
              kind: "p",
              text:
                `Inside the grounds, stalls take coins, not cash. Coins are bought at the coin counters near ` +
                `the gate at ₹10 a coin. Unspent coins are exchanged back to cash at those counters until ` +
                `5:00 PM on the day of the fest; after that they stop being money and become souvenirs. ` +
                `Coins are valid only at this edition of the fest.`,
            },
          ],
        },
        {
          id: "merch",
          heading: "6. Merch pre-orders",
          blocks: [
            {
              kind: "p",
              text:
                `Merch is paid for online at the time of ordering, and collected at the merch tent on the ` +
                `day with the collection code your receipt carries. Sizes and stock are limited and printed ` +
                `in one run; if what you paid for cannot be supplied, you choose another size or item of ` +
                `the same value, or the office refunds it in full.`,
            },
            {
              kind: "p",
              text:
                `Anything left uncollected by the end of the fest is held at the fest office for 30 days. ` +
                `After that it goes back on sale and the money is not refundable, so come and collect it.`,
            },
          ],
        },
        {
          id: "payments",
          heading: "7. Payments",
          blocks: [
            {
              kind: "p",
              text:
                `Online payments are processed by Razorpay. All prices are in Indian Rupees. The amount ` +
                `you are charged is worked out on our server from the prices published here, so it cannot ` +
                `be altered in your browser.`,
            },
            {
              kind: "p",
              text:
                `Every online payment carries GST of ${formatPercent(settings.gstPercent)}% on the price, and a ` +
                `convenience fee of ${formatPercent(settings.convenienceFeePercent)}% of the price` +
                (settings.gstOnConvenienceFee ? `, which carries GST of its own at the same rate` : ``) +
                `. Each is itemised on screen before you pay and on the receipt afterwards — a ${fete} Fete ` +
                `Pass is charged at ${feteTotal}, and a ${cosplay} cosplay entry at ${cosplayTotal}. There is ` +
                `nothing else added at the end.`,
            },
            {
              kind: "p",
              text:
                `If money leaves your account and you do not get a pass code, do not pay again — take the ` +
                `payment reference to the office and read the refund policy, which explains exactly what ` +
                `happens next.`,
            },
          ],
        },
        {
          id: "conduct",
          heading: "8. On the grounds",
          blocks: [
            {
              kind: "list",
              items: [
                `Bags may be checked at the gate. Alcohol, tobacco, drugs, weapons, fireworks, glass bottles, drones and laser pointers are not allowed on the grounds.`,
                `This is a school. Behave like it: no fighting, no harassment, no damage to property, no climbing on structures or barricades, and nothing that puts anyone else at risk.`,
                `Follow the instructions of volunteers, marshals, security and staff, especially around stages, crowds and exits.`,
                `Look after your own belongings. Lost property is handed in at the fest office; we cannot promise to find anything.`,
              ],
            },
          ],
        },
        {
          id: "media",
          heading: "9. Photography and filming",
          blocks: [
            {
              kind: "p",
              text:
                `The fest is photographed and filmed. By coming in, you agree that footage and photographs ` +
                `that include you may be used by the school and the Event Organizer for the fest's gallery, ` +
                `its social media, its press kit and next year's publicity, without payment. If you or your ` +
                `child would rather not appear, tell us at the fest office and we will keep you out of what ` +
                `we publish.`,
            },
            {
              kind: "p",
              text:
                `Filming by attendees for their own use is fine. Filming for commercial use, or press ` +
                `coverage of any kind, needs the organisers' written permission first.`,
            },
          ],
        },
        {
          id: "liability",
          heading: "10. Liability",
          blocks: [
            {
              kind: "p",
              text:
                `You attend at your own risk and are responsible for your own safety and your own ` +
                `belongings. To the extent the law allows, the organisers are not liable for loss, damage, ` +
                `injury or expense arising from your attendance, except where it is caused by our own ` +
                `negligence. Nothing in these terms limits any liability that cannot be limited by law.`,
            },
            {
              kind: "p",
              text:
                `We are not liable for a failure to run the fest, or part of it, caused by something ` +
                `outside our control — weather, a public emergency, an order of an authority, a power or ` +
                `network failure, or an act that no one could reasonably have prevented.`,
            },
          ],
        },
        {
          id: "ip",
          heading: "11. The name and the artwork",
          blocks: [
            {
              kind: "p",
              text:
                `The MADOOZA name, logo, artwork, photographs and the text of this site belong to ` +
                `${HOST_NAME} and ${ORGANIZER_NAME}. Use them for your own posts about the fest as much as ` +
                `you like; do not sell merchandise with them on it, and do not put them on anything that ` +
                `suggests the fest is yours.`,
            },
          ],
        },
        {
          id: "changes",
          heading: "12. Changes to these terms",
          blocks: [
            {
              kind: "p",
              text:
                `These terms may be updated, and the version on this page with the date at its top is the ` +
                `one that applies. A change does not alter the terms your pass was bought under.`,
            },
          ],
        },
        {
          id: "law",
          heading: "13. Governing law",
          blocks: [
            {
              kind: "p",
              text:
                `These terms are governed by the laws of India. Any dispute goes to the courts at ` +
                `Hazaribagh, Jharkhand.`,
            },
          ],
        },
      ],
    },

    refunds: {
      key: "refunds",
      eyebrow: "LEGAL / REFUNDS",
      title: "REFUND POLICY",
      intro:
        "Every refund is handled by the school, in person, at the office. No form, no chatbot, no " +
        "inbox queue — you talk to someone who can actually settle it.",
      updated: LEGAL_UPDATED,
      contactTitle: "COME TO THE OFFICE",
      contactBody:
        `For any refund, contact the school directly at ${OFFICE_LINE}. If you want to check something ` +
        `before you travel, call ${phone} or write to ${email} — but the refund itself is settled at the office.`,
      sections: [
        {
          id: "short",
          heading: "1. The short version",
          blocks: [
            {
              kind: "p",
              text:
                `For any refund, the school is to be contacted directly at the office. Come to ` +
                `${OFFICE_LINE}. Bring your pass code or payment reference and something that shows the ` +
                `booking is yours. A staff member checks it against the record, and what is due is returned.`,
            },
            {
              kind: "p",
              text:
                `Refunds are not arranged over social media, and not through the payment gateway's support ` +
                `chat. Those routes cannot see our records and will only cost you time.`,
            },
          ],
        },
        {
          id: "who",
          heading: "2. Who settles it",
          blocks: [
            { kind: "p", text: whoWeAre },
            {
              kind: "p",
              text:
                `Refunds are approved by the fest office at the school and paid out by the Event Organizer ` +
                `through Razorpay, back to the account the payment came from.`,
            },
          ],
        },
        {
          id: "passes",
          heading: "3. Fete Passes",
          blocks: [
            {
              kind: "list",
              items: [
                `A Fete Pass is ${fete} and is non-refundable once the pass code has been issued, because a pass is a held place at a one-day event.`,
                `Up to 7 days before the fest, the office may still cancel a pass and refund it in full if there is a genuine reason — illness, a clash with an exam, a family emergency. Ask at the office; it is a judgement made by a person, not a rule you have to argue with.`,
                `Within 7 days of the fest, a pass cannot be refunded, but it can be transferred to someone else. The office records the new name against the pass code.`,
                `An unused pass, or not turning up, is not refundable.`,
                `A pass cancelled for misconduct or for a pass used by someone it was not issued to is not refundable.`,
              ],
            },
          ],
        },
        {
          id: "cosplay",
          heading: "4. Cosplay entry fees",
          blocks: [
            {
              kind: "p",
              text:
                `The ${cosplay} entry fee is non-refundable — it pays for the slot, the judging and the ` +
                `prize pool, which are booked whether or not you walk. It is transferable to another ` +
                `entrant until entries close, and the office makes that change for you.`,
            },
            {
              kind: "p",
              text:
                `If a category is dropped, or the contest does not run at all, the fee is refunded in full.`,
            },
          ],
        },
        {
          id: "coins",
          heading: "5. MADOOZA coins",
          blocks: [
            {
              kind: "p",
              text:
                `Unspent coins are exchanged back to cash at the coin counters near the gate until 5:00 PM ` +
                `on the day of the fest. That is a counter transaction on the day, not an office one — ` +
                `after 5:00 PM coins are no longer refundable. Coins already spent at a stall are settled ` +
                `with that stall before you leave it.`,
            },
          ],
        },
        {
          id: "merch",
          heading: "6. Merch pre-orders",
          blocks: [
            {
              kind: "list",
              items: [
                `Merch is paid for online, so a refund is an office matter like any other: bring the collection code and the payment reference.`,
                `Before the fest, a merch order can be cancelled and refunded in full at any time up to 7 days before the day, while the print run can still absorb it.`,
                `Faulty or wrong on the day — take it back to the merch tent there and then; it is exchanged, or refunded at the office if nothing suits.`,
                `Sizes are swapped at the counter for free while stock lasts. If your size cannot be supplied at all, you take another item of the same value or the office refunds it in full.`,
                `Uncollected merch is held at the office for 30 days and is not refundable after that — it goes back on sale.`,
              ],
            },
          ],
        },
        {
          id: "cancelled",
          heading: "7. If the fest is cancelled or moved",
          blocks: [
            {
              kind: "list",
              items: [
                `Cancelled outright — every pass and every cosplay entry fee is refunded in full. You do not have to ask; the office begins processing refunds within 7 working days of the announcement, and you will be told where to come if anything is needed from you.`,
                `Moved to another date — your pass and your entry stay valid for the new date, no action needed. If the new date does not suit you, ask at the office within 14 days of the announcement and it is refunded in full.`,
                `Cut short on the day, once it has begun — passes are not refunded, because the fest ran. If a whole ticketed show is cancelled before it starts, that show's ticket is refunded.`,
              ],
            },
          ],
        },
        {
          id: "failed",
          heading: "8. Money left your account but no pass arrived",
          blocks: [
            {
              kind: "list",
              items: [
                `A payment that failed at the gateway is reversed by your bank on its own, usually within 5 to 7 working days. Nothing reaches us and nothing needs to be claimed.`,
                `A payment that was taken but produced no pass code, or a payment made twice, is settled at the office. Bring the payment reference from your bank or UPI app, and the extra amount is returned in full.`,
                `Do not pay a second time to "fix" a payment that seems stuck. Check the office first.`,
              ],
            },
          ],
        },
        {
          id: "how",
          heading: "9. How an approved refund is paid",
          blocks: [
            {
              kind: "p",
              text:
                `Refunds go back through Razorpay to the card, account or UPI ID the payment came from — we ` +
                `cannot pay an online payment out in cash, and we cannot send it to a different account. ` +
                `Once the office approves it, expect it in 7 to 10 working days, depending on your bank. ` +
                `The office gives you a reference when the refund is raised; keep it.`,
            },
            {
              kind: "p",
              text:
                `A refund is of the whole amount you were charged — the GST and the ` +
                `${formatPercent(settings.convenienceFeePercent)}% convenience fee included. We do not keep the fee on a refunded ` +
                `order and we deduct nothing for handling it.`,
            },
          ],
        },
        {
          id: "no",
          heading: "10. What cannot be refunded",
          blocks: [
            {
              kind: "list",
              items: [
                "Coins spent at a stall, and unspent coins presented after 5:00 PM on the day.",
                "A pass for a fest that ran, whether or not you came.",
                "Entry refused or revoked for misconduct, a prohibited item, or a pass that was not yours.",
                "A cosplay entry fee once entries have closed, other than the transfer route above.",
                "Anything bought from a student stall in cash or coins after you have left that stall.",
              ],
            },
            {
              kind: "p",
              text:
                `A lost pass code is not a refund matter — the office re-issues it against your name and ID, ` +
                `free.`,
            },
          ],
        },
      ],
    },
  };
}
