import type { BandId } from '../lib/bands.ts'

// The shared shape of a Storylands picture book.
//
// These three types were previously declared independently inside all seven
// book files — seven copies of the same contract, and `book-reader.tsx`
// imported `Book` from `books/nibs-perfect-acorn/book`, so deleting Nibs would
// have stopped the reader compiling. One definition, imported everywhere.

export type IllustrationManifest = {
  /** Reference character ids to seed image generation with. */
  charactersPresent: string[]
  location: string
  timeOfDay: string
  action: string
  emotionalBeat: string
  requiredVisualFacts: string[]
  forbiddenVisualFacts: string[]
  composition: string
  /**
   * Framing for this page. Optional because the first seven books were written
   * before it existed; new books are required to carry one.
   */
  shotType?: ShotType
}

/**
 * How the page is framed.
 *
 * Without this, nothing asked the illustrations to vary, and a
 * character-reference pipeline left to itself produces a centred mid-shot of the
 * protagonist thirteen times. See scripts/lib/shot-types.mjs for what each means
 * and the variance rules the validator enforces.
 */
export type ShotType =
  | 'establishing'
  | 'wide'
  | 'mid'
  | 'close'
  | 'detail'
  | 'low'
  | 'high'
  | 'overShoulder'
  | 'twoShot'

export type BookPage = {
  page: number
  /** The read-aloud prose for this page. */
  text: string
  /** Generated illustration path, relative to /public. */
  art: string
  /**
   * What the picture shows, for a child using a screen reader.
   *
   * In a picture book the illustration carries half the story, so `alt=""`
   * loses half the book. Absent means the reader falls back to a description
   * derived from the manifest rather than announcing nothing.
   */
  alt?: string
  manifest: IllustrationManifest
}

export type Book = {
  id: string
  title: string
  subtitle: string
  character: string
  ages: string
  minutes: number
  /**
   * Which age band this book was written for, and therefore which rules it is
   * held to — page count, word budget, and whether it needs a plot, a second
   * character, dialogue or a refrain. See lib/bands.ts.
   *
   * Optional because the seven original books and Pixie predate bands and are
   * all 4-6 books; absent means `young`. New books declare it.
   */
  band?: BandId
  /**
   * Which series this book belongs to, and where in it.
   *
   * `seriesId` matches an entry in `seriesDefs` in lib/catalog.ts. `seriesOrder`
   * is the reading position, 1-based. Without the order there is no "next in
   * series" to offer, and insertion order could not supply it: the catalog
   * registrar inserts new entries at the TOP of the array while books/index.ts
   * appends to the bottom, so the two orders diverge as books are added.
   */
  seriesId?: string
  seriesOrder?: number
  /**
   * This book's own cover art, relative to /public, e.g.
   * `books/pixies-enormous-plip/cover.webp`.
   *
   * Generated TEXTLESS, so the reader renders the title and subtitle over it.
   * Absent means fall back to the character portrait, whose title is painted in.
   * See bookCoverArt.
   */
  cover?: string
  pages: BookPage[]
}

/**
 * The page illustration format.
 *
 * WebP, not PNG. The source renders were 2.3 MB each, which made a 13-page
 * book a 29 MB download on a phone — see scripts/optimize-books.mjs.
 */
export const PAGE_EXT = 'webp'

/**
 * The shape page art is generated and served at, as width / height.
 *
 * 1.5, because that is what the image model returns for a landscape page
 * (1536x1024) and cropping it at build time turned out to be a mistake.
 *
 * The history is worth keeping, because two wrong answers came before this one.
 *
 * First the art was PORTRAIT, 1024x1536 at 0.667, displayed with `object-cover`
 * in a region about 1.2 wide. That showed roughly the central half of every
 * picture and threw the rest away — paid for in full, cropped in half, and
 * nothing could check what had been lost.
 *
 * Then the art went landscape and the crop moved to build time, to a fixed 1.25
 * derived from a 9:16 stage. That was better and still wrong, because **the
 * region's aspect is not fixed**. The stage is only 9:16 when the viewport is
 * taller than 16/9; on a 390x844 phone the stage is the full 390 wide and the
 * picture region is about 1.03. So a 1.25 file got cropped AGAIN by the browser,
 * and review-art.mjs correctly reported clipped wings on six of thirteen pages
 * — on renders that had margin to spare.
 *
 * So: no build-time crop. The file is the render, and `object-cover` does the
 * per-device cropping it exists for. What makes that safe is the brief, which
 * tells the illustrator the left and right thirds may be cut away. See
 * SAFE_WIDTH_FRACTION in scripts/lib/compile-prompt.mjs.
 */
export const READER_ART_ASPECT = 1536 / 1024

/** Where a book's page illustration lives, relative to /public. */
export function pageArt(slug: string, page: number) {
  return `books/${slug}/pages/page-${String(page).padStart(2, '0')}.${PAGE_EXT}`
}

/**
 * A book's cover art, and whether its title is painted into it.
 *
 * This used to return `characters/<character>.webp` unconditionally — one cover
 * per CHARACTER, not per book. That made a series impossible: Pip's second book
 * would have shown exactly the same cover as his first, so a shelf of three Pip
 * books would have been the same picture three times. It was the real blocker on
 * "turn them into series", and it was in the data model rather than the writing.
 *
 * Now a book may ship its own cover at `public/books/<id>/cover.webp`, which is
 * preferred when present. The character portrait is the fallback, so the eight
 * existing books are untouched.
 *
 * `paintedTitle` is the other half of the fix. The seven original covers have
 * the title and tagline painted INTO the artwork, and the reader also rendered
 * them as HTML on top — so every cover showed its title twice. A per-book cover
 * is generated textless, so the HTML title is correct there and wrong on the old
 * ones. Asking the art which case it is, rather than hardcoding either, is what
 * lets both kinds coexist while the library is half-migrated.
 */
export function bookCoverArt(book: Book): { src: string; paintedTitle: boolean } {
  if (book.cover) return { src: book.cover, paintedTitle: false }
  return { src: `characters/${book.character}.${PAGE_EXT}`, paintedTitle: true }
}

/** @deprecated Use bookCoverArt, which also reports whether the title is painted in. */
export function bookCover(book: Book) {
  return bookCoverArt(book).src
}

/**
 * Fallback alt text, built from the illustration manifest the book already
 * carries. Not as good as a hand-written line, but far better than silence,
 * and it can never drift from the art because it describes the same source.
 */
export function describePage(page: BookPage): string {
  if (page.alt) return page.alt
  const { action, location, timeOfDay } = page.manifest
  return `${action}. ${location}, ${timeOfDay}.`
    .replace(/\.\s*\./g, '.')
    .replace(/^\w/, (c) => c.toUpperCase())
}
