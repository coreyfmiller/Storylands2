import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { validateBook, WORD_CEILING } from '../lib/validate-book.mjs'

const refs = { pip: 'characters/pip.png', tilly: 'characters/Tilly.png' }
const bios = { pip: 'Pip, a small red dragon', tilly: 'Tilly, a small brown owl' }

const PRODUCT_RULES = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
]

function page(n, overrides = {}) {
  const { text, ...manifestOverrides } = overrides
  return {
    page: n,
    text: text ?? `Page ${n}. Pip looked at the lantern and wondered what would happen if he waited a little longer.`,
    art: '',
    manifest: {
      charactersPresent: ['pip'],
      location: 'a warm valley',
      timeOfDay: 'dusk',
      action: 'Pip sits on a rock looking up',
      emotionalBeat: 'gentle longing',
      requiredVisualFacts: ['Pip fully visible'],
      forbiddenVisualFacts: [...PRODUCT_RULES],
      composition: 'centred with generous margin',
      ...manifestOverrides,
    },
  }
}

function book(overrides = {}, pageOverrides = {}) {
  return {
    id: 'pip-test',
    title: 'A Test',
    subtitle: 'For the validator.',
    character: 'pip',
    ages: 'Ages 4+',
    minutes: 6,
    pages: Array.from({ length: 13 }, (_, i) => page(i + 1, pageOverrides)),
    ...overrides,
  }
}

const check = (b) => validateBook({ book: b, refs, bios })

describe('a well-formed book', () => {
  test('passes with no errors', () => {
    const { errors } = check(book())
    assert.deepEqual(errors, [])
  })
})

describe('the word budget', () => {
  test('rejects a page over the ceiling', () => {
    const long = Array.from({ length: WORD_CEILING + 5 }, () => 'word').join(' ')
    const b = book()
    b.pages[3].text = long
    const { errors } = check(b)
    assert.ok(
      errors.some((e) => e.includes('page 4') && e.includes('ceiling')),
      `expected a ceiling error, got ${JSON.stringify(errors)}`,
    )
  })

  test('accepts a page exactly at the ceiling', () => {
    const b = book()
    b.pages[3].text = Array.from({ length: WORD_CEILING }, () => 'word').join(' ')
    const { errors } = check(b)
    assert.equal(errors.length, 0)
  })

  test('rejects more than three paragraphs', () => {
    const b = book()
    b.pages[0].text = 'One here.\n\nTwo here.\n\nThree here.\n\nFour here.'
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('paragraphs')))
  })
})

describe('the textless rule', () => {
  test('rejects a signpost in the staged action', () => {
    const b = book({}, { action: 'Pip stands beside a wooden signpost' })
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('signpost')))
  })

  test('rejects a required fact that cannot be textless', () => {
    const b = book({}, { requiredVisualFacts: ['a newspaper on the table'] })
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('newspaper')))
  })

  // Nibs page 5 is a map drawn entirely in pictograms, and it is the best page
  // in that book. A flat ban on the word "map" would reject it.
  test('allows a map that is declared wordless', () => {
    const b = book(
      {},
      {
        action: 'Pip holds up a crude map with only scribbles and arrows, no readable text',
        requiredVisualFacts: ['Pip holding a map of scribbles, no readable text'],
        forbiddenVisualFacts: [...PRODUCT_RULES, 'readable words or letters on the map'],
      },
    )
    const { errors } = check(b)
    assert.deepEqual(errors, [])
  })

  test('rejects a map that is not declared wordless', () => {
    const b = book({}, { action: 'Pip holds up a map' })
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('map') && e.includes('wordless')))
  })

  test('requires both product rules on every page', () => {
    const b = book()
    b.pages[6].manifest.forbiddenVisualFacts = ['scary imagery']
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('page 7') && e.includes('signage')))
  })
})

describe('the ending', () => {
  test('rejects a final page without the protagonist', () => {
    const b = book()
    b.pages[12].manifest.charactersPresent = ['tilly']
    const { errors } = check(b)
    assert.ok(
      errors.some((e) => e.includes('final page') && e.includes('pip')),
      `expected a final-page error, got ${JSON.stringify(errors)}`,
    )
  })

  test('rejects prose that states the moral', () => {
    const b = book()
    b.pages[12].text = 'And so Pip learned that being kind is what matters most of all in the end.'
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('moral')))
  })
})

describe('structural rules', () => {
  test('rejects a page count outside 12-16', () => {
    const b = book({ pages: Array.from({ length: 8 }, (_, i) => page(i + 1)) })
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('8 pages')))
  })

  test('rejects a gap in page numbering', () => {
    const b = book()
    b.pages[5].page = 99
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('numbering')))
  })

  test('rejects a character with no reference art', () => {
    const b = book({}, { charactersPresent: ['pip', 'ghost'] })
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('ghost') && e.includes('CHARACTER_REFS')))
  })

  test('rejects a non-slug id, because it is also the reader route', () => {
    const { errors } = check(book({ id: 'Pip First Flame!' }))
    assert.ok(errors.some((e) => e.includes('kebab-case')))
  })

  test('rejects an empty manifest field', () => {
    const b = book({}, { composition: '' })
    const { errors } = check(b)
    assert.ok(errors.some((e) => e.includes('manifest.composition')))
  })
})

describe('warnings are advisory, never blocking', () => {
  test('a short page warns but does not fail', () => {
    const b = book()
    b.pages[2].text = 'Pip waited.'
    const { errors, warnings } = check(b)
    assert.deepEqual(errors, [])
    assert.ok(warnings.some((w) => w.includes('page 3')))
  })
})
