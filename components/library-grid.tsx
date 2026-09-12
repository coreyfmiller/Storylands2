"use client"

import Image from "next/image"
import type { Story } from "@/lib/catalog"

// A single big, proud grid of book covers. Used while the catalog is small (see
// RICH_SHELVES_THRESHOLD) instead of many redundant recommendation rows. Shows the tall
// painted 9:16 covers large — 2 across on a phone — so the collection reads as a real
// bookshelf rather than the same few books repeated under different headings.
export function LibraryGrid({
  title,
  stories,
  onOpen,
  paintedCovers = false,
}: {
  title: string
  stories: Story[]
  onOpen: (s: Story) => void
  paintedCovers?: boolean
}) {
  return (
    <section className="px-4 pt-8 sm:px-6 lg:px-10">
      <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => onOpen(story)}
            className="group text-left"
            aria-label={`Open ${story.title}`}
          >
            <div
              className={`relative overflow-hidden rounded-lg ring-1 ring-border shadow-lg transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:ring-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary ${
                paintedCovers ? "aspect-[9/16]" : "aspect-[2/3]"
              }`}
            >
              <Image
                src={story.portrait || story.landscape || "/placeholder.svg"}
                alt={story.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(120% 80% at 50% 120%, ${story.glow.replace(")", " / 22%)")}, transparent 70%)`,
                }}
              />
              {!story.readerSlug && (
                <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                  Coming soon
                </span>
              )}
            </div>
            {/* Painted covers already carry the title in the art; keep a short context line. */}
            {paintedCovers ? (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {story.ages} · {story.minutes} min
              </p>
            ) : (
              <>
                <h3 className="mt-2.5 font-serif text-[15px] leading-snug text-foreground">
                  {story.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {story.ages} · {story.minutes} min
                </p>
              </>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
