// Read-aloud segmentation.
//
// The highlight has to line up with the voice, and the rendered text has to be
// identical to the source: a child following the words must not see punctuation
// appear or vanish because the sentence splitter reassembled the page.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { segmentsOf, segmentAt } from '../read-aloud.ts'
import { books } from '../../books/index.ts'

describe('segmentsOf', () => {
  test('rejoins to exactly the original text', () => {
    const text = 'Pip waited. Nothing happened!\n\nThen, very quietly, something did?'
    assert.equal(
      segmentsOf(text)
        .map((s) => s.text)
        .join(''),
      text,
    )
  })

  test('offsets point at the real characters', () => {
    const text = 'One. Two. Three.'
    for (const seg of segmentsOf(text)) {
      assert.equal(text.slice(seg.start, seg.end), seg.text)
    }
  })

  test('splits on sentence endings', () => {
    const segs = segmentsOf('One. Two! Three?')
    assert.equal(segs.length, 3)
  })

  test('keeps a paragraph break inside a segment rather than losing it', () => {
    const segs = segmentsOf('First line.\n\nSecond line.')
    assert.ok(segs.some((s) => s.text.includes('\n')))
    assert.equal(segs.map((s) => s.text).join(''), 'First line.\n\nSecond line.')
  })

  test('a page with no terminal punctuation is one segment, not none', () => {
    const segs = segmentsOf('just a fragment')
    assert.equal(segs.length, 1)
    assert.equal(segs[0].text, 'just a fragment')
  })

  test('never returns an empty list, whatever it is given', () => {
    for (const input of ['', '   ', '\n\n', '...', '!']) {
      assert.ok(segmentsOf(input).length >= 1, JSON.stringify(input))
    }
  })

  // Every real page, because this is what actually gets read to a child.
  test('round-trips every page of every book', () => {
    for (const book of Object.values(books)) {
      for (const p of book.pages) {
        const joined = segmentsOf(p.text)
          .map((s) => s.text)
          .join('')
        assert.equal(joined, p.text, `${book.id} page ${p.page}`)
      }
    }
  })
})

describe('segmentAt', () => {
  const segs = segmentsOf('One. Two. Three.')

  test('finds the segment holding an offset', () => {
    assert.equal(segmentAt(segs, 0), 0)
    assert.equal(segmentAt(segs, 5), 1)
    assert.equal(segmentAt(segs, 15), 2)
  })

  test('returns -1 past the end rather than guessing', () => {
    assert.equal(segmentAt(segs, 9999), -1)
  })
})
