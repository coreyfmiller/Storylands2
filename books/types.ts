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
}

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
  pages: BookPage[]
}

/**
 * The page illustration format.
 *
 * WebP, not PNG. The source renders were 2.3 MB each, which made a 13-page
 * book a 29 MB download on a phone — see scripts/optimize-books.mjs.
 */
export const PAGE_EXT = 'webp'

/** Where a book's page illustration lives, relative to /public. */
export function pageArt(slug: string, page: number) {
  return `books/${slug}/pages/page-${String(page).padStart(2, '0')}.${PAGE_EXT}`
}

/** A book's cover art. The character portraits already have the title painted in. */
export function bookCover(book: Book) {
  return `characters/${book.character}.${PAGE_EXT}`
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
