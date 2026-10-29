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

  const forget = useCallback((slug: string) => {
    clearProgress(slug)
    setMap(readProgress())
  }, [])

  return { progress: map, record, forget }
}
