"use client"

// Stop a two-year-old leaving the book.
//
// Every page of the reader has a close button in the top-left corner, which is
// exactly where a thumb lands when a small child is holding a phone or a tablet
// with both hands. Hand a child the device and the book lasts until they brush
// it. That is the single most ordinary way this app fails in real use, and
// nothing in it addressed that.
//
// The lock hides the ways OUT of the book and leaves everything a child needs
// working: page turns, read-aloud, swipes. So the thing a parent actually wants
// — put the book on, hand it over, stop watching — becomes possible.
//
// Why press-and-hold rather than a tap, a code, or a maths question:
//
//   A tap is no lock at all; the child who found the close button finds this.
//   A PIN is a thing to forget, a thing to set up, and a thing to type one
//   handed while holding a toddler. A "what is 7 x 8" gate is the pattern most
//   apps use and it is theatre — it stops a four-year-old and annoys everyone.
//
//   Holding still for a second and a half is the one gesture that genuinely
//   separates an adult from a toddler, because a toddler taps. It needs no
//   setup, nothing can be forgotten, and it is obvious the first time you try.

import { useCallback, useEffect, useRef, useState } from "react"

const KEY = "storylands:child-lock:v1"

/**
 * How long the unlock has to be held.
 *
 * 1500ms is deliberate. Below about a second a determined toddler gets there by
 * accident; much above it and an adult lets go, assumes it is broken, and the
 * feature becomes the reason they stop using the app.
 */
export const UNLOCK_HOLD_MS = 1500

function read(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(KEY) === "1"
  } catch {
    // Private browsing. A lock that cannot be remembered is still worth having
    // for the current session.
    return false
  }
}

export type ChildLock = {
  /** True once mounted and the stored value is known. Guards SSR mismatch. */
  ready: boolean
  locked: boolean
  lock: () => void
  /** 0..1 while an unlock is being held, for the progress ring. */
  holding: number
  /** Begin an unlock hold. */
  holdStart: () => void
  /** Abandon it. Pointer-up, pointer-leave, and cancel all land here. */
  holdCancel: () => void
}

export function useChildLock(): ChildLock {
  const [ready, setReady] = useState(false)
  const [locked, setLocked] = useState(false)
  const [holding, setHolding] = useState(0)

  // The stored value is read after mount, never during render: reading
  // localStorage during render makes the server's HTML and the first client
  // paint disagree and React throws the markup away.
  useEffect(() => {
    setLocked(read())
    setReady(true)
  }, [])

  const timer = useRef<number | null>(null)
  const raf = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    if (raf.current !== null) cancelAnimationFrame(raf.current)
    timer.current = null
    raf.current = null
  }, [])

  // A hold in progress must not outlive the component, or the timeout fires
  // against an unmounted tree after the child has already left the book.
  useEffect(() => stop, [stop])

  const persist = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0")
    } catch {
      // Nothing to do. The in-memory state still holds for this session.
    }
  }, [])

  const lock = useCallback(() => {
    setLocked(true)
    persist(true)
  }, [persist])

  const holdCancel = useCallback(() => {
    stop()
    setHolding(0)
  }, [stop])

  const holdStart = useCallback(() => {
    stop()
    const began = performance.now()

    // The ring is driven by a rAF loop reading the real clock rather than by a
    // CSS transition, so letting go part-way snaps it back to empty instead of
    // animating down from wherever it was — which would read as the unlock
    // having half worked.
    const tick = () => {
      const elapsed = performance.now() - began
      setHolding(Math.min(1, elapsed / UNLOCK_HOLD_MS))
      if (elapsed < UNLOCK_HOLD_MS) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    timer.current = window.setTimeout(() => {
      stop()
      setHolding(0)
      setLocked(false)
      persist(false)
    }, UNLOCK_HOLD_MS)
  }, [persist, stop])

  return { ready, locked, lock, holding, holdStart, holdCancel }
}
