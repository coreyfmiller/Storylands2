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

/** Narration that tells the reader the moral instead of showing it. */
const PREACHY =
  /\b(the (?:lesson|moral) (?:is|was)|learned that (?:being|sharing|kindness)|remember(?:ed)? to always|it is important to|you should always|and that is why you)\b/i

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
export function validateBook({ book, refs = {}, bios = {} }) {
  const errors = []
  const warnings = []

  for (const field of ['id', 'title', 'subtitle', 'character', 'ages']) {
    if (!book?.[field] || typeof book[field] !== 'string') {
      errors.push(`book.${field} is missing`)
    }
  }
  if (book?.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(book.id)) {
    errors.push(`book.id "${book.id}" must be a kebab-case slug — it is also the reader route`)
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
    if (PREACHY.test(p.text)) {
      errors.push(`${where}: states the moral instead of showing it`)
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

  // Uneven pages now cost the whole book, not just one page.
  //
  // The reader picks ONE type size per book and it is set by the longest page,
  // so a single 45-word page drags every other page down with it: Nibs renders
  // at 24px on a phone while its shortest pages would carry 34. Twenty is tight
  // on purpose — this is the warning that protects how the book actually reads.
  const spread = words.length ? Math.max(...words) - Math.min(...words) : 0
  if (spread > 20) {
    warnings.push(
      `word counts span ${spread} (${Math.min(...words)}-${Math.max(...words)}); the longest page sets the type size for the WHOLE book, so evening these out makes every page bigger`,
    )
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
