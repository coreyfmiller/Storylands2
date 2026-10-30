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
import { MIN_BAND_AGE, bandsForReaderAge } from './bands'

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
 * Delegates to lib/bands.ts, which owns the age ranges. This function used to
 * return `['young']` for every age from 2 to 12 — one band for an eleven-year
 * span — because `young` was the only band with books in it. Now that a book can
 * be written for any of the four bands, the mapping is real.
 */
export function bandsForAge(age: number): Band[] {
  return bandsForReaderAge(age)
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
