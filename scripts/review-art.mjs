// Look at every illustration and check it against its own manifest.
//
// This was the last step in the pipeline still done entirely by eye:
// visual-consistency.md asks for each page to be confirmed on-model, with its
// required facts present, nothing forbidden, and no text or signage — thirteen
// images per book, every book. Nobody does that reliably on the fifth book.
//
// Art is roughly 95% of what a book costs to make, so catching a bad page before
// a person re-rolls it by hand is where both the money and the consistency are.
//
// Run:
//   node scripts/review-art.mjs --book <slug>
//   node scripts/review-art.mjs --all
//   node scripts/review-art.mjs --book <slug> --only 5,7
//
// It never deletes or regenerates anything. It prints a verdict per page and the
// exact command to re-roll the ones that failed.

import { readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { loadBook, bookSlugs, PUBLIC_DIR, ASSETS_DIR } from './lib/book-source.mjs'
import { loadEnv } from './lib/load-env.mjs'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const value = (n) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : undefined
}

const MODEL = process.env.OPENAI_VISION_MODEL || 'gpt-6.1-sol'
const ONLY = value('only')
  ? new Set(String(value('only')).split(',').map((n) => parseInt(n, 10)))
  : null

const SYSTEM = `You are a picture-book art director checking a finished illustration against the brief it was drawn from. You are strict and specific. You are looking for problems a four-year-old's parent would notice.

Judge only what you can SEE. Do not speculate about intent.

The hard rules, in order of how badly they hurt:
1. NO TEXT. No letters, words, numbers, titles, or lettering on any object.
   Be precise about what text IS. Letters and digits are text. These are NOT text and must not be reported as text: an X or cross mark, an arrow, a tick, a dot, a swirl, a stitch, a scratch, a crack, a leaf vein, a decorative pattern, a pictogram or simple drawn symbol. A hand-drawn map made of X marks, arrows and little pictures of objects is wordless and correct. Only flag this if you can actually read a letter or a number.
2. NO SIGNAGE. No sign, signpost, board, placard, plaque or nameplate, not even a blank one — a blank board looks like the art failed to render.
3. ON-MODEL. The character must match the reference image given to you: same species, same fur or feather colour and pattern, same eyes, same proportions, same apparent age, same clothing or accessory if it has one.
4. NOTHING CLIPPED. This image is already the final crop; the reader displays it as-is and will not cut it further. So judge what you can see: is any important thing — a head, an ear, a paw, a tail, the key action — cut off by the edge of this picture, or jammed so tight against an edge that it looks like an accident? A subject deliberately running out of frame for composition is fine; a head with its top sliced off is not.
5. THE BRIEF. The required facts should be present and the forbidden ones absent.

Be concise. One short sentence per problem.`

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'hasText', 'hasSignage', 'onModel', 'safeArea', 'problems', 'note'],
  properties: {
    verdict: {
      type: 'string',
      enum: ['pass', 'reroll'],
      description: 'reroll if any hard rule is broken',
    },
    hasText: { type: 'boolean', description: 'any letters, words or numbers visible' },
    hasSignage: { type: 'boolean', description: 'any sign, board, placard or plaque' },
    onModel: { type: 'boolean', description: 'character matches the reference' },
    safeArea: {
      type: 'boolean',
      description: 'true when nothing important is clipped or jammed against an edge',
    },
    problems: { type: 'array', items: { type: 'string' } },
    note: { type: 'string', description: 'one short line on what the picture shows' },
  },
}

function key() {
  const k = process.env.OPENAI_API_KEY
  if (!k) throw new Error('OPENAI_API_KEY is not set (put it in .env.local).')
  return k
}

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function dataUrl(absPath) {
  const buf = await readFile(absPath)
  const ext = path.extname(absPath).toLowerCase()
  const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  return `data:${mime};base64,${buf.toString('base64')}`
}

async function reviewPage({ page, artPath, refPaths, bios }) {
  const m = page.manifest
  const brief = [
    `Required: ${m.requiredVisualFacts.join('; ')}.`,
    `Forbidden: ${m.forbiddenVisualFacts.join('; ')}.`,
    `Intended scene: ${m.action}.`,
    `Setting: ${m.location}, ${m.timeOfDay}.`,
    m.shotType ? `Intended framing: ${m.shotType}.` : '',
    `Characters who should appear: ${m.charactersPresent
      .map((c) => `${c} (${bios[c] ?? 'see reference'})`)
      .join('; ')}.`,
  ]
    .filter(Boolean)
    .join('\n')

  const content = [
    { type: 'input_text', text: `The brief this was drawn from:\n${brief}` },
    {
      type: 'input_text',
      text: 'The finished illustration, exactly as a child sees it — this is the final crop and nothing further is cut:',
    },
    { type: 'input_image', image_url: await dataUrl(artPath) },
  ]
  for (const ref of refPaths) {
    content.push({ type: 'input_text', text: 'The approved character reference:' })
    content.push({ type: 'input_image', image_url: await dataUrl(ref) })
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      input: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content },
      ],
      text: { format: { type: 'json_schema', name: 'art_review', strict: true, schema } },
      max_output_tokens: 4000,
    }),
  })
  if (!res.ok) throw new Error(`vision ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const json = await res.json()
  let text = typeof json?.output_text === 'string' ? json.output_text : ''
  if (!text) {
    for (const item of json?.output ?? []) {
      for (const c of item?.content ?? []) if (typeof c?.text === 'string') text += c.text
    }
  }
  return JSON.parse(text)
}

async function reviewBook(slug) {
  const { book, refs, bios } = await loadBook(slug)
  const pages = book.pages.filter((p) => !ONLY || ONLY.has(p.page))
  const bad = []

  console.log(`\n${slug}: ${book.title} — reviewing ${pages.length} page(s)`)

  for (const page of pages) {
    const artPath = path.join(PUBLIC_DIR, page.art)
    if (!(await exists(artPath))) {
      console.log(`  page ${page.page}: no art on disk, skipped`)
      continue
    }
    const refPaths = []
    for (const c of page.manifest.charactersPresent) {
      const rel = refs[c]
      if (rel && (await exists(path.join(ASSETS_DIR, rel)))) {
        refPaths.push(path.join(ASSETS_DIR, rel))
      }
    }

    try {
      const r = await reviewPage({ page, artPath, refPaths, bios })
      const flags = [
        r.hasText ? 'TEXT' : '',
        r.hasSignage ? 'SIGNAGE' : '',
        !r.onModel ? 'OFF-MODEL' : '',
        !r.safeArea ? 'CLIPPED' : '',
      ].filter(Boolean)

      if (r.verdict === 'reroll' || flags.length) {
        bad.push(page.page)
        console.log(`  page ${page.page}: REROLL  ${flags.join(' ')}`)
        for (const p of r.problems.slice(0, 4)) console.log(`      ${p}`)
      } else {
        console.log(`  page ${page.page}: pass    ${r.note.slice(0, 70)}`)
      }
    } catch (e) {
      console.error(`  page ${page.page}: review failed — ${String(e.message).slice(0, 160)}`)
    }
  }

  if (bad.length) {
    console.log(
      `\n${slug}: ${bad.length} page(s) to re-roll:\n` +
        `  node scripts/generate-book.mjs --book ${slug} --force --only ${bad.join(',')}\n` +
        `  node scripts/optimize-books.mjs --prune`,
    )
  } else {
    console.log(`${slug}: every reviewed page passes`)
  }
  return bad.length
}

async function main() {
  await loadEnv()
  const slugs = flag('all') ? await bookSlugs() : [value('book')].filter(Boolean)
  if (slugs.length === 0) {
    console.error('Which book? Pass --book <slug> or --all.')
    console.error(`Available: ${(await bookSlugs()).join(', ')}`)
    process.exit(1)
  }
  console.log(`Reviewer: ${MODEL}`)
  let total = 0
  for (const slug of slugs) total += await reviewBook(slug)
  console.log(total === 0 ? '\nNothing to re-roll.' : `\n${total} page(s) flagged in total.`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
