// The narrator's direction, which is now per PAGE rather than per book.
//
// This replaced the idea of a voice per character. Only 7% of the library's
// words are inside quotation marks and four books have no dialogue at all, so
// casting a second voice would have cost a full re-recording plus clip
// stitching and re-aligning the word timings, to change 7% of the audio.
// Directing the single narrator from each page's own emotional beat changes
// 100% of it for the same number of calls.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { instructionsFor, SHOT_DIRECTION } from '../narrate-book.mjs'
import { SHOT_KEYS } from '../lib/shot-types.mjs'
import { BAND_ORDER, BANDS } from '../../lib/bands.ts'

const page = (manifest = {}) => ({ manifest })

describe('every shot type can be heard', () => {
  test('each shot key has a direction for the narrator', () => {
    // A new shot type added to shot-types.mjs must not silently lose its
    // reading direction — it would fall back to no instruction at all, and the
    // page would be read flat with nothing reporting it.
    for (const key of SHOT_KEYS) {
      assert.ok(SHOT_DIRECTION[key], `shot type "${key}" has no narration direction`)
    }
  })

  test('no direction exists for a shot type that does not', () => {
    for (const key of Object.keys(SHOT_DIRECTION)) {
      assert.ok(SHOT_KEYS.includes(key), `"${key}" is directed but is not a real shot type`)
    }
  })
})

describe('the direction is per page', () => {
  test("a page's emotional beat reaches the narrator", () => {
    const out = instructionsFor('young', page({ emotionalBeat: 'Sudden longing' }))
    assert.match(out, /Sudden longing/)
  })

  test('two pages of the same book get different direction', () => {
    // The whole point. This was byte-identical for every page of every book in
    // a band, so the quiet opening and the page where it all goes wrong were
    // read in exactly the same register.
    const a = instructionsFor('young', page({ emotionalBeat: 'Eager effort', shotType: 'wide' }))
    const b = instructionsFor('young', page({ emotionalBeat: 'Quiet dread', shotType: 'close' }))
    assert.notEqual(a, b)
  })

  test('the shot type colours the read', () => {
    const close = instructionsFor('young', page({ shotType: 'close' }))
    const wide = instructionsFor('young', page({ shotType: 'wide' }))
    assert.match(close, /confiding/)
    assert.notEqual(close, wide)
  })

  test('a page with no beat and no shot still gets band direction', () => {
    // The seven original books have no shotType at all, so this is the live
    // path for more than half the library until they are lifted.
    for (const band of BAND_ORDER) {
      const out = instructionsFor(band, page())
      assert.ok(out.length > 40, `${band} produced no usable direction`)
      assert.match(out, new RegExp(BANDS[band].voiceNote.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    }
  })

  test('an unknown band is not silently accepted', () => {
    assert.throws(() => instructionsFor('teenage', page()))
  })
})

describe('the direction never asks for a frightening read', () => {
  test('it forbids performing distress, at every band', () => {
    // A narrator who ACTS a dark beat is worse than a flat one at bedtime. The
    // beat is allowed to colour pacing and warmth, nothing more.
    for (const band of BAND_ORDER) {
      const out = instructionsFor(band, page({ emotionalBeat: 'Rising panic' }))
      assert.match(out, /Colour it, never act it/)
      assert.match(out, /Do not perform distress/)
    }
  })

  test('it still says never sound like an announcer', () => {
    const out = instructionsFor('young', page({ emotionalBeat: 'Joy' }))
    assert.match(out, /announcer/)
  })
})
