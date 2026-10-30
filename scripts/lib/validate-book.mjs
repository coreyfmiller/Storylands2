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

/** reader-layout.md: target ~35 words, comfortable band 18-45, hard ceiling 50. */
export const WORD_CEILING = 50
export const WORD_TARGET_MIN = 18
export const WORD_TARGET_MAX = 45
export const PARAGRAPH_CEILING = 3

/** book-production.md: ~12-16 textless pages. */
export const MIN_PAGES = 12
export const MAX_PAGES = 16

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

/**
 * Minimum pages carrying a spoken line.
 *
 * Dialogue is what a parent performs out loud, and it is most of why a book gets
 * asked for twice. Five of the seven existing books have one or two spoken lines
 * in thirteen pages; Nibs, which has the most, is the best of them.
 *
 * Set at three rather than four on purpose. Oliver vs. The Vacuum has NO
 * dialogue at all and is one of the two best books in the library — it works as
 * a comic narrator monologue, which is a real picture-book form. So this rule is
 * not "dialogue makes a book good".
 *
 * It is here because the strict bar exists to produce SERIES-capable books, and
 * a series needs a cast: a named second character who turns up, says something,
 * and could come back. Oliver's form cannot do that, which is why Oliver is a
 * fine book and is not the model for what comes next.
 */
const MIN_DIALOGUE_PAGES = 3

/**
 * How even the pages have to be, in strict mode.
 *
 * The reader picks ONE type size per book, set by the longest page, so an uneven
 * book renders small throughout. Nibs spans 27 words and reads at 24px where it
 * could read at 34.
 */
const STRICT_SPREAD = 12

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
export function validateBook({ book, refs = {}, bios = {}, strict = false }) {
  const errors = []
  const warnings = []
  /** In strict mode a shortfall blocks; otherwise it is advice. */
  const fail = (message) => (strict ? errors : warnings).push(message)

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
    const aphorism =
      /\b(?:begins with|starts with|is just|are just|goes a long way|makes? (?:the|a) (?:whole |bigger |world))\b/i.exec(
        book.subtitle,
      )
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
  if (pages.length < MIN_PAGES || pages.length > MAX_PAGES) {
    errors.push(`${pages.length} pages; a Storylands book is ${MIN_PAGES}-${MAX_PAGES}`)
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

    if (w > WORD_CEILING) {
      errors.push(`${where}: ${w} words, ceiling is ${WORD_CEILING} — split it into two pages`)
    } else if (w > WORD_TARGET_MAX) {
      warnings.push(`${where}: ${w} words, above the comfortable band of ${WORD_TARGET_MAX}`)
    } else if (w < WORD_TARGET_MIN) {
      warnings.push(`${where}: ${w} words, below the comfortable band of ${WORD_TARGET_MIN}`)
    }
    if (para > PARAGRAPH_CEILING) {
      errors.push(`${where}: ${para} paragraphs, ceiling is ${PARAGRAPH_CEILING}`)
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

    const preachy = preachyHit(p.text)
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
    for (const [i, shot] of shots.entries()) {
      if (shot && !SHOT_KEYS.includes(shot)) {
        errors.push(`page ${i + 1}: unknown shotType "${shot}". One of: ${SHOT_KEYS.join(', ')}`)
      }
    }
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
  for (const [word, n] of Object.entries(openers)) {
    if (n > OPENER_LIMIT) {
      fail(`${n} pages open with "${word}"; vary the sentence openings`)
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

    // Dialogue, counted by pages that contain a spoken line.
    const spoken = (p) => /[\u201c"][^\u201d"]{3,}[\u201d"]/.test(p.text)
    const speaking = pages.filter(spoken).length
    if (speaking < MIN_DIALOGUE_PAGES) {
      errors.push(
        `only ${speaking} page(s) carry a spoken line; at least ${MIN_DIALOGUE_PAGES} should — a series needs a cast that talks`,
      )
    }

    // The second character has to actually say something on a page they are on.
    // Present-but-silent is how the existing books ended up with a glow-moth
    // instead of a friend.
    for (const c of present) {
      const theirPages = pages.filter((p) => (p.manifest?.charactersPresent ?? []).includes(c))
      if (!theirPages.some(spoken)) {
        errors.push(
          `"${c}" never speaks on any page they appear on; a silent companion cannot ask the question the spine turns on`,
        )
      }
    }
  }

  const beats = pages.map((p) => String(p.manifest?.emotionalBeat ?? '').toLowerCase().trim())
  const distinctBeats = new Set(beats.filter(Boolean)).size
  if (beats.length >= 12 && distinctBeats < Math.ceil(beats.length * 0.6)) {
    warnings.push(
      `only ${distinctBeats} distinct emotional beats across ${beats.length} pages; the arc is flat`,
    )
  }

  const locations = new Set(
    pages.map((p) => String(p.manifest?.location ?? '').toLowerCase().trim()).filter(Boolean),
  )
  if (pages.length >= 12 && locations.size < 3) {
    warnings.push(
      `only ${locations.size} distinct location(s); the book never changes scene`,
    )
  }

  // Uneven pages now cost the whole book, not just one page.
  //
  // The reader picks ONE type size per book and it is set by the longest page,
  // so a single 45-word page drags every other page down with it: Nibs renders
  // at 24px on a phone while its shortest pages would carry 34. Twenty is tight
  // on purpose — this is the warning that protects how the book actually reads.
  const spread = words.length ? Math.max(...words) - Math.min(...words) : 0
  const spreadLimit = strict ? STRICT_SPREAD : 20
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
      pages: pages.length,
      minWords: words.length ? Math.min(...words) : 0,
      maxWords: words.length ? Math.max(...words) : 0,
      avgWords: words.length ? Math.round(words.reduce((a, b) => a + b, 0) / words.length) : 0,
      spread,
    },
  }
}
