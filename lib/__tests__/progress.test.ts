// Reading progress.
//
// The rule that matters most: the stored page only ever moves forward. Flicking
// back to look at an earlier picture is completely normal in a picture book, and
// it must not cost a child their place.

import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { readProgress, recordProgress, clearProgress, isResumable } from '../progress.ts'

/** A localStorage stand-in, so these run in Node with no browser. */
function installStorage() {
  const store = new Map<string, string>()
  const localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  }
  ;(globalThis as Record<string, unknown>).window = { localStorage }
  return store
}

let store: Map<string, string>
beforeEach(() => {
  store = installStorage()
})

describe('recordProgress', () => {
  test('stores the page reached', () => {
    recordProgress('pip', 4, 13)
    assert.equal(readProgress().pip.page, 4)
    assert.equal(readProgress().pip.total, 13)
  })

  test('moves forward', () => {
    recordProgress('pip', 2, 13)
    recordProgress('pip', 7, 13)
    assert.equal(readProgress().pip.page, 7)
  })

  test('never moves backward when a reader flicks back', () => {
    recordProgress('pip', 9, 13)
    recordProgress('pip', 3, 13)
    assert.equal(readProgress().pip.page, 9)
  })

  test('latches finished once the last page is reached', () => {
    recordProgress('pip', 12, 13)
    assert.equal(readProgress().pip.finished, true)
    // Reading it again from the start must not un-finish it.
    recordProgress('pip', 1, 13)
    assert.equal(readProgress().pip.finished, true)
  })

  test('clamps a page outside the book', () => {
    recordProgress('pip', 99, 13)
    assert.equal(readProgress().pip.page, 12)
    recordProgress('oliver', -5, 14)
    assert.equal(readProgress().oliver.page, 0)
  })

  test('restarts the furthest page when the book gains pages', () => {
    recordProgress('pip', 9, 13)
    recordProgress('pip', 2, 14)
    // 9 of 13 is not 9 of 14, so the old high-water mark is not carried over.
    assert.equal(readProgress().pip.page, 2)
    assert.equal(readProgress().pip.total, 14)
  })

  test('keeps books apart', () => {
    recordProgress('pip', 3, 13)
    recordProgress('nibs', 8, 14)
    assert.equal(readProgress().pip.page, 3)
    assert.equal(readProgress().nibs.page, 8)
  })
})

describe('readProgress', () => {
  test('is empty on a fresh device', () => {
    assert.deepEqual(readProgress(), {})
  })

  test('survives a corrupt value rather than throwing', () => {
    store.set('storylands:progress:v1', 'not json at all')
    assert.deepEqual(readProgress(), {})
  })

  test('drops records of the wrong shape', () => {
    store.set(
      'storylands:progress:v1',
      JSON.stringify({
        good: { page: 1, total: 13, finished: false, updatedAt: 1 },
        bad: { page: 'two' },
        alsoBad: null,
      }),
    )
    assert.deepEqual(Object.keys(readProgress()), ['good'])
  })
})

describe('clearProgress', () => {
  test('forgets one book and leaves the rest', () => {
    recordProgress('pip', 3, 13)
    recordProgress('nibs', 8, 14)
    clearProgress('pip')
    assert.equal(readProgress().pip, undefined)
    assert.equal(readProgress().nibs.page, 8)
  })
})

describe('isResumable', () => {
  const at = (page: number, finished = false) => ({ page, total: 13, finished, updatedAt: 1 })

  test('page one is not somewhere to resume', () => {
    assert.equal(isResumable(at(0)), false)
  })

  test('a finished book is not resumable, it is re-readable', () => {
    assert.equal(isResumable(at(9, true)), false)
  })

  test('mid-book is resumable', () => {
    assert.equal(isResumable(at(5)), true)
  })

  test('nothing stored is not resumable', () => {
    assert.equal(isResumable(undefined), false)
  })
})
