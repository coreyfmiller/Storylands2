import { NextResponse } from 'next/server'
import { spawn } from 'node:child_process'
import path from 'node:path'

// Runs the authoring scripts for the dev-only studio page.
//
// Hard-refused in production. The scripts hold the API key and write files into
// the repository, so this must never exist on a deployed site — not behind a
// password, not behind a flag. Two independent guards: this check, and
// `notFound()` on the page itself.
//
// It shells out to the same scripts the terminal uses rather than importing
// them, so there is exactly one implementation of "write a book" and the studio
// cannot drift from the command line.

const SCRIPTS: Record<string, string> = {
  doctor: 'scripts/doctor.mjs',
  audit: 'scripts/audit-text.mjs',
  create: 'scripts/create-book.mjs',
  illustrate: 'scripts/generate-book.mjs',
  review: 'scripts/review-art.mjs',
  narrate: 'scripts/narrate-book.mjs',
  optimize: 'scripts/optimize-books.mjs',
}

/**
 * Arguments are passed as an array and never interpolated into a shell string,
 * and `spawn` is called without a shell, so a premise containing quotes or
 * semicolons is one argument rather than a command.
 */
function isSafeArg(arg: unknown): arg is string {
  return typeof arg === 'string' && arg.length < 2000 && !arg.includes('\0')
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 })
  }

  let body: { script?: string; args?: unknown[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Expected JSON' }, { status: 400 })
  }

  const script = SCRIPTS[String(body.script)]
  if (!script) {
    return NextResponse.json(
      { error: `Unknown script. One of: ${Object.keys(SCRIPTS).join(', ')}` },
      { status: 400 },
    )
  }

  const args = Array.isArray(body.args) ? body.args : []
  if (!args.every(isSafeArg)) {
    return NextResponse.json({ error: 'Bad arguments' }, { status: 400 })
  }

  const cwd = process.cwd()
  const child = spawn(process.execPath, [path.join(cwd, script), ...(args as string[])], {
    cwd,
    shell: false,
    env: process.env,
  })

  // Streamed, because authoring takes a couple of minutes on a reasoning model
  // and a spinner with no output is indistinguishable from a hang.
  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk))
      child.stdout.on('data', send)
      child.stderr.on('data', send)
      child.on('close', (code) => {
        controller.enqueue(new TextEncoder().encode(`\n[exit ${code}]\n`))
        controller.close()
      })
      child.on('error', (err) => {
        controller.enqueue(new TextEncoder().encode(`\n[failed to start: ${err.message}]\n`))
        controller.close()
      })
    },
    cancel() {
      child.kill()
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  })
}
