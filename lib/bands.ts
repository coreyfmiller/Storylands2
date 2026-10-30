// What a Storylands book IS, per age.
//
// This is the single source for every age-dependent fact about a book: how many
// pages, how many words, which structural rules apply, how it is narrated, and
// how the art is briefed. Both the app and the production scripts import it —
// `scripts/lib/*.mjs` can import this file directly because Node strips the
// types, which is how `book-source.mjs` already loads `books/*/book.ts`. One
// definition, not a TypeScript copy and a JavaScript copy drifting apart.
//
// Before this existed, the numbers lived as seven module constants in
// validate-book.mjs with no parameter to vary them, the age was hardcoded as
// "ages 4 to 7" in six separate prompt strings, and `bandsForAge` mapped every
// age from 2 to 12 onto the same single band. The library could only ever hold
// one kind of book.
//
// The important part is not the word counts. It is that each band declares WHICH
// RULES APPLY. A book for a one-year-old has no plot, no second character and no
// dialogue, and the young band's rules — a friend who arrives to ask the
// question, three pages carrying a spoken line, five distinct shot types — would
// reject a perfectly good board book thirteen times out of thirteen. Those rules
// are right for a 4-6 story and meaningless below it, so they are per-band and
// not global.

export type BandId = "baby" | "toddler" | "young" | "middle"

/**
 * Which structural rules the validator enforces for a band.
 *
 * Every one of these is a real rule the strict bar checks. Turning one off for a
 * band is a statement that the rule does not apply to that form, not that the
 * band has a lower bar.
 */
export type BandRequires = {
  /** A spine with a turn: something goes wrong and the resolution costs something. */
  plot: boolean
  /** Minimum pages carrying a spoken line. 0 means dialogue is not expected. */
  dialoguePages: number
  /** A named second character with reference art who is absent, then arrives. */
  secondCharacter: boolean
  /** Varied framing: the shot-type vocabulary and its distinct-shot minimum. */
  shotVariety: boolean
  /** The no-stated-moral rule. Off only where there is no moral to state. */
  noStatedMoral: boolean
  /**
   * A refrain repeated verbatim across pages, which the child joins in with.
   *
   * This is the opposite of a rule for the older bands, where a repeated line
   * reads as a writing tic. Below four it is the single most load-bearing
   * feature of the form — repetition is how a pre-reader participates.
   */
  refrain: boolean
}

export type BandSpec = {
  id: BandId
  /** Shelf and profile label. */
  label: string
  /** Inclusive age range this band is written for. */
  ages: [number, number]
  /** How the age is stated on a cover and in the catalog. */
  agesLabel: string
  pages: { min: number; target: number; max: number }
  /**
   * Words per page. `min`/`max` are the comfortable band (outside is a warning),
   * `ceiling` is a hard error, `target` is what the author aims at.
   *
   * The ceiling is not arbitrary. The reader picks ONE type size for the whole
   * book, set by its longest page, between MIN_TEXT_PX and MAX_TEXT_PX in
   * components/book-reader.tsx. Raise a ceiling and every page of that book
   * renders smaller.
   */
  words: { min: number; target: number; max: number; ceiling: number }
  paragraphs: number
  /**
   * Max allowed spread between the shortest and longest page, in strict mode.
   * Tighter on the short bands because the proportional cost of one long page is
   * far higher when the target is eight words.
   */
  spread: number
  /** Typical read-aloud minutes, for the catalog entry. */
  minutes: number
  requires: BandRequires
  /** The story structure the authoring prompt asks for. */
  spine: string
  /** Extra prose instructions specific to this band. */
  proseNotes: string[]
  /** How the narrator is directed for this band. */
  voiceNote: string
  /** The age clause in the illustration prompt. */
  artNote: string
}

/**
 * The bands, youngest first.
 *
 * Four bands rather than two because the forms genuinely differ. A board book
 * for a one-year-old and a story for a seven-year-old are not the same artifact
 * with a different word count: one has no plot and exists to be pointed at, the
 * other turns on a character being wrong about something. Splitting 0-8 into
 * four is the coarsest division that doesn't force one form to pretend to be
 * another.
 */
export const BANDS: Record<BandId, BandSpec> = {
  baby: {
    id: "baby",
    label: "Babies",
    ages: [0, 2],
    agesLabel: "Ages 0–2",
    pages: { min: 8, target: 8, max: 10 },
    words: { min: 3, target: 6, max: 10, ceiling: 14 },
    paragraphs: 1,
    spread: 5,
    minutes: 2,
    requires: {
      // A board book has no plot and must not be given one. The form is: name a
      // thing, make a sound, repeat the refrain, end warm.
      plot: false,
      dialoguePages: 0,
      secondCharacter: false,
      // Framing still varies — a baby book is mostly big close-ups of one
      // subject, so the shot vocabulary applies but the variety minimum does not.
      shotVariety: false,
      // On at every band. A board book has no moral to state, but nothing stops
      // a generator tacking one onto the last page, and the check costs nothing.
      noStatedMoral: true,
      refrain: true,
    },
    spine:
      "There is NO plot. This is a naming book. Each page holds one subject the baby can point at, " +
      "a sound word, and the same refrain repeated VERBATIM every other page. Open on waking or " +
      "arriving, move through four or five concrete things in one place, close on sleep or a cuddle. " +
      "Nothing goes wrong. Nobody learns anything.",
    proseNotes: [
      "One sentence per page, at most two. No subordinate clauses.",
      "Concrete nouns a baby has seen: cup, ball, duck, boot, leaf, moon. No abstractions.",
      "Include a sound word on most pages — splash, plip, thump, whoosh — and keep the same one for the same thing.",
      "The refrain must appear word-for-word, not varied. Varying it defeats its whole purpose.",
      "Address the listener directly at least twice, e.g. a question with an obvious pointing answer.",
    ],
    voiceNote:
      "reading to a baby on your lap: very slow, musical, long pauses between pages, every sound word played with",
    artNote:
      "for a baby board book (ages 0-2): ONE large simple subject per page, bold clear shapes, high contrast, " +
      "uncluttered background, nothing small or fiddly",
  },

  toddler: {
    id: "toddler",
    label: "Toddlers",
    ages: [2, 4],
    agesLabel: "Ages 2–4",
    pages: { min: 10, target: 10, max: 12 },
    words: { min: 10, target: 16, max: 24, ceiling: 30 },
    paragraphs: 2,
    spread: 10,
    minutes: 4,
    requires: {
      // One want, one obstacle, one resolution. A turn, but no reversal and no irony.
      plot: true,
      dialoguePages: 2,
      secondCharacter: false,
      shotVariety: true,
      noStatedMoral: true,
      refrain: true,
    },
    spine:
      "One want, one obstacle, one resolution, in that order and nothing more. The character wants " +
      "something simple and physical. Three times they try and it does not work, with the SAME refrain " +
      "each time. The fourth time it works, because they did something slightly different — shown, not " +
      "explained. Close on the want satisfied. No reversal, no irony, no twist.",
    proseNotes: [
      "A cumulative refrain the child can say along with you, repeated at least three times word-for-word.",
      "Present-tense verbs and concrete physical action. Nothing happens inside anyone's head.",
      "At most one named character besides the lead, and they help rather than complicate.",
      "Sound words carry the comedy. A toddler laughs at a noise, not at a situation.",
    ],
    voiceNote:
      "reading to a two-year-old: slow and playful, leaning into the refrain so the child can join in, every sound word performed",
    artNote:
      "for a toddler picture book (ages 2-4): one clear action per page, big readable shapes, warm and simple, " +
      "no busy crowd scenes",
  },

  young: {
    id: "young",
    label: "Ages 4–6",
    ages: [4, 6],
    agesLabel: "Ages 4–6",
    pages: { min: 12, target: 13, max: 16 },
    // The original numbers, which the seven first books and Pixie were written
    // against. reader-layout.md: target ~35, comfortable 18-45, ceiling 50.
    words: { min: 18, target: 35, max: 45, ceiling: 50 },
    paragraphs: 3,
    spread: 12,
    minutes: 6,
    requires: {
      plot: true,
      dialoguePages: 3,
      secondCharacter: true,
      shotVariety: true,
      noStatedMoral: true,
      refrain: false,
    },
    spine:
      "A character wants something and cannot have it the obvious way. A named friend ARRIVES partway " +
      "through — they must be absent from the opening pages so their arrival lands — and asks a question " +
      "that reframes the problem. Something then goes genuinely wrong (a reversal), and the resolution " +
      "costs the character something. The last page shows what changed and NEVER states it.",
    proseNotes: [
      "At least three pages carry a spoken line. A series needs a cast that talks.",
      "The friend has a verbal tic that is theirs alone, so they are recognisable in their next book.",
      "Plant whatever resolves the story in the first two pages, in passing.",
      "Vary how pages open. Three pages starting with the same word is a rhythm a child hears.",
    ],
    voiceNote:
      "reading a picture book aloud to a four-year-old at bedtime: warm, unhurried, landing the end of each page",
    artNote:
      "for a children's picture book (ages 4-6): warm, hand-crafted, one clear story beat per page",
  },

  middle: {
    id: "middle",
    label: "Ages 6–8",
    ages: [6, 8],
    agesLabel: "Ages 6–8",
    pages: { min: 14, target: 16, max: 18 },
    // Capped at 72 rather than the ~100 a chapter book would carry, because the
    // reader sets one type size per book from its longest page and the floor is
    // MIN_TEXT_PX. Past about 72 words the whole book renders at the floor.
    words: { min: 40, target: 55, max: 72, ceiling: 85 },
    paragraphs: 4,
    spread: 20,
    minutes: 11,
    requires: {
      plot: true,
      dialoguePages: 6,
      secondCharacter: true,
      shotVariety: true,
      noStatedMoral: true,
      refrain: false,
    },
    spine:
      "The character is WRONG about something, confidently, from page one. A named friend disagrees and " +
      "is overruled. The character gets what they wanted and it is worse than expected — that is the " +
      "reversal, and it must cost them. They put it right at their own expense. A second small thread " +
      "runs underneath and pays off in the last three pages. The ending shows the change and never names it.",
    proseNotes: [
      "Dialogue carries the plot, on at least six pages. Two characters who want different things.",
      "The friend is right and says so early, so a re-read is a different experience.",
      "One sentence per page may be long and rhythmic. Vary sentence length deliberately.",
      "A joke a six-year-old gets and an adult gets differently is the target.",
      "No glossary words, but do not flatten the vocabulary — one stretch word per page or two is right.",
    ],
    voiceNote:
      "reading to a seven-year-old who is following the words: clear and characterful, distinct voices for each speaker, pace driven by the dialogue",
    artNote:
      "for a children's picture book (ages 6-8): richer detail and deeper scenes than a board book, " +
      "expressive faces, a readable background that rewards a second look",
  },
}

/** Youngest first. The order shelves and pickers should present. */
export const BAND_ORDER: BandId[] = ["baby", "toddler", "young", "middle"]

export const BAND_LIST: BandSpec[] = BAND_ORDER.map((id) => BANDS[id])

/** The youngest and oldest age Storylands publishes for, derived from the bands. */
export const MIN_BAND_AGE = Math.min(...BAND_LIST.map((b) => b.ages[0]))
export const MAX_BAND_AGE = Math.max(...BAND_LIST.map((b) => b.ages[1]))

export function bandSpec(id: BandId): BandSpec {
  const spec = BANDS[id]
  if (!spec) throw new Error(`unknown band "${id}". One of: ${BAND_ORDER.join(", ")}`)
  return spec
}

/**
 * The band an age reads at.
 *
 * Bands overlap at their edges by one year on purpose — a just-turned-four is
 * nearer a toddler than a six-year-old — and this resolves to the band whose
 * range contains the age, preferring the older one so a child is never handed
 * something babyish. Above the top band everything falls to `middle` rather than
 * to nothing, because an older child reading these to a younger sibling is a
 * real case and showing them an empty library is not an answer.
 */
export function bandForAge(age: number): BandId {
  if (age <= MIN_BAND_AGE) return "baby"
  const match = [...BAND_LIST].reverse().find((b) => age >= b.ages[0] && age <= b.ages[1])
  return match?.id ?? "middle"
}

/**
 * Every band an age should see books from.
 *
 * Wider than `bandForAge` because a library that shows a five-year-old only the
 * 4-6 shelf hides the toddler books they still like and the 6-8 books they are
 * growing into. The rule: your own band, plus the one below, plus the one above
 * once you are at the top of your own range.
 */
export function bandsForReaderAge(age: number): BandId[] {
  const own = bandForAge(age)
  const i = BAND_ORDER.indexOf(own)
  const out: BandId[] = [own]
  if (i > 0) out.unshift(BAND_ORDER[i - 1])
  const spec = BANDS[own]
  if (age >= spec.ages[1] && i < BAND_ORDER.length - 1) out.push(BAND_ORDER[i + 1])
  return out
}
