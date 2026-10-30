// The app and the narration pipeline must segment sentences identically.
//
// The timings in narration.json are aligned against scripts/lib/segments.mjs.
// The reader highlights using lib/read-aloud.ts. If the two ever disagree, the
// highlight lands on the wrong sentence — and nothing else would catch it,
// because both halves work perfectly well in isolation.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { segmentsOf as appSegments } from '../read-aloud.ts'
import { segmentsOf as pipelineSegments } from '../../scripts/lib/segments.mjs'
import { books } from '../../books/index.ts'

describe('sentence segmentation', () => {
  test('agrees on every page of every book', () => {
    for (const book of Object.values(books)) {
      for (const p of book.pages) {
        assert.deepEqual(
          appSegments(p.text),
          pipelineSegments(p.text),
          `${book.id} page ${p.page}`,
        )
      }
    }
  })

  test('agrees on awkward input', () => {
    const cases = [
      '',
      '   ',
      '\n\n',
      'One sentence only',
      'Ooh. Not Ow. Not Ah-CHOO.',
      'He said "stop!" and she did.',
      'Wait\u2026 what?',
      'First line.\n\nSecond line.\n\nThird.',
      '!!!',
      'Mr. Nibs went home.',
    ]
    for (const text of cases) {
      assert.deepEqual(appSegments(text), pipelineSegments(text), JSON.stringify(text))
    }
  })
})
