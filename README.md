# MADOOZA — The Voice of Hazaribagh

The official site for MADOOZA, The Elden Heights School's fest: cosplay contest, fete &amp; carnival stalls,
merch pre-orders, and a date-sealed concert reveal.

Built with Next.js (App Router, TypeScript), Razorpay for payments, and Firebase Firestore for storing
passes, cosplay entries, the concert interest list, and merch pre-orders.

## Stack

- **Next.js 15** (App Router) + React + TypeScript
- **Razorpay** — checkout for the Fete Pass and the cosplay entry, at whatever price the admin panel has
  set. Order creation and payment signature verification both happen server-side in API routes; nothing
  sensitive touches the client.
- **Firebase Admin / Firestore** — server-only, written to from API routes after a payment verifies (or,
  for the concert interest list and merch pre-orders, directly — no payment involved there).
- **Firebase Auth** — the account store for the `/admin` control room. Sign-in runs entirely on the
  server: no Firebase SDK, key or token ever reaches the browser.

## Pages

Home, Lineup &amp; Reveal, Tickets, Concert ("Guess Who"), Cosplay Contest, Merch Drop, Fete &amp; Carnival,
Gallery, Sponsors &amp; Press Kit, FAQ + Venue.

## Environment variables

Copy `.env.example` to `.env.local` for local development, and set the same keys in the Vercel project
settings for deployment:

**Exposed to the browser** (one, and it has to be):

- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — Razorpay's checkout runs in the browser, so its key id is public by
  design. It is a publishable key and cannot take a payment on its own.

**Server-only** — these never reach the browser:

- `RAZORPAY_KEY_SECRET` — from your Razorpay dashboard. Creates orders and verifies payment signatures.
- `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` — from a Firebase service
  account JSON (Project settings → Service accounts → Generate new private key). Keep the `\n` sequences
  in `FIREBASE_PRIVATE_KEY` literally as they appear in the JSON file.
- `FIREBASE_API_KEY` — the project's Web API key (Project settings → General). Used only on the server,
  to check an admin's password against Firebase Auth; the Admin SDK can mint tokens but cannot verify a
  password, so this one call goes through the Identity Toolkit REST API.
- `ADMIN_EMAILS` — comma-separated emails allowed into `/admin`.

All of the server-only ones are read at request time, so changing them takes effect on the next request
rather than needing a rebuild. `NEXT_PUBLIC_RAZORPAY_KEY_ID` is compiled into the bundle, so that one
does need a redeploy.

Until these are set, the site still runs: checkout routes return a "not configured" error instead of
opening Razorpay, Firestore writes are silently skipped (the concert interest counter falls back to its
static default), and `/admin` lists exactly which variables it is still waiting on. Nothing crashes — it
just isn't persisting yet.

## Admin panel

`/admin` is the council's control room: prices and switches, and read views of everything the site has
collected. It is not linked from the site and is marked `noindex`.

**Getting in.** Create the account in Firebase console → Authentication → Users (enable the
Email/Password provider first), then put that address in `ADMIN_EMAILS`. An account can also be admitted
with an `admin: true` custom claim instead of the allowlist.

**How the sign-in works.** The browser posts the email and password to `/api/admin/login`. The server
checks them against Firebase Auth, confirms the account is on the admin list, and mints a session cookie
with the Admin SDK (`createSessionCookie`), returned `HttpOnly`, `Secure` and `SameSite=Lax` and good for
12 hours. Every later request re-verifies that cookie server-side with `verifySessionCookie(…, true)`, so
a disabled or signed-out account loses access at once. `/admin` itself is a server component behind the
same check: a visitor who isn't an admin is never sent the panel's markup, let alone its data. There is
no Firebase SDK in the browser bundle and no token in JavaScript for a script to steal.

**What it does.**

- Prices and switches: Fete Pass, cosplay entry, the six merch prices, concert capacity, the interest-list
  starting number, and the sold-out / lineup-unlocked toggles. Saving writes `settings/fest` in Firestore
  and the site picks it up on the next request — no deploy needed.
- Read views of `passes`, `cosplayEntries`, `concertInterest` and `merchOrders`, each with a CSV download,
  plus an overview of counts and money taken.

Prices are always taken from the server. The order routes compute the amount from `settings/fest`, and the
verify routes read the amount back off the Razorpay order, so a tampered request body can't change what
gets charged or recorded.

## Firestore collections

- `passes` — Fete Pass purchases (buyer info, qty, total, Razorpay order/payment ids, pass code).
- `cosplayEntries` — cosplay contest registrations (solo/squad, category, entry fee payment ids).
- `concertInterest` — "Guess Who" interest-list signups, plus `counters/concertInterest` for the running
  count used both as the public "X have already put their name down" figure and each signup's queue
  number.
- `merchOrders` — merch pre-orders (line items, total). Paid on collection, no online payment.
- `settings/fest` — the live prices, capacities and toggles the admin panel edits. Created on the first
  save; until then the site uses the seed values in `src/data/fest.ts`.

## Content

Fest copy, lineup clues, merch items, fete stalls and FAQs live in `src/data/fest.ts` — edit there rather
than in a CMS. The `FEST` object in that file is only the *seed* for the settings document: once
`settings/fest` exists in Firestore, prices and toggles come from the admin panel instead.

### The date

MADOOZA's date is deliberately unannounced until the last guest reveal, so no page names a month. The
wording for that lives in one place, `DATE_REVEAL` in `src/data/fest.ts`, and the sealed `?? · ?? · 26`
tiles and the "DATE SEALED" stamp are the `SealedDateTiles` / `SealedDateStamp` components in
`src/components/SealedDate.tsx`. When the date is finally fixed, that constant and those two components
are what change.

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
