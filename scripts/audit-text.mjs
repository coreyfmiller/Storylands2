// Audit a book's prose against the reader-layout word budget.
//
// Used to regex the source of book.ts looking for `page: N, text: \`...\``,
// which meant reformatting the file could silently stop it finding any pages at
// all and it would report a clean pass on nothing. It now imports the book and
// runs the same validator the authoring engine and the image generator use, so
// there is one definition of "this book is acceptable".
//
// Run: node scripts/audit-text.mjs [book-slug]     (default: every book)

import { loadBook, bookSlugs } from './lib/book-source.mjs'
import {
  validateBook,
  wordCount,
  paragraphCount,
  WORD_CEILING,
  WORD_TARGET_MIN,
  WORD_TARGET_MAX,
  PARAGRAPH_CEILING,
} from './lib/validate-book.mjs'

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const verbose = process.argv.includes('--pages')
const slugs = only.length ? only : await bookSlugs()

let failed = 0

for (const slug of slugs) {
  const { book, refs, bios } = await loadBook(slug)
  const { errors, warnings, stats } = validateBook({ book, refs, bios })

  console.log(`\n${book.title}  (${slug})`)
  console.log(
    `  ${stats.pages} pages · ${stats.minWords}-${stats.maxWords} words · avg ${stats.avgWords} · spread ${stats.spread}`,
  )

  if (verbose) {
    console.log('  page  words  paras')
    for (const p of book.pages) {
      const w = wordCount(p.text)
      const para = paragraphCount(p.text)
      const mark =
        w > WORD_CEILING || para > PARAGRAPH_CEILING
          ? ' FAIL'
          : w > WORD_TARGET_MAX || w < WORD_TARGET_MIN
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
      `  PASS: every page within ${WORD_CEILING} words and ${PARAGRAPH_CEILING} paragraphs` +
        (warnings.length ? ` (${warnings.length} warning(s))` : ''),
    )
  }
}

console.log(
  `\n${slugs.length - failed}/${slugs.length} books pass. Comfortable band is ${WORD_TARGET_MIN}-${WORD_TARGET_MAX} words.`,
)
if (failed) process.exit(1)
