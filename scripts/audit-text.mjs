// Quick authoring audit: word/paragraph/char counts per page for a book's prose.
// Gate for the reader-layout word budget (target ~35, ceiling ~50 words/page).
// Run: node scripts/audit-text.mjs [book-id]   (defaults to nibs-perfect-acorn)
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bookId = process.argv[2] || 'nibs-perfect-acorn'
const src = await readFile(path.resolve(__dirname, `../books/${bookId}/book.ts`), 'utf8')

// Match: page: N, \n text: `...`
const rx = /page:\s*(\d+),\s*\r?\n\s*text:\s*`([\s\S]*?)`/g
let m
const rows = []
while ((m = rx.exec(src))) {
  const page = Number(m[1])
  const text = m[2].replace(/\\n/g, '\n')
  const words = text.split(/\s+/).filter(Boolean).length
  const paras = text.split(/\n\n+/).filter((s) => s.trim()).length
  const chars = text.length
  rows.push({ page, words, paras, chars })
}

console.log('page  words  paras  chars')
for (const r of rows) {
  console.log(
    String(r.page).padStart(4) +
      String(r.words).padStart(7) +
      String(r.paras).padStart(7) +
      String(r.chars).padStart(7),
  )
}
const words = rows.map((r) => r.words)
console.log('---')
console.log('min', Math.min(...words), 'max', Math.max(...words), 'avg', Math.round(words.reduce((a, b) => a + b, 0) / words.length))
console.log('longest pages:', [...rows].sort((a, b) => b.words - a.words).slice(0, 3).map((r) => `p${r.page}(${r.words}w)`).join(', '))

// Gate: word budget from reader-layout steering.
const CEILING = 50
const over = rows.filter((r) => r.words > CEILING || r.paras > 3)
if (over.length) {
  console.log(`\nFAIL: ${over.map((r) => `p${r.page}(${r.words}w/${r.paras}para)`).join(', ')} exceed the ~${CEILING}-word / 3-paragraph budget. Split them.`)
  process.exitCode = 1
} else {
  console.log(`\nPASS: every page is within the word budget (<= ${CEILING} words, <= 3 paragraphs).`)
}
