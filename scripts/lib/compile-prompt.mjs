// Turn one page manifest into one image prompt.
//
// Separated from generate-book.mjs so it can be printed without spending money
// (`--dry-run`), reused by the cast-check step, and unit-reasoned about. The
// manifest is the canonical truth; this file only ever rephrases it.

/**
 * Shared style, so every page reads like the same book. Most of the style is
 * actually carried by the reference images — this reinforces it and enforces the
 * two rules the model most likes to break.
 */
export const STYLE = [
  'Warm, hand-crafted storybook illustration for a childrens picture book (ages 4-7).',
  'Rich but gentle color, soft natural light, expressive and characterful.',
  'Full-bleed vertical 9:16 composition.',
  // The reader shows page art full-bleed with object-cover, which CROPS the edges.
  'CRITICAL FRAMING: the image will be displayed cropped to fill, so keep the main subject and ALL important detail (heads, ears, faces, paws, the key action) well within a centered safe area with generous margin and headroom on every side. Never place anything important near the top, bottom, or side edges. Leave comfortable empty space / background around the subject so nothing important is lost if the edges are cropped. Do not fill the frame edge-to-edge with the subject.',
  'IMPORTANT: absolutely NO text, letters, words, numbers, titles, or signage lettering anywhere in the image.',
  'Keep every character EXACTLY on-model with its provided reference image: same species, same fur/feather color and pattern, same eyes, same proportions, same apparent age.',
].join(' ')

const ORDINALS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH']

/**
 * The cast sentence. Reference images are passed to the API in the same order as
 * `charactersPresent`, so the ordinals here have to match that order exactly or
 * a two-character page swaps the bios and both characters come out wrong.
 */
function castSentence(cast, bios) {
  if (cast.length === 1) {
    const bio = bios[cast[0]] || `${cast[0]}, exactly as in the reference`
    return `The reference image is ${bio}. Draw it exactly on-model with the reference.`
  }
  const lines = cast.map((c, i) => {
    const bio = bios[c] || `${c}, exactly as in the reference image`
    return `The ${ORDINALS[i] || 'next'} reference image is ${bio}.`
  })
  return `${lines.join(' ')} Draw EACH character exactly on-model with its own reference image.`
}

/**
 * @param {object} manifest  a page manifest (flattened, see manifestsOf)
 * @param {Record<string,string>} bios
 */
export function compilePrompt(manifest, bios = {}) {
  const m = manifest
  return [
    STYLE,
    castSentence(m.charactersPresent, bios),
    `Scene: ${m.action}.`,
    `Setting: ${m.location}, ${m.timeOfDay}.`,
    `Mood: ${m.emotionalBeat}.`,
    `Must include: ${m.requiredVisualFacts.join('; ')}.`,
    `Must NOT include: ${m.forbiddenVisualFacts.join('; ')}.`,
    `Composition: ${m.composition}.`,
  ].join(' ')
}

/**
 * A "cast check" prompt: two characters together, on-model, at the right
 * relative scale. book-production.md requires one of these approved before any
 * two-character book generates pages.
 */
export function compileCastCheck(cast, bios) {
  return [
    STYLE,
    castSentence(cast, bios),
    `Scene: ${cast.join(' and ')} standing together in a simple woodland clearing, facing the viewer, full body, relaxed and friendly.`,
    'Setting: a plain, uncluttered clearing, soft daylight.',
    'Mood: calm and warm; this is a model sheet, not a story beat.',
    'Must include: both characters fully visible head to foot at their correct relative heights; each exactly on-model with its own reference.',
    'Must NOT include: any text, words, letters, numbers, or title in the image; any sign, signpost, board, placard, label, or plaque; props or clutter.',
    'Composition: both characters centered side by side with generous margin on every side.',
  ].join(' ')
}
