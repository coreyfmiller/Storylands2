// Wire a new book into the app.
//
// book-production.md used to list this as two manual steps: hand-write a reader
// route, then hand-edit lib/catalog.ts. The route is gone (one [slug] route
// serves every book), so what is left is the registry and the catalog entry, and
// both are mechanical. Forgetting either produced a book that existed on disk
// and could not be reached, which is the single easiest mistake in the pipeline.
//
// Every edit here is idempotent: running it twice changes nothing the second
// time, so it is safe to re-run after a partial failure.

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { ROOT } from './book-source.mjs'

/** A short identifier usable as a JS import binding. */
function importName(slug) {
  const camel = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
  return /^[a-z]/.test(camel) ? camel : `book${camel}`
}

/** Add the book to books/index.ts so the [slug] route can serve it. */
export async function registerInIndex(slug) {
  const file = path.join(ROOT, 'books', 'index.ts')
  let source = await readFile(file, 'utf8')
  if (source.includes(`./${slug}/book`)) return { changed: false, file }

  const name = importName(slug)
  const importLine = `import { book as ${name} } from './${slug}/book.ts'`

  // Keep the import block alphabetical by path, which is how it reads now.
  const imports = [...source.matchAll(/^import \{ book as \w+ \} from '\.\/[^']+'$/gm)]
  if (imports.length === 0) throw new Error('books/index.ts: could not find the book imports')
  const lastImport = imports[imports.length - 1]
  source =
    source.slice(0, lastImport.index + lastImport[0].length) +
    '\n' +
    importLine +
    source.slice(lastImport.index + lastImport[0].length)

  // Append to the ordered list. Order is shelf order, so new books go last.
  source = source.replace(
    /(const all: Book\[\] = \[)([^\]]*)(\])/,
    (_, open, inner, close) => `${open}${inner.trimEnd()}, ${name}${close}`,
  )

  await writeFile(file, source, 'utf8')
  return { changed: true, file }
}

/** Find a story entry block by id, returning its source text and bounds. */
function findEntry(source, id) {
  const marker = `    id: "${id}",`
  const at = source.indexOf(marker)
  if (at < 0) return null
  const start = source.lastIndexOf('\n  {', at)
  const end = source.indexOf('\n  },', at)
  if (start < 0 || end < 0) return null
  return { start, end: end + '\n  },'.length, text: source.slice(start, end + '\n  },'.length) }
}

/** Read one `key: value,` out of an entry block, value source included. */
function fieldOf(entryText, key) {
  const m = entryText.match(new RegExp(`^    ${key}: ([\\s\\S]*?),$`, 'm'))
  return m ? m[1].trim() : undefined
}

/**
 * Add or update the book's catalog entry.
 *
 * `readerSlug` is what makes "Begin Story" open the real reader rather than the
 * coming-soon card, so a book without one is invisible however complete it is.
 *
 * Three cases, and getting them confused is how the first version of this
 * function silently replaced "Pip and the First Flame" with a test fixture:
 *
 *  - The character has a coming-soon entry (no readerSlug): fill it in, keeping
 *    the hand-written hook, synopsis, genres, tags and colours. That copy is
 *    editorial work and the engine has nothing better to put there.
 *  - The character already has a PUBLISHED entry: add a second entry under a new
 *    id, inheriting the band and colours from its sibling. Never overwrite a
 *    book that exists.
 *  - The character is new to the catalog: insert a fresh entry.
 */
export async function registerInCatalog({ slug, book, story, shelf }) {
  const file = path.join(ROOT, 'lib', 'catalog.ts')
  let source = await readFile(file, 'utf8')

  if (source.includes(`readerSlug: "${slug}"`)) {
    return { changed: false, file, reason: 'already in catalog' }
  }

  const sibling = findEntry(source, book.character)
  const siblingPublished = sibling && /readerSlug:/.test(sibling.text)

  // Case 1: an unbuilt entry for this character is waiting to be filled in.
  if (sibling && !siblingPublished) {
    let updated = sibling.text
      .replace(/^    title: [\s\S]*?,$/m, `    title: ${JSON.stringify(book.title)},`)
      .replace(/^    minutes: .*,$/m, `    minutes: ${book.minutes},`)
    // readerSlug is what flips it from coming-soon to readable.
    updated = updated.replace(
      /^(    portrait: .*,)$/m,
      `    readerSlug: "${slug}",\n$1`,
    )
    if (!/readerSlug:/.test(updated)) {
      updated = updated.replace(/^(  \{)$/m, `$1\n    readerSlug: "${slug}",`)
    }
    source = source.slice(0, sibling.start) + updated + source.slice(sibling.end)
    await writeFile(file, source, 'utf8')
    return { changed: true, file, reason: 'filled in the existing coming-soon entry' }
  }

  // Cases 2 and 3: a new entry. Inherit presentation from a sibling if there is
  // one, so a second Pip book looks like it belongs beside the first.
  const inherit = (key, fallback) => (sibling && fieldOf(sibling.text, key)) || fallback
  const id = story?.id ?? slug

  const entry = `  {
    id: "${id}",
    title: ${JSON.stringify(book.title)},
    kicker: "A Storylands Original",
    hook: ${JSON.stringify(story?.hook ?? book.subtitle)},
    synopsis: ${JSON.stringify(story?.synopsis ?? book.subtitle)},
    readerSlug: "${slug}",${shelf ? `\n    shelf: "${shelf}",` : ''}
    landscape: "/characters/${book.character}.webp",
    portrait: "/characters/${book.character}.webp",
    ages: ${JSON.stringify(book.ages)},
    targetAge: ${inherit('targetAge', story?.targetAge ?? 5)},
    band: ${inherit('band', '"young"')},
    minutes: ${book.minutes},
    genres: ${JSON.stringify(story?.genres ?? ['Heart'])},
    tags: ${JSON.stringify(story?.tags ?? ['heart', 'quick'])},${
      sibling && fieldOf(sibling.text, 'seriesId')
        ? `\n    seriesId: ${fieldOf(sibling.text, 'seriesId')},`
        : ''
    }
    glow: ${inherit('glow', '"oklch(0.82 0.12 74)"')},
    tint: ${inherit('tint', '"oklch(0.34 0.05 70)"')},
  },
`

  const anchor = source.indexOf('export const stories: Story[] = [')
  if (anchor < 0) throw new Error('lib/catalog.ts: could not find the stories array')
  const insertAt = source.indexOf('\n', anchor) + 1
  source = source.slice(0, insertAt) + entry + source.slice(insertAt)

  await writeFile(file, source, 'utf8')
  return {
    changed: true,
    file,
    reason: siblingPublished ? 'added a second book for this character' : 'added a new entry',
  }
}
