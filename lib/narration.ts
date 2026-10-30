"use client"

// Recorded narration for a book, if it has any.
//
// Fetched rather than imported, so audio is entirely optional per book: a book
// with no recording still works, it just falls back to the device's own voice.
// The service worker caches these, so a narrated book read once is then readable
// with no connection.

import { useEffect, useState } from "react"

export type SentenceTiming = { start: number; end: number }

export type PageNarration = {
  /** Path relative to /public. */
  file: string
  bytes: number
  duration: number
  /** One entry per sentence, or null when alignment wasn't trustworthy. */
  sentences: SentenceTiming[] | null
}

export type Narration = {
  voice: string
  model: string
  pages: Record<string, PageNarration>
}

/**
 * Load a book's narration manifest.
 *
 * A 404 is the normal answer for an un-narrated book and must not look like an
 * error, so this resolves to null rather than throwing.
 */
export async function fetchNarration(slug: string): Promise<Narration | null> {
  try {
    const res = await fetch(`/books/${slug}/audio/narration.json`, { cache: "force-cache" })
    if (!res.ok) return null
    const json = (await res.json()) as Narration
    if (!json?.pages || typeof json.pages !== "object") return null
    return json
  } catch {
    return null
  }
}

export function useNarration(slug: string) {
  const [narration, setNarration] = useState<Narration | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let live = true
    fetchNarration(slug).then((n) => {
      if (!live) return
      setNarration(n)
      setChecked(true)
    })
    return () => {
      live = false
    }
  }, [slug])

  return { narration, checked }
}

/**
 * Which sentence is playing at this moment. -1 before the first one starts.
 *
 * The last sentence to have STARTED stays highlighted until the next one does.
 * Checking `start <= t < end` instead leaves the highlight off during the pause
 * between every sentence, and a narrator who breathes is the whole point of the
 * recording — the result was a flicker on every line.
 */
export function sentenceAt(timings: SentenceTiming[] | null, seconds: number): number {
  if (!timings || timings.length === 0) return -1
  let current = -1
  for (let i = 0; i < timings.length; i++) {
    if (seconds >= timings[i].start) current = i
    else break
  }
  return current
}
