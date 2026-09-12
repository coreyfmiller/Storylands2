// Generate one illustration per page for a Storylands book.
// Prompt is DERIVED from each page's manifest. Seeds every call with the present
// characters' reference PNGs (this is the consistency strategy). Resumable: skips pages
// whose art already exists unless --force. Per-page failures are isolated.
//
// Run: node scripts/generate-book.mjs                         (Story Zero, missing pages)
//      node scripts/generate-book.mjs --book oliver-vacuum    (a specific book)
//      node scripts/generate-book.mjs --book oliver-vacuum --force
//      node scripts/generate-book.mjs --book oliver-vacuum --only 6,7
//
// Reads books/<book-id>/pages.mjs (must export `pages` and `CHARACTER_REFS`; may export
// `CHARACTER_BIOS`) and writes public/books/<book-id>/pages/page-NN.png.

import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { generateFromReferences, DEFAULT_IMAGE_MODEL } from './lib/openai-image.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const onlyIdx = args.indexOf('--only')
const ONLY = onlyIdx >= 0 ? new Set((args[onlyIdx + 1] || '').split(',').map((n) => parseInt(n, 10))) : null

// --book <id> selects which book to generate. Defaults to Story Zero for backward compat.
const bookIdx = args.indexOf('--book')
const BOOK_ID = bookIdx >= 0 ? args[bookIdx + 1] : 'nibs-perfect-acorn'

const OUT = path.join(PUBLIC, 'books', BOOK_ID, 'pages')
const manifestPath = path.join(ROOT, 'books', BOOK_ID, 'pages.mjs')
const manifestModule = await import(pathToFileURL(manifestPath).href)
const { pages, CHARACTER_REFS } = manifestModule

async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
    }
  } catch {}
}

// Shared style so every page reads like the same book. Style is carried mostly by the
// reference images; this reinforces it and enforces the textless / 9:16 rules.
const STYLE = [
  'Warm, hand-crafted storybook illustration for a childrens picture book (ages 4-7).',
  'Rich but gentle color, soft natural light, expressive and characterful.',
  'Full-bleed vertical 9:16 composition.',
  'IMPORTANT: absolutely NO text, letters, words, numbers, titles, or signage lettering anywhere in the image.',
  'Keep every character EXACTLY on-model with its provided reference image: same species, same fur/feather color and pattern, same eyes, same proportions, same apparent age.',
].join(' ')

// Optional per-book character descriptions (id -> short on-model line). Books may export
// CHARACTER_BIOS from pages.mjs; if absent we fall back to a generic instruction.
const BIOS = manifestModule.CHARACTER_BIOS || {}

function compilePrompt(m) {
  const ordinals = ['FIRST', 'SECOND', 'THIRD', 'FOURTH']
  const who =
    m.charactersPresent.length > 1
      ? m.charactersPresent
          .map((c, i) => {
            const bio = BIOS[c] || `${c}, exactly as in the reference image`
            return `The ${ordinals[i] || 'next'} reference image is ${bio}.`
          })
          .join(' ') + ' Draw EACH character exactly on-model with its own reference image.'
      : `The reference image is ${BIOS[m.charactersPresent[0]] || m.charactersPresent[0] + ', exactly as in the reference'}. Draw it exactly on-model with the reference.`
  return [
    STYLE,
    who,
    `Scene: ${m.action}.`,
    `Setting: ${m.location}, ${m.timeOfDay}.`,
    `Mood: ${m.emotionalBeat}.`,
    `Must include: ${m.requiredVisualFacts.join('; ')}.`,
    `Must NOT include: ${m.forbiddenVisualFacts.join('; ')}.`,
    `Composition: ${m.composition}.`,
  ].join(' ')
}

async function exists(p) {
  try { await access(p); return true } catch { return false }
}

async function main() {
  await loadEnv()
  await mkdir(OUT, { recursive: true })
  console.log(`Model: ${DEFAULT_IMAGE_MODEL}`)

  const results = []
  for (const m of pages) {
    if (ONLY && !ONLY.has(m.page)) continue
    const name = `page-${String(m.page).padStart(2, '0')}.png`
    const outPath = path.join(OUT, name)
    if (!FORCE && (await exists(outPath))) {
      console.log(`page ${m.page}: exists, skip`)
      results.push({ page: m.page, status: 'skip' })
      continue
    }
    const refs = m.charactersPresent.map((c) => path.join(PUBLIC, CHARACTER_REFS[c]))
    const prompt = compilePrompt(m)
    process.stdout.write(`page ${m.page}: generating (${m.charactersPresent.join('+')}) ... `)
    try {
      const { b64 } = await generateFromReferences({ prompt, referencePaths: refs, size: '1024x1536' })
      await writeFile(outPath, Buffer.from(b64, 'base64'))
      console.log('OK')
      results.push({ page: m.page, status: 'ok' })
    } catch (e) {
      console.log('FAILED')
      console.error('  ' + String(e.message || e))
      results.push({ page: m.page, status: 'fail', error: String(e.message || e) })
    }
  }

  const ok = results.filter((r) => r.status === 'ok').length
  const skip = results.filter((r) => r.status === 'skip').length
  const fail = results.filter((r) => r.status === 'fail')
  console.log(`\nGenerated ${ok}, skipped ${skip}, failed ${fail.length}.`)
  if (fail.length) console.log('Failed pages: ' + fail.map((f) => f.page).join(', '))
}

main().catch((e) => { console.error(e); process.exit(1) })
