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
/**
 * The shape page art is generated at.
 *
 * LANDSCAPE, which contradicts what visual-consistency.md used to say. That file
 * called for a 9:16 portrait master, on the assumption that the reader shows the
 * picture full-bleed at 9:16. It does not: the picture occupies the top 9/20 of
 * a 9:16 stage, which is a region 1.25 times wider than it is tall.
 *
 * Measured consequences of getting this wrong:
 *   portrait 1024x1536 (0.667) cropped to 1.25 -> 47% of the HEIGHT discarded,
 *                                                 which is where heads are
 *   landscape 1536x1024 (1.50) cropped to 1.25 -> 17% of the WIDTH discarded,
 *                                                 which is side background
 *
 * So pages are briefed and generated wide.
 */
export const PAGE_ASPECT = '3:2'

/**
 * How much of the width survives on the narrowest device.
 *
 * A 1.5 render shown in a region of about 1.03 — which is what a 390x844 phone
 * gives — keeps 1.03/1.5 of the width, so roughly two thirds. The brief has to
 * say so: the first landscape book was reported as having clipped wings on six
 * of thirteen pages, and every one of those renders had margin to spare. The
 * art was fine and the frame was a third narrower than the illustrator thought.
 */
export const SAFE_WIDTH_FRACTION = 0.68

export const STYLE = [
  'Warm, hand-crafted storybook illustration for a childrens picture book (ages 4-7).',
  'Rich but gentle color, soft natural light, expressive and characterful.',
  'Full-bleed HORIZONTAL composition, wider than it is tall, like the picture across the top of a picture-book page.',
  // Only the sides are trimmed, and on a narrow phone a LOT of them are.
  `CRITICAL FRAMING: on a phone the left and right edges of this picture are cropped away, and only the middle ${Math.round(SAFE_WIDTH_FRACTION * 100)}% of its width is reliably visible. Compose the entire beat inside that central band: the characters, their wings, ears, paws and the key action must all sit within the middle of the frame, with generous background to spare on the left and the right. Treat the outer sixth of each side as scenery that will be thrown away. Use the FULL height — the top and bottom are not cropped, so no extra headroom is needed. Nothing important may touch or approach a left or right edge.`,
  'IMPORTANT: absolutely NO text, letters, words, numbers, titles, or signage lettering anywhere in the image.',
  'Keep every character EXACTLY on-model with its provided reference image: same species, same fur/feather color and pattern, same eyes, same proportions, same apparent age.',
].join(' ')

import { framingFor } from './shot-types.mjs'

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
  const framing = framingFor(m.shotType)
  return [
    STYLE,
    castSentence(m.charactersPresent, bios),
    `Scene: ${m.action}.`,
    `Setting: ${m.location}, ${m.timeOfDay}.`,
    `Mood: ${m.emotionalBeat}.`,
    `Must include: ${m.requiredVisualFacts.join('; ')}.`,
    `Must NOT include: ${m.forbiddenVisualFacts.join('; ')}.`,
    // Framing before composition, because the shot type is the stronger
    // instruction and the composition note refines it.
    framing ? `Framing: ${framing}.` : '',
    `Composition: ${m.composition}.`,
  ]
    .filter(Boolean)
    .join(' ')
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
