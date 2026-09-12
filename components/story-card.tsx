"use client"

import Image from "next/image"
import type { Story } from "@/lib/catalog"
import { thumbOf } from "@/lib/catalog"
import { Play } from "lucide-react"

type Props = {
  story: Story
  onOpen: (s: Story) => void
}

export function StoryMeta({
  story,
  className = "",
}: {
  story: Story
  className?: string
}) {
  return (
    <p className={`text-xs text-muted-foreground ${className}`}>
      <span className="text-foreground/70">{story.ages}</span>
      <span className="mx-1.5 opacity-40">·</span>
      {story.minutes} min
      <span className="mx-1.5 opacity-40">·</span>
      {story.genres.join(" · ")}
    </p>
  )
}

export function LandscapeCard({ story, onOpen }: Props) {
  return (
    <button
      onClick={() => onOpen(story)}
      className="group relative w-[76vw] shrink-0 snap-start text-left sm:w-[340px] lg:w-[360px]"
      aria-label={`Open ${story.title}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-md ring-1 ring-border transition-all duration-500 ease-out group-hover:ring-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
        <Image
          src={thumbOf(story.landscape) || "/placeholder.svg"}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 340px, 76vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120% 80% at 50% 120%, ${story.glow.replace(")", " / 22%)")}, transparent 70%)`,
          }}
        />
        <span className="absolute left-3 top-3 rounded-sm bg-black/45 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
          {story.genres[0]}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-serif text-lg leading-tight text-white text-shadow-cinema">
            {story.title}
          </h3>
          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <div className="overflow-hidden">
              <div className="flex items-center gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Play className="h-3 w-3 fill-current" />
                  Begin
                </span>
                <span className="text-xs text-white/70">
                  {story.ages} · {story.minutes} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

export function PortraitCard({
  story,
  onOpen,
  hideMeta = false,
}: Props & { hideMeta?: boolean }) {
  return (
    <button
      onClick={() => onOpen(story)}
      className="group relative w-[46vw] shrink-0 snap-start text-left sm:w-[200px]"
      aria-label={`Open ${story.title}`}
    >
      <div
        className={`relative overflow-hidden rounded-md ring-1 ring-border transition-all duration-500 group-hover:ring-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary ${
          hideMeta ? "aspect-[9/16]" : "aspect-[2/3]"
        }`}
      >
        <Image
          src={thumbOf(story.portrait || story.landscape) || "/placeholder.svg"}
          alt={hideMeta ? story.title : ""}
          fill
          sizes="(min-width: 640px) 200px, 46vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      {/* When the cover art already carries the title (ages 4–7 painted covers), skip the
          text label so the card isn't titled twice. Keep a short age/time line for context. */}
      {hideMeta ? (
        <p className="mt-2 text-xs text-muted-foreground">
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
  )
}
