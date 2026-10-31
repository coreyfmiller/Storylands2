"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Repeat } from "lucide-react"
import { poolForBands, storyByReaderSlug, thumbOf, type Band, type Story } from "@/lib/catalog"
import { timesFinished, useProgress } from "@/lib/progress"

/**
 * The books that got asked for again.
 *
 * Children do not consume picture books, they re-read one until the adult can
 * recite it. That makes "how many times has this been finished" the strongest
 * signal the app has about what a particular child loves — far stronger than
 * recency, which is all the Continue row knows.
 *
 * It was being discarded: `finished` was a boolean, so a book read once and a
 * book read twenty times looked identical. `completions` now counts.
 *
 * Two rules, both about not inventing things:
 *
 *  - A book needs at least TWO readings to appear. One reading is just "read",
 *    and a row called "Read it again" built from books read once would be a
 *    recommendation row wearing a relationship's clothes.
 *  - Nothing shows until a real re-read has happened. On a new install this
 *    renders nothing at all, which is the truth.
 */
const MIN_READINGS = 2

export function FavouritesRow({
  bands,
  onOpen,
}: {
  bands: Band[]
  onOpen: (s: Story) => void
}) {
  const { progress } = useProgress()

  const items = useMemo(() => {
    const visible = new Set(poolForBands(bands).map((s) => s.id))
    return Object.entries(progress)
      .map(([slug, p]) => ({ story: storyByReaderSlug(slug), times: timesFinished(p) }))
      .filter(
        (x): x is { story: Story; times: number } =>
          !!x.story && x.times >= MIN_READINGS && visible.has(x.story.id),
      )
      .sort((a, b) => b.times - a.times || a.story.title.localeCompare(b.story.title))
      .slice(0, 8)
  }, [progress, bands])

  if (items.length === 0) return null

  return (
    <section className="py-5">
      <div className="mb-3 px-4 sm:px-6 lg:px-10">
        <h2 className="font-serif text-xl font-medium tracking-tight sm:text-2xl">
          Read it again
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The ones you keep coming back to.
        </p>
      </div>
      <div className="flex gap-3.5 overflow-x-auto scrollbar-hide px-4 pb-1 sm:px-6 lg:px-10">
        {items.map(({ story, times }) => (
          <Link
            key={story.id}
            href={`/read/${story.readerSlug}`}
            onClick={(e) => {
              // The shelf opens books through the app's own handler so the
              // reader mounts without a navigation; the href is the fallback
              // and what a middle-click or a screen reader uses.
              e.preventDefault()
              onOpen(story)
            }}
            className="group w-[132px] shrink-0"
            aria-label={`${story.title}, read ${times} times`}
          >
            <div className="relative aspect-[9/16] overflow-hidden rounded-md ring-1 ring-border transition-all group-hover:ring-primary/60">
              <Image
                src={thumbOf(story.portrait || story.landscape)}
                alt={story.title}
                fill
                sizes="132px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-6">
                <Repeat className="h-3 w-3 text-white/70" aria-hidden />
                <span className="text-[11px] font-medium text-white/85">
                  {/* The number, not a vague "favourite". A child who has heard
                      this nine times has a fact about themselves worth seeing. */}
                  {times}×
                </span>
              </div>
            </div>
          </Link>
        ))}
        <div className="shrink-0" aria-hidden />
      </div>
    </section>
  )
}
