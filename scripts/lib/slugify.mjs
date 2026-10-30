// A short, readable slug from a book title. It is the reader route, so a person
// reads it.
//
// "The Finest Thing in the Wood" first came out as `the-finest-thing-in`: a flat
// four-word truncation that cut mid-phrase and ended on a preposition.

/** Words not worth a slug segment, and never worth ending one with. */
const STOP = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
  'from', 'into', 'by', 'is', 'was', 'that', 'it', 'its',
])

const MAX_SEGMENTS = 5

export function slugify(title) {
  let words = String(title)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  // Drop a leading article: "finest-thing-in-the-wood" reads better than "the-".
  if (words.length > 2 && STOP.has(words[0])) words = words.slice(1)

  // Only when the title is too long to fit, drop the small interior words. A
  // flat truncation threw away the noun and kept the filler: "Pixie and the
  // Enormous Little Rainbow" became `pixie-and-the-enormous-little`, a route
  // with the subject missing. Squeezing first keeps the words that carry it.
  if (words.length > MAX_SEGMENTS) {
    const squeezed = words.filter((w) => !STOP.has(w))
    if (squeezed.length >= 2) words = squeezed
  }

  words = words.slice(0, MAX_SEGMENTS)
  while (words.length > 2 && STOP.has(words[words.length - 1])) words.pop()

  return words.join('-')
}
