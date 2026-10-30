// Which model drew which page.
//
// Re-rolling three pages of a finished book on a different image model is an
// easy and expensive mistake: style and character rendering drift INSIDE one
// book, which reads worse than the mediocre page you were replacing. Nothing
// recorded what drew what, so there was no way to notice.
//
// books/<slug>/art.json is that record. Not in public/ — it is production
// metadata, not something to serve.

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { BOOKS_DIR } from './book-source.mjs'

const FILE = 'art.json'

function logPath(slug) {
  return path.join(BOOKS_DIR, slug, FILE)
}

/** @returns {Promise<{ provider?: string, model?: string, pages: Record<string, {provider: string, model: string, at: string}> }>} */
export async function readArtLog(slug) {
  try {
    const raw = await readFile(logPath(slug), 'utf8')
    const parsed = JSON.parse(raw)
    return { ...parsed, pages: parsed?.pages ?? {} }
  } catch {
    // No log is normal: every book that predates this file has none, and that
    // is treated as "unknown", never as a mismatch.
    return { pages: {} }
  }
}

/** Record a batch of freshly generated pages. */
export async function recordPages(slug, { provider, model, pages }) {
  const log = await readArtLog(slug)
  const at = new Date().toISOString()
  for (const page of pages) {
    log.pages[String(page)] = { provider, model, at }
  }
  // The book-level model is whatever drew most of it, so a single re-rolled
  // page cannot rewrite the book's identity.
  const tally = {}
  for (const entry of Object.values(log.pages)) {
    const key = `${entry.provider}/${entry.model}`
    tally[key] = (tally[key] ?? 0) + 1
  }
  const [dominant] = Object.entries(tally).sort((a, b) => b[1] - a[1])
  if (dominant) {
    const [p, m] = dominant[0].split('/')
    log.provider = p
    log.model = m
  }
  await writeFile(logPath(slug), `${JSON.stringify(log, null, 2)}\n`, 'utf8')
  return log
}

/**
 * Would generating with this model mix two models inside one book?
 *
 * @returns {Promise<{ mixed: boolean, existing?: string, incoming: string }>}
 */
export async function wouldMix(slug, { provider, model, pages }) {
  const log = await readArtLog(slug)
  const incoming = `${provider}/${model}`

  // Regenerating the whole book is not mixing — it is a clean replacement.
  const recorded = Object.keys(log.pages)
  const replacingAll = recorded.length > 0 && recorded.every((p) => pages.includes(Number(p)))
  if (replacingAll) return { mixed: false, incoming }

  const others = new Set(
    Object.values(log.pages)
      .map((e) => `${e.provider}/${e.model}`)
      .filter((k) => k !== incoming),
  )
  if (others.size === 0) return { mixed: false, incoming }
  return { mixed: true, existing: [...others].join(', '), incoming }
}
