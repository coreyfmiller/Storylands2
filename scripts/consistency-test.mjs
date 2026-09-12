// Consistency test: does Nibs stay Nibs across generations, and hold up with a second
// character (Tilly) in-frame? Seeds every call with the character PNG references.
//
// Run:  node scripts/consistency-test.mjs
// Output: public/consistency-test/*.png  (viewable at /consistency-test/<file> when dev runs)

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateFromReferences, DEFAULT_IMAGE_MODEL } from './lib/openai-image.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CHARS = path.join(ROOT, 'public', 'characters')
const OUT = path.join(ROOT, 'public', 'consistency-test')

// Minimal .env.local loader (no dependency).
async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
    }
  } catch {}
}

// Shared style guidance so all outputs read like the same book.
const STYLE = [
  'Warm, hand-crafted storybook illustration for a picture book (ages 6-9).',
  'Soft painterly rendering, rich but restrained color, gentle natural light.',
  'Full-bleed 9:16 vertical composition. NO text, NO title, NO lettering anywhere in the image.',
  'Keep the character exactly on-model with the provided reference: same species, same fur color and pattern, same tail, same eyes, same proportions and apparent age.',
].join(' ')

const NIBS_SCENE =
  `${STYLE} The reference image shows Nibs, a small red-orange squirrel with a large fluffy tail and big brown expressive eyes. ` +
  `Draw Nibs outdoors in a woodland clearing at golden late-afternoon light, carefully burying a single acorn beneath a crooked tree root, ` +
  `looking very serious and focused, as if performing an important secret task. Nibs is the same character as the reference.`

const NIBS_TILLY_SCENE =
  `${STYLE} The FIRST reference image is Nibs, a small red-orange squirrel with a large fluffy tail. ` +
  `The SECOND reference image is Tilly, a small brown owl with large amber eyes and tufted ears. ` +
  `Draw BOTH characters together in the same woodland clearing: Nibs crouched by a crooked tree root pointing at the ground, ` +
  `Tilly perched on a low branch beside him tilting her head with a curious, gently skeptical expression. ` +
  `Keep Nibs and Tilly each exactly on-model with their own reference. Tilly (owl) is roughly the same height as Nibs (squirrel). ` +
  `Consistent single storybook art style across both characters.`

async function saveB64(name, b64) {
  await writeFile(path.join(OUT, name), Buffer.from(b64, 'base64'))
}

async function main() {
  await loadEnv()
  await mkdir(OUT, { recursive: true })
  const nibs = path.join(CHARS, 'nibs.png')
  const tilly = path.join(CHARS, 'Tilly.png')

  console.log(`Model: ${DEFAULT_IMAGE_MODEL}`)
  const jobs = [
    { name: 'nibs-acorn-1.png', prompt: NIBS_SCENE, refs: [nibs] },
    { name: 'nibs-acorn-2.png', prompt: NIBS_SCENE, refs: [nibs] },
    { name: 'nibs-acorn-3.png', prompt: NIBS_SCENE, refs: [nibs] },
    { name: 'nibs-tilly.png', prompt: NIBS_TILLY_SCENE, refs: [nibs, tilly] },
  ]

  for (const job of jobs) {
    process.stdout.write(`Generating ${job.name} ... `)
    try {
      const { b64 } = await generateFromReferences({
        prompt: job.prompt,
        referencePaths: job.refs,
        size: '1024x1536',
      })
      await saveB64(job.name, b64)
      console.log('OK')
    } catch (e) {
      console.log('FAILED')
      console.error('  ' + String(e.message || e))
    }
  }
  console.log(`\nDone. Files in: public/consistency-test/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
