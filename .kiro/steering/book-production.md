# Storylands Book Production — the repeatable process for every character

Story Zero ("Nibs and the Absolutely Perfect Acorn") was built once, by hand, to prove the
whole pipeline. This file is how we reproduce that result for EVERY other character — Pip,
Oliver, Maple, Rusty, Finn, Lumi, Tilly, and any new cast member — without reinventing it each
time. Follow this process; do not improvise a new one.

This file is the "how we build a book" recipe. It sits on top of the other steering files and
defers to them for the details:
- `product-standard.md` — the quality bar every book must clear (incl. happy, complete endings).
- `visual-consistency.md` — how art stays on-model (reference-first pipeline, no text/signage).
- `reader-layout.md` — the 9:16 reader, text panel, no-scroll rule.

Nothing here overrides those; when in doubt, they win.

## The one-line summary

Every Storylands book = one lovable character + one small want + one flaw that complicates it
+ a friend who asks the right question + a low point the hero solves HIMSELF + a warm, happy,
forward-looking ending — rendered as ~12-16 textless 9:16 pages, each character kept exactly
on-model by seeding generation with approved reference art.

## The character-agnostic story spine (reuse this shape, never copy the plot)

Story Zero's arc is the template. For a new character, invent a NEW plot on the same spine:

1. **Establish the character and their want** in their own voice (Nibs: high standards; he
   wants the perfect acorn kept safe). One page or two.
2. **The flaw makes the want backfire**, escalating comically (Nibs over-protects: bury, dig
   up, decoys, maps, a wrong map on purpose). This is where personality shows.
3. **A friend punctures it with a question, not a lecture** (Tilly: "when did you last
   actually see it?"). The friend never solves it for the hero.
4. **The turn / low point** — the want appears lost or ruined; the hero is stuck.
5. **The hero solves it himself** — reasoning from what the story already showed (fair setup,
   no deus ex machina). The reader could have solved it too.
6. **The quiet change** — the hero chooses differently than the flaw would (Nibs lets the
   acorn grow instead of hoarding it).
7. **Happy, complete, forward-looking ending** (see product-standard "Endings"): resolve the
   want, rest on the hero + friendship, name the growth without preaching, look forward.

Keep the SHAPE, change everything else. Do NOT reuse the acorn plot; each character earns a
distinct premise, setting, and gag.

## The build sequence (do these in order)

### 1. Character reference (art identity) — reference-first, always
- Every character that appears needs an APPROVED, TEXTLESS reference in `public/characters/`
  (e.g. `nibs.png`, `Tilly.png`). The existing cover PNGs are the starting point.
- A brand-new character goes through the full workflow in `visual-consistency.md` (define the
  visual bible + invariants -> generate a clean textless reference sheet -> human approves)
  BEFORE appearing in any page. Establish a new character ALONE and approved before pairing.
- For any two-character book, do a quick "cast check" (the two together, on-model, right
  relative scale) and approve it before generating story pages.

### 2. Write the book data: `books/<book-id>/book.ts`
- `book-id` is a kebab-case slug (e.g. `pip-first-flame`). This is also the reader route.
- Author each page with BOTH the read-aloud `text` and the `manifest` (canonical truth the
  image is derived from): charactersPresent, location, timeOfDay, action, emotionalBeat,
  requiredVisualFacts, forbiddenVisualFacts, composition.
- Write SHORT per the no-scroll rule (reader-layout). A page needing 4+ heavy paragraphs is
  two pages. No text-dependent props in the art (no signs/labels/books) — put those words in
  the text panel and re-stage the beat (visual-consistency).
- `forbiddenAlways` must include "any text/words/letters" AND "any sign, signpost, board,
  placard, or plaque" for every page.

### 3. Mirror the manifests into `books/<book-id>/pages.mjs`
- Node's generator cannot import the app's `.ts`, so the manifests are duplicated in a plain
  `.mjs` that exports `pages` and `CHARACTER_REFS`. **Keep book.ts and pages.mjs in sync by
  hand** — they are the same manifests in two files. This is a known, deliberate duplication.

### 4. Generate the art
- `node scripts/generate-book.mjs` — one illustration per page, seeded with EACH present
  character's approved reference (this is the consistency mechanism). Resumable; per-page
  failures are isolated. Flags: `--force` (regenerate all), `--only 6,7` (specific pages).
- Output: `public/books/<book-id>/pages/page-01.png ...` at 9:16 (1024x1536 gen size).
- KNOWN LIMITATION to fix when we build book #2: `generate-book.mjs` currently hardcodes
  `import { pages, CHARACTER_REFS } from '../books/nibs-perfect-acorn/pages.mjs'` and a
  hardcoded output folder. Parameterize it (e.g. `--book <book-id>`) before generating a
  second book, rather than copy-pasting the script.

### 5. QA every page against its manifest (consistency gate)
- View each generated page. Confirm: correct characters, each on-model vs invariants; required
  visual facts present; forbidden facts absent (no text, no signage); style matches the rest
  of the book; age-appropriate and warm. Regenerate failures with `--only`. See
  visual-consistency "Automated QA".

### 6. Wire it into the app
- **Reader route:** create `app/read/<book-id>/page.tsx` that imports the book and renders
  `<BookReader book={book} />` (copy the Nibs route; it is a 4-line file).
- **Catalog:** in `lib/catalog.ts`, the character's `Story` entry gets `readerSlug: "<book-id>"`
  plus the real title/hook/synopsis/minutes. `readerSlug` is what makes "Begin Story" open the
  real linear reader instead of the sample preview. Remove any "placeholder" wording.

### 7. Verify + ship
- `pnpm exec tsc --noEmit` clean; reader route and every page image serve 200.
- Commit only intended files (never `.env.local`); push to `main`; Vercel auto-deploys from
  the connected repo. Confirm the live reader serves the new book.

## Definition of done for a book

A character's book is done only when it clears the `product-standard.md` bar AND:
- Every page is on-model and textless/signage-free (visual-consistency).
- Every page fits large with no scroll (reader-layout).
- The story follows the spine, the hero solves his own climax, and the ending is happy,
  complete, and forward-looking.
- It is wired (`readerSlug` + reader route), verified, and live.

## The real engine test (do this deliberately)

Reusing Story Zero proves nothing. The first true test of this process is a SECOND, cold book
for an existing character (same locked style + reference, brand-new plot) — ideally generated
without hand-tuning each page. If the character holds on-model across a story we did NOT
carefully massage, the pipeline works. Treat the first few books as consistency tests, not
just content.
