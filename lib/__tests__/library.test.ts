// The library's own invariants.
//
// These are the facts a reader can be misled by: a cover that opens the wrong
// book, a route that 404s, a picture a screen reader describes as nothing.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { books, bookSlugs, bookBySlug } from '../../books/index.ts'
import { bookCover, describePage, pageArt, PAGE_EXT } from '../../books/types.ts'
import { stories, storyByReaderSlug, thumbOf } from '../catalog.ts'

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

  test('cover art for a book matches its character', () => {
    for (const book of Object.values(books)) {
      assert.equal(bookCover(book), `characters/${book.character}.webp`)
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
