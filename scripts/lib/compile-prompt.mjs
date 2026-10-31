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

import { framingFor } from './shot-types.mjs'
import { bandSpec } from '../../lib/bands.ts'

/**
 * The house style, for one band.
 *
 * The age clause used to be the literal string "(ages 4-7)" in a module
 * constant, which is wrong for three of the four bands: a board book wants one
 * big bold subject on an uncluttered ground, and a 6-8 book wants depth and
 * detail that would be noise to a one-year-old. Everything else — the framing
 * warning, the textless rule, the on-model rule — is the same at every age.
 */
export function styleFor(band) {
  const spec = bandSpec(band)
  return [
    `Warm, hand-crafted storybook illustration ${spec.artNote}.`,
    'Rich but gentle color, soft natural light, expressive and characterful.',
    'Full-bleed HORIZONTAL composition, wider than it is tall, like the picture across the top of a picture-book page.',
    // Only the sides are trimmed, and on a narrow phone a LOT of them are.
    // Two separate facts, and conflating them cost two re-rolls.
    //
    // The SIDES get cropped on a phone, so the beat has to sit in the middle.
    // The TOP and BOTTOM do not get cropped — but the previous wording turned
    // that into "no extra headroom is needed", which reads as an instruction to
    // compose tight to the top edge. It duly did: the first review of the first
    // book written against this brief flagged two pages for an ear tip cut off
    // by the top edge, on a render we had not cropped at all.
    //
    // Not cropping the top is a reason the whole character FITS, not a reason to
    // push them against the edge.
    `CRITICAL FRAMING: on a phone the left and right edges of this picture are cropped away, and only the middle ${Math.round(SAFE_WIDTH_FRACTION * 100)}% of its width is reliably visible. Compose the entire beat inside that central band: the characters, their wings, ears, paws and the key action must all sit within the middle of the frame, with generous background to spare on the left and the right. Treat the outer sixth of each side as scenery that will be thrown away. The top and bottom are NOT cropped, so use the full height — but every character must still be WHOLLY inside the frame with clear space above them: ear tips, tufts, horns, antennae and the tops of heads must never touch or cross the top edge, and paws and tails must never cross the bottom one. Nothing important may touch or approach any edge.`,
    'IMPORTANT: absolutely NO text, letters, words, numbers, titles, or signage lettering anywhere in the image.',
    'Keep every character EXACTLY on-model with its provided reference image: same species, same fur/feather color and pattern, same eyes, same proportions, same apparent age.',
  ].join(' ')
}

/**
 * The 4-6 style, kept as a constant because new-character.mjs builds a reference
 * sheet prompt from it by stripping the horizontal-composition clause.
 */
export const STYLE = styleFor('young')

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
 * @param {string} [band]    the book's band, which sets the age clause in STYLE
 */
/**
 * The series' world, as prompt text.
 *
 * Characters have been held consistent since the beginning, by seeding every
 * page with an approved reference image. The WORLD never was: palette, light
 * and environment were re-invented per book, so across three Lantern Valley
 * books the river has been a broad bright lake, a frozen stream at sunset, and
 * a narrow dusk waterway. A series a child comes back to has to be the same
 * place each time — being the same place is most of what makes it a place.
 *
 * @param {object|null} world a parsed assets/series/<id>.json, or null
 */
export function seriesWorld(world) {
  if (!world) return ''
  const parts = [
    `This book belongs to the series "${world.name}", and every page must be unmistakably the same place.`,
    world.world ? `THE PLACE: ${world.world}.` : '',
    world.palette ? `PALETTE: ${world.palette}.` : '',
    world.light ? `LIGHT: ${world.light}.` : '',
    world.recurring?.length
      ? `Recurring things in this world, drawn the same way every time they appear: ${world.recurring.join('; ')}.`
      : '',
    // The forbidden list is what actually keeps two series apart. Without it the
    // models happily put paper lanterns in the oak clearing.
    world.forbidden?.length
      ? `NEVER in this world: ${world.forbidden.join('; ')}.`
      : '',
  ]
  return parts.filter(Boolean).join(' ')
}

export function compilePrompt(manifest, bios = {}, band = 'young', world = null) {
  const m = manifest
  const framing = framingFor(m.shotType)
  return [
    styleFor(band),
    // Before the cast, because the world is the stage they stand on and the
    // page-specific scene below should read as a refinement of both.
    seriesWorld(world),
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
