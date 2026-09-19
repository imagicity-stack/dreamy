# MADOOZA — The Voice of Hazaribagh

The official site for MADOOZA, The Elden Heights School's fest: cosplay contest, fete &amp; carnival stalls,
merch pre-orders, and a date-sealed concert reveal.

Built with Next.js (App Router, TypeScript), Razorpay for payments, and Firebase Firestore for storing
passes, cosplay entries, the concert interest list, and merch pre-orders.

## Stack

- **Next.js 15** (App Router) + React + TypeScript
- **Razorpay** — checkout for the Fete Pass (₹499) and cosplay entry (₹400). Order creation and payment
  signature verification both happen server-side in API routes; nothing sensitive touches the client.
- **Firebase Admin / Firestore** — server-only, written to from API routes after a payment verifies (or,
  for the concert interest list and merch pre-orders, directly — no payment involved there).

## Pages

Home, Lineup &amp; Reveal, Tickets, Concert ("Guess Who"), Cosplay Contest, Merch Drop, Fete &amp; Carnival,
Gallery, Sponsors &amp; Press Kit, FAQ + Venue.

## Environment variables

Copy `.env.example` to `.env.local` for local development, and set the same keys in the Vercel project
settings for deployment:

- `NEXT_PUBLIC_RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from your Razorpay dashboard.
- `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` — from a Firebase service
  account JSON (Project settings → Service accounts → Generate new private key). Keep the `\n` sequences
  in `FIREBASE_PRIVATE_KEY` literally as they appear in the JSON file.

Until these are set, the site still runs: checkout routes return a "not configured" error instead of
opening Razorpay, and Firestore writes are silently skipped (the concert interest counter falls back to
its static default). Nothing crashes — it just isn't persisting yet.

## Firestore collections

- `passes` — Fete Pass purchases (buyer info, qty, total, Razorpay order/payment ids, pass code).
- `cosplayEntries` — cosplay contest registrations (solo/squad, category, entry fee payment ids).
- `concertInterest` — "Guess Who" interest-list signups, plus `counters/concertInterest` for the running
  count used both as the public "X have already put their name down" figure and each signup's queue
  number.
- `merchOrders` — merch pre-orders (line items, total). Paid on collection, no online payment.

## Content

Fest copy, prices, lineup clues, merch items, fete stalls and FAQs live in `src/data/fest.ts` — edit
there rather than in a CMS. `FEST.lineupUnlocked` and `FEST.soldOut` are the two "reveal" toggles for
fest day.

## Development

```bash
npm install
npm run dev
```

## Notes on the source design

This implements the `MADOOZA.dc.html` design bundle (Claude Design prototype) pixel-for-pixel in real
Next.js components — same colors, type, layout and CSS animations, translated from the prototype's
inline-style/template-binding format into React. The prototype's own scroll-triggered stagger-reveal
animation was intentionally not ported (it was a fragile, previously-reworked-many-times entrance effect
that doesn't change the final look of the page); everything else — the spinning badge, pulsing halo,
drifting speckle textures, hover/press sticker-shadow lifts — is intact as plain CSS.
