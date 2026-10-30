// Create a Storylands book from a premise.
//
// This is the thing Storylands was supposed to be: you give it a character and
// an idea, and it writes the story, briefs every illustration, checks its own
// work against the product standard, and wires the result into the app. Until
// now the prose and all thirteen illustration manifests were written by hand,
// and only the images were automated.
//
// Run:
//   node scripts/create-book.mjs --character pip --premise "Pip tries to bake a cake for the festival"
//   node scripts/create-book.mjs --character nibs --slug nibs-winter-store --pages 14 --premise "..."
//   node scripts/create-book.mjs --character pip --premise "..." --provider mock --dry-run
//
// Flags:
//   --character <id>   protagonist; must already have reference art (required)
//   --premise "..."    the idea to build on (required)
//   --slug <slug>      book id / reader route (default: derived from the title)
//   --pages N          12-16 (default 13)
//   --with <id,id>     extra cast members available to the story
//   --notes "..."      extra direction for the author
//   --text-provider    openai | gemini | mock  (default: openai)
//   --attempts N       validation repair passes (default 3)
//   --dry-run          author and validate, write nothing
//   --force            overwrite an existing book with this slug
//
// It does NOT generate art. That is a separate, slow, paid step:
//   node scripts/generate-book.mjs --book <slug>
//   node scripts/optimize-books.mjs --prune

import { writeFile, mkdir, access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from './lib/load-env.mjs'
import { getTextProvider } from './lib/provider.mjs'
import { authorBook } from './lib/author-book.mjs'
import { emitBookSource } from './lib/emit-book.mjs'
import { validateBook } from './lib/validate-book.mjs'
import { registerInIndex, registerInCatalog } from './lib/register-book.mjs'
import { loadAllBooks, BOOKS_DIR, ASSETS_DIR } from './lib/book-source.mjs'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const value = (n) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : undefined
}

const CHARACTER = value('character')
const PREMISE = value('premise')
const PAGES = Number(value('pages') ?? 13)
const ATTEMPTS = Number(value('attempts') ?? 3)
const DRY = flag('dry-run')
const FORCE = flag('force')
const WITH = (value('with') ?? '').split(',').map((s) => s.trim()).filter(Boolean)

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .split('-')
    .slice(0, 4)
    .join('-')
}

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/**
 * Gather the cast from the books already on disk.
 *
 * CHARACTER_REFS and CHARACTER_BIOS live next to the books that use them, so the
 * set of characters who have approved reference art is exactly the union across
 * every book. That keeps one place to add a character: ship a book with them.
 */
async function knownCast() {
  const all = await loadAllBooks()
  const refs = {}
  const bios = {}
  const titlesByCharacter = {}
  for (const { book, refs: r, bios: b } of all) {
    Object.assign(refs, r)
    Object.assign(bios, b)
    titlesByCharacter[book.character] ??= []
    titlesByCharacter[book.character].push(book.title)
  }
  return { refs, bios, titlesByCharacter }
}

async function main() {
  await loadEnv()

  if (!CHARACTER || !PREMISE) {
    console.error('Usage: node scripts/create-book.mjs --character <id> --premise "..."')
    const { refs } = await knownCast()
    console.error(`\nCharacters with approved reference art: ${Object.keys(refs).join(', ')}`)
    console.error('A new character needs a reference sheet first — see .kiro/steering/visual-consistency.md')
    process.exit(1)
  }

  const { refs: allRefs, bios: allBios, titlesByCharacter } = await knownCast()

  if (!allRefs[CHARACTER]) {
    console.error(`"${CHARACTER}" has no approved reference art.`)
    console.error(`Known: ${Object.keys(allRefs).join(', ')}`)
    console.error(
      'A character cannot be drawn on-model without one. Create and approve a reference sheet first\n' +
        '(.kiro/steering/visual-consistency.md), put it in assets/characters/, and add it to the book\'s CHARACTER_REFS.',
    )
    process.exit(1)
  }

  // Only expose the protagonist plus any explicitly requested cast. Handing the
  // author every character invites a crowd scene it has no reference order for.
  const cast = [CHARACTER, ...WITH]
  const refs = {}
  const bios = {}
  for (const c of cast) {
    if (!allRefs[c]) {
      console.error(`--with "${c}" has no reference art. Known: ${Object.keys(allRefs).join(', ')}`)
      process.exit(1)
    }
    refs[c] = allRefs[c]
    if (allBios[c]) bios[c] = allBios[c]
  }

  // Reference paths must actually exist, or generate-book would fail later on
  // every page in turn. Cheap to check now.
  for (const [id, rel] of Object.entries(refs)) {
    if (!(await exists(path.join(ASSETS_DIR, rel)))) {
      console.error(`Reference art for "${id}" is missing: assets/${rel}`)
      process.exit(1)
    }
  }

  const provider = getTextProvider(value('text-provider') ?? value('provider'))
  console.log(`Author: ${provider.name} / ${provider.model}`)
  if (provider.name === 'mock') {
    console.log('NOTE: mock provider — the prose will be placeholder text, not a story.')
  }
  const already = titlesByCharacter[CHARACTER] ?? []
  if (already.length) console.log(`${CHARACTER} already appears in: ${already.join(', ')}`)
  console.log(`Premise: ${PREMISE}`)
  console.log(`Writing ${PAGES} pages...\n`)

  const { book, attempts, warnings } = await authorBook({
    provider,
    slug: value('slug') ?? 'pending',
    premise: PREMISE,
    character: CHARACTER,
    refs,
    bios,
    pages: PAGES,
    notes: value('notes'),
    maxAttempts: ATTEMPTS,
    onAttempt: (n, max, errors) => {
      if (!errors) console.log(`attempt ${n}/${max}: authoring...`)
      else {
        console.log(`attempt ${n}/${max}: rejected, ${errors.length} problem(s):`)
        for (const e of errors.slice(0, 6)) console.log(`   ${e}`)
        if (errors.length > 6) console.log(`   ... and ${errors.length - 6} more`)
        console.log('   repairing...')
      }
    },
  })

  // The slug comes from the title unless pinned, so the route reads properly.
  const slug = value('slug') ?? slugify(book.title)
  book.id = slug

  const { errors, stats } = validateBook({ book, refs, bios })
  if (errors.length) throw new Error(`post-slug validation failed:\n${errors.join('\n')}`)

  console.log(`\n"${book.title}" — ${book.subtitle}`)
  console.log(
    `  valid after ${attempts} attempt(s): ${stats.pages} pages, ${stats.minWords}-${stats.maxWords} words, avg ${stats.avgWords}, spread ${stats.spread}`,
  )
  for (const w of warnings) console.log(`  warn: ${w}`)
  console.log(`  slug: ${slug}  ->  /read/${slug}`)

  if (DRY) {
    console.log('\n--- page 1 ---')
    console.log(book.pages[0].text)
    console.log(`\n--- final page (${book.pages.length}) ---`)
    console.log(book.pages[book.pages.length - 1].text)
    console.log('\nDry run: nothing written.')
    return
  }

  const dir = path.join(BOOKS_DIR, slug)
  const bookFile = path.join(dir, 'book.ts')
  if ((await exists(bookFile)) && !FORCE) {
    console.error(`\nbooks/${slug}/book.ts already exists. Pass --force to overwrite it.`)
    process.exit(1)
  }

  const header = [
    `// STORYLANDS — "${book.title}"`,
    '//',
    '// Each page carries BOTH the read-aloud prose and the illustration manifest (the',
    '// canonical truth the image prompt is derived from). One source: the app reads this',
    '// file and so does scripts/generate-book.mjs.',
    '//',
    `// Authored by scripts/create-book.mjs from the premise:`,
    ...String(PREMISE)
      .match(/.{1,86}(\s|$)/g)
      .map((l) => `//   ${l.trim()}`),
    '//',
    '// Reviewed and edited by hand afterwards — the generator clears the mechanical bar',
    '// (word budget, textless art, the ending resting on the hero); whether it is any',
    '// GOOD is still a human call. See .kiro/steering/product-standard.md.',
  ].join('\n')

  await mkdir(dir, { recursive: true })
  await writeFile(bookFile, emitBookSource({ header, book, refs, bios }), 'utf8')
  console.log(`\nwrote books/${slug}/book.ts`)

  const idx = await registerInIndex(slug)
  console.log(idx.changed ? '  registered in books/index.ts' : '  books/index.ts already had it')

  const cat = await registerInCatalog({ slug, book })
  console.log(cat.changed ? '  added to lib/catalog.ts' : `  lib/catalog.ts: ${cat.reason}`)

  console.log(
    [
      '',
      'Next:',
      '  1. READ IT. The mechanical bar is met; the story being good is your call.',
      `  2. node scripts/generate-book.mjs --book ${slug}      (slow, paid)`,
      '  3. node scripts/optimize-books.mjs --prune',
      `  4. Check every page against its manifest, re-roll with --only N`,
      '  5. pnpm check, then commit',
    ].join('\n'),
  )
}

main().catch((e) => {
  console.error(`\n${e.message}`)
  process.exit(1)
})
