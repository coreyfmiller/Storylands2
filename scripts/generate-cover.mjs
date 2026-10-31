// Generate a book's own cover: portrait, textless, on-model.
//
// Why this exists. Until now `bookCover()` returned `characters/<character>.webp`
// — one cover per CHARACTER — so every book a character starred in showed the
// same picture, with that character's NAME painted across it rather than the
// book's title. Tilly's cover reads "TILLY / Big questions. Brighter tomorrows."
// on a book called "Tilly's Winter Map", and a three-book series would have been
// the same portrait three times. That was the real blocker on series, and
// `bookCoverArt` was built to take a per-book cover the moment one existed.
//
// Textless, deliberately. The seven original covers have their title painted in,
// which is why the reader has to suppress its own HTML title for them (see
// `paintedTitle` in books/types.ts) — and why those covers can never be
// retitled, translated, or reused. A textless cover lets the reader draw the
// real title over it, so the art stays true however the text changes.
//
// Portrait, deliberately. Pages are 3:2 landscape because the reader shows them
// above a text panel. A cover fills the whole 9:16 stage and is shown as a 9:16
// card on every shelf, so a landscape cover would be cropped to a third of its
// width. This is the one place portrait is right.
//
// Usage:
//   node scripts/generate-cover.mjs --book <slug> [--candidates 3]
//   node scripts/generate-cover.mjs --book <slug> --approve 2

import { writeFile, mkdir, access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { loadEnv } from './lib/load-env.mjs'
import { getImageProvider } from './lib/provider.mjs'
import { loadBook, ASSETS_DIR, PUBLIC_DIR } from './lib/book-source.mjs'
import { seriesWorld, styleFor } from './lib/compile-prompt.mjs'

const require = createRequire(import.meta.url)
const sharp = require('sharp')
// Windows holds a read handle open, so writing back over a file that was read
// in the same process fails EPERM without this.
sharp.cache(false)

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const value = (n) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : undefined
}

const SLUG = value('book')
const CANDIDATES = Number(value('candidates') ?? 3)
const APPROVE = value('approve') ? Number(value('approve')) : null

/** Covers are shown as 9:16 cards and fill a 9:16 reader stage. */
const COVER_ASPECT = '2:3'
const COVER_WIDTH = 820
const COVER_QUALITY = 74

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/**
 * The cover brief.
 *
 * Built from the book's OWN first and last pages rather than from a generic
 * character portrait, so the cover is about this story. A cover that could head
 * any book in the series is the thing being replaced.
 */
function coverPrompt(book, bios, cast, world = null) {
  const first = book.pages[0]?.manifest
  const last = book.pages[book.pages.length - 1]?.manifest

  const who = cast
    .map((c) => `${c} (${bios[c] ?? 'exactly as in the reference'})`)
    .join(' and ')

  /**
   * Everything this book forbids, carried onto the cover.
   *
   * The first version of this script omitted it and all three candidates for
   * Tilly's Winter Map put a physical paper map in her wings — which that book
   * forbids on every page, because the entire premise is that her map is behind
   * her eyes. The cover would have contradicted the story on the shelf.
   *
   * Union across pages rather than page one's list, since story-specific bans
   * are added per page and the cover can breach any of them.
   */
  const forbidden = [
    ...new Set(book.pages.flatMap((p) => p.manifest?.forbiddenVisualFacts ?? [])),
  ]

  /** The seasons and times the book is actually set in, so the cover matches. */
  const seasons = [
    ...new Set(book.pages.map((p) => p.manifest?.timeOfDay).filter(Boolean)),
  ].slice(0, 4)

  return [
    styleFor(book.band ?? 'young'),
    seriesWorld(world),
    // Override the landscape clause from the shared style: a cover is portrait.
    'IMPORTANT OVERRIDE: this image is PORTRAIT, taller than it is wide, composed as a book cover rather than as a page illustration. Ignore any instruction above about horizontal composition.',
    `This is the COVER of a children's picture book called "${book.title}".`,
    `It must show ${who}, exactly on-model with the reference image(s) provided.`,
    `The story: ${book.subtitle}`,
    `It opens in ${first?.location ?? 'the setting'} and ends in ${last?.location ?? 'the same world'}.`,
    // Page one's required facts, because they carry the continuity: the full
    // character description and the key props. Without them Oliver's cover came
    // back with a RED ball on a book whose every page says the ball is blue --
    // the forbidden facts were being passed and the required ones were not, so
    // the cover could avoid everything the book bans and still contradict it.
    first?.requiredVisualFacts?.length
      ? `These facts must hold on the cover exactly as they do inside the book: ${first.requiredVisualFacts.join('; ')}.`
      : '',
    'Compose it as a cover: the character or characters large and central in the lower two thirds, looking out or into the scene, with the setting readable behind them and GENEROUS EMPTY SKY OR SPACE ACROSS THE TOP THIRD where a title will be placed later.',
    'The top third must be simple and uncluttered — sky, canopy, mist, water — with nothing important in it.',
    seasons.length ? `The book is set at: ${seasons.join('; ')}. The cover must show that season and that light, not a generic sunny day.` : '',
    // Everything the pages forbid, the cover forbids. See `forbidden` above.
    forbidden.length ? `This book FORBIDS all of the following, and the cover must not contain any of them either: ${forbidden.join('; ')}.` : '',
    // The whole point of generating this rather than reusing the painted portrait.
    'ABSOLUTELY NO TEXT OF ANY KIND. No title, no character name, no tagline, no letters, no numbers, no words anywhere in the image. No signpost, board, placard, plaque, nameplate, book spine, label or lettering on any object. The title is drawn by the app on top of this picture, so any painted text would appear twice.',
    'Warm, inviting, and unmistakably the same world as the pages of this book.',
  ]
    .filter(Boolean)
    .join(' ')
}

async function main() {
  await loadEnv()

  if (!SLUG) {
    console.error('Usage: node scripts/generate-cover.mjs --book <slug> [--candidates 3]')
    console.error('       node scripts/generate-cover.mjs --book <slug> --approve <n>')
    process.exit(1)
  }

  const { book, refs, bios } = await loadBook(SLUG)
  const draftDir = path.join(ASSETS_DIR, 'books', SLUG)
  const servedDir = path.join(PUBLIC_DIR, 'books', SLUG)

  // ---- approve: promote a draft into the served cover ---------------------
  if (APPROVE !== null) {
    const draft = path.join(draftDir, `cover-${APPROVE}.png`)
    if (!(await exists(draft))) {
      console.error(`No such candidate: assets/books/${SLUG}/cover-${APPROVE}.png`)
      process.exit(1)
    }
    await mkdir(servedDir, { recursive: true })
    const out = path.join(servedDir, 'cover.webp')
    const info = await sharp(draft)
      .resize({ width: COVER_WIDTH, withoutEnlargement: true })
      .webp({ quality: COVER_QUALITY })
      .toFile(out)
    console.log(
      `wrote public/books/${SLUG}/cover.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`,
    )

    // And a thumbnail, because the shelf shows this at about 160px wide and the
    // full cover is over 100KB. `thumbOf` in lib/catalog.ts knows this path.
    // Without it every cover on a shelf of twenty books downloads at full size,
    // which is the regression that cost 94% of the payload the first time.
    await mkdir(path.join(servedDir, 'thumb'), { recursive: true })
    const thumb = await sharp(draft)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 62 })
      .toFile(path.join(servedDir, 'thumb', 'cover.webp'))
    console.log(
      `wrote public/books/${SLUG}/thumb/cover.webp  ${thumb.width}x${thumb.height}  ${(thumb.size / 1024).toFixed(0)}KB`,
    )
    console.log('\nNow add this to the book, which is what makes the app use it:')
    console.log(`  cover: 'books/${SLUG}/cover.webp',`)
    console.log('and drop `landscape`/`portrait` in lib/catalog.ts onto the same path.')
    return
  }

  // ---- generate candidates ------------------------------------------------
  const provider = getImageProvider(value('image-provider'))

  // Everyone with reference art in this book, protagonist first so the ordinals
  // in the prompt line up with the reference order the API is given.
  const cast = [book.character, ...Object.keys(refs).filter((c) => c !== book.character)]
  const referencePaths = cast.map((c) => path.join(ASSETS_DIR, refs[c]))
  for (const p of referencePaths) {
    if (!(await exists(p))) {
      console.error(`Missing reference art: ${p}`)
      process.exit(1)
    }
  }

  // The cover is the first thing anyone sees of a series, so it has to obey the
  // world lock too — a cover in a different palette than the pages reads as a
  // different book.
  let world = null
  if (book.seriesId) {
    try {
      world = JSON.parse(
        await readFile(path.join(ASSETS_DIR, 'series', `${book.seriesId}.json`), 'utf8'),
      )
      console.log(`World: ${world.name}`)
    } catch {
      // No bible for this series yet. Normal.
    }
  }

  const prompt = coverPrompt(book, bios, cast, world)
  console.log(`Images: ${provider.name} / ${provider.model}`)
  console.log(`Cover for "${book.title}" — cast: ${cast.join(' + ')}\n`)

  if (flag('dry-run')) {
    console.log(prompt)
    return
  }

  await mkdir(draftDir, { recursive: true })
  for (let i = 1; i <= CANDIDATES; i++) {
    try {
      const { b64 } = await provider.generateImage({
        prompt,
        referencePaths,
        aspectRatio: COVER_ASPECT,
      })
      const out = path.join(draftDir, `cover-${i}.png`)
      await writeFile(out, Buffer.from(b64, 'base64'))
      console.log(`  candidate ${i}: assets/books/${SLUG}/cover-${i}.png`)
    } catch (e) {
      console.log(`  candidate ${i}: FAILED — ${String(e?.message ?? e).slice(0, 200)}`)
    }
  }

  console.log(
    [
      '',
      'LOOK AT THEM. A cover is the first thing anyone sees and it is worth rejecting',
      'all of them and running this again. Check: both characters on-model, textless,',
      'and a clear uncluttered top third for the title.',
      '',
      `  node scripts/generate-cover.mjs --book ${SLUG} --approve <n>`,
    ].join('\n'),
  )
}

main().catch((e) => {
  console.error(`\n${e.message}`)
  process.exit(1)
})
