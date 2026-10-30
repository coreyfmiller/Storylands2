// Generate the same passage in every available voice, side by side.
//
// Choosing the narrator is the one decision in this pipeline that cannot be
// made from a description, and it is expensive to get wrong: the voice has to be
// the same across the whole library, so changing it later means re-recording
// every book. So listen to all of them on one real page first.
//
// Writes assets/voice-samples/, which is gitignored and never served.
//
// Run: node scripts/voice-samples.mjs
//      node scripts/voice-samples.mjs --book nibs-perfect-acorn --page 8

import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { loadAllBooks, loadBook, ROOT } from './lib/book-source.mjs'
import { loadEnv } from './lib/load-env.mjs'

const args = process.argv.slice(2)
const value = (n) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : undefined
}

const VOICES = [
  { id: 'coral', note: 'warmest; closest to a parent at bedtime (current default)' },
  { id: 'nova', note: 'brighter and a little quicker' },
  { id: 'shimmer', note: 'softer and breathier' },
  { id: 'sage', note: 'calmer and lower' },
  { id: 'ballad', note: 'more storytelling, slightly theatrical' },
]

const INSTRUCTIONS = [
  'You are reading a picture book aloud to a four-year-old at bedtime.',
  'Warm, gentle and unhurried, with a smile in your voice.',
  'Slow down and land the last few words of each page.',
  'Give dialogue a light touch of character without doing broad voices.',
  'Let sentence-ending punctuation breathe; a short pause is better than a rushed line.',
  'Never sound like an announcer, an audiobook trailer, or a news reader.',
].join(' ')

const MODEL = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts'
const OUT = path.join(ROOT, 'assets', 'voice-samples')

function key() {
  const k = process.env.OPENAI_API_KEY
  if (!k) throw new Error('OPENAI_API_KEY is not set (put it in .env.local).')
  return k
}

async function speak(text, voice) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      voice,
      input: text,
      instructions: INSTRUCTIONS,
      response_format: 'mp3',
    }),
  })
  if (!res.ok) throw new Error(`TTS ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return Buffer.from(await res.arrayBuffer())
}

/**
 * A page worth judging a voice on: one that has dialogue in it.
 *
 * A page of pure narration tells you the tone and nothing about how the voice
 * handles a character speaking, which is where a read-aloud either charms a
 * child or sounds like a kiosk.
 */
async function pickPassage() {
  if (value('book')) {
    const { book } = await loadBook(value('book'))
    const n = Number(value('page') ?? 1)
    const page = book.pages.find((p) => p.page === n) ?? book.pages[0]
    return { title: book.title, page: page.page, text: page.text }
  }
  for (const { book } of await loadAllBooks()) {
    const page = book.pages.find((p) => /[\u201c"]/.test(p.text) && p.text.length > 120)
    if (page) return { title: book.title, page: page.page, text: page.text }
  }
  const { book } = (await loadAllBooks())[0]
  return { title: book.title, page: 1, text: book.pages[0].text }
}

function html(passage, made) {
  const rows = made
    .map(
      (m) => `    <section>
      <h2>${m.id}${m.id === 'coral' ? ' <em>(current)</em>' : ''}</h2>
      <p class="note">${m.note}</p>
      ${m.ok ? `<audio controls preload="none" src="${m.id}.mp3"></audio>` : `<p class="fail">failed: ${m.error}</p>`}
    </section>`,
    )
    .join('\n')

  return `<!doctype html>
<meta charset="utf-8">
<title>Storylands narrator samples</title>
<style>
  :root { color-scheme: dark }
  body { background:#141210; color:#e9e4dc; font:16px/1.6 system-ui, sans-serif;
         margin:0; padding:48px 24px; }
  main { max-width: 640px; margin: 0 auto }
  h1 { font-weight: 500; font-size: 28px; margin: 0 0 4px }
  .sub { color:#9a938a; margin:0 0 32px }
  blockquote { background:#f4e9d6; color:#3b2a1c; margin:0 0 36px; padding:24px;
               border-radius:10px; font:400 22px/1.45 Georgia, serif;
               white-space: pre-line }
  section { border-top:1px solid #2b2724; padding:20px 0 }
  h2 { font-size:17px; font-weight:600; margin:0 0 2px; text-transform:capitalize }
  h2 em { color:#d9a05b; font-style:normal; font-size:13px; font-weight:400 }
  .note { color:#9a938a; font-size:14px; margin:0 0 12px }
  .fail { color:#d98080; font-size:14px }
  audio { width:100% }
  footer { color:#6f6a64; font-size:13px; border-top:1px solid #2b2724;
           margin-top:28px; padding-top:20px }
  code { background:#241f1b; padding:2px 6px; border-radius:4px }
</style>
<main>
  <h1>Which narrator?</h1>
  <p class="sub">The same page, read by each voice. ${passage.title}, page ${passage.page}.</p>
  <blockquote>${passage.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</blockquote>
${rows}
  <footer>
    Pick one, then: <code>node scripts/narrate-book.mjs --all --voice &lt;name&gt; --force</code><br>
    One narrator across the whole library, so changing it later re-records every book.
  </footer>
</main>
`
}

async function main() {
  await loadEnv()
  await mkdir(OUT, { recursive: true })

  const passage = await pickPassage()
  console.log(`Passage: ${passage.title}, page ${passage.page}`)
  console.log(`Model: ${MODEL}\n`)

  const made = []
  for (const v of VOICES) {
    process.stdout.write(`${v.id.padEnd(9)} ... `)
    try {
      const mp3 = await speak(passage.text, v.id)
      await writeFile(path.join(OUT, `${v.id}.mp3`), mp3)
      made.push({ ...v, ok: true })
      console.log(`OK  ${(mp3.length / 1024).toFixed(0)}KB`)
    } catch (e) {
      made.push({ ...v, ok: false, error: String(e.message).slice(0, 120) })
      console.log('FAILED')
    }
  }

  const page = path.join(OUT, 'index.html')
  await writeFile(page, html(passage, made), 'utf8')
  console.log(`\nOpen this to compare them:\n  ${page}`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
