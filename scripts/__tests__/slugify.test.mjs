// The slug is the reader route, so a person reads it.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { slugify } from '../lib/slugify.mjs'

describe('slugify', () => {
  test('never ends on a stop word', () => {
    // The real failure: a flat four-word cut gave `the-finest-thing-in`.
    assert.equal(slugify('The Finest Thing in the Wood'), 'finest-thing-in-the-wood')
  })

  test('drops a leading article', () => {
    assert.equal(slugify('The Last Firefly'), 'last-firefly')
    assert.equal(slugify('A Very Bad Idea'), 'very-bad-idea')
  })

  test('keeps a short title whole', () => {
    assert.equal(slugify('Oliver vs. The Vacuum'), 'oliver-vs-the-vacuum')
  })

  test('caps length without leaving a dangling word', () => {
    const s = slugify('Nibs and the Absolutely Perfect Acorn of Great Renown')
    assert.ok(s.split('-').length <= 5, s)
    assert.ok(!s.endsWith('-of'), s)
  })

  test('strips apostrophes and punctuation', () => {
    assert.equal(slugify("Juniper's Moonlight Delivery!"), 'junipers-moonlight-delivery')
  })

  test('produces a valid route slug for anything', () => {
    for (const title of ['A', 'The The The', '???', 'Pip & Lumi: Night 2']) {
      const s = slugify(title)
      if (s) assert.match(s, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${title} -> ${s}`)
    }
  })
})

describe('long titles', () => {
  // A flat truncation kept the filler and threw away the noun.
  test('squeezes out small words rather than cutting the subject', () => {
    assert.equal(
      slugify('Pixie and the Enormous Little Rainbow'),
      'pixie-enormous-little-rainbow',
    )
  })

  test('leaves a short title so its small words stay', () => {
    assert.equal(slugify('Oliver vs. The Vacuum'), 'oliver-vs-the-vacuum')
    assert.equal(slugify('The Finest Thing in the Wood'), 'finest-thing-in-the-wood')
  })
})
