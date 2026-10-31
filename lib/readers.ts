// Who is reading.
//
// Storylands used to ship four fictional children — Avery 6, Maya 10, Leo 13,
// Alex 16 — hardcoded in lib/catalog.ts, and the profile menu admitted what they
// were: "switch profiles to see how Storylands surfaces different stories". Two
// of them could not open a single book, because every book is for ages 4 to 7.
//
// A reader is now somebody a family actually adds. Pure logic lives here; the
// state and persistence live in components/providers/reader-provider.tsx.

import type { Band } from './catalog'
// Explicit .ts extension: this is a VALUE import, so it survives type stripping
// and Node has to resolve it at runtime. The type-only import above is erased
// and does not need one. Without the extension the app still builds, because
// webpack resolves it, and every .mjs script that touches this module dies.
import { BAND_ORDER, MIN_BAND_AGE, bandForAge, bandsForReaderAge } from './bands.ts'
import { bandsWithBooks, publishedAgeRange } from './catalog.ts'

export type Reader = {
  id: string
  name: string
  age: number
  /** Index into READER_COLOURS. Stored, not derived, so it survives a rename. */
  colour: number
}

/**
 * The ages Storylands is for.
 *
 * Zero is the floor now that there is a baby band: a profile for a one-year-old
 * is a parent reading a board book aloud, which is a real and central case. It
 * was 2, with a doc comment directly above it claiming "four is the floor" —
 * neither number matched the other and neither matched the books.
 *
 * Twelve stays as a generous ceiling. Nothing is written above the 6-8 band, and
 * `bandsForAge` resolves an older child to that band rather than to an empty
 * library, because an older sibling reading these aloud is worth supporting.
 */
export const MIN_AGE = MIN_BAND_AGE
export const MAX_AGE = 12
export const NAME_MAX = 24

/**
 * The ages to STATE in the interface, as opposed to the ages a profile accepts.
 *
 * These are two different facts and conflating them put a false claim on three
 * screens. `MIN_AGE`/`MAX_AGE` bound what a parent may type, deliberately wide
 * so an older sibling can have a profile. What the app may say out loud is
 * narrower: the ages it has actually published books for. The moment MIN_AGE
 * became 0, the welcome screen, the readers sheet and the footer all began
 * promising "ages 0 to 12" on a library of eight books written for 4 to 6.
 *
 * Derived from the catalog, so it can never drift from what exists.
 */
export function publishedAges(): { min: number; max: number } {
  return publishedAgeRange()
}

/** Accent colours for avatars, in the order new readers get them. */
export const READER_COLOURS = [
  'oklch(0.82 0.13 68)',
  'oklch(0.78 0.1 230)',
  'oklch(0.8 0.12 145)',
  'oklch(0.78 0.12 20)',
  'oklch(0.8 0.1 300)',
  'oklch(0.82 0.12 100)',
] as const

export function colourOf(reader: Reader) {
  return READER_COLOURS[reader.colour % READER_COLOURS.length]
}

/** The first letter, for the avatar. Falls back to a dot rather than nothing. */
export function initialOf(reader: Reader) {
  return reader.name.trim().charAt(0).toUpperCase() || '·'
}

/**
 * Which shelf bands an age can see.
 *
 * `bandsForReaderAge` says which bands SUIT this age; this says which of those
 * a reader may actually be shown, and never hands back an empty library.
 *
 * Both halves matter. Before the bands existed this returned `['young']` for
 * every age from 2 to 12, which was honest about having one kind of book and
 * useless as a mapping. Replacing it with the real age ranges then broke the
 * other way: a two-year-old resolved to [baby, toddler], both of which are
 * empty today, so a child who had seen seven books saw none. Neither "pretend
 * every age is the same" nor "show a child an empty shelf" is acceptable.
 *
 * So: the suitable bands, narrowed to those with books; and if that leaves
 * nothing, the nearest band that does have books. A parent reading a 4-6 book
 * to a two-year-old is a real and good thing — showing them an empty app is not.
 */
export function bandsForAge(age: number): Band[] {
  const available = bandsWithBooks()
  if (available.length === 0) return []

  const suitable = bandsForReaderAge(age).filter((b) => available.includes(b))
  if (suitable.length > 0) return suitable

  // Nothing for this age yet. Fall back to the closest band that has books,
  // measured from the middle of each band's range.
  const want = bandForAge(age)
  const wantIndex = BAND_ORDER.indexOf(want)
  const nearest = available.reduce((best, b) =>
    Math.abs(BAND_ORDER.indexOf(b) - wantIndex) < Math.abs(BAND_ORDER.indexOf(best) - wantIndex)
      ? b
      : best,
  )
  return [nearest]
}

/** The single validator, used by the form's submit guard and the provider. */
export function isValidReader(input: { name: string; age: unknown }): boolean {
  const name = input.name?.trim() ?? ''
  if (name.length === 0 || name.length > NAME_MAX) return false
  const age = Number(input.age)
  return Number.isInteger(age) && age >= MIN_AGE && age <= MAX_AGE
}

/** Why a reader is invalid, for the form to show. Null when it is fine. */
export function readerProblem(input: { name: string; age: unknown }): string | null {
  const name = input.name?.trim() ?? ''
  if (name.length === 0) return 'A name, so the greeting knows who you are.'
  if (name.length > NAME_MAX) return `Names are up to ${NAME_MAX} letters.`
  const age = Number(input.age)
  if (!Number.isInteger(age)) return 'An age in whole years.'
  if (age < MIN_AGE || age > MAX_AGE) return `Storylands books are for ages ${MIN_AGE} to ${MAX_AGE}.`
  return null
}

export function newReaderId() {
  // Date-based, so ordering is stable and two readers added in one session differ.
  return `r${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`
}
