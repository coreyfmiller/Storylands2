// The series world lock.
//
// Characters have been held consistent since the beginning by seeding every
// page with an approved reference image. The WORLD never was — palette, light
// and environment were re-invented per book, so across three Lantern Valley
// books the river has been a broad bright lake, a frozen stream at sunset and a
// narrow dusk waterway. A series a child returns to has to be the same place.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { seriesWorld } from '../lib/compile-prompt.mjs'
import { ASSETS_DIR } from '../lib/book-source.mjs'

const dir = path.join(ASSETS_DIR, 'series')
const files = await readdir(dir)
const worlds = []
for (const f of files.filter((f) => f.endsWith('.json'))) {
  worlds.push(JSON.parse(await readFile(path.join(dir, f), 'utf8')))
}

describe('seriesWorld produces prompt text', () => {
  test('a standalone book gets nothing at all', () => {
    // Most books are not in a series, and an empty string must drop out of the
    // prompt rather than appearing as a stray fragment.
    assert.equal(seriesWorld(null), '')
    assert.equal(seriesWorld(undefined), '')
  })

  test('it names the series and insists on sameness', () => {
    const out = seriesWorld(worlds[0])
    assert.match(out, new RegExp(worlds[0].name))
    assert.match(out, /same place/i)
  })

  test('it carries the palette, the light and the forbidden list', () => {
    for (const w of worlds) {
      const out = seriesWorld(w)
      assert.match(out, /PALETTE:/, `${w.id} lost its palette`)
      assert.match(out, /LIGHT:/, `${w.id} lost its light`)
      // The forbidden list is what actually keeps two series apart; without it
      // the models put paper lanterns in the oak clearing.
      assert.match(out, /NEVER in this world:/, `${w.id} lost its forbidden list`)
    }
  })

  test('a partial bible does not produce empty labels', () => {
    const out = seriesWorld({ id: 'x', name: 'X', world: 'a place' })
    assert.match(out, /THE PLACE: a place/)
    assert.doesNotMatch(out, /PALETTE:/)
    assert.doesNotMatch(out, /NEVER in this world/)
  })
})

describe('the world bibles are usable', () => {
  for (const w of worlds) {
    test(`${w.id} declares what it needs`, () => {
      for (const field of ['id', 'name', 'world', 'palette', 'light']) {
        assert.ok(w[field], `${w.id} is missing ${field}`)
      }
      assert.ok(w.recurring?.length, `${w.id} lists no recurring objects`)
      assert.ok(w.forbidden?.length, `${w.id} forbids nothing`)
    })
  }

  test('no two series share a world id', () => {
    const ids = worlds.map((w) => w.id)
    assert.equal(new Set(ids).size, ids.length)
  })

  test('the two worlds exclude each other', () => {
    // The whole point of the forbidden lists: Lantern Valley is lantern-lit and
    // at dusk, The Crooked Root is a daylit clearing. Each has to rule the
    // other out or they converge on a generic storybook wood.
    const valley = worlds.find((w) => w.id === 'pip')
    const root = worlds.find((w) => w.id === 'crooked-root')
    if (!valley || !root) return
    assert.match(root.forbidden.join(' '), /lantern/i, 'the clearing allows lanterns')
    assert.match(valley.forbidden.join(' '), /daylight|midday/i, 'the valley allows midday sun')
  })
})
