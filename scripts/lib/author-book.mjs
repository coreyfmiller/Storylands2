// Author a complete Storylands book: prose and illustration manifests.
//
// Everything the steering files say about how a Storylands book works is encoded
// here as (a) instructions the model is held to and (b) a validator it has to
// satisfy. The model gets up to a few attempts; each failure comes back to it as
// a specific list of what to fix, so a 52-word page is repaired rather than
// re-rolled from scratch. If it still can't pass, nothing is written.
//
// The rules live in .kiro/steering/{product-standard,book-production,
// reader-layout,visual-consistency}.md. Those files are the source; this is a
// transcription aimed at a model. When they change, change this.

import { validateBook, DEFAULT_BAND } from './validate-book.mjs'
import { SHOT_KEYS, SHOT_TYPES, MAX_CONSECUTIVE, minimumDistinctShots } from './shot-types.mjs'
import { bandSpec } from '../../lib/bands.ts'

/**
 * The instructions, built for one band.
 *
 * This was a single `const SYSTEM` string with the 4-6 form written into it in
 * nine places: the opening line said "ages 4 to 7", the spine assumed a friend
 * who arrives to ask a question, the word budget was interpolated from the
 * validator's young-band constants, the framing rule said "at least
 * ${minimumDistinctShots(13)}" with a literal 13 regardless of the actual page
 * count, and the casting section demanded a second character who speaks on three
 * pages. Every one of those is right for a 4-6 story and wrong for a board book.
 *
 * So the prompt is assembled from the band spec, and the sections that only
 * apply to some bands are omitted rather than softened. Telling a model to write
 * eight pages of six words each AND give the second character an arrival beat
 * produces a confused board book, not a careful one.
 */
function systemFor(spec, pageCount) {
  const { words: W, requires: R } = spec
  const parts = []

  parts.push(
    `You are a leading author of children's picture books, writing for Storylands. This book is for ${spec.agesLabel}. You write warm, specific, funny, tender prose that a parent is happy to read aloud a second time. You never write anything generic, preachy, or that sounds machine-made.

You produce TWO things per page, together:
1. "text" — the read-aloud prose a parent says out loud.
2. "manifest" — the canonical description an illustrator (an image model) works from. It is not prose; it is a precise brief.`,
  )

  parts.push(`THE SHAPE OF THIS BOOK (${spec.agesLabel}, ${pageCount} pages):
${spec.spine}`)

  // The ending rules. The plot bands share one set; a board book has no want to
  // resolve and no change to show, so it gets its own.
  if (R.plot) {
    parts.push(`THE ENDING IS NON-NEGOTIABLE. The last page is what the child is left holding.
- Resolve the want plainly. Nothing ambiguous, nothing left hanging for a small child to worry about.
- End warm and hopeful. A wry or bittersweet closing line is NOT enough on its own at this age.
- Rest on the character we rooted for, not on a side character judging them.
- Show what changed. NEVER state the moral. Do not write "he learned that...", "the lesson is...", "it is important to...". If the growth is visible in what they do, the reader gets it.
- Look forward: the friendship continues, the thing grows, tomorrow is bright.`)
  } else {
    parts.push(`THE ENDING. Close on calm: sleep, a cuddle, or being carried in. Nothing is resolved because nothing went wrong. Do not add a lesson, a realisation, or a moral — there is no plot for one to attach to.`)
  }

  const prose = [
    `- ${W.min}-${W.max} words per page, hard ceiling ${W.ceiling}. Aim for about ${W.target}.`,
    `- At most ${spec.paragraphs} short paragraph${spec.paragraphs === 1 ? '' : 's'} per page.${spec.paragraphs > 1 ? ' Separate paragraphs with a blank line.' : ''}`,
    `- Keep page lengths within about ${spec.spread} words of each other. The reader sizes type to fit the LONGEST page and uses that size for the whole book, so one long page shrinks every other page.`,
    '- Read it aloud in your head. Rhythm matters more than vocabulary.',
    ...spec.proseNotes.map((n) => `- ${n}`),
  ]
  parts.push(`PROSE RULES (these are measured, and a book that breaks them is rejected):
${prose.join('\n')}`)

  if (R.refrain) {
    parts.push(`THE REFRAIN. This is the most important feature of a book for ${spec.agesLabel}.
- One line must repeat WORD FOR WORD on at least three pages. Identical. Not varied, not developed, not improved.
- It is how a child who cannot read takes part: they say it with you, and then they say it before you do.
- Varying it to keep it interesting for the adult defeats the entire purpose. Resist that.`)
  }

  // Framing. The vocabulary applies everywhere; the variety rules do not.
  const framing = [
    `HOW THE PAGES ARE FRAMED. Every page declares a shotType. The options:`,
    SHOT_KEYS.map((k) => `- ${k}: ${SHOT_TYPES[k]}`).join('\n'),
  ]
  if (R.shotVariety) {
    framing.push(
      `- Never more than ${MAX_CONSECUTIVE} of the same shotType in a row.`,
      `- Use at least ${minimumDistinctShots(pageCount)} different ones across these ${pageCount} pages.`,
      '- Match the shot to the beat: an establishing or wide shot to open, close shots for the moments that turn on a face, a detail shot when the object matters, twoShot when two characters are really together, high angle when the character feels small, low angle when they feel big. Do not just rotate through the list — choose each one.',
    )
  } else {
    framing.push(
      '- Repetition is CORRECT here. Mostly close and detail shots of one clear subject, the same way twice in a row if that is what the page wants. A board book is not trying to look cinematic.',
    )
  }
  parts.push(framing.join('\n'))

  if (R.secondCharacter) {
    parts.push(`HOW THE PAGES ARE CAST. This matters more than anything else on this page.
- The second character you are given is a REAL CHARACTER, not scenery. They have a name, they speak, they have their own view, and what they say changes what the hero does.
- They must be ABSENT from some pages and then ARRIVE. A friend who is simply always there cannot arrive, and the arrival is the beat the whole story turns on.
- They must speak out loud, in quotation marks, on at least ${R.dialoguePages} pages.
- Their big moment is a QUESTION, not advice. "When did you last actually see it?" is the model: it makes the hero realise something themselves rather than being told.
- Write them so they could carry their own book later. Give them one opinion and one habit of speech.`)
  } else if (R.dialoguePages > 0) {
    parts.push(`SPEECH. At least ${R.dialoguePages} pages carry a line in quotation marks. Keep the cast tiny — the lead, and at most one familiar face who helps rather than complicates.`)
  } else {
    parts.push(`SPEECH. There is no dialogue and no second character. The narrator speaks to the listener directly; the book is being read TO a baby, not performed as a scene.`)
  }

  if (R.plot) {
    parts.push(`WHAT NOT TO DO, taken from a real audit of the existing library:
- Do NOT end by explaining the story. Five of the seven existing books end on a sentence like "Rusty had learned something: kindness makes the whole world feel the right size", or "big dreams are just small splashes, one after another". Every one of those is the book stopping to tell the reader what it meant. The two books that do not do this are the two best ones.
- The last page shows the change through an action or an image, and stops. No "he learned", no "it turned out", no "that is why", no defining what brave or kind means.
- Do NOT make the companion a silent animal that glows or flutters nearby. Five books did exactly that.
- Give the book a REVERSAL: something the reader did not see coming, not just the hero quietly realising a truth. The best existing book works because the monster turns out to be useful.
- Earn at least one real laugh. Specific and physical, not whimsical.

PROSE TEXTURE:
${R.refrain ? '- Outside the refrain, vary how pages open.' : '- Do not start more than three pages with the same word. Starting five pages with the protagonist\'s name is a tic a reader hears.'}
- Every page needs a different emotionalBeat. A flat arc is ${pageCount} pages of "determined".
- The book should move through at least three distinct locations.
- No two pages should use the same shape of joke.`)
  }

  parts.push(`ILLUSTRATION RULES (also measured):
- The art is ${spec.artNote}
- Illustrations are ALWAYS TEXTLESS. No words, letters, numbers or titles in the picture, ever. All words live in the reader's text panel.
- Never stage a prop that only exists to be read: no sign, signpost, placard, plaque, poster, nameplate, menu, newspaper, price tag. Not even a blank one — a blank board looks like the art broke. Re-stage the beat wordlessly instead.
- A map, note or banner is allowed ONLY if you say explicitly that it carries no readable text (e.g. "a crude map with only scribbles and arrows, no readable text") AND you forbid letters on it.
- Every page's forbiddenVisualFacts MUST include both "any text, words, letters, numbers, or title in the image" and "any sign, signpost, board, placard, label, or plaque".
- The reader crops the sides of the art away on a narrow screen, so composition must keep the subject and all important detail centred with generous margin and headroom. Nothing important near a left or right edge.
- charactersPresent uses the given character ids exactly. Only ids you were given.
- The FINAL page must include the protagonist.`)

  parts.push(
    `Write the whole book as one piece of work: a real voice, and a premise nobody has used.`,
  )

  return parts.join('\n\n')
}

const manifestSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'charactersPresent',
    'location',
    'timeOfDay',
    'action',
    'emotionalBeat',
    'requiredVisualFacts',
    'forbiddenVisualFacts',
    'composition',
    'shotType',
  ],
  properties: {
    charactersPresent: {
      type: 'array',
      items: { type: 'string' },
      description: 'Character ids present, in the order their references should be supplied.',
    },
    location: { type: 'string' },
    timeOfDay: { type: 'string' },
    action: { type: 'string', description: 'What is happening, concretely and visually.' },
    emotionalBeat: { type: 'string' },
    requiredVisualFacts: { type: 'array', items: { type: 'string' } },
    forbiddenVisualFacts: { type: 'array', items: { type: 'string' } },
    composition: { type: 'string' },
    shotType: {
      type: 'string',
      enum: SHOT_KEYS,
      description: 'How this page is framed. Vary it across the book.',
    },
  },
}

const bookSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'title', 'subtitle', 'character', 'ages', 'minutes', 'pages'],
  properties: {
    id: { type: 'string', description: 'kebab-case slug; also the reader route' },
    title: { type: 'string' },
    subtitle: { type: 'string', description: 'One short line, sentence case, ending in a full stop.' },
    character: { type: 'string', description: 'The protagonist character id.' },
    ages: { type: 'string', description: 'The age range, e.g. "Ages 4–6".' },
    minutes: { type: 'number', description: 'Read-aloud minutes.' },
    pages: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['page', 'text', 'manifest'],
        properties: {
          page: { type: 'number' },
          text: { type: 'string' },
          manifest: manifestSchema,
        },
      },
    },
  },
}

/**
 * Describe the cast so the model can only use ids that have reference art.
 * A page naming a character with no reference cannot be illustrated at all.
 */
function castBrief(refs, bios) {
  return Object.keys(refs)
    .map((id) => `  - id "${id}": ${bios[id] || 'see reference art'}`)
    .join('\n')
}

function buildRequest({ slug, premise, character, refs, bios, pages, notes, spec }) {
  return `Write a complete Storylands picture book.

slug: ${slug}
character id: ${character}
pages: exactly ${pages} pages
audience: ${spec.agesLabel} (the ${spec.label} band)
ages field: "${spec.agesLabel}"
minutes field: ${spec.minutes}

The cast available to you, with the EXACT ids to use in charactersPresent:
${castBrief(refs, bios)}

Premise to build on:
${premise}
${notes ? `\nAdditional direction:\n${notes}\n` : ''}
Invent the plot, the setting and the gags. Follow the spine. Do not reuse a plot from any existing Storylands book (a squirrel hiding an acorn, a dragon who cannot breathe fire, a dog fighting a vacuum, a duckling crossing a lake, a raccoon camping in the backyard, a fox overwhelmed at a fair, an owl lighting the way home).

Return the book as JSON.`
}

function repairRequest(errors, warnings) {
  const lines = ['The book you returned was rejected. Fix exactly these problems and return the WHOLE book again as JSON.', '', 'Must fix:']
  for (const e of errors) lines.push(`  - ${e}`)
  if (warnings.length) {
    lines.push('', 'Worth fixing while you are there:')
    for (const w of warnings.slice(0, 8)) lines.push(`  - ${w}`)
  }
  lines.push(
    '',
    'Keep everything that was already good: the plot, the voice, the page order, the title. Change only what is needed to clear the problems above.',
  )
  return lines.join('\n')
}

/**
 * Normalise what came back. Page numbering and the `art` field are derived, so a
 * model getting them slightly wrong should not fail a good story.
 */
function normalise(raw, { slug, character, spec }) {
  const pages = (raw?.pages ?? []).map((p, i) => ({
    page: i + 1,
    text: String(p?.text ?? '').replace(/\r\n/g, '\n').trim(),
    art: '',
    manifest: {
      charactersPresent: p?.manifest?.charactersPresent ?? [],
      location: p?.manifest?.location ?? '',
      timeOfDay: p?.manifest?.timeOfDay ?? '',
      action: p?.manifest?.action ?? '',
      emotionalBeat: p?.manifest?.emotionalBeat ?? '',
      requiredVisualFacts: p?.manifest?.requiredVisualFacts ?? [],
      forbiddenVisualFacts: p?.manifest?.forbiddenVisualFacts ?? [],
      composition: p?.manifest?.composition ?? '',
      shotType: p?.manifest?.shotType,
    },
  }))
  return {
    id: slug,
    title: String(raw?.title ?? '').trim(),
    subtitle: String(raw?.subtitle ?? '').trim(),
    character,
    // Both of these fall back to the BAND's values rather than to a hardcoded
    // "Ages 4+" and 6 minutes, which is what a baby book used to inherit by
    // default — a 2-minute board book labelled as a 6-minute 4+ story.
    ages: String(raw?.ages ?? spec.agesLabel).trim(),
    minutes: Number(raw?.minutes) || spec.minutes,
    band: spec.id,
    pages,
  }
}

/**
 * Author a book, validating and repairing until it passes.
 *
 * @returns {Promise<{ book: object, attempts: number, warnings: string[] }>}
 */
export async function authorBook({
  provider,
  slug,
  premise,
  character,
  refs,
  bios,
  band = DEFAULT_BAND,
  pages,
  notes,
  maxAttempts = 3,
  strict = true,
  onAttempt,
}) {
  const spec = bandSpec(band)
  // The band's own target when no page count is given, not a global 13 — an
  // 8-page board book and a 16-page 6-8 book are both correct defaults for their
  // band, and 13 is correct for neither.
  const pageCount = pages ?? spec.pages.target
  if (pageCount < spec.pages.min || pageCount > spec.pages.max) {
    throw new Error(
      `pages must be ${spec.pages.min}-${spec.pages.max} for a ${spec.label} book (${spec.agesLabel}), got ${pageCount}`,
    )
  }
  if (!refs[character]) {
    throw new Error(
      `"${character}" has no reference art. Add it to CHARACTER_REFS (assets/characters/) before authoring — a character with no reference cannot be drawn on-model.`,
    )
  }

  const system = systemFor(spec, pageCount)
  const request = () =>
    buildRequest({ slug, premise, character, refs, bios, pages: pageCount, notes, spec })

  let user = request()
  let last = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    onAttempt?.(attempt, maxAttempts)
    const raw = await provider.generateJSON({
      system,
      user,
      schema: bookSchema,
      schemaName: 'storylands_book',
      maxOutputTokens: 32000,
    })
    const book = normalise(raw, { slug, character, spec })
    const { errors, warnings } = validateBook({ book, refs, bios, strict, band })
    last = { book, errors, warnings }

    if (errors.length === 0) return { book, attempts: attempt, warnings }

    onAttempt?.(attempt, maxAttempts, errors)
    // Carry the rejected book forward so the repair pass edits it rather than
    // starting again and losing a plot that was mostly working.
    user = `${request()}

You previously returned this, which was rejected:
${JSON.stringify(book)}

${repairRequest(errors, warnings)}`
  }

  const detail = last.errors.map((e) => `  - ${e}`).join('\n')
  throw new Error(
    `Could not produce a valid book in ${maxAttempts} attempts. Remaining problems:\n${detail}`,
  )
}
