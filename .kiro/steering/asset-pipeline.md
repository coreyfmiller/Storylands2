# Storylands: images, and where a fact about a book lives

## Nothing in public/ is a raw render

The image model returns ~2.3 MB PNGs. Thirteen of those is a 30 MB book, and
`images.unoptimized` is on, so every one of those bytes reached the phone. The
whole of `public/` was 246 MB. After conversion it is about 14 MB.

Two scripts, both idempotent, both safe to re-run:

- `pnpm books` → `scripts/optimize-books.mjs --prune`. Converts
  `public/books/<slug>/pages/page-NN.png` to `.webp` at 1280px / quality 72,
  then deletes the PNG **only once every page of that book has a WebP beside
  it**. Those renders cost money; a half-converted book with the sources gone is
  unrecoverable.
- `pnpm art` → `scripts/optimize-art.mjs`. Same treatment for `public/art` and
  `public/characters`, plus a 640px thumbnail in `thumb/` alongside.

**Generating art is not finished until the converter has run.** The reader loads
`.webp`; a fresh PNG is not served at all. `generate-book.mjs` prints the next
command, and its resume check treats *either* extension as "already done" so it
can't re-bill a finished book.

### The two image directories mean different things

- `assets/characters/*.png` — the 2.2 MB masters, used **only** to seed the image
  model for character consistency. Not served. `CHARACTER_REFS` paths resolve
  against `assets/`.
- `public/characters/*.webp` — what the app displays, plus `thumb/` for cards and
  the nav avatar. `thumbOf()` in `lib/catalog.ts` is the only thing that knows
  the thumbnail path, and it covers **both** `/art/` and `/characters/`. It was
  missing the second one, so a 32-pixel avatar downloaded the full-size cover.

Anything written into `public/` ships on every deploy. Experiment output belongs
in `assets/` — that's why `consistency-test.mjs` writes there now.

### Priority is a budget, not a label

Only the cover and the open page carry `priority`. Marking all fourteen pages
priority made them compete for the same connections, so the page being looked at
arrived *later*. The next page is warmed with a plain `new Image()` instead.

## One list of books

`books/index.ts` is the registry and `app/read/[slug]/page.tsx` is the only
reader route. Adding a book is adding a line to the registry. There used to be
seven four-line route files, and a 404 was how you found out you'd forgotten one.

`books/types.ts` holds `Book`, `BookPage`, `IllustrationManifest`, and the path
helpers `pageArt()` / `bookCover()`. Those three types were declared
independently in all seven book files, and `book-reader.tsx` imported `Book` from
*Nibs* — deleting one book would have stopped the reader compiling. Each book
file re-exports them so old import paths still resolve; don't add an eighth copy.

**Never hand-write a page art path.** `pageArt(slug, page)` owns the directory,
the zero padding, and the extension, so changing the format is one edit.

## Reading progress is recorded, never invented

`lib/progress.ts` is the single source for how far each book has been read, in
`localStorage`, on the device, never sent anywhere.

"Continue Your Story" was previously a hand-written table in `lib/catalog.ts`:
Avery was 45% through Pip with "Chapter 2" remaining — on a first run, on a
brand-new device, for a book with no chapters — and tapping the card started from
page one anyway. Same rule as everywhere else: **don't fabricate a fact about
what somebody has done.** An empty Continue row is the correct state for a new
install, and `ContinueRow` renders nothing then.

- The stored page only moves forward. Flicking back to look at an earlier picture
  is a normal thing to do in a picture book and must not lose the place.
- The label is `Page 4 of 13`, because that is what the reader actually knows. No
  estimated minutes, no chapter numbers.
- The cover offers "Keep Reading · page 5" only when there is somewhere to
  return to, with "Start from the beginning" beside it. An unread book keeps a
  single obvious button.
- `useProgress()` starts empty and loads after mount. Reading `localStorage`
  during render makes the server's HTML and the first client paint disagree.
- The "Because You Read" shelf is titled from the real most-recent book, and
  **dropped entirely** when nothing has been read rather than naming a book this
  reader has never opened.

## The illustration is half the story

Page images get real `alt` text. `describePage()` prefers a hand-written
`page.alt` and otherwise builds a sentence from the manifest the art was
generated from, so it can't drift from the picture. `alt=""` on a picture book
page hands a child using a screen reader half a book.

Read-aloud uses the browser's own `speechSynthesis`: no audio files, no API, and
a four-year-old who can't read yet can open any of these books alone. The button
is hidden entirely where the API is missing — never ship a control that does
nothing.
