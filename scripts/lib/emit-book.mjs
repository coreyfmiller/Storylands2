// Serialise a book into books/<slug>/book.ts source.
//
// One emitter, two callers: the migration that merged the old duplicated
// manifests, and create-book.mjs, which writes a brand-new book. Generated
// files are meant to be read and hand-edited afterwards, so this emits the same
// shape a person would have written — including hoisting the shared
// `forbiddenAlways` list out of the pages instead of repeating it thirteen
// times.

/**
 * A JS string literal. Prefers single quotes to match the rest of the codebase,
 * and falls back to JSON double-quoting when the value contains an apostrophe —
 * which most of this prose does, so correctness beats consistency here.
 */
function str(value) {
  const s = String(value)
  if (s.includes("'")) return JSON.stringify(s)
  return "'" + s.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n') + "'"
}

/** A template literal for prose, with real paragraph breaks written as \n\n. */
function prose(text) {
  const escaped = String(text)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
    .replace(/\r?\n/g, '\\n')
  return '`' + escaped + '`'
}

function list(values, indent) {
  if (!values || values.length === 0) return '[]'
  const inline = `[${values.map(str).join(', ')}]`
  if (inline.length <= 100) return inline
  const pad = ' '.repeat(indent + 2)
  return `[\n${values.map((v) => pad + str(v)).join(',\n')},\n${' '.repeat(indent)}]`
}

/**
 * Entries common to every page's forbiddenVisualFacts, in the order page 1 has
 * them. Hoisting these keeps a thirteen-page file readable.
 */
function sharedForbidden(pages) {
  if (pages.length === 0) return []
  const first = pages[0].manifest.forbiddenVisualFacts ?? []
  return first.filter((fact) =>
    pages.every((p) => (p.manifest.forbiddenVisualFacts ?? []).includes(fact)),
  )
}

function emitRecord(name, record, docComment) {
  const keys = Object.keys(record)
  const lines = [docComment, `export const ${name}: Record<string, string> = {`]
  for (const k of keys) {
    const key = /^[A-Za-z_$][\w$]*$/.test(k) ? k : str(k)
    const literal = str(record[k])
    // Character bios run to a paragraph; reference paths are a dozen characters.
    // Wrapping both the same way made the short ones look like a mistake.
    if (`  ${key}: ${literal},`.length <= 100) lines.push(`  ${key}: ${literal},`)
    else lines.push(`  ${key}:`, `    ${literal},`)
  }
  lines.push('}')
  return lines.join('\n')
}

/**
 * @param {object} opts
 * @param {string} [opts.header]  Leading comment block, without the `//`.
 * @param {any} opts.book         { id, title, subtitle, character, ages, minutes, pages }
 * @param {Record<string,string>} opts.refs
 * @param {Record<string,string>} opts.bios
 */
export function emitBookSource({ header, book, refs, bios }) {
  const out = []

  if (header) out.push(header.trimEnd(), '')

  out.push(
    "import { pageArt, type Book, type BookPage, type IllustrationManifest } from '../types.ts'",
    '',
    '// Re-exported so anything that imported these from this module still resolves.',
    'export type { Book, BookPage, IllustrationManifest }',
    '',
  )

  out.push(
    emitRecord(
      'CHARACTER_REFS',
      refs,
      '/**\n * Approved reference art, seeded into every page prompt that character appears on.\n * Paths resolve against assets/ — these are generation masters and are not served.\n */',
    ),
    '',
  )

  if (Object.keys(bios).length > 0) {
    out.push(
      emitRecord(
        'CHARACTER_BIOS',
        bios,
        "/** Short on-model description, written into the prompt alongside the reference. */",
      ),
      '',
    )
  }

  const shared = sharedForbidden(book.pages)
  if (shared.length > 0) {
    out.push(
      '// Never allowed in any illustration in this book. The first two are product rules:',
      '// all words live in the reader\'s text panel, and a blank sign looks like broken art.',
      `const forbiddenAlways = ${list(shared, 0)}`,
      '',
    )
  }

  out.push('const rawBook: Book = {')
  out.push(`  id: ${str(book.id)},`)
  out.push(`  title: ${str(book.title)},`)
  out.push(`  subtitle: ${str(book.subtitle)},`)
  out.push(`  character: ${str(book.character)},`)
  out.push(`  ages: ${str(book.ages)},`)
  out.push(`  minutes: ${book.minutes},`)
  out.push('  pages: [')

  for (const p of book.pages) {
    const m = p.manifest
    const extras = (m.forbiddenVisualFacts ?? []).filter((f) => !shared.includes(f))
    const forbidden =
      shared.length > 0
        ? extras.length > 0
          ? `[...forbiddenAlways, ${extras.map(str).join(', ')}]`
          : '[...forbiddenAlways]'
        : list(m.forbiddenVisualFacts ?? [], 8)

    out.push('    {')
    out.push(`      page: ${p.page},`)
    out.push(`      text: ${prose(p.text)},`)
    if (p.alt) out.push(`      alt: ${str(p.alt)},`)
    out.push("      art: '',")
    out.push('      manifest: {')
    out.push(`        charactersPresent: ${list(m.charactersPresent, 8)},`)
    out.push(`        location: ${str(m.location)},`)
    out.push(`        timeOfDay: ${str(m.timeOfDay)},`)
    out.push(`        action: ${str(m.action)},`)
    out.push(`        emotionalBeat: ${str(m.emotionalBeat)},`)
    out.push(`        requiredVisualFacts: ${list(m.requiredVisualFacts, 8)},`)
    out.push(`        forbiddenVisualFacts: ${forbidden},`)
    out.push(`        composition: ${str(m.composition)},`)
    out.push('      },')
    out.push('    },')
  }

  out.push('  ],')
  out.push('}')
  out.push('')
  out.push(
    '// `art` is derived, never written by hand: pageArt owns the directory, the zero',
    '// padding and the file extension, so changing the image format is one edit.',
    'export const book: Book = {',
    '  ...rawBook,',
    '  pages: rawBook.pages.map((p) => ({',
    '    ...p,',
    `    art: p.art || pageArt(${str(book.id)}, p.page),`,
    '  })),',
    '}',
    '',
  )

  return out.join('\n')
}
