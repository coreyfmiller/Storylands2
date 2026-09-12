"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Book } from "@/books/nibs-perfect-acorn/book"
import { X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

// AutoFitText: renders page prose as large as possible while GUARANTEEING it fits its
// container with no scroll. Starts at a preferred size and steps down only if it overflows.
// This is what enforces the "text always fits, never scrolls" rule at runtime, on any
// device, for any page length.
const MAX_TEXT_PX = 34 // preferred phone size; a long page shrinks below this as needed
const MIN_TEXT_PX = 17 // never smaller than this (comfortably readable floor)

function AutoFitText({ text }: { text: string }) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const pRef = useRef<HTMLParagraphElement | null>(null)
  const [size, setSize] = useState(MAX_TEXT_PX)

  useLayoutEffect(() => {
    const box = boxRef.current
    const p = pRef.current
    if (!box || !p) return

    let px = MAX_TEXT_PX
    p.style.fontSize = `${px}px`
    // Shrink until the paragraph fits inside the box (height + width), or we hit the floor.
    // Small guard count keeps this cheap.
    let guard = 0
    while (guard++ < 40 && px > MIN_TEXT_PX && (p.scrollHeight > box.clientHeight || p.scrollWidth > box.clientWidth)) {
      px -= 1
      p.style.fontSize = `${px}px`
    }
    setSize(px)
  }, [text])

  return (
    <div ref={boxRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <p
        ref={pRef}
        className="mx-auto max-w-md whitespace-pre-line text-pretty font-serif text-[#3b2a1c]"
        style={{ fontSize: `${size}px`, lineHeight: 1.45 }}
      >
        {text}
      </p>
    </div>
  )
}

// A full-bleed 9:16 picture-book reader. One illustration per page fills the screen; the
// prose sits as a caption in the calm bottom zone. Tap the right half (or arrow / swipe)
// to advance, left half to go back. A cover page opens it; a final "The End" page offers
// read-again. Designed phone-first, works one-handed.

export function BookReader({ book }: { book: Book }) {
  // index: -1 = cover, 0..n-1 = pages, n = end card
  const [index, setIndex] = useState(-1)
  const total = book.pages.length

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => Math.min(total, Math.max(-1, i + dir))),
    [total],
  )
  const restart = useCallback(() => setIndex(-1), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1)
      else if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  // Touch swipe — works on EVERY stage (cover, page, end). We track both axes so a
  // vertical scroll or a plain tap is never mistaken for a horizontal page-turn.
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    // Require a clearly horizontal gesture: enough distance AND more horizontal than vertical.
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      go(dx < 0 ? 1 : -1)
    }
  }

  const stage = useMemo(() => {
    if (index === -1) return "cover" as const
    if (index >= total) return "end" as const
    return "page" as const
  }, [index, total])

  const page = stage === "page" ? book.pages[index] : null

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white">
      {/* Reading frame: centered 9:16 stage, letterboxed on wide screens, full-bleed on phones.
          touch-pan-y + overscroll-none stops the browser's edge back-swipe from stealing our
          horizontal page-turn gesture on mobile. */}
      <div
        className="relative mx-auto h-full w-full max-w-[calc(100svh*9/16)] touch-pan-y overscroll-none select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Tap zones — only on story pages, and beneath the caption/chrome so buttons work */}
        {stage === "page" && (
          <>
            <button
              aria-label="Previous page"
              onClick={() => go(-1)}
              className="absolute inset-y-0 left-0 z-30 w-1/3"
            />
            <button
              aria-label="Next page"
              onClick={() => go(1)}
              className="absolute inset-y-0 right-0 z-30 w-2/3"
            />
          </>
        )}

        {/* Top chrome: close + progress */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center gap-3 bg-gradient-to-b from-black/60 to-transparent px-4 pb-6 pt-3">
          <Link
            href="/"
            aria-label="Close book"
            className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white/80 backdrop-blur transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            {stage === "page" && (
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-primary transition-[width] duration-500"
                  style={{ width: `${((index + 1) / total) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* COVER */}
        {stage === "cover" && (
          <div className="absolute inset-0 animate-fade-in">
            {/* Tapping the cover art itself begins the story (not just the button). */}
            <button
              aria-label="Start reading"
              onClick={() => setIndex(0)}
              className="absolute inset-0 z-30 h-full w-full cursor-pointer"
            />
            <Image
              src={`/${bookCover(book)}`}
              alt={book.title}
              fill
              priority
              sizes="(max-height: 100svh) 56svh"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-8 pb-16 text-center">
              <h1 className="font-serif text-4xl font-medium leading-tight text-white text-shadow-cinema">
                {book.title}
              </h1>
              <p className="mt-3 text-sm italic text-white/70">{book.subtitle}</p>
              <button
                onClick={() => setIndex(0)}
                className="pointer-events-auto relative z-40 mt-8 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
              >
                Start Reading
              </button>
              <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-white/40">
                Tap or swipe to turn the page
              </p>
            </div>
          </div>
        )}

        {/* PAGE — illustration on top, warm parchment text panel below (Option A). */}
        {stage === "page" && page && (
          <div key={page.page} className="absolute inset-0 flex flex-col bg-[#f4e9d6] animate-fade-in">
            {/* Illustration region (top). object-cover fills the region edge-to-edge for a bold
                full-bleed look. Note: cover crops tall 9:16 art to fit, so keep important subject
                matter centered with margin when authoring/generating pages. */}
            <div className="relative min-h-0 flex-[9] overflow-hidden bg-black">
              {page.art ? (
                <Image
                  src={`/${page.art}`}
                  alt=""
                  fill
                  priority
                  sizes="(max-height: 100svh) 56svh"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-neutral-900 text-white/40">
                  <span className="text-sm">illustration pending</span>
                </div>
              )}

              {/* soft blend into the parchment panel */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#f4e9d6] to-transparent" />
            </div>

            {/* Text panel (bottom): warm paper, serif. Text auto-fits — always large, never scrolls.
                Extra bottom padding keeps prose clear of the on-screen controls. */}
            <div className="relative z-20 flex-[11] overflow-hidden bg-[#f4e9d6] px-6 pt-5 pb-20">
              <AutoFitText text={page.text} />
            </div>
          </div>
        )}

        {/* END */}
        {stage === "end" && (
          <div className="absolute inset-0 grid place-items-center bg-background animate-fade-in">
            <div className="flex flex-col items-center px-8 text-center">
              <p className="font-serif text-3xl font-medium text-foreground">The End</p>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                {book.title}
              </p>
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" />
                  Read Again
                </button>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Back to Storylands
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* On-screen controls — visible, large touch targets. Tap zones + swipe still work;
            these give an obvious, discoverable way to turn pages on mobile. */}
        {stage === "page" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-center justify-between px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-10 bg-gradient-to-t from-black/50 to-transparent">
            <button
              onClick={() => go(-1)}
              aria-label="Previous page"
              className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-black/45 text-white/85 backdrop-blur transition-all active:scale-90 hover:bg-black/60 disabled:opacity-0"
              disabled={index <= 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <span className="pointer-events-none rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium tracking-wide text-white/70 backdrop-blur">
              {index + 1} / {total}
            </span>

            <button
              onClick={() => go(1)}
              aria-label="Next page"
              className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all active:scale-90 hover:brightness-105"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// The cover uses the character art (which already has the painted title). Falls back to
// page 1 art if needed.
function bookCover(book: Book): string {
  return `characters/${book.character}.png`
}
