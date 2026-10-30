// Shot types, so thirteen pages don't all look like the same photograph.
//
// Before this existed, nothing asked the illustrations to vary. Every manifest
// described what was happening and left framing to whatever the model felt like,
// which on a character-reference pipeline means a centred mid-shot of the
// protagonist thirteen times. A picture book that does that reads flat however
// good each individual page is.

/**
 * The vocabulary. Each entry carries the framing language that goes into the
 * prompt, so "wide" means the same thing on every page of every book.
 */
export const SHOT_TYPES = {
  establishing:
    'a wide establishing shot: the whole setting visible, the character small within it, generous sky or canopy above',
  wide: 'a wide shot: the character full-body with plenty of the setting around them',
  mid: 'a mid shot: the character from roughly the knees up, the setting readable behind',
  close:
    'a close shot: head and shoulders, the face filling much of the frame, expression doing the work',
  detail:
    'a detail shot: the object or paws at the centre of this beat held large, the character partly in frame',
  low: 'a low angle looking up at the character, making them and the moment feel bigger',
  high: 'a high angle looking down, making the character feel small in the space',
  overShoulder:
    'framed from just behind the character, over their shoulder, so the reader sees what they see',
  twoShot:
    'a two-shot: both characters in frame together at their correct relative heights, facing each other',
}

export const SHOT_KEYS = Object.keys(SHOT_TYPES)

/**
 * Shots that carry a story beat badly if repeated back to back.
 *
 * `close` twice running is the common failure: two consecutive emotional
 * close-ups read as one page split in half.
 */
export const MAX_CONSECUTIVE = 2

/** How many distinct shot types a book of this length should use. */
export function minimumDistinctShots(pageCount) {
  // Thirteen pages on three shot types is a slideshow. Five is comfortable and
  // achievable without contorting the story.
  return pageCount >= 12 ? 5 : 3
}

/** The prompt fragment for a shot type, or empty for an unknown one. */
export function framingFor(shot) {
  return SHOT_TYPES[shot] ?? ''
}
