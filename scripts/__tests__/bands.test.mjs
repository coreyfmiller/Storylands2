// The age bands, and the proof that they actually change what passes.
//
// The whole point of lib/bands.ts is that a board book and a 6-8 story are
// different artifacts, not the same one with a different word count. If the
// validator ignored the band, every test here would still pass against a single
// global budget — so the load-bearing assertions are the ones checking that a
// book correct for ONE band is rejected by another.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { validateBook } from '../lib/validate-book.mjs'
import {
  BANDS,
  BAND_LIST,
  BAND_ORDER,
  MIN_BAND_AGE,
  MAX_BAND_AGE,
  bandForAge,
  bandSpec,
  bandsForReaderAge,
} from '../../lib/bands.ts'

const refs = { pip: 'characters/pip.png', tilly: 'characters/Tilly.png' }
const bios = { pip: 'Pip, a small red dragon', tilly: 'Tilly, a small brown owl' }

const PRODUCT_RULES = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
]

const SHOTS = ['establishing', 'wide', 'mid', 'close', 'detail', 'low', 'high', 'overShoulder']

/**
 * Openers to rotate through, so a fixture doesn't trip the repeated-opener rule.
 *
 * The first version of this helper began every page with "Pip" and the validator
 * duly rejected the 4-6 and 6-8 fixtures with "13 pages open with pip". That was
 * the rule working correctly on a badly built fixture, and there have to be more
 * than OPENER_LIMIT of these for the rotation to be safe.
 */
const OPENERS = ['Pip', 'Later', 'Outside', 'Somewhere', 'Softly', 'Away']

/** Prose of exactly `n` words, so a word-budget assertion is unambiguous. */
function words(n, seed = 'lantern', opener = 0) {
  const first = OPENERS[opener % OPENERS.length]
  return Array.from({ length: n }, (_, i) => (i === 0 ? first : seed)).join(' ') + '.'
}

function page(n, { text, cast = ['pip'], shot, location = 'a warm valley' } = {}) {
  return {
    page: n,
    text,
    art: '',
    manifest: {
      charactersPresent: cast,
      location,
      timeOfDay: 'dusk',
      action: 'Pip sits on a rock looking up',
      emotionalBeat: `beat ${n}`,
      requiredVisualFacts: ['Pip fully visible'],
      forbiddenVisualFacts: [...PRODUCT_RULES],
      composition: 'centred with generous margin',
      shotType: shot ?? SHOTS[n % SHOTS.length],
    },
  }
}

/**
 * A book shaped correctly for its band: the band's page count, prose at the
 * band's target length, a refrain where one is required, and a second character
 * who arrives and speaks where one is required.
 */
function bookFor(bandId) {
  const spec = bandSpec(bandId)
  const n = spec.pages.target
  const refrain = 'Where is the little light'

  const pages = Array.from({ length: n }, (_, i) => {
    const num = i + 1
    // Three or more locations, for the plot bands' scene-change warning.
    const location = ['a warm valley', 'the river bend', 'the high meadow'][i % 3]

    let text = words(spec.words.target, 'lantern', i)
    if (spec.requires.refrain && num % 2 === 1) {
      // The refrain has to be a whole repeated line, so it goes in as its own
      // sentence alongside enough filler to hit the band's word target.
      const rest = Math.max(0, spec.words.target - 5)
      text = `${refrain}. ${words(rest, 'lantern', i)}`
    }

    // Dialogue, on as many pages as the band requires, from the second
    // character — who must be absent from the opening pages so they can arrive.
    const needsSpeech = spec.requires.dialoguePages > 0 && num > 2 && num <= 2 + spec.requires.dialoguePages
    const cast = needsSpeech && spec.requires.secondCharacter ? ['pip', 'tilly'] : ['pip']
    if (needsSpeech) {
      text = `${text} \u201cWell, now, where did it go?\u201d asked Tilly.`
    }

    return page(num, { text, cast, location })
  })

  return {
    id: 'pip-test',
    title: 'A Test',
    subtitle: 'Pip, and a light that will not stay put.',
    character: 'pip',
    ages: spec.agesLabel,
    minutes: spec.minutes,
    band: bandId,
    pages,
  }
}

const check = (book, opts = {}) => validateBook({ book, refs, bios, ...opts })

describe('the band specs are internally consistent', () => {
  for (const spec of BAND_LIST) {
    test(`${spec.id}: ranges are ordered`, () => {
      assert.ok(spec.ages[0] <= spec.ages[1], 'age range is backwards')
      assert.ok(spec.pages.min <= spec.pages.target, 'page target below the minimum')
      assert.ok(spec.pages.target <= spec.pages.max, 'page target above the maximum')
      assert.ok(spec.words.min < spec.words.target, 'word target at or below the minimum')
      assert.ok(spec.words.target < spec.words.max, 'word target at or above the maximum')
      assert.ok(spec.words.max < spec.words.ceiling, 'ceiling not above the comfortable band')
      assert.ok(spec.spread > 0, 'spread limit must be positive')
      assert.ok(spec.paragraphs >= 1, 'at least one paragraph per page')
    })
  }

  test('the bands cover 0 to 8 with no gap', () => {
    assert.equal(MIN_BAND_AGE, 0)
    assert.equal(MAX_BAND_AGE, 8)
    for (let age = 0; age <= 8; age++) {
      const id = bandForAge(age)
      assert.ok(BAND_ORDER.includes(id), `age ${age} resolved to "${id}"`)
    }
  })

  test('every band is reachable from some age', () => {
    const reached = new Set()
    for (let age = 0; age <= 20; age++) reached.add(bandForAge(age))
    for (const id of BAND_ORDER) {
      assert.ok(reached.has(id), `no age maps to the "${id}" band`)
    }
  })

  test('word budgets rise with age, and page length never shrinks', () => {
    for (let i = 1; i < BAND_LIST.length; i++) {
      const prev = BAND_LIST[i - 1]
      const next = BAND_LIST[i]
      assert.ok(
        next.words.target > prev.words.target,
        `${next.id} does not ask for more words than ${prev.id}`,
      )
    }
  })

  test('an older reader is never resolved to an empty library', () => {
    // A twelve-year-old reading these to a younger sibling is a real case, and
    // bandsForAge used to be the function that returned [] below age 2.
    assert.ok(bandsForReaderAge(12).length > 0)
    assert.ok(bandsForReaderAge(0).length > 0)
  })

  test('a reader sees their own band', () => {
    for (let age = 0; age <= 8; age++) {
      assert.ok(
        bandsForReaderAge(age).includes(bandForAge(age)),
        `age ${age} cannot see its own band`,
      )
    }
  })
})

describe('a book is validated against its own band', () => {
  for (const id of BAND_ORDER) {
    test(`${id}: a correctly shaped book passes, loose and strict`, () => {
      const book = bookFor(id)
      const loose = check(book)
      assert.deepEqual(loose.errors, [], `loose errors: ${loose.errors.join(' | ')}`)

      const strict = check(book, { strict: true })
      assert.deepEqual(strict.errors, [], `strict errors: ${strict.errors.join(' | ')}`)
    })

    test(`${id}: stats report the band it was judged as`, () => {
      const { stats } = check(bookFor(id))
      assert.equal(stats.band, id)
      assert.equal(stats.budget.words.ceiling, BANDS[id].words.ceiling)
    })
  }

  // This is the assertion that proves bands do something. Without it, every
  // test above would still pass against one global budget.
  test('a board book is rejected as a 4-6 book', () => {
    const baby = bookFor('baby')
    const asYoung = validateBook({ book: baby, refs, bios, band: 'young' })
    assert.ok(
      asYoung.errors.some((e) => /pages/.test(e)),
      `expected a page-count error, got: ${asYoung.errors.join(' | ')}`,
    )
  })

  test('a 6-8 book is rejected as a board book', () => {
    const middle = bookFor('middle')
    const asBaby = validateBook({ book: middle, refs, bios, band: 'baby' })
    assert.ok(
      asBaby.errors.some((e) => /words, ceiling/.test(e)),
      `expected a word-ceiling error, got: ${asBaby.errors.join(' | ')}`,
    )
  })

  test('an undeclared band is treated as 4-6, so the original books still load', () => {
    const book = bookFor('young')
    delete book.band
    const { stats, errors } = check(book)
    assert.equal(stats.band, 'young')
    assert.deepEqual(errors, [])
  })

  test('the page ceiling is the band\'s, not a global 50', () => {
    const baby = bookFor('baby')
    baby.pages[0].text = words(20)
    const { errors } = check(baby)
    assert.ok(
      errors.some((e) => /ceiling for Ages 0/.test(e)),
      `20 words should breach the baby ceiling: ${errors.join(' | ')}`,
    )
  })
})

describe('the refrain rule', () => {
  test('a baby book with no repeated line fails strict', () => {
    const baby = bookFor('baby')
    // Make every page distinct, which is exactly wrong for this band.
    baby.pages.forEach((p, i) => {
      p.text = words(BANDS.baby.words.target, `thing${i}`)
    })
    const { errors } = check(baby, { strict: true })
    assert.ok(
      errors.some((e) => /refrain/.test(e)),
      `expected a refrain error, got: ${errors.join(' | ')}`,
    )
  })

  test('a 4-6 book is not asked for a refrain', () => {
    const young = bookFor('young')
    const { errors, warnings } = check(young, { strict: true })
    const all = [...errors, ...warnings].join(' | ')
    assert.ok(!/refrain/.test(all), `4-6 should not mention a refrain: ${all}`)
  })

  test('a refrain does not trip the repeated-opener rule', () => {
    // These two rules directly contradict each other, which is why the opener
    // check is skipped on the refrain bands. A refrain used as a page opener is
    // several pages starting with the same word, and that is correct here.
    const baby = bookFor('baby')
    const { errors, warnings } = check(baby, { strict: true })
    const all = [...errors, ...warnings].join(' | ')
    assert.ok(!/open with/.test(all), `the refrain was penalised as a tic: ${all}`)
  })
})

describe('structural rules switch off where they do not apply', () => {
  test('a board book is not required to have a second character', () => {
    const baby = bookFor('baby')
    const { errors } = check(baby, { strict: true })
    assert.ok(
      !errors.some((e) => /second character/.test(e)),
      `errors: ${errors.join(' | ')}`,
    )
  })

  test('a board book is not required to carry dialogue', () => {
    const baby = bookFor('baby')
    const { errors } = check(baby, { strict: true })
    assert.ok(!errors.some((e) => /spoken line/.test(e)), `errors: ${errors.join(' | ')}`)
  })

  test('a 4-6 book IS required to have a second character', () => {
    const young = bookFor('young')
    // Strip the companion out entirely.
    young.pages.forEach((p) => {
      p.manifest.charactersPresent = ['pip']
      p.text = words(BANDS.young.words.target)
    })
    const { errors } = check(young, { strict: true })
    assert.ok(
      errors.some((e) => /second character/.test(e)),
      `errors: ${errors.join(' | ')}`,
    )
  })

  test('a board book may repeat the same shot type throughout', () => {
    const baby = bookFor('baby')
    baby.pages.forEach((p) => {
      p.manifest.shotType = 'close'
    })
    const { errors } = check(baby, { strict: true })
    assert.ok(
      !errors.some((e) => /consecutive|distinct shot/.test(e)),
      `repetition is correct for a board book: ${errors.join(' | ')}`,
    )
  })

  test('a 4-6 book may not repeat the same shot type throughout', () => {
    const young = bookFor('young')
    young.pages.forEach((p) => {
      p.manifest.shotType = 'close'
    })
    const { errors } = check(young, { strict: true })
    assert.ok(
      errors.some((e) => /consecutive|distinct shot/.test(e)),
      `errors: ${errors.join(' | ')}`,
    )
  })

  test('an unknown shot type is an error at every band', () => {
    for (const id of BAND_ORDER) {
      const book = bookFor(id)
      book.pages[0].manifest.shotType = 'dutchAngle'
      const { errors } = check(book)
      assert.ok(
        errors.some((e) => /unknown shotType/.test(e)),
        `${id} accepted an unknown shot type`,
      )
    }
  })

  test('the no-stated-moral rule is on at every band', () => {
    for (const id of BAND_ORDER) {
      const book = bookFor(id)
      const last = book.pages[book.pages.length - 1]
      last.text = 'And Pip had learned something that day.'
      const { errors } = check(book, { strict: true })
      assert.ok(
        errors.some((e) => /tells the reader the point/.test(e)),
        `${id} let a stated moral through: ${errors.join(' | ')}`,
      )
    }
  })
})

describe('a refrain can be as short as a toddler needs', () => {
  /** A toddler book carrying `refrain` on the pages given. */
  function withRefrain(refrain, onPages) {
    const book = bookFor('toddler')
    book.pages.forEach((p, i) => {
      const base = words(14, 'lantern', i)
      p.text = onPages.includes(i + 1) ? `${base}\n\n${refrain}` : base
    })
    // Keep the band's other strict rules satisfied.
    book.pages[2].text += ' \u201cWhere did it go?\u201d he said.'
    book.pages[3].text += ' \u201cThere you are,\u201d he said.'
    return book
  }

  test('a two-sentence refrain of two-word halves counts', () => {
    // "Still there. Still stuck." is a correct toddler refrain. The first
    // version of this rule split on sentences and required three words, so both
    // halves were discarded and a book that repeated it four times was rejected
    // three times running for having no refrain.
    const book = withRefrain('Still there. Still stuck.', [2, 4, 6, 8])
    const { errors } = check(book, { strict: true })
    assert.ok(
      !errors.some((e) => /refrain/.test(e)),
      `rejected a real refrain: ${errors.join(' | ')}`,
    )
  })

  test('a single short sentence counts', () => {
    const book = withRefrain('Not yet.', [2, 5, 8])
    const { errors } = check(book, { strict: true })
    assert.ok(!errors.some((e) => /refrain/.test(e)), errors.join(' | '))
  })

  test('a one-word repeat is a sound effect, not a refrain', () => {
    const book = withRefrain('Oof.', [2, 4, 6, 8])
    const { errors } = check(book, { strict: true })
    assert.ok(
      errors.some((e) => /refrain/.test(e)),
      'a single repeated word should not satisfy the rule',
    )
  })

  test('a refrain on only two pages is not enough', () => {
    const book = withRefrain('Still there. Still stuck.', [3, 7])
    const { errors } = check(book, { strict: true })
    assert.ok(errors.some((e) => /refrain/.test(e)), errors.join(' | '))
  })

  test('the same line twice on one page does not count twice', () => {
    const book = withRefrain('Still there. Still stuck.', [4])
    book.pages[3].text += '\n\nStill there. Still stuck.'
    const { errors } = check(book, { strict: true })
    assert.ok(
      errors.some((e) => /refrain/.test(e)),
      'a refrain must come back after a page turn, not repeat on one page',
    )
  })
})
