"use client"

import Image from "next/image"
import type { Profile } from "@/lib/catalog"
import { seriesForProfile, thumbOf } from "@/lib/catalog"

export function SeriesRow({ profile }: { profile: Profile }) {
  const items = seriesForProfile(profile)
  if (items.length < 1) return null

  return (
    <section className="py-5">
      <div className="mb-3 px-4 sm:px-6 lg:px-10">
        <h2 className="font-serif text-xl font-medium tracking-tight sm:text-2xl">
          Return to Worlds You Love
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Recurring characters and places, continued across many stories.
        </p>
      </div>
      <div className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto scrollbar-hide px-4 pb-1 sm:px-6 lg:px-10">
        {items.map((s) => (
          <article
            key={s.id}
            className="group relative w-[85vw] shrink-0 snap-start sm:w-[440px]"
          >
            <div className="relative aspect-[21/10] overflow-hidden rounded-md ring-1 ring-border transition-all duration-500 group-hover:ring-primary/40">
              <Image
                src={thumbOf(s.image) || "/placeholder.svg"}
                alt=""
                fill
                sizes="(min-width: 640px) 440px, 85vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, ${s.glow.replace(")", " / 30%)")} 0%, transparent 55%), linear-gradient(0deg, rgba(0,0,0,0.9), rgba(0,0,0,0.1))`,
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
                  Series · {s.count} stories
                </p>
                <h3 className="font-serif text-2xl leading-none text-white text-shadow-cinema">
                  {s.name}
                </h3>
                <p className="mt-2 max-w-[80%] text-sm leading-snug text-white/75">
                  {s.tagline}
                </p>
              </div>
            </div>
          </article>
        ))}
        <div className="shrink-0" aria-hidden />
      </div>
    </section>
  )
}
