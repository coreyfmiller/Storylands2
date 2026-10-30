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

## The authoring engine

`scripts/create-book.mjs` writes a book from a premise. `node scripts/doctor.mjs`
says whether it can run right now and what to fix if not.

```
node scripts/create-book.mjs --character pip --premise "..."   # writes books/<slug>/book.ts
node scripts/generate-book.mjs --book <slug>                   # slow, paid
node scripts/optimize-books.mjs --prune                        # required, not optional
```

**One source per book.** `books/<slug>/book.ts` holds the prose AND the
illustration manifests, and both the app and the generator import it. There used
to be a second copy in `pages.mjs` for the generator, because Node could not read
TypeScript; `book-production.md` called the duplication deliberate and said to
keep the two in sync by hand. Three of the seven books had drifted across nine
manifest fields, which meant the alt text a screen reader announced described a
different picture than the prompt that drew it. Node 24 strips types, so the
second copy is gone. Imports inside the book files carry an explicit `.ts`
extension — Node's resolver needs it, and `allowImportingTsExtensions` lets
TypeScript accept the same spelling. **Do not reintroduce a generation-side copy
of anything.**

### The validator is the product standard, executable

`scripts/lib/validate-book.mjs` is the single definition of "acceptable", used by
the authoring engine, `generate-book.mjs` (before spending anything) and
`audit-text.mjs`. Errors block; warnings are for a human.

When a book fails, the engine hands the model the numbered list of failures and
asks for a repair rather than a re-roll, so a 52-word page gets fixed and the
plot survives. Three passes, then it refuses to write anything.

Two rules worth knowing before editing it:

- **Text-only props are refused; wordless ones are allowed when declared.** A
  menu or a signpost exists only to be read. A map can be pictograms — Nibs page
  5 is a treasure map drawn in acorns and arrows with not one letter on it, and
  it is the best page in that book. An earlier version of this check called that
  page a violation. Props that *can* be wordless need the manifest to say so.
- **Warnings must never block.** A 46-word page is outside the comfortable band
  and well inside the ceiling. Refusing it would make the engine unusable.

What it cannot judge is whether the story is any good. That stays human, which
is the whole reason the mechanical rules should cost a human no attention.

### Providers

`scripts/lib/provider.mjs` wraps Gemini and OpenAI behind one interface, chosen
by `--provider` or by whichever key is set. Gemini is the default and
`gemini-flash-latest` is the workspace standard: a self-updating alias, so the
model string never needs migrating. Image generation is the one sanctioned
reason to pin something else, because it needs that capability tier.

`mock` is a third real provider, not a leftover test stub. It runs the entire
pipeline — schema, validation, repair loop, emitter, registration — with no
network and no spend, which is the only thing keeping those parts honest when
the accounts are dry. They were dry the day this was written: the OpenAI key had
expired and the Gemini project was out of prepayment credit. Its prose is
placeholder and says so in capitals, because the one unforgivable outcome is
mock text reaching a child.

### Registration is automatic and must stay idempotent

`scripts/lib/register-book.mjs` adds the book to `books/index.ts` and
`lib/catalog.ts`. Three cases, and the first version of it confused two of them
and replaced "Pip and the First Flame" with a test fixture:

- a coming-soon entry for that character exists → fill it in, keeping the
  hand-written hook, synopsis, genres and colours, which are editorial work
- that character already has a published book → add a sibling entry
- the character is new → insert a fresh entry

**Never overwrite an entry that has a `readerSlug`.**

## Readers, and the end of the four fictional children

`components/providers/reader-provider.tsx` is the single source for who is
reading; `lib/readers.ts` holds the pure logic and the one validator both the
form and the provider use. Device-local, like progress: no account, and nothing
about a child leaves the browser.

Four children used to be hardcoded in `lib/catalog.ts` — Avery 6, Maya 10, Leo
13, Alex 16 — and the profile menu admitted it: "switch profiles to see how
Storylands surfaces different stories". Two of them could open nothing at all,
because every book is for ages 4 to 7. The catalog functions take `Band[]` now
rather than a whole `Profile`, so nothing in the app needs a person to exist in
order to filter a shelf.

The avatar is an initial on a colour, not a character cover. Using Pip's face as
a stand-in photo quietly told a child that Pip was them.

## The shelf states what it has

Twelve of nineteen catalog entries had no book: full covers, hooks and synopses,
each one opening "we're still illustrating this one". They are in
`docs/STUDIO_SLATE.md` now, as premises the engine can turn into real books.

`series` counts are **counted, not written down**. The hand-written numbers
claimed Juniper had 3 books, Grey Point 5 and Black River 3; each had one
catalog entry and no book anybody could open. A series with fewer than two
readable books is left out rather than shown as a shelf of one.

`moodFilters` is filtered against the catalog for the same reason. It used to
offer Mystery, Suspense and "Under 30 min" to a four-year-old, all of which
returned nothing — a filter that tells a child their search is broken.
