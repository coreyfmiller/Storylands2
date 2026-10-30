// Record a human-sounding narrator for every page of a book.
//
// The reader used to lean on the browser's own speechSynthesis, which hands a
// child whatever voice the device happens to have — robotic on most Androids,
// Siri on an iPhone, different on every device, and impossible to direct. For a
// bedtime picture book the voice IS the product, so it is recorded once here
// instead of synthesised on the phone.
//
// Two calls per page:
//   1. gpt-4o-mini-tts, which takes an `instructions` field, so the delivery can
//      actually be directed rather than hoped for.
//   2. whisper-1 with word timestamps, so the on-page sentence highlight is
//      exact. The browser's own `boundary` events were the alternative and they
//      are unreliable: Safari fires them sparsely and some voices never do.
//
// Output:
//   public/books/<slug>/audio/page-NN.mp3
//   public/books/<slug>/audio/narration.json   (voice, and per-page timings)
//
// Run:
//   node scripts/narrate-book.mjs --book <slug>
//   node scripts/narrate-book.mjs --all
//   node scripts/narrate-book.mjs --book <slug> --voice nova --force
//   node scripts/narrate-book.mjs --book <slug> --only 3,4

import { writeFile, mkdir, access, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { loadBook, bookSlugs, PUBLIC_DIR } from './lib/book-source.mjs'
import { segmentsOf, wordsOf } from './lib/segments.mjs'
import { loadEnv } from './lib/load-env.mjs'
import { bandSpec } from '../lib/bands.ts'
import { DEFAULT_BAND } from './lib/validate-book.mjs'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const value = (n) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : undefined
}

/**
 * Warm female voices. `coral` reads closest to a parent at bedtime; `nova` is
 * brighter and `shimmer` softer. Not a per-book setting by default — one
 * narrator across the whole library is part of it feeling like one shelf.
 */
const VOICES = ['coral', 'nova', 'shimmer', 'sage', 'ballad']
const VOICE = value('voice') ?? 'coral'

/**
 * How to read it. This is the whole reason for using a directable TTS model
 * rather than the device's voice.
 */
function instructionsFor(band) {
  const spec = bandSpec(band ?? DEFAULT_BAND)
  return [
    // The band's own direction. This was the fixed line "reading a picture book
    // aloud to a four-year-old at bedtime", which is the wrong performance for
    // three of the four bands: a board book wants every sound word played with
    // and long pauses to point at things, and a 6-8 book is paced by its
    // dialogue for a child following the words themselves.
    `You are ${spec.voiceNote}.`,
    'Warm, gentle and unhurried, with a smile in your voice.',
    'Slow down and land the last few words of each page.',
    'Let sentence-ending punctuation breathe; a short pause is better than a rushed line.',
    'Never sound like an announcer, an audiobook trailer, or a news reader.',
  ].join(' ')
}

const TTS_MODEL = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts'
const STT_MODEL = process.env.OPENAI_STT_MODEL || 'whisper-1'
const FORCE = flag('force')
const ONLY = value('only')
  ? new Set(String(value('only')).split(',').map((n) => parseInt(n, 10)))
  : null

function key() {
  const k = process.env.OPENAI_API_KEY
  if (!k) throw new Error('OPENAI_API_KEY is not set (put it in .env.local).')
  return k
}

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function speak(text, band) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: VOICE,
      input: text,
      instructions: instructionsFor(band),
      response_format: 'mp3',
    }),
  })
  if (!res.ok) throw new Error(`TTS ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return Buffer.from(await res.arrayBuffer())
}

/** Word-level timings for the audio we just made. */
async function timeWords(mp3, filename) {
  const form = new FormData()
  form.append('file', new Blob([mp3], { type: 'audio/mpeg' }), filename)
  form.append('model', STT_MODEL)
  form.append('response_format', 'verbose_json')
  form.append('timestamp_granularities[]', 'word')

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}` },
    body: form,
  })
  if (!res.ok) throw new Error(`STT ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const json = await res.json()
  return { words: json.words ?? [], duration: json.duration ?? 0 }
}

/**
 * Turn word timings into one start/end per sentence.
 *
 * Walks the transcript and the prose in parallel. A transcript word that does
 * not match is skipped rather than resynchronising the whole page, because
 * whisper occasionally drops or merges a word and losing one word's timing is
 * invisible while losing alignment is not.
 *
 * Returns null when too little matched to trust — better no highlight than a
 * highlight on the wrong line.
 */
function alignSentences(text, timed, duration) {
  const segments = segmentsOf(text)
  const out = []
  let t = 0
  let matched = 0
  let total = 0

  for (const seg of segments) {
    const want = wordsOf(seg.text)
    total += want.length
    let start = null
    let end = null

    for (const word of want) {
      // Look a little ahead for this word; skip transcript noise in between.
      let found = -1
      for (let k = t; k < Math.min(timed.length, t + 6); k++) {
        if (wordsOf(timed[k].word)[0] === word) {
          found = k
          break
        }
      }
      if (found < 0) continue
      if (start === null) start = timed[found].start
      end = timed[found].end
      t = found + 1
      matched += 1
    }

    out.push({
      start: start ?? (out.length ? out[out.length - 1].end : 0),
      end: end ?? duration,
    })
  }

  if (total === 0 || matched / total < 0.6) return null

  // Make the sequence monotonic and cover the whole clip, so a dropped word
  // cannot leave a gap where nothing is highlighted.
  for (let i = 0; i < out.length; i++) {
    if (i > 0 && out[i].start < out[i - 1].end) out[i].start = out[i - 1].end
    if (out[i].end < out[i].start) out[i].end = out[i].start
  }
  if (out.length) out[out.length - 1].end = Math.max(out[out.length - 1].end, duration)
  return out
}

async function narrateBook(slug) {
  const { book } = await loadBook(slug)
  const dir = path.join(PUBLIC_DIR, 'books', slug, 'audio')
  await mkdir(dir, { recursive: true })

  const manifestPath = path.join(dir, 'narration.json')
  let manifest = { voice: VOICE, model: TTS_MODEL, pages: {} }
  if (await exists(manifestPath)) {
    try {
      manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
      manifest.pages ??= {}
    } catch {
      // A corrupt manifest is rebuilt rather than inherited.
    }
  }

  // One narrator per book. Changing voice mid-book is as jarring as changing
  // the illustrator, so a voice change requires regenerating all of it.
  if (manifest.voice !== VOICE && Object.keys(manifest.pages).length > 0 && !FORCE) {
    console.error(
      `${slug}: already narrated by "${manifest.voice}". Use --force to re-record the whole book in "${VOICE}".`,
    )
    return { slug, ok: 0, skip: 0, fail: 0 }
  }

  const pages = book.pages.filter((p) => !ONLY || ONLY.has(p.page))
  let ok = 0
  let skip = 0
  let fail = 0

  console.log(`\n${slug}: ${book.title} — ${pages.length} page(s), voice "${VOICE}"`)

  for (const page of pages) {
    const name = `page-${String(page.page).padStart(2, '0')}.mp3`
    const file = path.join(dir, name)
    if (!FORCE && (await exists(file)) && manifest.pages[page.page]) {
      skip += 1
      continue
    }

    try {
      const mp3 = await speak(page.text, book.band)
      await writeFile(file, mp3)

      let sentences = null
      let duration = 0
      try {
        const timed = await timeWords(mp3, name)
        duration = timed.duration
        sentences = alignSentences(page.text, timed.words, timed.duration)
      } catch (e) {
        // Timings are an enhancement. Audio with no highlight still reads the
        // book aloud, so a transcription failure must not lose the recording.
        console.log(`  page ${page.page}: audio OK, timings failed (${String(e.message).slice(0, 80)})`)
      }

      manifest.pages[page.page] = {
        file: `books/${slug}/audio/${name}`,
        bytes: (await stat(file)).size,
        duration,
        sentences,
      }
      ok += 1
      console.log(
        `  page ${page.page}: OK  ${(mp3.length / 1024).toFixed(0)}KB` +
          `  ${duration ? `${duration.toFixed(1)}s` : ''}` +
          `  ${sentences ? `${sentences.length} sentences timed` : 'no timings'}`,
      )
    } catch (e) {
      fail += 1
      console.error(`  page ${page.page}: FAILED — ${String(e.message).slice(0, 200)}`)
    }
  }

  manifest.voice = VOICE
  manifest.model = TTS_MODEL
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  console.log(`${slug}: recorded ${ok}, skipped ${skip}, failed ${fail}`)
  return { slug, ok, skip, fail }
}

async function main() {
  await loadEnv()

  if (!VOICES.includes(VOICE)) {
    console.error(`Unknown voice "${VOICE}". One of: ${VOICES.join(', ')}`)
    process.exit(1)
  }

  const slugs = flag('all') ? await bookSlugs() : [value('book')].filter(Boolean)
  if (slugs.length === 0) {
    console.error('Which book? Pass --book <slug> or --all.')
    console.error(`Available: ${(await bookSlugs()).join(', ')}`)
    process.exit(1)
  }

  console.log(`TTS: ${TTS_MODEL}  timings: ${STT_MODEL}`)
  let recorded = 0
  for (const slug of slugs) recorded += (await narrateBook(slug)).ok
  if (recorded > 0) console.log('\nThe reader picks this up automatically. Commit the audio.')
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
