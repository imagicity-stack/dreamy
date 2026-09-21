# MADOOZA — The Voice of Hazaribagh

The official site for MADOOZA, The Elden Heights School's fest: cosplay contest, fete &amp; carnival stalls,
merch pre-orders, and a date-sealed concert reveal.

Built with Next.js (App Router, TypeScript), Razorpay for payments, and Firebase Firestore for storing
passes, cosplay entries, the concert interest list, and merch pre-orders.

## Stack

- **Next.js 15** (App Router) + React + TypeScript
- **Razorpay** — checkout for everything the fest sells: the Fete Pass, the cosplay entry and the merch
  drop. Prices, the convenience fee and the GST on it are computed server-side; a webhook confirms every
  payment independently of the browser. See **Payments** below.
- **Firebase Admin / Firestore** — server-only, written to from API routes after a payment is confirmed
  against Razorpay (or, for the concert interest list, directly — no payment involved there).
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
- `RAZORPAY_WEBHOOK_SECRET` — the secret you type into Razorpay → Settings → Webhooks for this site's
  webhook. Until it is set, Razorpay's confirmations are refused and the panel says so on the overview.
- `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` — from a Firebase service
  account JSON (Project settings → Service accounts → Generate new private key). Keep the `\n` sequences
  in `FIREBASE_PRIVATE_KEY` literally as they appear in the JSON file.
- `FIREBASE_API_KEY` — the project's Web API key (Project settings → General). Used only on the server,
  to check an admin's password against Firebase Auth; the Admin SDK can mint tokens but cannot verify a
  password, so this one call goes through the Identity Toolkit REST API.
- `ADMIN_EMAILS` — comma-separated emails allowed into `/admin`.
- `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM` / `MAIL_TO` — the Google Workspace mailbox that sends the
  fest's mail, and the inbox that gets a copy of everything. `SMTP_HOST` and `SMTP_PORT` default to
  `smtp.gmail.com` and `465`. See **Mail** below.

All of the server-only ones are read at request time, so changing them takes effect on the next request
rather than needing a rebuild. `NEXT_PUBLIC_RAZORPAY_KEY_ID` is compiled into the bundle, so that one
does need a redeploy.

Until these are set, the site still runs: checkout routes return a "not configured" error instead of
opening Razorpay, Firestore writes are silently skipped (the concert interest counter falls back to its
static default), and `/admin` lists exactly which variables it is still waiting on. Nothing crashes — it
just isn't persisting yet.

## Payments

Everything the fest sells goes through one flow. Adding a paid thing is an entry in `PRODUCTS`
(`src/lib/products.ts`), not another pair of API routes.

**What it costs.** `src/lib/pricing.ts` is the only place money is worked out, and it works in paise as
integers — `499 × 1.18` in floating point is not a rupee figure, and Razorpay takes paise anyway. Four
lines, in this order:

| | |
|---|---|
| the ticket price | ₹499.00 |
| GST on it (18%) | ₹89.82 |
| convenience fee (2% of the ticket) | ₹9.98 |
| GST on the fee (18%) | ₹1.80 |
| **charged** | **₹600.60** |

Both rates are editable in the panel under Settings → GST & convenience fee, and a switch there exempts
the convenience fee from GST if the council ever needs it to be. Every line is rounded to a whole paisa
from the ticket price rather than compounding, so the breakdown on screen always adds up to the amount
charged.

**Where it is worked out.** On the server, always. The checkout panels call `POST /api/checkout/quote`
and print what comes back; they never multiply a price by a quantity themselves. The amount sent to
Razorpay is computed again in `createOrder()` from the same settings, so a tampered request body cannot
move it.

**The flow.**

1. `POST /api/checkout/quote` — prices a basket. Creates nothing, safe to call on every keystroke.
2. `POST /api/checkout/order` — re-prices it, checks the product is open and within capacity, creates the
   Razorpay order, and writes `orders/<razorpay order id>` as `created` **with the buyer's details
   already on it**. That last part is what lets the webhook finish an order whose browser closed.
3. The browser opens Razorpay's checkout with that order id.
4. `POST /api/checkout/verify` — the browser reporting back. The signature proves the response came from
   Razorpay; the payment is then re-fetched from Razorpay and checked for status, order and amount before
   anything is issued.
5. `POST /api/razorpay/webhook` — Razorpay's own account of the same payment, which arrives whether or not
   the browser survived.

Steps 4 and 5 both call `fulfilOrder()`, which is idempotent: in one Firestore transaction it allocates
the pass numbers, writes the pass/entry/merch record and moves the counters, and whichever of the two
arrives second reads the finished order back out and returns the same codes.

**Setting up the webhook** (once, by hand, in the Razorpay dashboard → Settings → Webhooks):

- **URL** `https://<the site>/api/razorpay/webhook`
- **Secret** the same string as `RAZORPAY_WEBHOOK_SECRET` in the environment
- **Events** `payment.captured`, `payment.failed`, `order.paid`, `refund.created`, `refund.processed`

Only a bad signature is answered with a 400 — any other refusal would have Razorpay redeliver an event
that has already been understood. Two exceptions are deliberate: a delivery that arrives while Firestore
is unreachable gets a 503, because an event we cannot even check for duplication must be sent again
rather than silently dropped; and a handler that throws releases its claim on the event id on the way
out, so the redelivery is treated as new. Keep **auto-capture on** in the Razorpay account: an
authorised-but-uncaptured payment is money held rather than taken, and the webhook deliberately issues
nothing for it.

**Counting.** `counters/<product>` holds units sold, orders, the last issued sequence number and the
money split four ways (base, fee, GST, total). The same transaction that issues a pass moves the counter,
so the number the panel shows and the number capacity is enforced against are the same number. Pass codes
are drawn from that sequence — `MDZ-F-0001`, `MDZ-C-0001`, `MDZ-M-0001` — so a code is also a count, and a
Fete Pass order gets one code per pass rather than one per payment. Capacity is checked when the order is
created and again inside the fulfilment transaction; an order that somehow wins a race after the last
pass is gone is marked `oversold` and left for the office to refund rather than quietly issued.

**When something goes wrong.** Every checkout is a row in the panel's Sign-ups → Payments ledger, paid or
not, with the order id, the payment id, the money split and which of the two routes confirmed it. That is
the tab to open when somebody says they were charged and got nothing.

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

**What it does.** Four tabs:

- **Overview** — counts and money taken.
- **Settings** — Fete Pass and cosplay prices, the convenience fee and the GST on it, how many passes and
  cosplay entries may be sold at all, concert capacity, the interest-list starting number; how
  much of the date to give away (sealed / month only / full) and the day, month and year behind it; the
  countdown and what it counts down to; which pages are live; the sold-out and lineup-unlocked switches;
  the announcement banner; the browser title, search description and the public email and phone. Saving
  writes `settings/fest` in Firestore and the site picks it up on the next request — no deploy needed.
- **Content** — every editable list: guest artists (with photos and a per-artist reveal), support acts,
  gallery shots, merch, fete stalls, FAQ answers, the header ticker, the home stat cards, sponsor logos,
  sponsor tiers, cosplay carnival tiers, and the cosplay categories and prizes. Rows can be added, reordered, hidden or deleted,
  and image fields upload straight to the Firebase storage bucket.
- **Sign-ups** — read views of `passes`, `cosplayEntries`, `concertInterest`, `merchOrders` and the
  `orders` payments ledger, each with a CSV download.

Each list starts from the seed values in `src/data/fest.ts` and `src/lib/content.ts`; the first save
writes a `content_<key>` collection and the site reads that from then on. Adding a new editable list
means adding an entry to `CONTENT` in `src/lib/content.ts` — the editor and the API routes are generic.

Prices are always taken from the server. The order route computes the amount from `settings/fest`, and
fulfilment re-fetches the payment from Razorpay and checks its amount against the stored order, so a
tampered request body can't change what gets charged or recorded.

## Mail

Everything that happens sends mail, from one Workspace mailbox to the fest inbox — and to the buyer as
well, whenever there is an address to send to.

| What happened | The office gets | The buyer gets |
|---|---|---|
| Pass, cosplay entry or merch paid | The sale, the buyer, the codes, the money split | A receipt with their code(s) and what they paid |
| Interest-list signup | Name, contact, who they're hoping for, queue number | Their queue number, if they signed up with an email |
| Payment failed | A note, with the reason Razorpay gave | — |
| Refund processed | The amount and whose it was | Confirmation, and where to ask about it |
| Paid but sold out | **REFUND NEEDED**, in red, with the payment reference | — (they were told on screen) |

The addresses live in the environment (`MAIL_FROM`, `MAIL_TO`), never in the source, so changing the
inbox is a Vercel setting rather than a deploy.

**Setting it up.** In Google Workspace, turn on 2-Step Verification for the sending mailbox, then create
an App Password for it (Google Account → Security → App passwords) and put that in `SMTP_PASS` —
Workspace will not accept the account's own password over SMTP. Port 465 is implicit TLS; 587 also works
and negotiates STARTTLS. Then open `/admin` → Settings → **Is the mailbox working?** and send yourself a
test, which goes through the real transport rather than pretending.

**How it behaves.** Mail is sent from inside `after()`, so it goes out once the response has already
reached the browser — a slow mail server never leaves somebody who has paid watching a spinner. Nothing
it does can fail a payment: every error is caught and logged, and the record in Firestore is written
first, always. Only the call that actually issued the codes sends the receipt, so the browser and the
webhook both reporting the same payment still produces exactly one email. Templates live in
`src/lib/mailTemplates.ts` and are built from the same `breakdownLines()` the checkout panel prints, so a
receipt cannot disagree with the screen the buyer saw.

## Firestore collections

- `passes` — Fete Pass purchases (buyer info, qty, total, Razorpay order/payment ids, pass code).
- `cosplayEntries` — cosplay contest registrations (solo/squad, category, entry fee payment ids).
- `concertInterest` — "Guess Who" interest-list signups. `counters/concertInterest` holds `signups`: the
  number of real people who used the form, and nothing else. The figure the concert page quotes is that
  plus **Interest list start** from the panel, added at read time (`src/lib/interest.ts`), so the start is
  a live setting rather than something baked into the tally on the first signup. Move it and the public
  number moves with it; the record of who actually signed up is untouched. A counter left in the old
  shape repairs itself on the first read by counting the entries.
- `merchOrders` — paid merch orders (line items, total, collection code, buyer).
- `orders` — one document per checkout, keyed by the Razorpay order id: the priced lines, the buyer, the
  status (`created`, `paid`, `failed`, `oversold`, `refunded`), the payment and the codes issued.
- `counters/<product>` — units sold, orders, last issued code number and the money split, moved by the
  same transaction that issues a pass.
- `webhookEvents/<event id>` — one document per Razorpay delivery, so a retry cannot double-count.
- `settings/fest` — the live prices, capacities, date and toggles the admin panel edits. Created on the
  first save; until then the site uses the seed values in `src/data/fest.ts`.
- `content_<key>` — one per editable list (`content_lineup`, `content_sponsors`, `content_faqs`, …).
  Created when that list is first saved; until then the site uses the seeds in `src/lib/content.ts`.

## Content

Everything the council might want to change is edited in the admin panel, not in the source. What lives
in `src/data/fest.ts` and in the `seed` arrays of `src/lib/content.ts` is only the starting point: once a
list has been saved once, the site reads `content_<key>` from Firestore instead.

- `src/lib/festSettings.ts` — the shape of the settings, their defaults, and `describeDate()`. It touches
  no Firestore, so client components can import it; `src/lib/settings.ts` adds the reads and writes and
  re-exports the rest.
- `src/lib/content.ts` — the editable lists: their fields, and the values they start from.
- `src/lib/media.ts` — uploads to the Firebase storage bucket. Files are saved with a download token, so
  they serve over HTTPS without making the bucket public.

### The date

MADOOZA's date is deliberately unannounced until the last guest reveal, so no page names a month. One
setting decides how much to give away — sealed, month only, or the full date — and `describeDate()` in
`src/lib/festSettings.ts` turns it into every form the site needs: the `?? · ?? · 26` tiles, the ticker
line, the hero headline, the body-copy sentence. Revealing the month is a change in the panel, not a
deploy, and nothing has to be hunted down page by page.

## Speed

Every public page is rendered per request, so that a price or a headline changed in the panel is live for
the next visitor without a deploy. Read literally that meant six or seven Firestore round trips per page
view — the settings, the page's words, the footer's words, the header ticker and two or three content
lists — and on a bad day, with the function and the database in different parts of the world, that is a
couple of seconds of a visitor looking at a page that hasn't changed yet.

Two things fix it, and they work together:

- **Reads go through Next's data cache, tagged** (`src/lib/cache.ts`). Between edits a page render costs
  no Firestore round trips at all. Every write in the panel drops the tags it touched — and the dropping
  happens inside `saveSettings()`, `saveCopy()`, `createRecord()`, `updateRecord()` and `deleteRecord()`
  rather than in the routes that call them, so a new editing endpoint cannot forget to do it. Editing in
  the panel is still live immediately. The `revalidate` windows are a safety net, not the mechanism.
- **`src/app/(site)/loading.tsx`** fills the page area the moment a link is clicked, so a navigation that
  still has to wait on the server shows movement rather than the old page. Measured with a 1.5s delay in
  front of the navigation: something appears in 130ms instead of nothing for two seconds.

**If it is still slow, look at where things are.** The function and Firestore should be in the same part
of the world. Firestore's location is fixed when the database is created and cannot be moved afterwards;
Vercel's function region is a setting (Project → Settings → Functions). A database in `asia-south1` with
functions in Washington pays roughly a quarter of a second per round trip, and the first render after any
edit makes several. Put `vercel.json`'s region — or the dashboard setting — next door to the database.

## Legal pages

`/privacy`, `/terms` and `/refunds` — the privacy policy, the terms and conditions, and the refund
policy. They are linked from the bottom bar of every page and from both checkouts (the pass checkout and
the cosplay entry form), because a site that takes money has to keep them one tap from the pay button.

Unlike the rest of the site's writing, these are **not** editable in the admin panel. They live in
`src/lib/legal.ts` and change by a reviewed commit: the copy editor is for the fest's voice, and this is
the school's word to someone who has paid. Live values still come from settings — the pass price, the
cosplay fee, the concert capacity, the contact email and phone, and the fest date are read in as the page
renders, so a price change in the panel never leaves a stale figure in a policy. `src/components/LegalDoc.tsx`
renders all three from the same shell, and `LEGAL_UPDATED` in `legal.ts` is the "last updated" date —
change it when you change the wording.

They are also not in `PAGES`, so the panel's show/hide switches cannot take them off the site. The only
thing the panel can reword is the three link labels in the footer (Words → Footer).

The fest is hosted by The Elden Heights School and organised and operated by FLYKRAFT SYNERGIES PRIVATE
LIMITED (Event Organizer); both are named on every legal page and in the footer, and the constants for
them are at the top of `legal.ts`. Every refund is settled in person at the school's fest office — the
site has no refund form, and the refund policy says so. The convenience fee and its GST are quoted in the
terms from the live settings, so a rate change in the panel updates the policies too.

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
