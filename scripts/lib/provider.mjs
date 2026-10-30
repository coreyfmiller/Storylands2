// The AI providers, behind one interface.
//
// Two capabilities are needed: structured text (to author a book) and
// image-from-references (to illustrate it). Both exist on Gemini and on OpenAI,
// and the pipeline should not care which is in use — when one account runs dry
// the other should be a flag, not a rewrite. That is not hypothetical: on
// 2026-10-13 the OpenAI key had expired AND the Gemini project was out of
// prepayment credit, which is what prompted this abstraction.
//
// `mock` is a real provider, not a test stub left lying around. It makes the
// whole authoring pipeline — schema, validation, repair loop, emitter,
// registration — runnable with no network and no spend, which is the only way
// those parts stay honest.

import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const PROVIDERS = ['gemini', 'openai', 'mock']

/**
 * Which provider to use.
 * Explicit flag wins, then whichever key is present, then mock.
 */
export function resolveProvider(requested) {
  if (requested) {
    if (!PROVIDERS.includes(requested)) {
      throw new Error(`Unknown provider "${requested}". One of: ${PROVIDERS.join(', ')}`)
    }
    return requested
  }
  if (process.env.GEMINI_API_KEY) return 'gemini'
  if (process.env.OPENAI_API_KEY) return 'openai'
  return 'mock'
}

// ---------------------------------------------------------------- Gemini

/**
 * gemini-flash-latest is a self-updating alias and the workspace standard: it
 * always resolves to the newest stable Flash model, so this string never needs
 * migrating when Google ships a new version.
 */
export const GEMINI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-flash-latest'

/**
 * Image generation genuinely needs the image capability tier, which is the one
 * sanctioned reason to pin something other than the flash alias.
 */
export const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image'

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

function geminiKey() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY is not set (put it in .env.local).')
  return key
}

async function geminiCall(model, body) {
  const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${geminiKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    const hint =
      res.status === 402
        ? ' — the Gemini project is out of prepayment credit; top up at https://ai.studio/projects'
        : res.status === 429
          ? ' — rate limited; lower --concurrency or wait'
          : ''
    throw new Error(`Gemini ${model} ${res.status}${hint}: ${text.slice(0, 500)}`)
  }
  return res.json()
}

/** JSON Schema -> the subset Gemini's responseSchema accepts. */
function toGeminiSchema(schema) {
  if (!schema || typeof schema !== 'object') return schema
  const out = {}
  for (const [k, v] of Object.entries(schema)) {
    if (k === 'additionalProperties') continue
    if (k === 'type') {
      out.type = String(v).toUpperCase()
    } else if (k === 'properties') {
      out.properties = Object.fromEntries(
        Object.entries(v).map(([key, val]) => [key, toGeminiSchema(val)]),
      )
    } else if (k === 'items') {
      out.items = toGeminiSchema(v)
    } else {
      out[k] = v
    }
  }
  return out
}

async function geminiJSON({ system, user, schema, maxOutputTokens }) {
  const json = await geminiCall(GEMINI_TEXT_MODEL, {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: user }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: toGeminiSchema(schema),
      maxOutputTokens,
    },
  })
  const parts = json?.candidates?.[0]?.content?.parts ?? []
  const text = parts.map((p) => p.text ?? '').join('')
  if (!text) throw new Error(`Gemini returned no text: ${JSON.stringify(json).slice(0, 400)}`)
  return JSON.parse(text)
}

async function geminiImage({ prompt, referencePaths, aspectRatio = '9:16' }) {
  const parts = [{ text: prompt }]
  for (const p of referencePaths) {
    const buf = await readFile(p)
    const ext = path.extname(p).toLowerCase()
    const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
    parts.push({ inline_data: { mime_type: mime, data: buf.toString('base64') } })
  }
  const json = await geminiCall(GEMINI_IMAGE_MODEL, {
    contents: [{ parts }],
    generationConfig: { imageConfig: { aspectRatio } },
  })
  const out = json?.candidates?.[0]?.content?.parts ?? []
  const img = out.find((p) => p.inlineData || p.inline_data)
  const b64 = img?.inlineData?.data ?? img?.inline_data?.data
  if (!b64) {
    const reason = json?.candidates?.[0]?.finishReason ?? 'unknown'
    const textBack = out.map((p) => p.text ?? '').join(' ').slice(0, 300)
    throw new Error(`Gemini returned no image (finishReason: ${reason}). ${textBack}`)
  }
  return { b64, model: GEMINI_IMAGE_MODEL }
}

// ---------------------------------------------------------------- OpenAI

export const OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || 'gpt-5.2'
export const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst'

function openaiKey() {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set (put it in .env.local).')
  return key
}

function openaiError(status, text) {
  const hint =
    status === 401
      ? ' — the key is invalid or expired; create a new one'
      : status === 429
        ? ' — rate limited or out of quota'
        : ''
  return new Error(`OpenAI ${status}${hint}: ${text.slice(0, 500)}`)
}

async function openaiJSON({ system, user, schema, maxOutputTokens }) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openaiKey()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OPENAI_TEXT_MODEL,
      input: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      text: { format: { type: 'json_schema', name: 'book', strict: true, schema } },
      max_output_tokens: maxOutputTokens,
    }),
  })
  if (!res.ok) throw openaiError(res.status, await res.text())
  const json = await res.json()
  let text = typeof json?.output_text === 'string' ? json.output_text : ''
  if (!text) {
    for (const item of json?.output ?? []) {
      for (const c of item?.content ?? []) if (typeof c?.text === 'string') text += c.text
    }
  }
  if (!text) throw new Error(`OpenAI returned no text: ${JSON.stringify(json).slice(0, 400)}`)
  return JSON.parse(text)
}

async function openaiImage({ prompt, referencePaths }) {
  const form = new FormData()
  form.append('model', OPENAI_IMAGE_MODEL)
  form.append('prompt', prompt)
  form.append('size', '1024x1536')
  for (const p of referencePaths) {
    const buf = await readFile(p)
    const ext = path.extname(p).toLowerCase()
    const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
    form.append('image[]', new Blob([buf], { type: mime }), path.basename(p))
  }
  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openaiKey()}` },
    body: form,
  })
  if (!res.ok) throw openaiError(res.status, await res.text())
  const json = await res.json()
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error(`OpenAI returned no image: ${JSON.stringify(json).slice(0, 400)}`)
  return { b64, model: OPENAI_IMAGE_MODEL }
}

// ---------------------------------------------------------------- mock

/**
 * Deterministic stand-in. Produces a structurally valid book so the pipeline can
 * be exercised offline; the prose is placeholder and says so, loudly, because
 * the one unforgivable outcome would be mock text reaching a child.
 */
async function mockJSON({ schema, user }) {
  const pages = Number((user.match(/exactly (\d+) pages/) || [])[1] || 13)
  const slug = (user.match(/slug:\s*([a-z0-9-]+)/) || [])[1] || 'mock-book'
  const character = (user.match(/character id:\s*([a-z0-9_]+)/) || [])[1] || 'mock'
  if (!schema?.properties?.pages) return { ok: true }
  return {
    id: slug,
    title: 'MOCK BOOK — not for reading',
    subtitle: 'Generated by the mock provider.',
    character,
    ages: 'Ages 4+',
    minutes: 6,
    pages: Array.from({ length: pages }, (_, i) => ({
      page: i + 1,
      text: `MOCK PAGE ${i + 1}. This placeholder exists so the pipeline can be tested without spending anything.\n\nIt is deliberately not a story.`,
      manifest: {
        charactersPresent: [character],
        location: 'a plain green clearing',
        timeOfDay: 'midday',
        action: `${character} stands in the middle of a clearing doing nothing in particular`,
        emotionalBeat: 'neutral placeholder',
        requiredVisualFacts: [`${character} fully visible, on-model`, 'a plain uncluttered background'],
        forbiddenVisualFacts: [
          'any text, words, letters, numbers, or title in the image',
          'any sign, signpost, board, placard, label, or plaque',
        ],
        composition: 'centered with generous margin on every side',
      },
    })),
  }
}

async function mockImage() {
  // A 1x1 transparent PNG. Enough to prove the write path works.
  return {
    b64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBAEAX+XGsQAAAABJRU5ErkJggg==',
    model: 'mock',
  }
}

// ---------------------------------------------------------------- dispatch

/** @returns {{ name: string, textModel: string, imageModel: string, generateJSON: Function, generateImage: Function }} */
export function getProvider(requested) {
  const name = resolveProvider(requested)
  if (name === 'gemini') {
    return {
      name,
      textModel: GEMINI_TEXT_MODEL,
      imageModel: GEMINI_IMAGE_MODEL,
      generateJSON: geminiJSON,
      generateImage: geminiImage,
    }
  }
  if (name === 'openai') {
    return {
      name,
      textModel: OPENAI_TEXT_MODEL,
      imageModel: OPENAI_IMAGE_MODEL,
      generateJSON: openaiJSON,
      generateImage: openaiImage,
    }
  }
  return {
    name: 'mock',
    textModel: 'mock',
    imageModel: 'mock',
    generateJSON: mockJSON,
    generateImage: mockImage,
  }
}
