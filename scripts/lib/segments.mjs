// Sentence segmentation, shared by the reader and the narration pipeline.
//
// This has to produce IDENTICAL output in both, or the highlight lands on the
// wrong sentence. lib/read-aloud.ts holds the TypeScript copy the app uses and
// re-exports from here is not possible across the .ts/.mjs boundary without
// dragging React into Node, so there is a test asserting the two agree.

/**
 * Split page prose into read-aloud segments.
 *
 * Sentences, not words: a word-by-word highlight at this age is a strobe, and a
 * whole-page highlight tells you nothing. Terminal punctuation and newlines are
 * kept inside the segment so rejoining gives back the original exactly.
 */
export function segmentsOf(text) {
  const out = []
  const re = /[^.!?\n]+[.!?]*[\n]*/g
  let m
  while ((m = re.exec(text))) {
    const raw = m[0]
    if (!raw.trim()) continue
    out.push({ text: raw, start: m.index, end: m.index + raw.length })
  }
  return out.length > 0 ? out : [{ text, start: 0, end: text.length }]
}

/** Words of a segment, normalised for matching against a transcript. */
export function wordsOf(text) {
  return String(text)
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, "'")
    .match(/[a-z0-9']+/g) ?? []
}
