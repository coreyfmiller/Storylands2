"use client"

import { useState } from "react"
import Image from "next/image"
import type { Story } from "@/lib/catalog"
import { hasPaintedTitle, storyById, stories, thumbOf } from "@/lib/catalog"
import { StoryMeta } from "@/components/story-card"
import { Play, Repeat } from "lucide-react"
import { timesFinished, useProgress } from "@/lib/progress"
import { BANDS } from "@/lib/bands"

/**
 * What a book of each band is like, in a parent's terms.
 *
 * The band spec's `spine` is written at an authoring model and reads like a
 * brief; this is the same information for somebody choosing a book at bedtime.
 * Kept short and concrete, and deliberately honest about what a board book is
 * NOT — a parent who opens an eight-page naming book expecting a story will
 * think the app is broken rather than that they picked the wrong shelf.
 */
const BAND_SHAPE: Record<string, string> = {
  baby: "A naming book, not a story. One thing to point at on each page, a sound to make, and the same line coming back for someone small to say with you. Nothing goes wrong and it ends asleep.",
  toddler:
    "One simple want and one thing in the way. Three tries that do not work, with a line that repeats each time, and a fourth that does. Noises carry the jokes.",
  young:
    "A proper story: someone wants something, a friend turns up and asks the question that changes it, something goes genuinely wrong, and putting it right costs them something. It never explains itself on the last page.",
  middle:
    "Longer, and driven by what the characters say to each other. Somebody is confidently wrong at the start and finds out, and a second thread runs underneath and pays off near the end.",
}

export function StoryDetail({
  story,
  resuming,
  onBegin,
  onOpen,
}: {
  story: Story
  resuming: boolean
  onBegin: (s: Story) => void
  onOpen: (s: Story) => void
}) {
  const { progress } = useProgress()
  const readings = story.readerSlug ? timesFinished(progress[story.readerSlug]) : 0

  const related = stories
    .filter(
      (s) =>
        s.id !== story.id &&
        s.band === story.band &&
        s.genres.some((g) => story.genres.includes(g)),
    )
    .slice(0, 3)

  // Painted covers are tall 9:16 with the title already in the art, so show the
  // whole cover without a wide crop and never overlay a second title.
  //
  // This was `story.band === "young"`, which was true while every 4-6 cover was
  // a painted character portrait and wrong the moment a book got a textless
  // cover of its own — those books' titles stopped being drawn anywhere. It is
  // derived from the cover path now, in one place, next to the reader's version.
  const paintedCover = hasPaintedTitle(story)

  return (
    <div className="overflow-hidden rounded-none bg-card shadow-2xl sm:rounded-xl">
      {paintedCover ? (
        <button
          type="button"
          onClick={() => onBegin(story)}
          aria-label={resuming ? `Continue ${story.title}` : `Begin ${story.title}`}
          className="group relative block w-full cursor-pointer bg-black"
        >
          <div className="relative mx-auto aspect-[9/16] max-h-[62svh] w-auto">
            <Image
              src={story.portrait || story.landscape}
              alt={`Cover for ${story.title}`}
              fill
              sizes="(min-width: 640px) 360px, 100vw"
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onBegin(story)}
          aria-label={resuming ? `Continue ${story.title}` : `Begin ${story.title}`}
          className="group relative block aspect-[16/10] w-full cursor-pointer text-left sm:aspect-[16/8]"
        >
          <Image
            src={story.landscape}
            alt={`Key art for ${story.title}`}
            fill
            sizes="(min-width: 640px) 640px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div
            className="absolute inset-0 mix-blend-soft-light opacity-70"
            style={{ background: `radial-gradient(70% 80% at 30% 90%, ${story.tint.replace(")", " / 55%)")}, transparent 70%)` }}
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              {story.kicker}
            </p>
            <h2 className="max-w-2xl font-serif text-4xl font-medium leading-none tracking-tight text-white text-shadow-cinema sm:text-5xl">
              {story.title}
            </h2>
          </div>
        </button>
      )}

      <div className="p-5 sm:p-8">
        <p className="max-w-2xl text-pretty font-serif text-lg italic leading-snug text-foreground/90">
          {story.hook}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onBegin(story)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-95"
          >
            <Play className="h-4 w-4 fill-current" />
            {resuming ? "Continue Story" : "Begin Story"}
          </button>
          {/* "Add to My Stories" used to sit here. It was a useState(false)
              with nothing behind it — no storage, no list, no screen that ever
              showed the result — so it claimed to save something and saved
              nothing. A control that lies about persisting is worse than no
              control.
              The honest version already exists and needs no button: the
              "Read it again" row is built from books actually read to the end
              more than once, which is a real preference rather than a declared
              one. */}
        </div>

        {/* How many times this one has been asked for. Shown only once it has
            genuinely happened — a parent seeing "read 7 times" is being told
            something true about their own child. */}
        {readings >= 2 && (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-foreground/80">
            <Repeat className="h-3 w-3" aria-hidden />
            Read {readings} times
          </p>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:gap-10">
          <div>
            <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {story.synopsis}
            </p>

            {/* What this band's books are LIKE, which is the question a parent
                is actually asking when they look at "Ages 0-2" and wonder
                whether it is a story or a naming book. Taken from the band's
                own spine, so it describes what the validator enforced. */}
            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-foreground/70">
              <span className="font-semibold text-foreground/90">
                {BANDS[story.band].label}:
              </span>{" "}
              {BAND_SHAPE[story.band]}
            </p>
          </div>
          <dl className="grid h-fit gap-3 border-t border-border pt-5 text-sm sm:min-w-44 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
            <Detail label="Ages" value={story.ages.replace("Ages ", "")} />
            <Detail label="Length" value={`${story.minutes} min`} />
            <Detail label="Genre" value={story.genres.join(", ")} />
            {/* The shape of the book, for a parent deciding at bedtime. These
                come from the band, so they cannot disagree with what the book
                was actually written and validated against. `targetAge` has been
                stored on every story since the beginning and read by nothing
                until now. */}
            <Detail label="Pages" value={`${BANDS[story.band].pages.target}`} />
            <Detail
              label="Words a page"
              value={`about ${BANDS[story.band].words.target}`}
            />
          </dl>
        </div>

        {related.length > 0 && (
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              More like this
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {related.map((r) => (
                <button
                  key={r.id}
                  /* `r` is already the Story. The old code round-tripped it
                     through storyById, which now returns undefined for an
                     unknown id instead of a non-null assertion. */
                  onClick={() => onOpen(r)}
                  className="group text-left"
                >
                  <div
                    className={`relative overflow-hidden rounded-md ring-1 ring-border transition-all group-hover:ring-primary/50 ${
                      paintedCover ? "aspect-[9/16]" : "aspect-[16/10]"
                    }`}
                  >
                    <Image
                      src={thumbOf(paintedCover ? r.portrait || r.landscape : r.landscape)}
                      alt={paintedCover ? r.title : ""}
                      fill
                      sizes="(min-width: 640px) 200px, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  {!paintedCover && (
                    <>
                      <p className="mt-1.5 line-clamp-1 font-serif text-sm text-foreground">
                        {r.title}
                      </p>
                      <StoryMeta story={r} className="line-clamp-1" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  )
}
