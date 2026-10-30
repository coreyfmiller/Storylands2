// Audit every book's prose against its own band's budget.
//
// Used to regex the source of book.ts looking for `page: N, text: \`...\``,
// which meant reformatting the file could silently stop it finding any pages at
// all and it would report a clean pass on nothing. It now imports the book and
// runs the same validator the authoring engine and the image generator use, so
// there is one definition of "this book is acceptable".
//
// Each book is checked against ITS OWN band. This file used to import the four
// young-band constants and report against them globally — "every page within 50
// words", "comfortable band is 18-45" — which would have called a correct 8-page
// board book of six-word pages a book with eight warnings.
//
// Run: node scripts/audit-text.mjs [book-slug]     (default: every book)
//      node scripts/audit-text.mjs --pages         (per-page table)

import { loadBook, bookSlugs } from './lib/book-source.mjs'
import { validateBook, wordCount, paragraphCount } from './lib/validate-book.mjs'
import { bandSpec } from '../lib/bands.ts'

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const verbose = process.argv.includes('--pages')
const slugs = only.length ? only : await bookSlugs()

let failed = 0
/** Books per band, so the closing line can report what was actually checked. */
const byBand = {}

for (const slug of slugs) {
  const { book, refs, bios } = await loadBook(slug)
  const { errors, warnings, stats } = validateBook({ book, refs, bios })
  const spec = bandSpec(stats.band)
  byBand[spec.label] = (byBand[spec.label] ?? 0) + 1

  console.log(`\n${book.title}  (${slug})`)
  console.log(
    `  ${spec.label} · ${stats.pages} pages · ${stats.minWords}-${stats.maxWords} words · avg ${stats.avgWords} · spread ${stats.spread}`,
  )

  if (verbose) {
    console.log('  page  words  paras')
    for (const p of book.pages) {
      const w = wordCount(p.text)
      const para = paragraphCount(p.text)
      const mark =
        w > spec.words.ceiling || para > spec.paragraphs
          ? ' FAIL'
          : w > spec.words.max || w < spec.words.min
            ? ' ~'
            : ''
      console.log(
        `  ${String(p.page).padStart(4)}${String(w).padStart(7)}${String(para).padStart(7)}${mark}`,
      )
    }
  }

  for (const e of errors) console.log(`  ERROR  ${e}`)
  for (const w of warnings) console.log(`  warn   ${w}`)

  if (errors.length) {
    failed += 1
    console.log(`  FAIL: ${errors.length} error(s)`)
  } else {
    console.log(
      `  PASS: every page within ${spec.words.ceiling} words and ${spec.paragraphs} paragraph(s) for ${spec.agesLabel}` +
        (warnings.length ? ` (${warnings.length} warning(s))` : ''),
    )
  }
}

const spread = Object.entries(byBand)
  .map(([label, n]) => `${n} ${label}`)
  .join(', ')
console.log(`\n${slugs.length - failed}/${slugs.length} books pass. Checked: ${spread}.`)
if (failed) process.exit(1)
