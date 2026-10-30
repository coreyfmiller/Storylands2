"use client"

// Read-aloud, with the words it is saying marked on the page.
//
// The first version was a robot voice with no connection to the picture book it
// was reading: nothing on screen moved, so a child who cannot read yet had no
// idea which part was being said. Highlighting the current sentence is the whole
// point — following along is how following along is learned.
//
// Web Speech gives us `boundary` events carrying a character offset into the
// text, which is enough to find the sentence being spoken. Support for those
// events is uneven (Safari fires them sparsely, some Android voices not at all),
// so the highlight is treated as a bonus and never as a precondition: if no
// boundary ever arrives, the whole page simply stays unhighlighted and the voice
// still works.

import { useCallback, useEffect, useRef, useState } from "react"

const RATE_KEY = "storylands:read-aloud-rate:v1"
const ON_KEY = "storylands:read-aloud:v1"

export const RATES = [0.7, 0.85, 1] as const
export type Rate = (typeof RATES)[number]

export type Segment = { text: string; start: number; end: number }

/**
 * Split page prose into read-aloud segments.
 *
 * Sentences, not words: a word-by-word highlight at this age is a strobe, and a
 * whole-page highlight tells you nothing. Keeps the terminal punctuation so the
 * rendered text is identical to the source, and keeps offsets so a boundary
 * event can be mapped back.
 */
export function segmentsOf(text: string): Segment[] {
  const out: Segment[] = []
  // Sentence-ish: run to a terminator followed by space/newline/end. Abbreviations
  // are not a concern in prose written for four-year-olds.
  const re = /[^.!?\n]+[.!?]*[\n]*/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const raw = m[0]
    if (!raw.trim()) continue
    out.push({ text: raw, start: m.index, end: m.index + raw.length })
  }
  return out.length > 0 ? out : [{ text, start: 0, end: text.length }]
}

/** Which segment contains a character offset. -1 when none does. */
export function segmentAt(segments: Segment[], charIndex: number): number {
  for (let i = 0; i < segments.length; i++) {
    if (charIndex >= segments[i].start && charIndex < segments[i].end) return i
  }
  return -1
}

function readStored<T>(key: string, parse: (raw: string) => T | null, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return parse(raw) ?? fallback
  } catch {
    return fallback
  }
}

export type ReadAloud = {
  supported: boolean
  on: boolean
  /** Index of the sentence being spoken, or -1. */
  speaking: number
  rate: Rate
  toggle: () => void
  setRate: (r: Rate) => void
}

/**
 * @param text       the current page's prose, or null off a story page
 * @param segments   that page's segments, so the caller can render them
 * @param onFinished called when the page has been read to the end, for auto-turn
 */
export function useReadAloud(
  text: string | null,
  segments: Segment[],
  onFinished?: () => void,
): ReadAloud {
  const [supported, setSupported] = useState(false)
  const [on, setOn] = useState(false)
  const [rate, setRateState] = useState<Rate>(0.85)
  const [speaking, setSpeaking] = useState(-1)

  // Held in a ref so the utterance's own callbacks always see the live value
  // without re-subscribing and restarting the speech.
  const finishedRef = useRef(onFinished)
  finishedRef.current = onFinished

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    setSupported(true)
    setOn(readStored(ON_KEY, (r) => r === "1", false))
    setRateState(
      readStored(
        RATE_KEY,
        (r) => {
          const n = Number(r)
          return (RATES as readonly number[]).includes(n) ? (n as Rate) : null
        },
        0.85,
      ),
    )
  }, [])

  useEffect(() => {
    if (!supported || !on || !text) {
      setSpeaking(-1)
      return
    }
    const synth = window.speechSynthesis
    // Cancel first: turning pages faster than the voice can talk must not queue
    // a backlog of pages nobody is looking at any more.
    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = 1.05
    setSpeaking(segments.length > 0 ? 0 : -1)

    utterance.onboundary = (e) => {
      const i = segmentAt(segments, e.charIndex ?? 0)
      if (i >= 0) setSpeaking(i)
    }
    utterance.onend = () => {
      setSpeaking(-1)
      finishedRef.current?.()
    }
    utterance.onerror = () => setSpeaking(-1)

    synth.speak(utterance)
    return () => {
      // Clearing the handlers matters: a cancelled utterance can still fire
      // `onend`, which would turn the page the reader just navigated away from.
      utterance.onboundary = null
      utterance.onend = null
      utterance.onerror = null
      synth.cancel()
      setSpeaking(-1)
    }
  }, [supported, on, text, rate, segments])

  // Leaving the book mid-sentence must not leave a voice talking over the library.
  useEffect(() => {
    if (!supported) return
    return () => window.speechSynthesis.cancel()
  }, [supported])

  const toggle = useCallback(() => {
    setOn((v) => {
      const next = !v
      if (typeof window !== "undefined") {
        if (!next) window.speechSynthesis.cancel()
        try {
          window.localStorage.setItem(ON_KEY, next ? "1" : "0")
        } catch {
          // Not worth failing a page turn over.
        }
      }
      return next
    })
  }, [])

  const setRate = useCallback((r: Rate) => {
    setRateState(r)
    try {
      window.localStorage.setItem(RATE_KEY, String(r))
    } catch {
      // As above.
    }
  }, [])

  return { supported, on, speaking, rate, toggle, setRate }
}
