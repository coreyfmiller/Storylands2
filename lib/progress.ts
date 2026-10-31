"use client"

// Where each book was left off.
//
// "Continue Your Story" used to be a hand-written table in lib/catalog.ts:
// Avery was 45% through Pip and had "Chapter 2" left, on a first run, on a
// brand-new device. Picture books don't have chapters, nobody had read
// anything, and tapping the card started the book from page one regardless.
// A progress bar that was never earned is worse than no progress bar.
//
// This records the real thing. It is device-local and unauthenticated —
// nothing about a child's reading leaves the browser.

import { useCallback, useEffect, useState } from "react"

const KEY = "storylands:progress:v1"

export type BookProgress = {
  /** Zero-based index of the furthest page reached. */
  page: number
  /** Page count at the time, so a book gaining pages can't show 14/13. */
  total: number
  /** True once the end card was reached. */
  finished: boolean
  /** Epoch ms, for ordering the Continue row most-recent-first. */
  updatedAt: number
  /**
   * How many times this book has been read to the end.
   *
   * The single strongest signal in an app for small children, and it was being
   * thrown away: `finished` is a boolean, so a book read once and a book read
   * twenty times were indistinguishable. Children do not consume picture books,
   * they re-read a favourite until the adult can recite it — "again" is the
   * whole relationship.
   *
   * Optional because every record written before this existed lacks it. Absent
   * means "we don't know", which is honestly different from zero, and
   * `timesFinished` treats it as the one completion `finished` implies.
   */
  completions?: number
}

/**
 * How many times a book has been finished, as far as we can tell.
 *
 * A record from before completions were counted reports 1 if it was finished,
 * because that is what it genuinely evidences — not 0, which would be a lie,
 * and not more, which would be an invention.
 */
export function timesFinished(p: BookProgress | undefined): number {
  if (!p) return 0
  if (typeof p.completions === "number") return p.completions
  return p.finished ? 1 : 0
}

export type ProgressMap = Record<string, BookProgress>

function isProgress(v: unknown): v is BookProgress {
  if (typeof v !== "object" || v === null) return false
  const p = v as Record<string, unknown>
  return (
    typeof p.page === "number" &&
    typeof p.total === "number" &&
    typeof p.finished === "boolean" &&
    typeof p.updatedAt === "number"
  )
}

export function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return {}
    const out: ProgressMap = {}
    for (const [slug, value] of Object.entries(parsed)) {
      if (isProgress(value)) out[slug] = value
    }
    return out
  } catch {
    // A corrupt or foreign value is not worth crashing the library over.
    return {}
  }
}

function write(map: ProgressMap) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map))
  } catch {
    // Private browsing and a full quota both land here. Losing the bookmark is
    // survivable; failing to turn the page is not.
  }
}

/**
 * Record how far a book has been read.
 *
 * `page` only ever moves forward: flicking back to look at an earlier picture
 * is a normal thing to do in a picture book and must not lose the place.
 */
export function recordProgress(slug: string, page: number, total: number) {
  if (typeof window === "undefined") return
  const map = readProgress()
  const prev = map[slug]
  const furthest = prev && prev.total === total ? Math.max(prev.page, page) : page
  map[slug] = {
    page: Math.max(0, Math.min(total - 1, furthest)),
    total,
    finished: (prev?.finished ?? false) || page >= total - 1,
    updatedAt: Date.now(),
    completions: timesFinished(prev),
  }
  write(map)
}

/**
 * Record that a book was read all the way to the end.
 *
 * Separate from `recordProgress` on purpose. Progress fires on every page turn,
 * so counting a completion there would increment once per turn on the last
 * page; and `finished` is already sticky, so it cannot tell a second reading
 * from a re-render of the first.
 *
 * Called once from the end card, which is the only place that genuinely knows a
 * book was reached the end of.
 */
export function recordCompletion(slug: string, total: number) {
  if (typeof window === "undefined") return
  const map = readProgress()
  const prev = map[slug]
  map[slug] = {
    page: Math.max(0, total - 1),
    total,
    finished: true,
    updatedAt: Date.now(),
    completions: timesFinished(prev) + 1,
  }
  write(map)
}

/** Forget a book — used by "start from the beginning". */
export function clearProgress(slug: string) {
  if (typeof window === "undefined") return
  const map = readProgress()
  delete map[slug]
  write(map)
}

/** True when there is somewhere worth returning to, rather than page one. */
export function isResumable(p: BookProgress | undefined): p is BookProgress {
  return !!p && !p.finished && p.page > 0
}

/**
 * The stored progress map, for client components.
 *
 * Starts empty on the first render and fills in after mount: reading
 * localStorage during render makes the server's HTML and the client's first
 * paint disagree, and React then throws out the markup.
 */
export function useProgress() {
  const [map, setMap] = useState<ProgressMap>({})

  useEffect(() => {
    setMap(readProgress())
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY || e.key === null) setMap(readProgress())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const record = useCallback((slug: string, page: number, total: number) => {
    recordProgress(slug, page, total)
    setMap(readProgress())
  }, [])

  const complete = useCallback((slug: string, total: number) => {
    recordCompletion(slug, total)
    setMap(readProgress())
  }, [])

  const forget = useCallback((slug: string) => {
    clearProgress(slug)
    setMap(readProgress())
  }, [])

  return { progress: map, record, complete, forget }
}
