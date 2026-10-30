// Load a book from its single source of truth: books/<slug>/book.ts
//
// There used to be two copies of every page manifest — book.ts for the app and
// pages.mjs for the generator — because Node could not import TypeScript. The
// steering file called the duplication "known and deliberate" and told you to
// keep them in sync by hand.
//
// It did not stay in sync. Three of the seven books had drifted across nine
// manifest fields, which means the alt text the app reads aloud to a screen
// reader described a different picture than the prompt that drew it.
//
// Node 24 strips types natively, so the second copy is gone. Imports inside the
// book files use an explicit `.ts` extension, which is what Node's resolver
// needs; `allowImportingTsExtensions` in tsconfig.json lets TypeScript accept
// the same spelling.

import { readdir, access } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..', '..')
export const BOOKS_DIR = path.join(ROOT, 'books')
export const ASSETS_DIR = path.join(ROOT, 'assets')
export const PUBLIC_DIR = path.join(ROOT, 'public')
export { ROOT }

/** Every book slug on disk, in directory order. */
export async function bookSlugs() {
  const entries = await readdir(BOOKS_DIR, { withFileTypes: true })
  const slugs = []
  for (const e of entries) {
    if (!e.isDirectory()) continue
    try {
      await access(path.join(BOOKS_DIR, e.name, 'book.ts'))
      slugs.push(e.name)
    } catch {
      // A directory without a book.ts is not a book.
    }
  }
  return slugs
}

/**
 * Load one book.
 * @returns {Promise<{ slug: string, book: any, refs: Record<string,string>, bios: Record<string,string> }>}
 */
export async function loadBook(slug) {
  const file = path.join(BOOKS_DIR, slug, 'book.ts')
  const mod = await import(pathToFileURL(file).href)
  if (!mod.book) throw new Error(`${slug}/book.ts does not export \`book\``)
  return {
    slug,
    book: mod.book,
    refs: mod.CHARACTER_REFS ?? {},
    bios: mod.CHARACTER_BIOS ?? {},
  }
}

/** Load every book. */
export async function loadAllBooks() {
  const slugs = await bookSlugs()
  return Promise.all(slugs.map(loadBook))
}

/**
 * The generation-side view of a page: the manifest, flattened, with its number.
 * This is the shape the image prompt is compiled from.
 */
export function manifestsOf(book) {
  return book.pages.map((p) => ({ page: p.page, ...p.manifest }))
}
