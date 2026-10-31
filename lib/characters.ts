// Who the books are about.
//
// Children do not ask for a genre, a tag, or a reading band. They ask for "the
// dragon one". Nine characters star in this library and there has been no way
// to browse by any of them — Tilly appears in three different books and nothing
// anywhere surfaced that. This is the registry that fixes it.
//
// Why it is written down rather than derived from the character bibles: only two
// of the nine have a bible (they predate `new-character.mjs`), bibles live in
// `assets/` which is never served to the browser, and a bible's `bio` is a dense
// paragraph of visual facts written for an image model, not something to show a
// parent. The shelf needs a name and one short line.
//
// `tagline` is the character's, not a book's. It has to still be true for every
// book they are ever in, which is exactly the test three of the painted covers
// fail: Rusty's cover says "Kindness makes a bigger world" and Lumi's says "A
// little light goes a long way", which are the morals of one story each and
// cannot head a series. The taglines here are deliberately about the CHARACTER.

export type Character = {
  id: string
  name: string
  /** One short line about the character, true across every book they appear in. */
  tagline: string
  species: string
}

export const CHARACTERS: Record<string, Character> = {
  pip: {
    id: 'pip',
    name: 'Pip',
    tagline: 'A small dragon whose flame arrived late.',
    species: 'dragon',
  },
  lumi: {
    id: 'lumi',
    name: 'Lumi',
    tagline: 'The owl who lights the way home.',
    species: 'owl',
  },
  tilly: {
    id: 'tilly',
    name: 'Tilly',
    tagline: 'Asks the question nobody thought of.',
    species: 'owl',
  },
  nibs: {
    id: 'nibs',
    name: 'Nibs',
    tagline: 'A squirrel with very high standards.',
    species: 'squirrel',
  },
  oliver: {
    id: 'oliver',
    name: 'Oliver',
    tagline: 'Defender of the house. Enemy of the vacuum.',
    species: 'dog',
  },
  maple: {
    id: 'maple',
    name: 'Maple',
    tagline: 'Big ideas. Slightly questionable plans.',
    species: 'raccoon',
  },
  finn: {
    id: 'finn',
    name: 'Finn',
    tagline: 'Small splashes. Big adventures.',
    species: 'duckling',
  },
  rusty: {
    id: 'rusty',
    name: 'Rusty',
    tagline: 'A fox whose feelings get big.',
    species: 'fox',
  },
  pixie: {
    id: 'pixie',
    name: 'Pixie',
    tagline: 'Little moments can change everything.',
    species: 'butterfly',
  },
}

export function characterById(id: string): Character | undefined {
  return CHARACTERS[id]
}

/** The portrait served for a character. Covers both the full and thumb paths. */
export function characterPortrait(id: string): string {
  return `/characters/${id}.webp`
}
