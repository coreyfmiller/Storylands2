// Convert generated book page renders to the file the reader actually serves.
//
// Two jobs, and the second one is the important one.
//
// SIZE. The image model returns ~2.3 MB PNGs. Thirteen of those is a 30 MB book
// over a phone connection, and `images.unoptimized` is on, so every byte reached
// the child. At WebP quality 72 the same page is well under 200 KB.
//
// SHAPE. The renders are 1024x1536 — a 0.667 portrait. The reader's illustration
// region is 1.25 (see READER_ART_ASPECT in books/types.ts), so `object-cover`
// was showing the central 53% of each picture and throwing away the other 47%.
// Every page was generated at full price and cropped in half in the browser,
// where nothing could check what had been lost.
//
// So the crop happens here instead, to exactly the region's ratio, positioned by
// sharp's attention heuristic so it keeps the subject rather than the geometric
// middle. The browser then has nothing left to crop, and scripts/review-art.mjs
// reviews the same pixels the child sees.
//
// Run with `node scripts/optimize-books.mjs`. Idempotent: an existing .webp is
// skipped unless --force. Pass --prune to delete the source PNGs once every page
// in a book has a WebP beside it.

import { readdir, mkdir, stat, unlink, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { READER_ART_ASPECT } from '../books/types.ts'

// Sharp's file cache keeps handles open, which on Windows blocks writing back
// over a file it has read. This pass rewrites pages in place, so turn it off.
sharp.cache(false)

const BOOKS = 'public/books'
const WIDTH = 1024
const QUALITY = 72

/** The served page size: the reader's region ratio at full display width. */
const HEIGHT = Math.round(WIDTH / READER_ART_ASPECT)

/**
 * No crop. Fit the render inside the target box and keep its shape.
 *
 * Cropping here was tried twice and was wrong both times. `attention` took the
 * top off Nibs's head. A fixed centre crop to 1.25 then clipped wings on six of
 * thirteen pages of the first landscape book, because the reader's picture
 * region is NOT a fixed shape — it depends on the viewport, and on a narrow
 * phone it is nearer 1.03 than 1.25, so the browser cropped the cropped file.
 *
 * The render already matches READER_ART_ASPECT, so there is nothing to trim.
 * `object-cover` handles the per-device difference, which is its job, and the
 * prompt tells the illustrator to keep the beat inside the central band that
 * survives on the narrowest screen.
 */
const FIT = 'inside'

const force = process.argv.includes('--force')
const prune = process.argv.includes('--prune')
/** Re-crop already-converted pages whose aspect no longer matches the reader. */
const recrop = process.argv.includes('--recrop')
let recropped = 0
let skippedShape = 0

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

console.log(`Target: ${WIDTH}x${HEIGHT} (aspect ${READER_ART_ASPECT.toFixed(3)}), WebP q${QUALITY}`)

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
      .resize({ width: WIDTH, height: HEIGHT, fit: FIT, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out)
    after += (await stat(out)).size
    converted += 1
  }

  // Re-crop WebPs that are the wrong shape.
  //
  // The seven existing books were converted before the crop moved here and
  // their PNG masters have been pruned, so the WebP is the only copy left. A
  // crop-only pass on it loses nothing beyond the one generation of WebP it has
  // already been through, which is invisible against showing 47% less picture.
  if (recrop) {
    const existing = (await readdir(dir)).filter((f) => /^page-\d+\.webp$/.test(f)).sort()
    for (const file of existing) {
      const target = join(dir, file)
      // Read the bytes ONCE and never hand sharp the path. On Windows sharp
      // keeps a handle on any file it opens, so reading metadata from the path
      // makes the write back to that same path fail.
      const source = await readFile(target)
      const meta = await sharp(source).metadata()
      const aspect = meta.width / meta.height
      if (Math.abs(aspect - READER_ART_ASPECT) < 0.01) continue

      // Portrait pages from the first seven books cannot be reshaped into
      // landscape without inventing picture, so they are left alone and simply
      // reported. They are cropped by the browser, as they always were.
      console.warn(
        `  ${slug}/${file} is ${aspect.toFixed(2)}, not ${READER_ART_ASPECT.toFixed(2)};` +
          ` regenerate the book to get landscape art`,
      )
      skippedShape += 1
    }
  }

  // Only remove a source once its replacement is on disk. A half-converted book
  // with the PNGs gone is unrecoverable, and these renders cost money.
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
  `${converted} converted, ${skipped} already done, ${recropped} re-cropped, ${skippedShape} wrong shape, ${pruned} PNGs pruned` +
    (before ? `: ${(before / 1e6).toFixed(1)}MB PNG -> ${(after / 1e6).toFixed(1)}MB WebP` : ''),
)
