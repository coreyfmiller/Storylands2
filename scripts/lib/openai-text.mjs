// Structured text generation against the OpenAI Responses API.
//
// Every call here asks for JSON matching a schema, because the thing being
// produced is a data file the app imports, not prose for a human to tidy up. A
// book that comes back as a nice paragraph is useless; a book that comes back as
// thirteen validated page objects can be written straight to disk.
//
// Node 24 has global fetch, so no dependency.

const URL_RESPONSES = 'https://api.openai.com/v1/responses'

/** Authoring model. Override with OPENAI_TEXT_MODEL. */
export const DEFAULT_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || 'gpt-5.2'

function requireKey() {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set (put it in .env.local).')
  return key
}

/**
 * Ask for a JSON object matching `schema`.
 *
 * @param {object} opts
 * @param {string} opts.system        role and rules
 * @param {string} opts.user          the request
 * @param {object} opts.schema        JSON Schema for the response
 * @param {string} opts.schemaName
 * @param {string} [opts.model]
 * @param {number} [opts.maxOutputTokens]
 * @returns {Promise<any>}
 */
export async function generateJSON({
  system,
  user,
  schema,
  schemaName = 'result',
  model = DEFAULT_TEXT_MODEL,
  maxOutputTokens = 16000,
}) {
  const key = requireKey()

  const body = {
    model,
    input: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: schemaName,
        strict: true,
        schema,
      },
    },
    max_output_tokens: maxOutputTokens,
  }

  const res = await fetch(URL_RESPONSES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI responses ${res.status}: ${text.slice(0, 1000)}`)
  }

  const json = await res.json()
  const text = extractText(json)
  if (!text) {
    throw new Error(`No text in response: ${JSON.stringify(json).slice(0, 600)}`)
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Response was not valid JSON: ${text.slice(0, 600)}`)
  }
}

/**
 * Pull the assistant text out of a Responses payload.
 *
 * `output_text` is the convenience field, but it is not always present, so fall
 * back to walking the output items rather than failing on a valid response.
 */
function extractText(json) {
  if (typeof json?.output_text === 'string' && json.output_text) return json.output_text
  const parts = []
  for (const item of json?.output ?? []) {
    for (const c of item?.content ?? []) {
      if (typeof c?.text === 'string') parts.push(c.text)
    }
  }
  return parts.join('')
}
