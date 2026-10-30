// Is the pipeline able to run right now?
//
// Three things stop a book getting made, and all three used to surface as a
// confusing error halfway through a paid run: no usable API key, missing
// reference art, or a book that fails validation. This answers all three in a
// couple of seconds and spends nothing.
//
// Run: node scripts/doctor.mjs

import { access } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from './lib/load-env.mjs'
import { loadAllBooks, ASSETS_DIR, PUBLIC_DIR } from './lib/book-source.mjs'
import { validateBook } from './lib/validate-book.mjs'
import {
  GEMINI_TEXT_MODEL,
  GEMINI_IMAGE_MODEL,
  OPENAI_TEXT_MODEL,
  OPENAI_IMAGE_MODEL,
} from './lib/provider.mjs'

await loadEnv()

const tick = (ok) => (ok ? 'ok  ' : 'FAIL')
let problems = 0

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

console.log('CREDENTIALS')

if (process.env.GEMINI_API_KEY) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
    )
    if (res.ok) {
      const json = await res.json()
      const names = (json.models ?? []).map((m) => m.name.replace('models/', ''))
      const hasText = names.includes(GEMINI_TEXT_MODEL)
      const hasImage = names.includes(GEMINI_IMAGE_MODEL)
      console.log(`  ok   gemini: key valid, ${names.length} models visible`)
      console.log(`  ${tick(hasText)} gemini text:  ${GEMINI_TEXT_MODEL}`)
      console.log(`  ${tick(hasImage)} gemini image: ${GEMINI_IMAGE_MODEL}`)
      if (!hasText || !hasImage) problems += 1
      // Authentication and credit are different failures and the message for the
      // second one is the only actionable thing, so probe it rather than guess.
      const probe = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Reply with the single word: ok' }] }],
            generationConfig: { maxOutputTokens: 8 },
          }),
        },
      )
      if (probe.ok) {
        console.log('  ok   gemini: a real call succeeded — authoring will work')
      } else {
        problems += 1
        const body = await probe.text()
        const why = probe.status === 402 ? 'out of prepayment credit' : `HTTP ${probe.status}`
        console.log(`  FAIL gemini: key is valid but the call failed (${why})`)
        if (probe.status === 402) {
          console.log('       top up at https://ai.studio/projects')
        } else {
          console.log(`       ${body.slice(0, 200)}`)
        }
      }
    } else {
      problems += 1
      console.log(`  FAIL gemini: key rejected (HTTP ${res.status})`)
    }
  } catch (e) {
    problems += 1
    console.log(`  FAIL gemini: ${e.message.slice(0, 160)}`)
  }
} else {
  console.log('  --   gemini: GEMINI_API_KEY not set')
}

if (process.env.OPENAI_API_KEY) {
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    })
    if (res.ok) {
      const json = await res.json()
      const names = (json.data ?? []).map((m) => m.id)
      console.log(`  ok   openai: key valid, ${names.length} models visible`)
      console.log(`  ${tick(names.includes(OPENAI_TEXT_MODEL))} openai text:  ${OPENAI_TEXT_MODEL}`)
      console.log(`  ${tick(names.includes(OPENAI_IMAGE_MODEL))} openai image: ${OPENAI_IMAGE_MODEL}`)
    } else {
      problems += 1
      const body = await res.text()
      const expired = /expired/i.test(body)
      console.log(
        `  FAIL openai: key rejected (HTTP ${res.status}${expired ? ', expired' : ''}) — create a new key`,
      )
    }
  } catch (e) {
    problems += 1
    console.log(`  FAIL openai: ${e.message.slice(0, 160)}`)
  }
} else {
  console.log('  --   openai: OPENAI_API_KEY not set')
}

console.log('\nBOOKS')
const books = await loadAllBooks()
for (const { slug, book, refs, bios } of books) {
  const { errors, warnings, stats } = validateBook({ book, refs, bios })

  const missingRefs = []
  for (const [id, rel] of Object.entries(refs)) {
    if (!(await exists(path.join(ASSETS_DIR, rel)))) missingRefs.push(`assets/${rel}`)
  }

  const missingArt = []
  for (const p of book.pages) {
    if (!(await exists(path.join(PUBLIC_DIR, p.art)))) missingArt.push(p.page)
  }

  const bad = errors.length + missingRefs.length
  if (bad) problems += 1
  console.log(
    `  ${tick(bad === 0)} ${slug.padEnd(22)} ${String(stats.pages).padStart(2)}pp` +
      `  ${String(stats.minWords).padStart(2)}-${String(stats.maxWords).padStart(2)}w` +
      `  art ${book.pages.length - missingArt.length}/${book.pages.length}` +
      (warnings.length ? `  ${warnings.length} warn` : ''),
  )
  for (const e of errors) console.log(`       ERROR ${e}`)
  for (const r of missingRefs) console.log(`       ERROR reference art missing: ${r}`)
  if (missingArt.length) {
    console.log(
      `       pages without art: ${missingArt.join(', ')}  ->  node scripts/generate-book.mjs --book ${slug} --only ${missingArt.join(',')}`,
    )
  }
}

console.log('\nCAST')
const refs = {}
const bios = {}
for (const b of books) {
  Object.assign(refs, b.refs)
  Object.assign(bios, b.bios)
}
for (const id of Object.keys(refs).sort()) {
  const hasRef = await exists(path.join(ASSETS_DIR, refs[id]))
  const served = await exists(path.join(PUBLIC_DIR, 'characters', `${id}.webp`))
  console.log(
    `  ${tick(hasRef)} ${id.padEnd(10)} reference ${hasRef ? 'present' : 'MISSING'}` +
      `, cover ${served ? 'present' : 'MISSING'}` +
      `, bio ${bios[id] ? 'present' : 'missing'}`,
  )
}

console.log(
  problems === 0
    ? '\nEverything checks out.'
    : `\n${problems} problem(s). Nothing above needs guessing — each line says what to do.`,
)
