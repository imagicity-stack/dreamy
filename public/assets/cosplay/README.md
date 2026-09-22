# Cosplay category photos

Drop a photo in here and the matching card on `/cosplay` picks it up on the
next request. Nothing else to change — no code, no admin panel, no upload.

| Category   | File to add                        |
| ---------- | ---------------------------------- |
| ANIME      | `public/assets/cosplay/anime.jpg`      |
| MARVEL     | `public/assets/cosplay/marvel.jpg`     |
| DISNEY     | `public/assets/cosplay/disney.jpg`     |
| MYTHOLOGY  | `public/assets/cosplay/mythology.jpg`  |

`.jpg`, `.jpeg`, `.png` and `.webp` all work — the page checks for them in that
order, so `marvel.png` is just as good as `marvel.jpg`.

**Shape.** The card crops to 4:3, centred. Anything roughly landscape is fine;
a portrait photo will lose its top and bottom. Around 1200×900 is plenty — the
card is never wider than about 280px on screen, and a 4MB photo is 4MB every
visitor downloads.

**Until a file is there**, the card draws its own placeholder: the category's
initial on a tinted panel. It looks deliberate, so an empty one is not
embarrassing — but it is also not a photo of a costume, which is what sells
this page.

**Naming.** The filename comes from the category's *Saved as* value in the
content panel, lowercased with spaces turned into hyphens. Rename a category
there and the file it looks for changes with it. Running the site locally
(`npm run dev`) prints the exact path each empty card is waiting for.

**It appears on the next deploy.** The file is read off disk when the page is
rendered, and a running server only learns about new files in `public/` when it
restarts — so committing and pushing is what puts the photo live, not copying
it onto a server. Locally, `npm run dev` picks it up straight away.

**A photo uploaded through the admin panel wins over the file here**, so these
can be the baseline and a last-minute change can still be made without a
deploy.

**Rights.** Use photos the fest has the right to use — last year's entrants
with their say-so, a club shoot, or a licensed stock image. A screenshot off
the internet is somebody else's copyright, and the site is a commercial one
selling passes.
