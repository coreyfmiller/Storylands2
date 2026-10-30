// Mapping playback position to the highlighted sentence.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { sentenceAt } from '../narration.ts'

const timings = [
  { start: 0, end: 2.62 },
  { start: 3.46, end: 4.76 },
  { start: 5.74, end: 11.25 },
]

describe('sentenceAt', () => {
  test('finds the sentence playing', () => {
    assert.equal(sentenceAt(timings, 0), 0)
    assert.equal(sentenceAt(timings, 2.5), 0)
    assert.equal(sentenceAt(timings, 3.5), 1)
    assert.equal(sentenceAt(timings, 6), 2)
  })

  // A gap between clips is silence between sentences. Dropping the highlight
  // there would make it flicker off and on between every line.
  test('holds the previous sentence through a gap', () => {
    const i = sentenceAt(timings, 3.0)
    assert.ok(i === 0 || i === 1, `got ${i}`)
  })

  test('holds the last sentence past the final timing', () => {
    assert.equal(sentenceAt(timings, 20), 2)
  })

  test('returns -1 with no timings rather than guessing', () => {
    assert.equal(sentenceAt(null, 5), -1)
    assert.equal(sentenceAt([], 5), -1)
  })

  test('returns -1 before the first sentence starts', () => {
    assert.equal(sentenceAt([{ start: 1, end: 2 }], 0.2), -1)
  })
})
