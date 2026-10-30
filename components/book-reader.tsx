"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { bookCoverArt, describePage, type Book } from "@/books/types"
import { isResumable, readProgress, recordProgress } from "@/lib/progress"
import { segmentsOf, useReadAloud, type Segment } from "@/lib/read-aloud"
import { useNarration } from "@/lib/narration"
import {
  mainShelf,
  newShelf,
  nextInSeries,
  seriesById,
  seriesPosition,
  storyByReaderSlug,
  type Story,
} from "@/lib/catalog"
import { X, ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX } from "lucide-react"

// The preferred phone size, and the floor it will shrink to. A page that has to
// reach the floor is too long — see .kiro/steering/reader-layout.md.
const MAX_TEXT_PX = 34
const MIN_TEXT_PX = 17

/**
 * The one type size this whole book is read at.
 *
 * Sizing each page independently made the type breathe between turns: 34px,
 * then 26px, then 31px. reader-layout.md calls that out — "uneven pages make
 * the auto-fit size jump around between turns, which feels cheap" — and the
 * per-page fit was what caused it.
 *
 * So the longest page decides, and every page uses that. Measured by rendering
 * the longest page once, invisibly, and binary-searching it: a larger font never
 * fits better, so halving the range finds the answer in five layout reads rather
 * than the forty a one-pixel-at-a-time walk cost on every single page turn.
 */
function useBookTextSize(pages: Book["pages"]) {
  // A callback ref, not a plain one: the panel being measured does not exist on
  // the cover, so an effect keyed on anything else runs while the ref is still
  // null, bails out, and never runs again. That is how this shipped reporting
  // 34px for every book while most pages overflowed by eighty pixels.
  const [box, setBox] = useState<HTMLDivElement | null>(null)
  const probeRef = useRef<HTMLParagraphElement | null>(null)
  const [size, setSize] = useState(MAX_TEXT_PX)

  const texts = useMemo(() => pages.map((p) => p.text), [pages])

  const fit = useCallback(() => {
    const p = probeRef.current
    if (!box || !p) return

    // The usable height is the box minus its own padding. clientHeight includes
    // padding, and comparing against it directly let text run under the page
    // controls — the panel's bottom padding is 80px of clearance for them.
    const cs = getComputedStyle(box)
    const innerHeight =
      box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
    const innerWidth = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    if (innerHeight <= 0 || innerWidth <= 0) return

    const fits = (px: number) => {
      p.style.fontSize = `${px}px`
      return p.scrollHeight <= innerHeight && p.scrollWidth <= innerWidth
    }

    /** Largest size the text currently in the probe fits at. */
    const largestThatFits = () => {
      let lo = MIN_TEXT_PX
      let hi = MAX_TEXT_PX
      let best = MIN_TEXT_PX
      while (lo <= hi) {
        const mid = (lo + hi) >> 1
        if (fits(mid)) {
          best = mid
          lo = mid + 1
        } else {
          hi = mid - 1
        }
      }
      return best
    }

    // Every page, not the one with the most characters.
    //
    // Picking the longest page by character count was wrong, and wrong in the
    // direction that matters: rendered height comes from how the text WRAPS and
    // from the blank line between paragraphs, not from how many characters it
    // has. Pip's page 1 is shorter than his page 13 and two lines taller,
    // because it is two paragraphs. The result was 34px chosen off page 13
    // while pages 1, 3 and 5 overflowed by 84px.
    //
    // Thirteen pages at five probes each is sixty-five layout reads, once per
    // book. The version this replaced did up to forty on every page turn.
    let best = MAX_TEXT_PX
    for (const text of texts) {
      p.textContent = text
      best = Math.min(best, largestThatFits())
      if (best === MIN_TEXT_PX) break
    }

    p.style.fontSize = `${best}px`
    setSize(best)
  }, [box, texts])

  useLayoutEffect(() => {
    fit()
  }, [fit])

  // Turning a phone sideways changes the height of the text panel. Without this
  // the prose kept its portrait size and overflowed, which is the one thing the
  // fitting exists to prevent.
  useEffect(() => {
    if (!box || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => fit())
    ro.observe(box)
    return () => ro.disconnect()
  }, [box, fit])

  return { size, setBox, probeRef }
}

/** The page prose, with the sentence being read aloud marked. */
function PageText({
  segments,
  speaking,
  size,
}: {
  segments: Segment[]
  speaking: number
  size: number
}) {
  return (
    <p
      className="mx-auto max-w-md whitespace-pre-line text-pretty font-serif text-[#3b2a1c]"
      style={{ fontSize: `${size}px`, lineHeight: 1.45 }}
    >
      {segments.map((seg, i) => (
        <span
          key={seg.start}
          /* A warm wash behind the sentence, not a colour change on the words:
             reducing contrast on the thing a child is trying to read would be a
             strange way to help them read it. */
          className={
            i === speaking
              ? "rounded-[0.2em] bg-[#e8c88a]/70 transition-colors duration-200"
              : "transition-colors duration-200"
          }
        >
          {seg.text}
        </span>
      ))}
    </p>
  )
}

/**
 * Shown where a page's illustration does not exist yet.
 *
 * Deliberately designed rather than left to the browser. A book on the staging
 * shelf is read before its art is paid for, so this is a state a real reader
 * sees — it should look like a page waiting for its picture, not like something
 * broke.
 */
function ArtPending() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-[#2a2320] to-[#1a1512]">
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="h-7 w-7 text-white/30"
          aria-hidden
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M21 16l-5-5-7 7" />
        </svg>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/35">
          Illustration coming
        </span>
      </div>
    </div>
  )
}

const COVER = -1

export function BookReader({ book, slug }: { book: Book; slug?: string }) {
  // index: -1 = cover, 0..n-1 = pages, n = end card
  const [index, setIndex] = useState(COVER)
  const total = book.pages.length
  const bookSlug = slug ?? book.id

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => Math.min(total, Math.max(COVER, i + dir))),
    [total],
  )
  const restart = useCallback(() => setIndex(0), [])

  const stage = index === COVER ? "cover" : index >= total ? "end" : "page"
  const page = stage === "page" ? book.pages[index] : null
  // Which cover to show, and whether its title is already painted into the art.
  const cover = useMemo(() => bookCoverArt(book), [book])

  const { size, setBox, probeRef } = useBookTextSize(book.pages)

  // Reset per page: a book part-way through illustration has some pages drawn
  // and some not, so one missing file must not blank the rest.
  const [artFailed, setArtFailed] = useState(false)
  useEffect(() => {
    setArtFailed(false)
  }, [index])
  const segments = useMemo(() => (page ? segmentsOf(page.text) : []), [page])

  // Auto-turn when the narration reaches the end of a page. This is what lets a
  // child who cannot read hold the phone and just listen; without it they have
  // to guess when to tap. Guarded on still being on the page that was spoken,
  // so a manual turn mid-sentence can't cause a double advance.
  const spokenIndex = useRef(index)
  spokenIndex.current = index
  const onNarrationEnd = useCallback(() => {
    if (spokenIndex.current !== index) return
    setIndex((i) => (i === index ? Math.min(total, i + 1) : i))
  }, [index, total])

  const { narration } = useNarration(bookSlug)
  const aloud = useReadAloud(
    page?.text ?? null,
    segments,
    narration,
    page?.page ?? null,
    onNarrationEnd,
  )

  // Where this book was left off, read once after mount. Reading localStorage
  // during render would make the server's HTML and the first client paint differ.
  const [resumeAt, setResumeAt] = useState<number | null>(null)
  useEffect(() => {
    const saved = readProgress()[bookSlug]
    if (isResumable(saved) && saved.total === total) setResumeAt(saved.page)
  }, [bookSlug, total])

  useEffect(() => {
    if (index < 0) return
    recordProgress(bookSlug, Math.min(index, total - 1), total)
  }, [index, bookSlug, total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1)
      else if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  // Warm the next page's illustration while the current one is being read. Only
  // the cover and the open page get `priority`; marking all fourteen priority
  // made them compete for the same connections and the open page arrived later.
  useEffect(() => {
    const next = book.pages[index + 1]
    if (!next?.art) return
    const img = new window.Image()
    img.src = `/${next.art}`
  }, [index, book.pages])

  // Touch swipe — ONLY on story pages. The cover and end card have their own
  // full-screen tap buttons, and letting the frame's swipe fire there too caused
  // a double-navigation. Both axes are tracked so a vertical scroll or a plain
  // tap is never mistaken for a page turn.
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    if (index < 0 || index >= total) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx < 0 ? 1 : -1)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white">
      {/* A screen reader gets told the page changed. Nothing announced it before,
          so to anyone not looking at the screen the book never moved. */}
      <div className="sr-only" role="status" aria-live="polite">
        {stage === "page" ? `Page ${index + 1} of ${total}` : stage === "end" ? "The end" : "Cover"}
      </div>

      <div
        className="reader-stage relative mx-auto h-full w-full max-w-[calc(100svh*9/16)] touch-pan-y overscroll-none select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
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

        {/* Top chrome: close, progress, read-aloud */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center gap-3 bg-gradient-to-b from-black/60 to-transparent px-4 pb-6 pt-3">
          <Link
            href="/"
            aria-label="Close book"
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white/80 backdrop-blur transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            {stage === "page" && (
              <div
                className="h-[3px] w-full overflow-hidden rounded-full bg-white/20"
                role="progressbar"
                aria-label="Reading progress"
                aria-valuemin={1}
                aria-valuemax={total}
                aria-valuenow={index + 1}
              >
                <div
                  className="h-full bg-primary transition-[width] duration-500"
                  style={{ width: `${((index + 1) / total) * 100}%` }}
                />
              </div>
            )}
          </div>
          {/* One control: on or off. A speed dial beside it implied the
              recording needed adjusting, and its default actually played the
              narrator 15% slow. The pacing belongs in the recording. */}
          {aloud.supported && (
            <button
              onClick={aloud.toggle}
              aria-pressed={aloud.on}
              aria-label={
                aloud.on
                  ? "Turn read-aloud off"
                  : aloud.recorded
                    ? "Read this book aloud, narrated"
                    : "Read this book aloud"
              }
              className={`pointer-events-auto grid h-11 w-11 place-items-center rounded-full backdrop-blur transition-colors ${
                aloud.on
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/40 text-white/80 hover:text-white"
              }`}
            >
              {aloud.on ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          )}
        </div>

        {/* COVER */}
        {stage === "cover" && (
          <div className="absolute inset-0 animate-fade-in">
            <button
              aria-label={resumeAt === null ? "Start reading" : "Keep reading"}
              onClick={() => setIndex(resumeAt ?? 0)}
              className="absolute inset-0 z-30 h-full w-full cursor-pointer"
            />
            <Image
              src={`/${cover.src}`}
              alt={`Cover of ${book.title}`}
              fill
              priority
              sizes="(min-width: 768px) 56vh, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-8 pb-16 text-center">
              {/* The seven original covers have the title and tagline PAINTED
                  into the artwork, and this rendered them again on top — so every
                  cover showed its title twice and its subtitle twice. Textless
                  per-book covers need the HTML; painted ones must not have it. */}
              {!cover.paintedTitle && (
                <>
                  <h1 className="font-serif text-4xl font-medium leading-tight text-white text-shadow-cinema">
                    {book.title}
                  </h1>
                  <p className="mt-3 text-sm italic text-white/70">{book.subtitle}</p>
                </>
              )}
              <button
                onClick={() => setIndex(resumeAt ?? 0)}
                className="pointer-events-auto relative z-40 mt-8 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
              >
                {resumeAt === null ? "Start Reading" : `Keep Reading · page ${resumeAt + 1}`}
              </button>
              {/* Only offered when there is a place to come back to, so the cover
                  of an unread book stays a single, obvious button. */}
              {resumeAt !== null && (
                <button
                  onClick={() => setIndex(0)}
                  className="pointer-events-auto relative z-40 mt-3 min-h-11 rounded-full px-4 text-xs text-white/70 underline underline-offset-4 transition-colors hover:text-white"
                >
                  Start from the beginning
                </button>
              )}
              <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-white/40">
                Tap or swipe to turn the page
              </p>
            </div>
          </div>
        )}

        {/* PAGE — illustration on top, warm parchment text panel below.
            The two panels are NOT keyed on the page number: the text panel is
            the surface the type size is measured against, and remounting it on
            every turn would re-measure all thirteen pages every time. The key
            sits on the image and the prose, which is what needs to re-animate. */}
        {stage === "page" && page && (
          <div className="reader-page absolute inset-0 flex flex-col bg-[#f4e9d6]">
            {/* The served file is already cropped to this region's exact shape
                by optimize-books.mjs, so object-cover has nothing left to trim.
                See READER_ART_ASPECT in books/types.ts. */}
            <div
              key={page.page}
              className="reader-art relative min-h-0 flex-[9] overflow-hidden bg-black animate-fade-in"
            >
              {page.art && !artFailed ? (
                <Image
                  src={`/${page.art}`}
                  /* In a picture book the illustration carries half the story, so
                     an empty alt hands a child using a screen reader half a book. */
                  alt={describePage(page)}
                  fill
                  priority
                  sizes="(min-width: 768px) 56vh, 100vw"
                  className="object-cover"
                  /* A book whose art has not been generated yet still has an art
                     PATH — pageArt() always returns one — so the file 404s and
                     the browser renders the alt text sprawled across the top of
                     the screen, over the close button. Checking `page.art` was
                     never enough; the failure has to be caught at load. */
                  onError={() => setArtFailed(true)}
                />
              ) : (
                <ArtPending />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#f4e9d6] to-transparent" />
            </div>

            {/* min-h-0 is load-bearing. Without it this panel's min-height is
                content-based, so a long page made the panel GROW past its 11/20
                share, squeezing the illustration and still clipping the last
                line. The split is fixed now and the type is fitted to it. */}
            <div
              ref={setBox}
              className="reader-text relative z-20 flex min-h-0 flex-[11] items-center justify-center overflow-hidden bg-[#f4e9d6] px-6 pb-20 pt-5"
            >
              <PageText
                key={page.page}
                segments={segments}
                speaking={aloud.on ? aloud.speaking : -1}
                size={size}
              />

              {/* The measuring surface. It overlays the real panel and carries
                  the same padding, so the probe wraps at exactly the width the
                  prose will, and the panel itself is what gets measured. A
                  separate clone with hand-computed height came out 45px short of
                  the truth and sized every book's type a step too small.
                  Its content is written imperatively, one page at a time. */}
              <div
                aria-hidden
                /* Same padding as the panel it overlays, including the landscape
                   override, or the measurement is taken against the wrong box. */
                className="reader-text pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-6 pb-20 pt-5 opacity-0"
              >
                <p
                  ref={probeRef}
                  className="mx-auto max-w-md whitespace-pre-line text-pretty font-serif"
                  style={{ lineHeight: 1.45 }}
                />
              </div>
            </div>
          </div>
        )}

        {/* END */}
        {stage === "end" && (
          <div className="absolute inset-0 overflow-y-auto bg-background animate-fade-in">
            <EndCard book={book} slug={bookSlug} onRestart={restart} />
          </div>
        )}

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

/**
 * The last page.
 *
 * It used to offer Read Again and a link back to the shelf, which is a dead end
 * at the exact moment a child is most willing to start another book. Now it hands
 * over the next one by cover.
 */
function EndCard({
  book,
  slug,
  onRestart,
}: {
  book: Book
  slug: string
  onRestart: () => void
}) {
  const next = useMemo(() => nextBookAfter(slug), [slug])
  // "Book 2 of 3" under The End, so finishing one book tells a child there are
  // more of these — the thing a series is for.
  const place = useMemo(() => {
    const story = storyByReaderSlug(slug)
    return story ? seriesPosition(story) : null
  }, [slug])

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-8 py-16 text-center">
      <p className="font-serif text-3xl font-medium text-foreground">The End</p>
      <p className="mt-3 max-w-xs text-sm text-muted-foreground">{book.title}</p>
      {place && (
        <p className="mt-1 text-xs text-muted-foreground">
          Book {place.index} of {place.total}
        </p>
      )}

      {next && (
        <div className="mt-10 w-full max-w-[240px]">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {/* Naming the series is the whole point of the handover: "More
                Lantern Valley" is a reason to carry on, "Read next" is a shrug. */}
            {next.series ? `More ${next.series}` : "Read next"}
          </p>
          <Link
            href={`/read/${next.story.readerSlug}`}
            className="group block"
            aria-label={`Read ${next.story.title}`}
          >
            <div className="relative aspect-[9/16] overflow-hidden rounded-lg ring-1 ring-border transition-all group-hover:ring-primary/60">
              <Image
                src={next.story.portrait || next.story.landscape}
                alt={next.story.title}
                fill
                sizes="240px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <p className="mt-3 font-serif text-lg leading-tight text-foreground">
              {next.story.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{next.story.minutes} min</p>
          </Link>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={onRestart}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-6 text-sm font-semibold text-foreground ring-1 ring-border transition-transform active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          Read {book.title.split(" ")[0]} again
        </button>
        <Link
          href="/"
          className="min-h-11 px-4 text-sm leading-[2.75rem] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Back to Storylands
        </Link>
      </div>
    </div>
  )
}

/**
 * What to offer when a book ends.
 *
 * The next book in the SAME SERIES comes first, because that is the one moment a
 * child is both willing to start another book and already attached to these
 * characters. Everything else falls back to catalog order, wrapping around —
 * with eight books, similarity scoring is a dressed-up way of always suggesting
 * the same two.
 *
 * Two things this must not do. It must not offer the book just finished, which is
 * why it returns nothing rather than wrapping onto itself. And it must not cross
 * shelves: `stories` includes the `shelf: "new"` staging books, so the old
 * version could hand a child an unreviewed book straight off the end of a
 * published one — the exact leak `poolForBands` exists to prevent, reintroduced
 * at the one screen that actively pushes a book at somebody.
 */
function nextBookAfter(slug: string): { story: Story; series: string | null } | null {
  const current = storyByReaderSlug(slug)

  if (current) {
    const next = nextInSeries(current)
    if (next?.readerSlug) {
      return { story: next, series: seriesById(current.seriesId!)?.name ?? null }
    }
  }

  // Stay on the shelf this book came from.
  const shelf = current?.shelf === "new" ? newShelf() : mainShelf()
  const readable = shelf.filter((s) => s.readerSlug)
  if (readable.length < 2) return null
  const at = readable.findIndex((s) => s.readerSlug === slug)
  if (at < 0) return { story: readable[0], series: null }
  return { story: readable[(at + 1) % readable.length], series: null }
}
