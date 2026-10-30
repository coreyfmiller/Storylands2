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

export const STYLE = [
  'Warm, hand-crafted storybook illustration for a childrens picture book (ages 4-7).',
  'Rich but gentle color, soft natural light, expressive and characterful.',
  'Full-bleed HORIZONTAL composition, wider than it is tall, like the picture across the top of a picture-book page.',
  // Only the sides are trimmed, so that is the only place margin is needed.
  'CRITICAL FRAMING: a narrow strip will be trimmed from the LEFT and RIGHT edges, so keep the subject and all important detail (heads, ears, faces, paws, the key action) clear of the left and right edges, with background to spare on both sides. Use the full height of the frame: the top and bottom are NOT trimmed, so heads do not need extra headroom. Do not place anything important hard against a side edge.',
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
