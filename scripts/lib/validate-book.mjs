// The Storylands quality bar, as code.
//
// Everything checkable here is written down in the steering files and was, until
// now, checked by a person remembering to look. A generated book has to pass
// this before it is written to disk, and the authoring engine feeds the failures
// back to the model for a repair pass. That is the difference between a story
// generator and a story *creator*: the second one knows when it got it wrong.
//
// What this cannot judge: whether the story is any good. Warmth, rhythm, whether
// an ending lands. Those stay human, which is exactly why the mechanical rules
// should never cost a human any attention.

import { SHOT_KEYS, MAX_CONSECUTIVE, minimumDistinctShots } from './shot-types.mjs'
import { BANDS, bandSpec } from '../../lib/bands.ts'

/**
 * The default band, for a book that does not declare one.
 *
 * The seven original books and Pixie were all written before bands existed and
 * are all 4-6 books, so an absent band means `young` rather than an error.
 */
export const DEFAULT_BAND = 'young'

/**
 * The 4-6 budget, still exported because audit-text.mjs and the tests report
 * against it by name.
 *
 * These are no longer THE rules — they are the `young` band's rules, and every
 * limit below is read from the band being validated. A baby book is 8 pages of
 * 6 words and a 6-8 book runs to 72, neither of which these numbers describe.
 * Use `bandSpec(id).words` for anything new.
 */
export const WORD_CEILING = BANDS.young.words.ceiling
export const WORD_TARGET_MIN = BANDS.young.words.min
export const WORD_TARGET_MAX = BANDS.young.words.max
export const PARAGRAPH_CEILING = BANDS.young.paragraphs
export const MIN_PAGES = BANDS.young.pages.min
export const MAX_PAGES = BANDS.young.pages.max

const MANIFEST_FIELDS = [
  'charactersPresent',
  'location',
  'timeOfDay',
  'action',
  'emotionalBeat',
  'requiredVisualFacts',
  'forbiddenVisualFacts',
  'composition',
]

/**
 * Sentence openers that read as a tic when a book leans on them.
 *
 * Not banned — "Then" and "But" are good picture-book words. The rule is about
 * frequency: four pages in a row starting "Then" is a rhythm problem a reader
 * hears immediately, even if no single page is wrong.
 */
const OPENER_LIMIT = 3

/**
 * Props that exist only to be read. visual-consistency.md bans these outright:
 * with words they break the textless rule, and blank they look like the art
 * failed to render. There is no wordless version of a menu.
 */
const TEXT_ONLY_PROPS =
  /\b(sign|signpost|signage|placard|plaque|nameplate|poster|billboard|menu|newspaper|headline|price tag|book cover|envelope)\b/i

/**
 * Props that CAN be wordless and are lovely when they are.
 *
 * Nibs page 5 is the case that taught this distinction: he waves a crude
 * treasure map drawn entirely in acorn pictograms, arrows and X marks. Not one
 * letter, completely readable to a four-year-old, and the best gag in the book.
 * A flat ban on "map" would have called the strongest page a violation.
 *
 * So these are allowed when the manifest says out loud that they carry no words.
 */
const READABLE_PROPS = /\b(map|note|letter|banner|label|chalkboard|blackboard|whiteboard|scroll)\b/i

/** The manifest declaring, in any field, that a prop carries no readable words. */
const DECLARED_WORDLESS =
  /\b(no readable (?:text|words|letters)|wordless|textless|pictogram|pictographs?|symbols only|no letters|no words|only scribbles|scribbles and arrows|picture-only)\b/i

/** The two forbidden-fact rules every page must carry. */
const REQUIRED_FORBIDDEN = [/text|words|letters/i, /sign|placard|plaque/i]

/**
 * Prose that TELLS the reader the point instead of showing it.
 *
 * product-standard.md is unambiguous: show what changed, never state the moral.
 * The first version of this check was far too narrow — it looked for "the lesson
 * is" and "learned that being", and let through five of the seven books in the
 * library, every one of them on its final page:
 *
 *   Rusty:  "But Rusty had learned something: even the biggest feelings get
 *            smaller when you are gentle — and kindness, it turns out, makes
 *            the whole world feel just the right size."
 *   Finn:   "big dreams are just small splashes, one after another"
 *   Lumi:   "She had learned something brighter than any lantern."
 *   Pip:    "it had come from his own big heart."
 *   Maple:  "Maybe brave didn't mean never being scared. Maybe brave meant
 *            looking anyway."
 *
 * The two books that DON'T do it — Oliver and Nibs — are the two best books and
 * the two funniest. That is not a coincidence, and it is why this check is now
 * wide enough to hurt.
 *
 * These patterns are deliberately aggressive. False positives are cheap: the
 * fix is to rewrite one sentence so it shows instead. A false negative ships a
 * sermon to a four-year-old.
 */
const PREACHY = [
  // Naming the act of learning at all.
  /\b(?:had |has |have )?learn(?:ed|t|s)? (?:that|something|a lesson|the|how)\b/i,
  /\b(?:the|a|one) (?:lesson|moral|secret|truth)\b/i,
  /\bnow (?:he|she|they|we) knew\b/i,
  /\b(?:he|she|they) understood (?:that|why|at last)\b/i,
  // Definitional sentences: "brave meant", "kindness is", "being X means Y".
  /\b(?:brave|bravery|kind|kindness|courage|friendship|sharing|love|caring)\s+(?:is|was|means?|meant|didn[’']?t mean|does not mean|doesn[’']?t mean)\b/i,
  /\bmaybe\s+\w+\s+(?:didn[’']?t mean|meant|means)\b/i,
  // The narrator stepping in to summarise.
  /\bit turn(?:s|ed) out\b/i,
  /\b(?:and )?that(?:'s| is| was) (?:why|how|when) (?:you|we|he|she|they)\b/i,
  /\bbecause\s+\w+(?:['’]s)?\s+\w*\s*(?:was|is)\s+(?:small|big|the biggest|the smallest)\b/i,
  // Instructional address to the reader.
  /\b(?:remember(?:ed)? to always|it is important to|you should always|always remember)\b/i,
  // "X is just Y, one after another" style aphorisms.
  /\b(?:are|is) just \w+(?:\s+\w+)?, one after another\b/i,
]

function preachyHit(text) {
  for (const rule of PREACHY) {
    const m = rule.exec(text)
    if (m) return m[0]
  }
  return null
}

// The dialogue minimum and the strict spread limit used to live here as two
// module constants. They are per-band now — `requires.dialoguePages` and
// `spread` in lib/bands.ts — because six spoken pages is right for a 6-8 book
// and absurd for a board book, and a 12-word spread is tight across 35-word
// pages and twice the entire budget across 6-word ones.
//
// Two notes from those constants worth keeping, since they explain the numbers:
//
// Dialogue was set at three for the young band rather than four because Oliver
// vs. The Vacuum has NO dialogue and is one of the two best books in the
// library — it works as a comic narrator monologue, which is a real
// picture-book form. The rule is not "dialogue makes a book good". It is that
// the strict bar exists to produce SERIES-capable books, and a series needs a
// cast: a named second character who turns up, says something, and could come
// back. Oliver's form cannot do that.
//
// The spread limit exists because the reader picks ONE type size per book, set
// by its longest page, so an uneven book renders small throughout. Nibs spans
// 27 words and reads at 24px where it could read at 34.

export function wordCount(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length
}

export function paragraphCount(text) {
  return String(text)
    .split(/\n\s*\n+/)
    .filter((s) => s.trim()).length
}

/**
 * Check a book against every mechanical rule.
 *
 * @returns {{ errors: string[], warnings: string[], stats: object }}
 *   `errors` block the book. `warnings` are judgement calls worth a human's eye
 *   but not worth refusing a book over — a 46-word page is outside the
 *   comfortable band and still well inside the ceiling.
 */
/**
 * Check a book against every mechanical rule.
 *
 * @param {object} opts
 * @param {boolean} [opts.strict] Hold it to the second-generation bar.
 *
 *   The seven original books all pass the loose bar and are, on honest reading,
 *   only as good as that bar. Strict mode encodes what an audit of them found
 *   missing: no stated morals, a named second character who speaks and who is
 *   absent from some pages so they can arrive, real dialogue, varied framing,
 *   varied sentence openings, and even page lengths so the type renders large.
 *
 *   New books are strict. The originals stay loose so they keep loading, and
 *   their shortfalls show up as warnings instead.
 */
export function validateBook({ book, refs = {}, bios = {}, strict = false, band }) {
  const errors = []
  const warnings = []
  /** In strict mode a shortfall blocks; otherwise it is advice. */
  const fail = (message) => (strict ? errors : warnings).push(message)

  // Which form this book is being held to. An explicit `band` argument wins so a
  // caller can check a book against a band it does not yet declare; otherwise the
  // book's own band; otherwise 4-6, which is what every book written before
  // bands existed actually is.
  const spec = bandSpec(band ?? book?.band ?? DEFAULT_BAND)
  const { words: W, pages: P, requires: R } = spec

  for (const field of ['id', 'title', 'subtitle', 'character', 'ages']) {
    if (!book?.[field] || typeof book[field] !== 'string') {
      errors.push(`book.${field} is missing`)
    }
  }
  if (book?.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(book.id)) {
    errors.push(`book.id "${book.id}" must be a kebab-case slug — it is also the reader route`)
  }

  // The subtitle is a thesis statement more often than the prose is.
  //
  // "A very big morning begins with something very small." is the moral, moved
  // to the cover. Rusty's and Lumi's painted taglines do the same thing, and a
  // character tagline has to work for every book they are ever in — a moral
  // only works for one, which is why those two covers cannot head a series.
  // A subtitle should describe the CHARACTER or tease the situation.
  if (book?.subtitle) {
    const hit = preachyHit(book.subtitle)
    // Aphorism shapes, widened after a generated subtitle got through.
    //
    // "A little help leaves room for finding." passed every rule above and is
    // exactly what this check exists to stop: a sentence about what the story
    // MEANS, which can only ever describe one book. The pattern it added is the
    // general one — an abstract noun as the subject of a present-tense verb,
    // stated as a truth. Compare the subtitles that work, which name a character
    // or tease a situation: "A small dragon with a big heart.", "Big ideas.
    // Slightly questionable plans.", "One enormous plan. One very small pond."
    const ABSTRACT =
      'help|kindness|love|courage|bravery|friendship|sharing|patience|hope|trust|honesty|a little light|small things|little things|big feelings|big dreams'
    const aphorism =
      /\b(?:begins with|starts with|is just|are just|goes a long way|makes? (?:the|a) (?:whole |bigger |world))\b/i.exec(
        book.subtitle,
      ) ??
      new RegExp(
        `\\b(?:${ABSTRACT})\\b[^.]{0,40}\\b(?:leaves|makes|means|brings|finds|grows|wins|opens|changes|is|are)\\b`,
        'i',
      ).exec(book.subtitle)
    if (hit || aphorism) {
      fail(
        `the subtitle states the story's point ("${(hit ?? aphorism)[0]}") — a subtitle should describe the character or tease the situation, so it still works for their next book`,
      )
    }
  }
  if (typeof book?.minutes !== 'number' || book.minutes <= 0) {
    errors.push('book.minutes must be a positive number')
  }

  const pages = Array.isArray(book?.pages) ? book.pages : []
  if (pages.length === 0) {
    return { errors: [...errors, 'book has no pages'], warnings, stats: {} }
  }
  if (pages.length < P.min || pages.length > P.max) {
    errors.push(
      `${pages.length} pages; a ${spec.label} book (${spec.agesLabel}) is ${P.min}-${P.max}`,
    )
  }

  // Page numbers must be 1..n with no gaps: pageArt() derives the filename from
  // the number, so a gap is a missing illustration that nothing would report.
  pages.forEach((p, i) => {
    if (p.page !== i + 1) errors.push(`page ${i + 1} is numbered ${p.page}; numbering must be 1..n`)
  })

  const words = []
  for (const p of pages) {
    const where = `page ${p.page}`

    if (!p.text || typeof p.text !== 'string' || !p.text.trim()) {
      errors.push(`${where}: no text`)
      continue
    }

    const w = wordCount(p.text)
    const para = paragraphCount(p.text)
    words.push(w)

    if (w > W.ceiling) {
      errors.push(
        `${where}: ${w} words, ceiling for ${spec.agesLabel} is ${W.ceiling} — split it into two pages`,
      )
    } else if (w > W.max) {
      warnings.push(`${where}: ${w} words, above the comfortable band of ${W.max} for ${spec.agesLabel}`)
    } else if (w < W.min) {
      warnings.push(`${where}: ${w} words, below the comfortable band of ${W.min} for ${spec.agesLabel}`)
    }
    if (para > spec.paragraphs) {
      errors.push(`${where}: ${para} paragraphs, ceiling for ${spec.agesLabel} is ${spec.paragraphs}`)
    }
    // Two speakers sharing one paragraph. A parent reading aloud has no cue
    // that the voice changed, and a child following the words sees one person
    // answering themselves.
    for (const para of String(p.text).split(/\n\s*\n+/)) {
      const quotes = (para.match(/[\u201c"]/g) ?? []).length
      if (quotes >= 4 && /[\u201d"]\s+[\u201c"]/.test(para)) {
        fail(
          `${where}: two speakers share one paragraph; give each their own line so a read-aloud has somewhere to change voice`,
        )
        break
      }
    }

    const preachy = R.noStatedMoral ? preachyHit(p.text) : null
    if (preachy) {
      const message = `${where}: tells the reader the point instead of showing it — "${preachy}"`
      // A warning on the seven books that predate this check, an error for
      // anything held to the current bar. Rewriting five shipped endings is an
      // editorial job, not something a validator should do by refusing to load.
      if (strict) errors.push(message)
      else warnings.push(message)
    }

    const m = p.manifest
    if (!m || typeof m !== 'object') {
      errors.push(`${where}: no illustration manifest`)
      continue
    }
    for (const field of MANIFEST_FIELDS) {
      const v = m[field]
      const empty = Array.isArray(v) ? v.length === 0 : !v
      if (empty) errors.push(`${where}: manifest.${field} is empty`)
    }

    const cast = Array.isArray(m.charactersPresent) ? m.charactersPresent : []
    if (cast.length === 0) {
      errors.push(`${where}: no charactersPresent, so the prompt has no reference to seed with`)
    }
    for (const c of cast) {
      if (!refs[c]) {
        errors.push(`${where}: character "${c}" has no entry in CHARACTER_REFS`)
      }
    }

    const forbidden = Array.isArray(m.forbiddenVisualFacts) ? m.forbiddenVisualFacts : []
    const joined = forbidden.join(' ')
    for (const rule of REQUIRED_FORBIDDEN) {
      if (!rule.test(joined)) {
        errors.push(
          `${where}: forbiddenVisualFacts must rule out text and signage on every page`,
        )
        break
      }
    }

    // A prop that only exists to be read conflicts directly with the textless
    // rule. Checked in what the picture must CONTAIN, never in what it forbids.
    const staged = [m.action, m.composition, m.location, ...(m.requiredVisualFacts ?? [])]
    const wordlessDeclared = DECLARED_WORDLESS.test(
      [...staged, ...(m.forbiddenVisualFacts ?? [])].join(' '),
    )

    for (const text of staged) {
      const banned = TEXT_ONLY_PROPS.exec(text ?? '')
      if (banned) {
        errors.push(
          `${where}: the picture stages a "${banned[0]}", which only exists to be read — re-stage the beat wordlessly and put the words in the text panel`,
        )
      }
      const readable = READABLE_PROPS.exec(text ?? '')
      if (readable && !wordlessDeclared) {
        errors.push(
          `${where}: the picture stages a "${readable[0]}" without saying it is wordless — add "no readable text" to the required facts and forbid letters on it`,
        )
      }
    }
  }

  // The protagonist has to be in their own last page. product-standard.md:
  // "rest on the character we rooted for."
  const last = pages[pages.length - 1]
  if (last?.manifest?.charactersPresent && book.character) {
    if (!last.manifest.charactersPresent.includes(book.character)) {
      errors.push(
        `the final page does not include "${book.character}" — the ending must rest on the character we rooted for`,
      )
    }
  }

  for (const c of Object.keys(refs)) {
    if (!bios[c]) warnings.push(`character "${c}" has a reference but no CHARACTER_BIOS line`)
  }

  // ---- how the pages are FRAMED -----------------------------------------
  //
  // Left alone, a character-reference pipeline draws a centred mid-shot of the
  // protagonist thirteen times. Each page is fine and the book reads flat.
  const shots = pages.map((p) => p.manifest?.shotType)
  const haveShots = shots.filter(Boolean).length

  if (haveShots === 0) {
    // The first seven books predate shotType, so its absence is a warning for
    // them and an error for anything held to the current bar.
    fail('no page declares a shotType, so nothing is varying the framing')
  } else {
    if (haveShots < pages.length) {
      errors.push(
        `${pages.length - haveShots} page(s) have no shotType while others do — either all or none`,
      )
    }
    // An unknown key is always an error: framingFor() returns empty for one, so
    // the page silently loses its framing instruction whatever the band.
    for (const [i, shot] of shots.entries()) {
      if (shot && !SHOT_KEYS.includes(shot)) {
        errors.push(`page ${i + 1}: unknown shotType "${shot}". One of: ${SHOT_KEYS.join(', ')}`)
      }
    }
    // Variety is a band rule. A board book is deliberately repetitive — the same
    // big close-up of the same subject is the form, not a flat arc — so neither
    // the consecutive-run limit nor the distinct minimum applies below toddler.
    if (R.shotVariety) {
      let run = 1
      for (let i = 1; i < shots.length; i++) {
        if (shots[i] && shots[i] === shots[i - 1]) {
          run += 1
          if (run > MAX_CONSECUTIVE) {
            errors.push(
              `pages ${i + 2 - run}-${i + 1}: ${run} consecutive "${shots[i]}" shots; at most ${MAX_CONSECUTIVE}`,
            )
            run = 1
          }
        } else {
          run = 1
        }
      }
      const distinct = new Set(shots.filter(Boolean)).size
      const needed = minimumDistinctShots(pages.length)
      if (distinct < needed) {
        errors.push(
          `only ${distinct} distinct shot types across ${pages.length} pages; use at least ${needed}`,
        )
      }
    }
  }

  // ---- the refrain, on the bands that live or die by it -------------------
  //
  // Below four, a line repeated word-for-word is the single most load-bearing
  // feature of the form: repetition is how a child who cannot read takes part,
  // and it is why a two-year-old asks for the same book nightly. Note this is
  // the exact inverse of the opener rule below, which treats repetition as a
  // tic — so it has to be a band rule rather than a global one, or the two
  // checks would contradict each other.
  if (R.refrain) {
    /**
     * Candidate refrains on one page: whole paragraphs AND single sentences.
     *
     * Both, because a refrain takes either shape. "Goodnight, little light." is
     * one sentence; "Still there. Still stuck." is a two-sentence paragraph
     * whose halves are two words each.
     *
     * That second case is why this looks at paragraphs at all. The first version
     * only split on sentence boundaries and required three words, so a correct
     * toddler refrain of two short sentences became two 2-word fragments, both
     * discarded — and a book that had faithfully repeated its refrain four times
     * was rejected three times in a row for not having one. A toddler refrain is
     * SUPPOSED to be tiny.
     *
     * Two words is the floor. One word ("Hush.") repeating is a sound effect,
     * not a line a child joins in with.
     */
    const candidatesOf = (text) => {
      const out = new Set()
      const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ')
      for (const para of String(text ?? '').split(/\n\s*\n+/)) {
        const whole = norm(para)
        if (wordCount(whole) >= 2) out.add(whole)
        for (const sentence of para.split(/(?<=[.!?])\s+/)) {
          const line = norm(sentence)
          if (wordCount(line) >= 2) out.add(line)
        }
      }
      return out
    }

    const pagesWith = new Map()
    for (const p of pages) {
      // Counted per PAGE, not per occurrence: a refrain twice on one page is
      // emphasis. A refrain has to come back after a page turn.
      for (const line of candidatesOf(p.text)) {
        pagesWith.set(line, (pagesWith.get(line) ?? 0) + 1)
      }
    }

    const best = [...pagesWith.entries()].sort((a, b) => b[1] - a[1])[0]
    const MIN_REFRAIN_PAGES = 3
    if (!best || best[1] < MIN_REFRAIN_PAGES) {
      fail(
        `no line repeats word-for-word across at least ${MIN_REFRAIN_PAGES} pages; a ${spec.label} book needs a refrain the child can join in with` +
          (best ? ` (the most repeated line, "${best[0]}", appears on ${best[1]})` : ''),
      )
    }
  }

  // ---- how the pages are CAST -------------------------------------------
  const castSizes = pages.map((p) => (p.manifest?.charactersPresent ?? []).length)
  const supporting = Object.keys(refs).filter((c) => c !== book.character)
  for (const c of supporting) {
    const appearances = pages.filter((p) =>
      (p.manifest?.charactersPresent ?? []).includes(c),
    ).length
    if (appearances === 0) {
      warnings.push(`"${c}" has reference art available but never appears`)
    } else if (appearances === pages.length) {
      // A friend who is simply always there cannot arrive, and the spine turns
      // on them arriving to ask the question.
      warnings.push(
        `"${c}" is on every page; a supporting character needs pages they are absent from for their arrival to land`,
      )
    }
  }
  if (castSizes.length > 2 && new Set(castSizes).size === 1 && supporting.length > 0) {
    warnings.push('every page has the same number of characters; the frame never opens or closes')
  }

  // ---- prose texture ----------------------------------------------------
  const openers = {}
  for (const p of pages) {
    const first = String(p.text ?? '')
      .trim()
      .split(/\s+/)[0]
      ?.replace(/[^A-Za-z']/g, '')
      .toLowerCase()
    if (first) openers[first] = (openers[first] ?? 0) + 1
  }
  // Skipped on the refrain bands, which would otherwise be penalised for the
  // thing they are required to do: a refrain used as a page opener is four pages
  // starting with the same word, and that is correct for a two-year-old.
  if (!R.refrain) {
    for (const [word, n] of Object.entries(openers)) {
      if (n > OPENER_LIMIT) {
        fail(`${n} pages open with "${word}"; vary the sentence openings`)
      }
    }
  }

  // ---- a second character who speaks, and who arrives ---------------------
  //
  // The audit's clearest finding. In five of the seven books the protagonist is
  // alone and the "friend" is a glow-moth, a dragonfly, a silent owl, a
  // hedgehog, a firefly — unnamed, barely speaking, incapable of returning.
  // Nibs is the only book with a real second character, and it is the best
  // book. It is also why there is no series: there is no cast.
  if (strict) {
    const supportingLeads = Object.keys(refs).filter((c) => c !== book.character)
    const onPages = (c) =>
      pages.filter((p) => (p.manifest?.charactersPresent ?? []).includes(c)).length

    const present = supportingLeads.filter((c) => onPages(c) > 0)

    // A second character is required for 4-6 and up, where the spine turns on a
    // friend arriving. A board book is a baby and one familiar face; adding a
    // cast to it would be the wrong note, so the rule is off below toddler.
    if (R.secondCharacter) {
      if (present.length === 0) {
        errors.push(
          'no second character with reference art appears; the protagonist is alone for the whole book',
        )
      }
      for (const c of present) {
        const n = onPages(c)
        if (n === pages.length) {
          errors.push(
            `"${c}" is on every page, so they can never arrive — the spine turns on a friend arriving to ask the question`,
          )
        }
        if (n < 3) {
          errors.push(
            `"${c}" appears on only ${n} page(s); a second character needs enough room to matter`,
          )
        }
      }
    }

    // Dialogue, counted by pages that contain a spoken line. The minimum is the
    // band's: six pages for 6-8 where dialogue carries the plot, three for 4-6,
    // two for a toddler, and none at all for a baby who is being spoken TO.
    const spoken = (p) => /[\u201c"][^\u201d"]{3,}[\u201d"]/.test(p.text)
    const speaking = pages.filter(spoken).length
    if (R.dialoguePages > 0 && speaking < R.dialoguePages) {
      errors.push(
        `only ${speaking} page(s) carry a spoken line; a ${spec.label} book needs at least ${R.dialoguePages}`,
      )
    }

    // The second character has to actually say something on a page they are on.
    // Present-but-silent is how the existing books ended up with a glow-moth
    // instead of a friend.
    if (R.secondCharacter && R.dialoguePages > 0) {
      for (const c of present) {
        const theirPages = pages.filter((p) => (p.manifest?.charactersPresent ?? []).includes(c))
        if (!theirPages.some(spoken)) {
          errors.push(
            `"${c}" never speaks on any page they appear on; a silent companion cannot ask the question the spine turns on`,
          )
        }
      }
    }
  }

  // Both of these measure whether a STORY moves, so they only apply to a band
  // that has one. They were also gated on a literal `>= 12` pages, which silently
  // skipped itself on any book shorter than the 4-6 form — so an 8-page book
  // escaped them by being short rather than by being a different kind of thing.
  if (R.plot) {
    const beats = pages.map((p) => String(p.manifest?.emotionalBeat ?? '').toLowerCase().trim())
    const distinctBeats = new Set(beats.filter(Boolean)).size
    if (distinctBeats < Math.ceil(beats.length * 0.6)) {
      warnings.push(
        `only ${distinctBeats} distinct emotional beats across ${beats.length} pages; the arc is flat`,
      )
    }

    const locations = new Set(
      pages.map((p) => String(p.manifest?.location ?? '').toLowerCase().trim()).filter(Boolean),
    )
    if (locations.size < 3) {
      warnings.push(`only ${locations.size} distinct location(s); the book never changes scene`)
    }
  }

  // Uneven pages now cost the whole book, not just one page.
  //
  // The reader picks ONE type size per book and it is set by the longest page,
  // so a single 45-word page drags every other page down with it: Nibs renders
  // at 24px on a phone while its shortest pages would carry 34. Twenty is tight
  // on purpose — this is the warning that protects how the book actually reads.
  const spread = words.length ? Math.max(...words) - Math.min(...words) : 0
  // The band's limit in strict mode, and a looser one otherwise. Per band
  // because the proportional cost differs enormously: a 12-word spread is
  // nothing across 55-word pages and is twice the whole target for a baby book.
  const spreadLimit = strict ? spec.spread : spec.spread + 8
  if (spread > spreadLimit) {
    const message =
      `word counts span ${spread} (${Math.min(...words)}-${Math.max(...words)}); the longest page sets ` +
      `the type size for the WHOLE book, so evening these out makes every page bigger`
    if (strict) errors.push(message)
    else warnings.push(message)
  }

  return {
    errors,
    warnings,
    stats: {
      band: spec.id,
      bandLabel: spec.label,
      ages: spec.agesLabel,
      pages: pages.length,
      minWords: words.length ? Math.min(...words) : 0,
      maxWords: words.length ? Math.max(...words) : 0,
      avgWords: words.length ? Math.round(words.reduce((a, b) => a + b, 0) / words.length) : 0,
      spread,
      // The band's own budget, so a reporter doesn't have to re-import the spec
      // to say what the numbers should have been.
      budget: { words: W, pages: P, spread: spec.spread },
    },
  }
}
