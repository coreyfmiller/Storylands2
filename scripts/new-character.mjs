// Create a new cast member: a visual bible and an approved reference sheet.
//
// This was the hard limit on the whole engine. `create-book.mjs` refuses a
// character with no approved reference art — correctly, because a character
// cannot be drawn on-model without one — and nothing existed to make that
// reference. So the engine could only ever write for the eight characters that
// already had one, and "introduce a new friend" was not a thing it could do.
//
// Two steps, because a character is a commitment: every future book has to draw
// them identically.
//
//   1. --describe   writes the visual bible (invariants: the facts that must
//                   never change) and nothing else. Free. Read it, edit it.
//   2. --sheet      generates candidate reference sheets from that bible.
//                   You pick one. That file becomes the master every page of
//                   every book is seeded with.
//
// Run:
//   node scripts/new-character.mjs --id mo --describe "a small shy hedgehog who collects lost things"
//   node scripts/new-character.mjs --id mo --sheet --candidates 3
//   node scripts/new-character.mjs --id mo --approve 2
//
// A new character is only usable once --approve has run, which is what puts the
// file in assets/characters/ and the bio where books can import it.

import { readFile, writeFile, mkdir, access, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from './lib/load-env.mjs'
import { getTextProvider, getImageProvider } from './lib/provider.mjs'
import { loadAllBooks, ASSETS_DIR, ROOT } from './lib/book-source.mjs'
import { STYLE } from './lib/compile-prompt.mjs'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const value = (n) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : undefined
}

const ID = value('id')
const CANDIDATES = Number(value('candidates') ?? 3)
const BIBLE_DIR = path.join(ROOT, 'assets', 'characters', 'bibles')
const DRAFT_DIR = path.join(ROOT, 'assets', 'characters', 'drafts')

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

const SYSTEM = `You design characters for Storylands, a library of illustrated picture books for ages 4 to 7.

A character is drawn hundreds of times by an image model seeded with one reference picture. So your job is to decide the small number of facts that must NEVER vary, and to make them concrete enough that a drawing either obeys them or visibly does not.

Rules:
- Pick a real animal species and stay within it. "A fluffy creature" is undrawable.
- Invariants must be checkable by looking: colours, markings, the shape of the ears, the number of horns, the one accessory. Not "friendly" or "curious".
- Exactly ONE accessory or garment at most, and it must be simple. Every extra item is a thing that will drift between pages.
- NEVER an accessory that carries words: no labelled collar, no name tag, no badge with writing. Illustrations in this library are textless.
- Give them one physical habit an illustrator can draw (how they hold their paws, what their tail does when they are pleased).
- The bio line is what goes into every image prompt. It must be one sentence, dense with visual facts, and read like the existing cast:
  "Rusty, a cute young red fox: bright orange-red fur with a white/cream muzzle, chest and belly, black socks on all four legs, big black-backed pointed ears with fluffy insides, a huge bushy orange tail with a white tip, big warm brown eyes, freckles across the muzzle and a friendly toothy grin; he wears a red bandana with a small white maple leaf around his neck"
- They must be clearly distinct from the existing cast you are shown. A second red fox is a mistake.`

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'name', 'species', 'bio', 'invariants', 'forbidden', 'habit', 'personality'],
  properties: {
    id: { type: 'string', description: 'lowercase, no spaces; used in charactersPresent' },
    name: { type: 'string' },
    species: { type: 'string' },
    bio: { type: 'string', description: 'The one-sentence prompt line. Dense with visual facts.' },
    invariants: {
      type: 'array',
      items: { type: 'string' },
      description: 'Facts that must never change between drawings.',
    },
    forbidden: {
      type: 'array',
      items: { type: 'string' },
      description: 'Drift to rule out on every page, e.g. "a different ear shape".',
    },
    habit: { type: 'string', description: 'One drawable physical habit.' },
    personality: { type: 'string', description: 'Two or three words, for story briefs.' },
  },
}

async function describe() {
  const premise = value('describe')
  if (!premise) throw new Error('Pass --describe "a short idea for the character"')

  const all = await loadAllBooks()
  const cast = {}
  for (const b of all) Object.assign(cast, b.bios)

  const provider = getTextProvider(value('text-provider'))
  console.log(`Designer: ${provider.name} / ${provider.model}`)

  const result = await provider.generateJSON({
    system: SYSTEM,
    user: `Design a new Storylands character.

The idea: ${premise}
${ID ? `Use the id "${ID}".` : ''}

The existing cast, which this character must be clearly distinct from:
${Object.entries(cast)
  .map(([id, bio]) => `- ${id}: ${bio}`)
  .join('\n')}

Return the character as JSON.`,
    schema,
    schemaName: 'character',
    maxOutputTokens: 8000,
  })

  if (ID) result.id = ID
  await mkdir(BIBLE_DIR, { recursive: true })
  const file = path.join(BIBLE_DIR, `${result.id}.json`)
  await writeFile(file, `${JSON.stringify(result, null, 2)}\n`, 'utf8')

  console.log(`\n${result.name} — ${result.species}`)
  console.log(`  id: ${result.id}`)
  console.log(`  personality: ${result.personality}`)
  console.log(`  habit: ${result.habit}`)
  console.log(`\n  bio:\n    ${result.bio}`)
  console.log(`\n  invariants:`)
  for (const i of result.invariants) console.log(`    - ${i}`)
  console.log(`\nwrote assets/characters/bibles/${result.id}.json`)
  console.log(
    `\nRead it, edit it by hand if you want, then:\n  node scripts/new-character.mjs --id ${result.id} --sheet`,
  )
}

/**
 * A reference sheet, not a scene.
 *
 * Plain background, full body, neutral pose, no props. Everything the image
 * model sees in this picture it will carry into every page, so a sheet with a
 * forest behind it quietly makes the character a forest character.
 */
function sheetPrompt(c) {
  return [
    STYLE.replace(
      /Full-bleed HORIZONTAL composition[^.]*\./,
      'A clean character reference sheet, not a scene.',
    ),
    `Draw ${c.bio}.`,
    `Pose: standing upright, full body visible head to foot, facing the viewer, relaxed and friendly, ${c.habit}.`,
    'Background: a plain, flat, pale neutral background. Nothing else in the picture at all.',
    `Must include: ${c.invariants.join('; ')}.`,
    `Must NOT include: any text, words, letters, numbers, or title in the image; any sign, signpost, board, placard, label, or plaque; any prop, scenery, furniture or other character; ${c.forbidden.join('; ')}.`,
    'This image defines the character for every future drawing, so every detail must be clear, well lit and unambiguous.',
  ].join(' ')
}

async function sheet() {
  if (!ID) throw new Error('Pass --id <id>')
  const biblePath = path.join(BIBLE_DIR, `${ID}.json`)
  if (!(await exists(biblePath))) {
    throw new Error(`No bible for "${ID}". Run --describe first.`)
  }
  const c = JSON.parse(await readFile(biblePath, 'utf8'))

  const provider = getImageProvider(value('image-provider'))
  console.log(`Images: ${provider.name} / ${provider.model}`)
  await mkdir(DRAFT_DIR, { recursive: true })

  const prompt = sheetPrompt(c)
  if (flag('dry-run')) {
    console.log(`\n${prompt}\n\nDry run: nothing generated.`)
    return
  }

  for (let i = 1; i <= CANDIDATES; i++) {
    const out = path.join(DRAFT_DIR, `${ID}-${i}.png`)
    process.stdout.write(`candidate ${i}/${CANDIDATES} ... `)
    try {
      // No reference to seed with — this IS the first one. Text-to-image.
      const { b64 } = await provider.generateImage({
        prompt,
        referencePaths: [],
        aspectRatio: '2:3',
      })
      await writeFile(out, Buffer.from(b64, 'base64'))
      console.log('OK')
    } catch (e) {
      console.log(`FAILED — ${String(e.message).slice(0, 160)}`)
    }
  }

  console.log(
    `\nCandidates in assets/characters/drafts/. Open them and pick one:\n` +
      `  node scripts/new-character.mjs --id ${ID} --approve <n>\n` +
      `\nReject all of them if none is exactly on-model. This file is the character ` +
      `forever, and a sheet that is nearly right makes every page nearly right.`,
  )
}

async function approve() {
  if (!ID) throw new Error('Pass --id <id>')
  const n = Number(value('approve'))
  const draft = path.join(DRAFT_DIR, `${ID}-${n}.png`)
  if (!(await exists(draft))) throw new Error(`No candidate at ${draft}`)

  const biblePath = path.join(BIBLE_DIR, `${ID}.json`)
  const c = JSON.parse(await readFile(biblePath, 'utf8'))

  const master = path.join(ASSETS_DIR, 'characters', `${ID}.png`)
  await copyFile(draft, master)
  c.approved = { candidate: n, at: new Date().toISOString() }
  await writeFile(biblePath, `${JSON.stringify(c, null, 2)}\n`, 'utf8')

  console.log(`approved candidate ${n} -> assets/characters/${ID}.png`)
  console.log(`\nTwo things left, both by hand:`)
  console.log(`  1. Add to the CHARACTER_REFS and CHARACTER_BIOS of any book using ${ID}:`)
  console.log(`       ${ID}: 'characters/${ID}.png',`)
  console.log(`       ${ID}:\n         '${c.bio}',`)
  console.log(`  2. If ${ID} is a book's protagonist, they need a cover:`)
  console.log(`       copy the sheet to public/characters/${ID}.png and run: node scripts/optimize-art.mjs`)
  console.log(`\nThen: node scripts/create-book.mjs --character <lead> --with ${ID} --premise "..."`)
}

async function main() {
  await loadEnv()
  if (value('describe')) return describe()
  if (flag('sheet')) return sheet()
  if (value('approve')) return approve()

  console.error('One of: --describe "<idea>" | --sheet | --approve <n>')
  console.error('Always with --id <id> after the first step.')
  process.exit(1)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
