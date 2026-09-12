// Minimal OpenAI image provider (edit endpoint) — the seed of the real pipeline.
// Node 24 has global fetch/FormData/Blob, so no dependencies are needed.
// Reads OPENAI_API_KEY from the environment. Never hardcode or log the key.
//
// The edit endpoint accepts up to 16 input images. We pass one reference per present
// character so multi-character pages stay on-model (this is the whole consistency strategy).

import { readFile } from 'node:fs/promises'
import path from 'node:path'

const OPENAI_URL = 'https://api.openai.com/v1/images/edits'

// Verified against the live models list for this account. Newest reference-preserving line.
// Override with OPENAI_IMAGE_MODEL if a variant is rejected.
export const DEFAULT_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst'

function requireKey() {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set (put it in .env.local).')
  return key
}

async function fileToBlob(absPath) {
  const buf = await readFile(absPath)
  const ext = path.extname(absPath).toLowerCase()
  const type = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  return new Blob([buf], { type })
}

/**
 * Generate one image from a prompt + one or more reference images.
 * @param {object} opts
 * @param {string} opts.prompt
 * @param {string[]} opts.referencePaths  absolute paths to character/style references
 * @param {string} [opts.size]  e.g. "1024x1536" (portrait). gpt-image sizes are fixed sets.
 * @param {string} [opts.model]
 * @returns {Promise<{ b64: string, model: string, size: string }>}
 */
export async function generateFromReferences({ prompt, referencePaths, size = '1024x1536', model = DEFAULT_IMAGE_MODEL }) {
  const key = requireKey()
  const form = new FormData()
  form.append('model', model)
  form.append('prompt', prompt)
  form.append('size', size)
  // Multiple images[] entries are how references are supplied to the edit endpoint.
  for (const p of referencePaths) {
    const blob = await fileToBlob(p)
    form.append('image[]', blob, path.basename(p))
  }

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI images edit ${res.status}: ${text.slice(0, 800)}`)
  }
  const json = await res.json()
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error(`No image in response: ${JSON.stringify(json).slice(0, 500)}`)
  return { b64, model, size }
}
