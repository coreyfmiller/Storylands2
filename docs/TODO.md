# To do

## Decide what happens to the shelf engine

**Deferred on purpose.** Raised as improvement #7, parked because the question
wasn't clear enough to answer yet. Here is what it actually means, so the
decision can be made later without re-deriving it.

### The situation

`lib/catalog.ts` contains a recommendation engine modelled on a streaming
service. Ten shelf definitions (`shelfDefs`), each with a filter, a minimum
number of items and an optional sort — "Trending in Storylands", "Mysteries
Worth Solving", "Stories for a Rainy Night", "15 Minutes or Less" and so on.
`shelvesForBands()` runs them, and `StoryRow` plus `SeriesRow` render the
result as horizontal scrolling rows.

**None of it renders.** It is gated behind this:

```ts
export const RICH_SHELVES_THRESHOLD = 20
```

Below twenty titles in a reader's band, every row surfaces nearly the same
handful of books under a different heading, which is worse than one honest
grid — so `StorylandsApp` falls back to `LibraryGrid`. There are seven books.
The threshold has never been met, and until recently the largest band had
eight titles, twelve of which were covers with no book behind them.

So roughly 150 lines of machinery, plus the `Shelf` and `ShelfDef` types,
`StoryRow`, `SeriesRow` and the "Popular With Readers Your Age" splice, are
unreachable code that nonetheless has to keep compiling.

### The three options

**Delete it.** `LibraryGrid` becomes the design, full stop. Seven to twenty
proud covers in a grid is arguably the better interface for a picture-book
library anyway — a four-year-old is choosing by picture, not browsing genre
rows. Removes the most code and the `Shelf` abstraction with it. Reversible
from git if the catalog ever gets big.

**Keep it and lower the threshold.** Rows appear at, say, ten books. Risks
exactly what the comment warns about: "Funny", "Worlds of Magic" and "Big
Adventures" all showing Oliver, because with seven books most tags overlap.

**Keep it, untouched.** It costs nothing at runtime and turns on by itself
once the engine has produced twenty books, which is now a plausible near-term
number rather than a fantasy.

### Recommendation

Delete `StoryRow`, `SeriesRow` and the shelf engine, and commit to the grid.
The deciding argument is the audience: rows exist to help an adult browse a
large catalog, and this one is read by children who pick the picture they like.
If Storylands ever has a hundred books and an older band, a shelf engine
written for that catalog will be better than one written speculatively for
this one.

Not done yet because it is a design call, not a bug, and deleting working code
on a guess is how good interfaces get lost.

---

## Smaller things, in rough order of worth

- **No new characters can be created.** `create-book.mjs` refuses a character
  with no approved reference art, which is correct, and there is no script to
  produce that reference. A new character means doing
  `.kiro/steering/visual-consistency.md` by hand. `compileCastCheck()` in
  `scripts/lib/compile-prompt.mjs` is written and unused; a
  `scripts/new-character.mjs` would close the loop.

- **Nobody has read what the engine writes.** The pipeline has never produced a
  real book, because both API accounts are out of credit (see the credentials
  section of `node scripts/doctor.mjs`). Everything mechanical is verified
  against the `mock` provider, and the prose quality of a generated story is
  completely unproven. Budget a book and read it before trusting the output.

- **Band machinery for one band.** Every book is `young`, and `Band` still has
  `middle | older | teen` with nothing in them. Fine while the studio slate is
  live, misleading if it stays this way.

- **`thumbOf` is load-bearing and silent.** It rewrites `/art/` and
  `/characters/` into their `thumb/` directories, and a path it does not
  recognise passes through at full size — which is how the nav avatar ended up
  downloading a 2.2 MB cover. A third image directory would do it again.

- **Page transitions are a cross-fade.** Real picture books turn. Worth trying a
  slide, driven off the swipe direction, with `prefers-reduced-motion`
  respected.

- **The service worker never tells you it cached a book.** Offline works, but
  silently, so there is no way to know whether a book is safe to take on a
  plane. A per-book "available offline" state would be honest and is a real
  feature for the stated use case.
