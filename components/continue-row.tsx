"use client"

import Image from "next/image"
import type { Profile, Story } from "@/lib/catalog"
import { continueForProfile, thumbOf } from "@/lib/catalog"
import { Play } from "lucide-react"

export function ContinueRow({
  profile,
  onResume,
}: {
  profile: Profile
  onResume: (s: Story) => void
}) {
  const items = continueForProfile(profile)
  if (!items.length) return null

  // Ages 4–7 use tall 9:16 character covers with titles painted into the art. Render them
  // as portrait cards (matching the shelves) and let the art carry the name, so this row
  // no longer looks like a different design language than everything below it.
  const youngOnly = profile.bands.length === 1 && profile.bands[0] === "young"

  return (
    <section className="py-5">
      <div className="mb-3 px-4 sm:px-6 lg:px-10">
        <h2 className="font-serif text-xl font-medium tracking-tight sm:text-2xl">
          Continue Your Story
        </h2>
      </div>
      <div className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto scrollbar-hide px-4 pb-1 sm:px-6 lg:px-10">
        {items.map(({ story, label, progress }) =>
          youngOnly ? (
            <button
              key={story.id}
              onClick={() => onResume(story)}
              className="group relative w-[46vw] shrink-0 snap-start text-left sm:w-[200px]"
              aria-label={`Resume ${story.title}`}
            >
              <div className="relative aspect-[9/16] overflow-hidden rounded-md ring-1 ring-border transition-all duration-500 group-hover:ring-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                <Image
                  src={story.portrait || story.landscape || "/placeholder.svg"}
                  alt={story.title}
                  fill
                  sizes="(min-width: 640px) 200px, 46vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/95 text-primary-foreground shadow-lg">
                    <Play className="h-5 w-5 translate-x-0.5 fill-current" />
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
                  <div
                    className="h-full bg-primary transition-[width] duration-700"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>
            </button>
          ) : (
            <button
              key={story.id}
              onClick={() => onResume(story)}
              className="group relative w-[82vw] shrink-0 snap-start text-left sm:w-[400px]"
              aria-label={`Resume ${story.title}`}
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-md ring-1 ring-border transition-all duration-500 group-hover:ring-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                <Image
                  src={thumbOf(story.landscape) || "/placeholder.svg"}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 400px, 82vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/95 text-primary-foreground shadow-lg">
                    <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-serif text-lg leading-tight text-white text-shadow-cinema">
                    {story.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/70">{label}</p>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
                  <div
                    className="h-full bg-primary transition-[width] duration-700"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
            </button>
          ),
        )}
        <div className="shrink-0" aria-hidden />
      </div>
    </section>
  )
}
