"use client"

import { useState } from "react"
import Image from "next/image"
import type { Story } from "@/lib/catalog"
import { storyById, stories, thumbOf } from "@/lib/catalog"
import { StoryMeta } from "@/components/story-card"
import { Play, Plus, Check } from "lucide-react"

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
  const [saved, setSaved] = useState(false)

  const related = stories
    .filter(
      (s) =>
        s.id !== story.id &&
        s.band === story.band &&
        s.genres.some((g) => story.genres.includes(g)),
    )
    .slice(0, 3)

  // Ages 4–7 covers are tall 9:16 with the title painted into the art. Show the whole
  // cover (no wide crop) and don't overlay a second title.
  const paintedCover = story.band === "young"

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
              src={story.portrait || story.landscape || "/placeholder.svg"}
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
            src={story.landscape || "/placeholder.svg"}
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
          <button
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold ring-1 ring-border transition-colors hover:bg-white/5"
          >
            {saved ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {saved ? "In My Stories" : "Add to My Stories"}
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:gap-10">
          <div>
            <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {story.synopsis}
            </p>
          </div>
          <dl className="grid h-fit gap-3 border-t border-border pt-5 text-sm sm:min-w-44 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
            <Detail label="Ages" value={story.ages.replace("Ages ", "")} />
            <Detail label="Length" value={`${story.minutes} min`} />
            <Detail label="Genre" value={story.genres.join(", ")} />
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
                  onClick={() => onOpen(storyById(r.id))}
                  className="group text-left"
                >
                  <div
                    className={`relative overflow-hidden rounded-md ring-1 ring-border transition-all group-hover:ring-primary/50 ${
                      paintedCover ? "aspect-[9/16]" : "aspect-[16/10]"
                    }`}
                  >
                    <Image
                      src={thumbOf(paintedCover ? r.portrait || r.landscape : r.landscape) || "/placeholder.svg"}
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
