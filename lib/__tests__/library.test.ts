// The library's own invariants.
//
// These are the facts a reader can be misled by: a cover that opens the wrong
// book, a route that 404s, a picture a screen reader describes as nothing.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { books, bookSlugs, bookBySlug } from '../../books/index.ts'
import { bookCoverArt, describePage, pageArt, PAGE_EXT } from '../../books/types.ts'
import {
  bandsWithBooks,
  mainShelf,
  newShelf,
  nextInSeries,
  poolForBands,
  series,
  seriesById,
  seriesPosition,
  shelvesForBands,
  stories,
  storiesInSeries,
  storyByReaderSlug,
  thumbOf,
  RICH_SHELVES_THRESHOLD,
  TAG_SHELVES,
} from '../catalog.ts'
import { MAX_AGE, MIN_AGE, bandsForAge, publishedAges } from '../readers.ts'
import { BANDS } from '../bands.ts'

describe('the book registry', () => {
  test('every slug resolves to a book', () => {
    for (const slug of bookSlugs) {
      const book = bookBySlug(slug)
      assert.ok(book, `${slug} did not resolve`)
      assert.equal(book.id, slug, `${slug} disagrees with its own id`)
    }
  })

  test('an unknown slug resolves to nothing, so the route can 404', () => {
    assert.equal(bookBySlug('not-a-book'), undefined)
  })

  test('slugs are unique', () => {
    assert.equal(new Set(bookSlugs).size, bookSlugs.length)
  })
})

describe('page art paths', () => {
  test('are zero-padded and WebP', () => {
    assert.equal(pageArt('x', 1), 'books/x/pages/page-01.webp')
    assert.equal(pageArt('x', 13), 'books/x/pages/page-13.webp')
    assert.equal(PAGE_EXT, 'webp')
  })

  test('every page of every book has a derived art path', () => {
    for (const book of Object.values(books)) {
      for (const p of book.pages) {
        assert.equal(p.art, pageArt(book.id, p.page), `${book.id} p${p.page}`)
      }
    }
  })
})

describe('alt text', () => {
  // In a picture book the illustration carries half the story, so an empty alt
  // hands a child using a screen reader half a book.
  test('is never empty for any page of any book', () => {
    for (const book of Object.values(books)) {
      for (const p of book.pages) {
        const described = describePage(p)
        assert.ok(described.length > 10, `${book.id} p${p.page}: "${described}"`)
      }
    }
  })

  test('prefers a hand-written line over the derived one', () => {
    const page = {
      page: 1,
      text: 'x',
      art: 'x',
      alt: 'A hand-written description.',
      manifest: {
        charactersPresent: [],
        location: 'a valley',
        timeOfDay: 'dusk',
        action: 'something happens',
        emotionalBeat: '',
        requiredVisualFacts: [],
        forbiddenVisualFacts: [],
        composition: '',
      },
    }
    assert.equal(describePage(page), 'A hand-written description.')
  })
})

describe('the catalog agrees with the books on disk', () => {
  test('every readerSlug points at a real book', () => {
    for (const story of stories) {
      if (!story.readerSlug) continue
      assert.ok(
        bookBySlug(story.readerSlug),
        `catalog story "${story.id}" points at missing book "${story.readerSlug}"`,
      )
    }
  })

  test('every book on disk is reachable from the catalog', () => {
    for (const slug of bookSlugs) {
      assert.ok(storyByReaderSlug(slug), `book "${slug}" has no catalog entry, so nothing links to it`)
    }
  })

  test('story ids are unique', () => {
    const ids = stories.map((s) => s.id)
    assert.equal(new Set(ids).size, ids.length)
  })

  test('a book with no cover of its own falls back to its character portrait', () => {
    for (const book of Object.values(books)) {
      if (book.cover) continue
      const art = bookCoverArt(book)
      assert.equal(art.src, `characters/${book.character}.webp`)
      // The character portraits have the title painted into the artwork, so the
      // reader must NOT render it again on top. This flag is what stopped every
      // cover showing its title and subtitle twice.
      assert.equal(art.paintedTitle, true)
    }
  })

  test("a book's own cover is preferred, and is textless", () => {
    const [first] = Object.values(books)
    const art = bookCoverArt({ ...first, cover: 'books/x/cover.webp' })
    assert.equal(art.src, 'books/x/cover.webp')
    assert.equal(art.paintedTitle, false)
  })
})

describe('series', () => {
  test('every series has at least two readable books', () => {
    // A series of one is not a series. The catalog used to claim Juniper had
    // three books and Grey Point five, with one entry each and none openable.
    for (const s of series) {
      assert.ok(s.count >= 2, `series "${s.id}" has ${s.count} book(s)`)
      assert.equal(storiesInSeries(s.id).length, s.count, `"${s.id}" count disagrees with members`)
    }
  })

  test('every story in a series points at a real series', () => {
    for (const story of stories) {
      if (!story.seriesId) continue
      assert.ok(
        seriesById(story.seriesId),
        `"${story.id}" is in series "${story.seriesId}", which does not exist`,
      )
    }
  })

  test('reading order is stated and unique within a series', () => {
    for (const s of series) {
      const run = storiesInSeries(s.id)
      const orders = run.map((b) => b.seriesOrder)
      for (const [i, o] of orders.entries()) {
        assert.equal(typeof o, 'number', `"${run[i].id}" has no seriesOrder`)
      }
      assert.equal(new Set(orders).size, orders.length, `"${s.id}" has duplicate positions`)
    }
  })

  test('storiesInSeries returns reading order, not catalog order', () => {
    for (const s of series) {
      const orders = storiesInSeries(s.id).map((b) => b.seriesOrder as number)
      const sorted = [...orders].sort((a, b) => a - b)
      assert.deepEqual(orders, sorted)
    }
  })

  test('nextInSeries walks forward and stops at the end', () => {
    for (const s of series) {
      const run = storiesInSeries(s.id)
      for (let i = 0; i < run.length - 1; i++) {
        assert.equal(nextInSeries(run[i])?.id, run[i + 1].id)
      }
      // The last book must offer nothing rather than wrap onto book one, which
      // would hand a child a book they have already read as "what's next".
      assert.equal(nextInSeries(run[run.length - 1]), null)
    }
  })

  test('a standalone book has no next and no position', () => {
    const standalone = stories.find((s) => !s.seriesId)
    assert.ok(standalone, 'expected at least one standalone book')
    assert.equal(nextInSeries(standalone!), null)
    assert.equal(seriesPosition(standalone!), null)
  })

  test('seriesPosition counts from one', () => {
    for (const s of series) {
      const run = storiesInSeries(s.id)
      assert.deepEqual(seriesPosition(run[0]), { index: 1, total: run.length })
    }
  })
})

describe('the staging shelf stays off the main shelf', () => {
  test('the two shelves are disjoint and together are everything', () => {
    const main = new Set(mainShelf().map((s) => s.id))
    const staging = new Set(newShelf().map((s) => s.id))
    for (const id of staging) {
      assert.ok(!main.has(id), `"${id}" is on both shelves`)
    }
    assert.equal(main.size + staging.size, stories.length)
  })

  test('no main-shelf book is in a series with a staging book', () => {
    // Otherwise "next in series" would walk a child straight off a published
    // book onto an unreviewed one, which is the leak poolForBands exists to stop.
    for (const story of mainShelf()) {
      const next = nextInSeries(story)
      if (next) assert.notEqual(next.shelf, 'new', `"${story.id}" leads to staging book "${next.id}"`)
    }
  })
})

describe('thumbnails', () => {
  test('rewrite both art directories', () => {
    assert.equal(thumbOf('/art/pip.webp'), '/art/thumb/pip.webp')
    assert.equal(thumbOf('/characters/pip.webp'), '/characters/thumb/pip.webp')
  })

  test('leave an unknown path alone rather than inventing one', () => {
    assert.equal(thumbOf('/logo.png'), '/logo.png')
  })
})

describe('no age is shown an empty library', () => {
  // Adding the baby, toddler and middle bands broke this instantly: a
  // two-year-old resolved to [baby, toddler], both empty, so a child who had
  // been able to open seven books could open none. An age mapping that is
  // honest about the age ranges is still wrong if it hands back nothing.
  test('every allowed age can see at least one book', () => {
    for (let age = MIN_AGE; age <= MAX_AGE; age++) {
      const bands = bandsForAge(age)
      assert.ok(bands.length > 0, `age ${age} maps to no band at all`)
      assert.ok(
        poolForBands(bands).length > 0,
        `age ${age} sees an empty library (bands: ${bands.join(', ')})`,
      )
    }
  })

  test('a reader is only ever offered bands that have books', () => {
    const available = bandsWithBooks()
    for (let age = MIN_AGE; age <= MAX_AGE; age++) {
      for (const b of bandsForAge(age)) {
        assert.ok(available.includes(b), `age ${age} offered the empty "${b}" band`)
      }
    }
  })

  test('bandsWithBooks is derived from the catalog, not written down', () => {
    const declared = new Set(mainShelf().filter((s) => s.readerSlug).map((s) => s.band))
    assert.deepEqual(new Set(bandsWithBooks()), declared)
  })

  test('the stated age range matches the bands that have books', () => {
    // The UI may only claim ages it actually publishes for. MIN_AGE went to 0
    // for the baby band and three screens immediately began promising "ages 0
    // to 12" on a library written entirely for 4 to 6.
    const { min, max } = publishedAges()
    const bands = bandsWithBooks()
    assert.ok(bands.length > 0, 'expected at least one band with books')
    assert.equal(min, Math.min(...bands.map((b) => BANDS[b].ages[0])))
    assert.equal(max, Math.max(...bands.map((b) => BANDS[b].ages[1])))
    // And it must be narrower than what a profile accepts, or the two facts
    // have been conflated again.
    assert.ok(min >= MIN_AGE && max <= MAX_AGE)
  })
})

describe('no shelf is dead config', () => {
  // Three rows -- "Mysteries Worth Solving", "Strange Things Are Happening" and
  // "Stories for a Rainy Night" -- filtered for tags no book has ever carried.
  // They looked like deliberate configuration and could never render.
  test('every tag shelf heading maps to a tag some book carries', () => {
    const tags = new Set(stories.flatMap((s) => s.tags))
    for (const { tag, title } of TAG_SHELVES) {
      assert.ok(tags.has(tag), `shelf "${title}" filters for "${tag}", which no book has`)
    }
  })

  test('every shelf that renders has at least its own minimum', () => {
    for (const band of bandsWithBooks()) {
      for (const shelf of shelvesForBands([band])) {
        assert.ok(
          shelf.stories.length >= 2,
          `"${shelf.title}" rendered with ${shelf.stories.length} book(s)`,
        )
      }
    }
  })

  test('no two shelves in one band carry the same heading', () => {
    for (const band of bandsWithBooks()) {
      const titles = shelvesForBands([band]).map((s) => s.title)
      assert.equal(new Set(titles).size, titles.length, `duplicate heading in "${band}"`)
    }
  })

  test('the rich-shelf threshold is reachable by one band', () => {
    // It was 20, counted per BAND rather than per library. Splitting the
    // catalog four ways made it unreachable, so the rows would never appear.
    assert.ok(
      RICH_SHELVES_THRESHOLD <= 12,
      `threshold ${RICH_SHELVES_THRESHOLD} is too high for a four-band catalog`,
    )
  })
})
