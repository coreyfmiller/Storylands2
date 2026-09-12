"use client"

import { useRef } from "react"
import type { Shelf, Story } from "@/lib/catalog"
import { LandscapeCard, PortraitCard } from "@/components/story-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function StoryRow({
  shelf,
  onOpen,
}: {
  shelf: Shelf
  onOpen: (s: Story) => void
}) {
  const scroller = useRef<HTMLDivElement>(null)

  const nudge = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <section className="group/row py-5">
      <div className="mb-3 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <h2 className="font-serif text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          {shelf.title}
        </h2>
        <div className="hidden items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 md:flex">
          <RowButton dir={-1} onClick={() => nudge(-1)} />
          <RowButton dir={1} onClick={() => nudge(1)} />
        </div>
      </div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-pl-4 scrollbar-hide px-4 pb-1 sm:scroll-pl-6 sm:px-6 lg:scroll-pl-10 lg:px-10"
      >
        {shelf.stories.map((s) =>
          shelf.layout === "portrait" ? (
            <PortraitCard key={s.id} story={s} onOpen={onOpen} hideMeta={!!shelf.paintedCovers} />
          ) : (
            <LandscapeCard key={s.id} story={s} onOpen={onOpen} />
          ),
        )}
        <div className="shrink-0" aria-hidden />
      </div>
    </section>
  )
}

function RowButton({
  dir,
  onClick,
}: {
  dir: 1 | -1
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 1 ? "Scroll right" : "Scroll left"}
      className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
    >
      {dir === 1 ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </button>
  )
}
