// Convert generated book page renders to WebP.
//
// The image model returns ~2.3 MB PNGs at 1536px. Thirteen of those is a
// 30 MB book, and the reader loads them over a phone connection with
// `images.unoptimized` set, so every byte reached the child. At quality 72
// the same page is well under 200 KB and the difference is invisible on a
// phone screen.
//
// Run with `node scripts/optimize-books.mjs`. It is idempotent: an existing
// .webp is skipped unless --force is passed. Pass --prune to delete the source
// PNGs once every page in a book has a WebP beside it.

import { readdir, mkdir, stat, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const BOOKS = 'public/books'
const MAX = 1280
const QUALITY = 72

const force = process.argv.includes('--force')
const prune = process.argv.includes('--prune')

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

const slugs = (await readdir(BOOKS, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name)

let before = 0
let after = 0
let converted = 0
let skipped = 0
let pruned = 0

for (const slug of slugs) {
  const dir = join(BOOKS, slug, 'pages')
  if (!(await exists(dir))) {
    console.warn(`no pages dir for ${slug}`)
    continue
  }
  await mkdir(dir, { recursive: true })

  const pngs = (await readdir(dir)).filter((f) => /^page-\d+\.png$/.test(f)).sort()
  const webps = []

  for (const file of pngs) {
    const src = join(dir, file)
    const out = join(dir, file.replace(/\.png$/, '.webp'))
    webps.push(out)
    before += (await stat(src)).size

    if (!force && (await exists(out))) {
      after += (await stat(out)).size
      skipped += 1
      continue
    }

    await sharp(src)
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out)
    after += (await stat(out)).size
    converted += 1
  }

  // Only remove a source once its replacement is on disk — a half-converted
  // book with the PNGs gone is unrecoverable, and these renders cost money.
  if (prune && pngs.length > 0) {
    const allPresent = (await Promise.all(webps.map(exists))).every(Boolean)
    if (!allPresent) {
      console.warn(`not pruning ${slug}: some pages have no .webp yet`)
      continue
    }
    for (const file of pngs) {
      await unlink(join(dir, file))
      pruned += 1
    }
  }
}

console.log(
  `${converted} converted, ${skipped} already done, ${pruned} PNGs pruned: ` +
    `${(before / 1e6).toFixed(1)}MB PNG -> ${(after / 1e6).toFixed(1)}MB WebP`,
)
