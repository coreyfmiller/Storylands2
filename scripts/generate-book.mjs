// Generate one illustration per page for a Storylands book.
//
// The prompt is DERIVED from each page's manifest in books/<slug>/book.ts, which
// is the single source for both the app and this script. Every call is seeded
// with the approved reference art for each character present — that is the whole
// character-consistency strategy, and the reason pages are generated one cast at
// a time rather than from a style prompt alone.
//
// Run:
//   node scripts/generate-book.mjs --book pip-first-flame
//   node scripts/generate-book.mjs --book pip-first-flame --dry-run
//   node scripts/generate-book.mjs --book pip-first-flame --only 6,7 --force
//   node scripts/generate-book.mjs --all
//
// Flags:
//   --book <slug>     which book (required unless --all)
//   --all             every book on disk, missing pages only
//   --only 6,7        just these page numbers
//   --force           regenerate pages that already exist
//   --dry-run         print the compiled prompts and spend nothing
//   --concurrency N   pages in flight at once (default 2)
//
// Resumable and per-page isolated: a failure on page 7 never stops page 8, and a
// re-run fills the gaps. Output is public/books/<slug>/pages/page-NN.png, which
// must then be converted by scripts/optimize-books.mjs before the app serves it.

import { writeFile, mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { generateFromReferences, DEFAULT_IMAGE_MODEL } from './lib/openai-image.mjs'
import { loadBook, bookSlugs, manifestsOf, ASSETS_DIR, PUBLIC_DIR } from './lib/book-source.mjs'
import { compilePrompt } from './lib/compile-prompt.mjs'
import { validateBook } from './lib/validate-book.mjs'
import { loadEnv } from './lib/load-env.mjs'

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const value = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}

const FORCE = flag('force')
const DRY = flag('dry-run')
const ALL = flag('all')
const CONCURRENCY = Math.max(1, Number(value('concurrency') ?? 2))
const ONLY = value('only')
  ? new Set(
      String(value('only'))
        .split(',')
        .map((n) => parseInt(n, 10))
        .filter(Number.isInteger),
    )
  : null

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/** Run tasks with a small fixed concurrency, preserving per-task isolation. */
async function pool(items, limit, worker) {
  const results = []
  let next = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = next++
      if (i >= items.length) return
      results[i] = await worker(items[i], i)
    }
  })
  await Promise.all(runners)
  return results
}

async function generateOne({ slug, manifest, bios, refs, outDir }) {
  const name = `page-${String(manifest.page).padStart(2, '0')}.png`
  const pngPath = path.join(outDir, name)
  // A page is done if either the render OR the WebP the app serves is present.
  // optimize-books.mjs --prune removes the PNG once converted, so checking only
  // the PNG would re-generate, and re-bill, every page of a finished book.
  const webpPath = pngPath.replace(/\.png$/, '.webp')
  if (!FORCE && ((await exists(pngPath)) || (await exists(webpPath)))) {
    return { page: manifest.page, status: 'skip' }
  }

  const prompt = compilePrompt(manifest, bios)
  if (DRY) {
    console.log(`\n--- ${slug} page ${manifest.page} (${manifest.charactersPresent.join('+')}) ---`)
    console.log(prompt)
    return { page: manifest.page, status: 'dry' }
  }

  // Reference order must match charactersPresent, because compile-prompt names
  // them by position ("the FIRST reference image is ...").
  const referencePaths = manifest.charactersPresent.map((c) => path.join(ASSETS_DIR, refs[c]))

  try {
    const { b64 } = await generateFromReferences({ prompt, referencePaths, size: '1024x1536' })
    await writeFile(pngPath, Buffer.from(b64, 'base64'))
    console.log(`  page ${manifest.page}: OK`)
    return { page: manifest.page, status: 'ok' }
  } catch (e) {
    const message = String(e?.message ?? e)
    console.log(`  page ${manifest.page}: FAILED`)
    console.error(`    ${message.slice(0, 300)}`)
    // Moderation false-positives are common and the fix is editorial, not a
    // retry, so say so rather than letting it look like a network blip.
    if (/moderation|safety|rejected/i.test(message)) {
      console.error(
        `    This reads as a moderation refusal. Soften the wording in books/${slug}/book.ts ` +
          `page ${manifest.page} (avoid "monster", "attack", "scary") and re-run with --only ${manifest.page}.`,
      )
    }
    return { page: manifest.page, status: 'fail', error: message }
  }
}

async function runBook(slug) {
  const { book, refs, bios } = await loadBook(slug)

  // Validate before spending anything. A book with a missing CHARACTER_REFS entry
  // would fail on every page, one paid call at a time.
  const { errors, warnings } = validateBook({ book, refs, bios })
  if (errors.length) {
    console.error(`\n${slug}: will not generate, ${errors.length} validation error(s):`)
    for (const e of errors) console.error(`   ${e}`)
    return { slug, ok: 0, skip: 0, fail: book.pages.length, blocked: true }
  }
  for (const w of warnings) console.log(`  warn: ${w}`)

  const outDir = path.join(PUBLIC_DIR, 'books', slug, 'pages')
  await mkdir(outDir, { recursive: true })

  const manifests = manifestsOf(book).filter((m) => !ONLY || ONLY.has(m.page))
  if (manifests.length === 0) {
    console.log(`${slug}: no pages selected`)
    return { slug, ok: 0, skip: 0, fail: 0 }
  }

  console.log(`\n${slug}: ${book.title} — ${manifests.length} page(s)`)
  const results = await pool(manifests, DRY ? 1 : CONCURRENCY, (manifest) =>
    generateOne({ slug, manifest, bios, refs, outDir }),
  )

  const ok = results.filter((r) => r.status === 'ok').length
  const skip = results.filter((r) => r.status === 'skip').length
  const fail = results.filter((r) => r.status === 'fail')
  console.log(`${slug}: generated ${ok}, skipped ${skip}, failed ${fail.length}`)
  if (fail.length) {
    console.log(`  retry with: --book ${slug} --only ${fail.map((f) => f.page).join(',')}`)
  }
  return { slug, ok, skip, fail: fail.length }
}

async function main() {
  await loadEnv()

  const slugs = ALL ? await bookSlugs() : [value('book')].filter(Boolean)
  if (slugs.length === 0) {
    console.error('Which book? Pass --book <slug> or --all.')
    console.error(`Available: ${(await bookSlugs()).join(', ')}`)
    process.exit(1)
  }

  if (!DRY) console.log(`Model: ${DEFAULT_IMAGE_MODEL}  concurrency: ${CONCURRENCY}`)

  let generated = 0
  for (const slug of slugs) {
    const r = await runBook(slug)
    generated += r.ok
  }

  if (generated > 0) {
    // The reader loads .webp. A fresh PNG render is ~2.3 MB and is not served at
    // all until converted, so this is the required next step.
    console.log('\nNext: node scripts/optimize-books.mjs --prune')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
