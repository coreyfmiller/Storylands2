"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { books, bookSlugs } from "@/books"

// The authoring console. Dev only — see app/studio/page.tsx.
//
// Deliberately plain. It is a window onto the same scripts the terminal runs,
// not a second implementation of them, so there is nothing here that can
// disagree with the command line.

type Step = {
  id: string
  label: string
  script: string
  hint: string
  /** Costs money. Shown, because the art steps are ~10x the text ones. */
  paid?: boolean
}

export function StudioView() {
  const [character, setCharacter] = useState("nibs")
  const [withCast, setWithCast] = useState("")
  const [premise, setPremise] = useState("")
  const [slug, setSlug] = useState(bookSlugs[0] ?? "")
  const [output, setOutput] = useState("")
  const [running, setRunning] = useState<string | null>(null)
  const logRef = useRef<HTMLPreElement>(null)

  // The cast is whoever has reference art, which is the union across all books.
  const cast = Array.from(
    new Set(Object.values(books).map((b) => b.character)),
  ).sort()

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [output])

  const run = useCallback(async (script: string, args: string[]) => {
    setRunning(script)
    setOutput(`$ ${script} ${args.join(" ")}\n\n`)
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, args }),
      })
      if (!res.body) {
        const text = await res.text()
        setOutput((o) => o + text)
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      // Streamed so a two-minute authoring run shows progress instead of
      // looking like a hang.
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        setOutput((o) => o + decoder.decode(value, { stream: true }))
      }
    } catch (e) {
      setOutput((o) => o + `\n[request failed: ${(e as Error).message}]\n`)
    } finally {
      setRunning(null)
    }
  }, [])

  const draft = () =>
    run("create", [
      "--character",
      character,
      ...(withCast.trim() ? ["--with", withCast.trim()] : []),
      "--premise",
      premise.trim(),
      "--dry-run",
    ])

  const keep = () =>
    run("create", [
      "--character",
      character,
      ...(withCast.trim() ? ["--with", withCast.trim()] : []),
      "--premise",
      premise.trim(),
    ])

  const perBook: Step[] = [
    { id: "audit", label: "Check the words", script: "audit", hint: "word budget, framing, cast, texture" },
    { id: "illustrate", label: "Illustrate", script: "illustrate", hint: "~13 images", paid: true },
    { id: "optimize", label: "Crop and convert", script: "optimize", hint: "free, required after illustrating" },
    { id: "review", label: "Review the art", script: "review", hint: "checks every page against its brief", paid: true },
    { id: "narrate", label: "Record the narrator", script: "narrate", hint: "one audio clip per page", paid: true },
  ]

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          Development only
        </p>
        <h1 className="mt-3 font-serif text-3xl font-medium text-foreground">Studio</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The same scripts the terminal runs. A book is still a file in the repository that
          somebody has to read and commit — this page just means you can see the engine
          working without one. It does not exist on the deployed site.
        </p>

        <button
          onClick={() => run("doctor", [])}
          disabled={!!running}
          className="mt-6 min-h-11 rounded-md bg-white/10 px-4 text-sm text-foreground ring-1 ring-border transition-colors hover:bg-white/15 disabled:opacity-50"
        >
          Can this run right now?
        </button>

        {/* ---- write a new book ---- */}
        <section className="mt-10 rounded-lg border border-border p-5">
          <h2 className="font-serif text-xl text-foreground">Write a book</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Lead character</span>
              <select
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                className="min-h-11 rounded-md border border-border bg-card px-3 text-base text-foreground"
              >
                {cast.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Also in it (optional)</span>
              <input
                value={withCast}
                onChange={(e) => setWithCast(e.target.value)}
                placeholder="tilly"
                className="min-h-11 rounded-md border border-border bg-card px-3 text-base text-foreground"
              />
            </label>
          </div>

          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Premise</span>
            <textarea
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              rows={3}
              placeholder="Nibs wants to give Tilly a thank-you present and sets out to find the single most perfect thing in the wood."
              className="rounded-md border border-border bg-card p-3 text-base leading-relaxed text-foreground"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={draft}
              disabled={!!running || premise.trim().length < 10}
              className="min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              Draft and read it
            </button>
            <button
              onClick={keep}
              disabled={!!running || premise.trim().length < 10}
              className="min-h-11 rounded-md bg-white/10 px-5 text-sm text-foreground ring-1 ring-border disabled:opacity-50"
            >
              Keep it
            </button>
            <p className="text-xs text-muted-foreground">
              Draft first. Illustrating costs roughly ten times what writing does, so read the
              story before paying for pictures.
            </p>
          </div>
        </section>

        {/* ---- work on an existing book ---- */}
        <section className="mt-6 rounded-lg border border-border p-5">
          <h2 className="font-serif text-xl text-foreground">Work on a book</h2>
          <label className="mt-4 flex max-w-xs flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Book</span>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="min-h-11 rounded-md border border-border bg-card px-3 text-base text-foreground"
            >
              {bookSlugs.map((s) => (
                <option key={s} value={s}>
                  {books[s]?.title ?? s}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 flex flex-col gap-2">
            {perBook.map((step) => (
              <div key={step.id} className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() =>
                    run(step.script, step.script === "optimize" ? [] : ["--book", slug])
                  }
                  disabled={!!running}
                  className="min-h-11 min-w-[190px] rounded-md bg-white/10 px-4 text-left text-sm text-foreground ring-1 ring-border disabled:opacity-50"
                >
                  {step.label}
                  {step.paid && <span className="ml-2 text-xs text-primary">costs</span>}
                </button>
                <span className="text-xs text-muted-foreground">{step.hint}</span>
              </div>
            ))}
          </div>
        </section>

        <pre
          ref={logRef}
          className="mt-6 h-[420px] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-black/40 p-4 text-[12px] leading-relaxed text-foreground/85"
        >
          {output || "Output appears here."}
        </pre>
        {running && <p className="mt-2 text-xs text-primary">running {running}…</p>}
      </div>
    </main>
  )
}
