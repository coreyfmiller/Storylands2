// The emitter writes TypeScript that the app then imports. If a round trip
// loses or mangles anything, a book ships with prose nobody proofread — so the
// test is the round trip itself, not a snapshot of the output.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, mkdir, rm, cp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { emitBookSource } from '../lib/emit-book.mjs'

const ROOT = path.resolve(import.meta.dirname, '..', '..')

const refs = { pip: 'characters/pip.png' }
const bios = { pip: 'Pip, a small red dragon with a cream belly' }

/** Prose chosen to break a naive emitter: quotes, backticks, ${}, em dashes. */
const AWKWARD = [
  "Pip's lantern wouldn't light — not even a spark.",
  'He said "it is fine" and meant it, mostly.',
  'A backtick ` and a ${template} and a backslash \\ walked in.',
  "Don't stop.\n\nNot now.",
]

function book(pages = 13) {
  return {
    id: 'round-trip',
    title: "Pip's Round Trip",
    subtitle: 'A test of the emitter.',
    character: 'pip',
    ages: 'Ages 4+',
    minutes: 6,
    pages: Array.from({ length: pages }, (_, i) => ({
      page: i + 1,
      text: AWKWARD[i % AWKWARD.length],
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: "a valley where it's dusk",
        timeOfDay: 'dusk',
        action: `Pip does thing number ${i + 1}`,
        emotionalBeat: 'warm',
        requiredVisualFacts: ['Pip fully visible', "the valley's lanterns"],
        forbiddenVisualFacts: [
          'any text, words, letters, numbers, or title in the image',
          'any sign, signpost, board, placard, label, or plaque',
          ...(i === 2 ? ['a giant fire'] : []),
        ],
        composition: 'centred with generous margin',
      },
    })),
  }
}

/** Emit into a temp package, import it, and hand back what Node actually read. */
async function roundTrip(source) {
  const dir = await mkdtemp(path.join(tmpdir(), 'sl-emit-'))
  try {
    await mkdir(path.join(dir, 'books', 'round-trip'), { recursive: true })
    // The emitted file imports '../types.ts', so the real types module has to be
    // beside it — which also means this test fails if that import path breaks.
    await cp(path.join(ROOT, 'books', 'types.ts'), path.join(dir, 'books', 'types.ts'))
    const file = path.join(dir, 'books', 'round-trip', 'book.ts')
    await writeFile(file, source, 'utf8')
    return await import(pathToFileURL(file).href)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

describe('emitBookSource', () => {
  test('round-trips every field, including awkward prose', async () => {
    const original = book()
    const mod = await roundTrip(emitBookSource({ book: original, refs, bios }))

    assert.equal(mod.book.title, original.title)
    assert.equal(mod.book.subtitle, original.subtitle)
    assert.equal(mod.book.character, original.character)
    assert.equal(mod.book.minutes, original.minutes)
    assert.equal(mod.book.pages.length, original.pages.length)

    for (const [i, p] of original.pages.entries()) {
      const got = mod.book.pages[i]
      assert.equal(got.page, p.page, `page ${p.page} number`)
      assert.equal(got.text, p.text, `page ${p.page} text survived verbatim`)
      assert.deepEqual(got.manifest, p.manifest, `page ${p.page} manifest`)
    }
  })

  test('re-exports the character records', async () => {
    const mod = await roundTrip(emitBookSource({ book: book(), refs, bios }))
    assert.deepEqual(mod.CHARACTER_REFS, refs)
    assert.deepEqual(mod.CHARACTER_BIOS, bios)
  })

  test('derives art paths rather than storing them', async () => {
    const mod = await roundTrip(emitBookSource({ book: book(), refs, bios }))
    assert.equal(mod.book.pages[0].art, 'books/round-trip/pages/page-01.webp')
    assert.equal(mod.book.pages[12].art, 'books/round-trip/pages/page-13.webp')
  })

  test('hoists the shared forbidden list but keeps per-page extras', async () => {
    const source = emitBookSource({ book: book(), refs, bios })
    assert.match(source, /const forbiddenAlways = \[/)
    assert.match(source, /\[\.\.\.forbiddenAlways, 'a giant fire'\]/)

    const mod = await roundTrip(source)
    assert.deepEqual(mod.book.pages[2].manifest.forbiddenVisualFacts, [
      'any text, words, letters, numbers, or title in the image',
      'any sign, signpost, board, placard, label, or plaque',
      'a giant fire',
    ])
    assert.equal(mod.book.pages[0].manifest.forbiddenVisualFacts.length, 2)
  })

  test('keeps a supplied header comment', async () => {
    const source = emitBookSource({
      header: '// STORYLANDS — a header\n// second line',
      book: book(),
      refs,
      bios,
    })
    assert.ok(source.startsWith('// STORYLANDS — a header\n// second line'))
  })
})
