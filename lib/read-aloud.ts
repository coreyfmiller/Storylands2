"use client"

// Read-aloud, with the sentence being spoken marked on the page.
//
// Two sources, in order of preference:
//
//   1. A RECORDED narrator (scripts/narrate-book.mjs). A directed female voice,
//      identical on every device, with exact sentence timings from a word-level
//      transcript. This is the one that sounds like a person.
//   2. The browser's own speechSynthesis, as a fallback for books that have not
//      been narrated yet. It hands a child whatever voice the device has —
//      robotic on most Androids, Siri on an iPhone — and its `boundary` events
//      are unreliable, so the highlight is best-effort there.
//
// Either way the page turns itself when the narration ends, which is what lets a
// child who cannot read hold the phone and just listen.

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { sentenceAt, type Narration } from "./narration.ts"

const ON_KEY = "storylands:read-aloud:v1"

/**
 * Playback speed for the RECORDED narrator: exactly as recorded.
 *
 * There used to be a Slow / Normal / Quick control, and it defaulted to 0.85 —
 * which meant the coral narration played 15% slow on every page. That voice is
 * already directed to be warm and unhurried and to land the end of each page, so
 * slowing it further only made it sluggish and dropped its pitch. The pacing
 * belongs in the recording, not in a speed dial.
 */
const RECORDED_RATE = 1

/**
 * Speed for the device's own voice, which arrives with no direction at all and
 * reads far too briskly for a four-year-old. This is the one place a slower rate
 * genuinely helps.
 */
const FALLBACK_RATE = 0.85

export type Segment = { text: string; start: number; end: number }

/**
 * Split page prose into read-aloud segments.
 *
 * Must stay identical to segmentsOf in scripts/lib/segments.mjs, which is what
 * the narration timings were aligned against. There is a test asserting the two
 * agree; if they drift, the highlight lands on the wrong sentence.
 */
export function segmentsOf(text: string): Segment[] {
  const out: Segment[] = []
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

function store(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Private browsing and a full quota both land here. Not worth failing a
    // page turn over.
  }
}

export type ReadAloud = {
  supported: boolean
  on: boolean
  /** Index of the sentence being spoken, or -1. */
  speaking: number
  /** True when a real narrator is playing rather than the device's voice. */
  recorded: boolean
  toggle: () => void
}

/**
 * @param text       the current page's prose, or null off a story page
 * @param segments   that page's segments, so the caller can render them
 * @param narration  the book's recording, if it has one
 * @param pageNumber 1-based page, to look up its clip
 * @param onFinished called when the page has been read to the end, for auto-turn
 */
export function useReadAloud(
  text: string | null,
  segments: Segment[],
  narration: Narration | null,
  pageNumber: number | null,
  onFinished?: () => void,
): ReadAloud {
  const [speechSupported, setSpeechSupported] = useState(false)
  const [on, setOn] = useState(false)
  const [speaking, setSpeaking] = useState(-1)

  const finishedRef = useRef(onFinished)
  finishedRef.current = onFinished

  const clip = useMemo(() => {
    if (!narration || pageNumber === null) return null
    return narration.pages[String(pageNumber)] ?? null
  }, [narration, pageNumber])

  useEffect(() => {
    if (typeof window === "undefined") return
    setSpeechSupported("speechSynthesis" in window)
    setOn(readStored(ON_KEY, (r) => r === "1", false))
  }, [])

  // ---- recorded narrator -------------------------------------------------
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!on || !clip) return

    const audio = new Audio(`/${clip.file}`)
    audio.playbackRate = RECORDED_RATE
    audio.preload = "auto"
    audioRef.current = audio

    const onTime = () => setSpeaking(sentenceAt(clip.sentences, audio.currentTime))
    const onEnd = () => {
      setSpeaking(-1)
      finishedRef.current?.()
    }
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("ended", onEnd)

    // Autoplay can be refused until the page has been interacted with. The
    // toggle itself is an interaction, so the first play is fine; a refusal
    // here must not look like a broken book, so it just goes quiet.
    void audio.play().catch(() => setSpeaking(-1))

    return () => {
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("ended", onEnd)
      audio.pause()
      audio.src = ""
      audioRef.current = null
      setSpeaking(-1)
    }
  }, [on, clip])

  // ---- fallback: the device's own voice -----------------------------------
  useEffect(() => {
    if (!on || clip || !speechSupported || !text) return

    const synth = window.speechSynthesis
    // Cancel first: turning pages faster than the voice can talk must not queue
    // a backlog of pages nobody is looking at any more.
    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = FALLBACK_RATE
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
      // `onend`, which would turn a page the reader has already left.
      utterance.onboundary = null
      utterance.onend = null
      utterance.onerror = null
      synth.cancel()
      setSpeaking(-1)
    }
  }, [on, clip, speechSupported, text, segments])

  // Leaving the book mid-sentence must not leave a voice talking over the library.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const toggle = useCallback(() => {
    setOn((v) => {
      const next = !v
      if (typeof window !== "undefined") {
        if (!next && "speechSynthesis" in window) window.speechSynthesis.cancel()
        store(ON_KEY, next ? "1" : "0")
      }
      return next
    })
  }, [])

  return {
    // A narrated book offers read-aloud even where speechSynthesis is missing.
    supported: speechSupported || !!clip,
    on,
    speaking,
    recorded: !!clip,
    toggle,
  }
}
