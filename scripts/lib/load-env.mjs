// Minimal .env.local loader, shared by every script. No dependency, and it never
// overwrites a variable that is already set in the real environment.
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ROOT } from './book-source.mjs'

export async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  } catch {
    // No .env.local is fine when the variables come from the shell or CI.
  }
}
