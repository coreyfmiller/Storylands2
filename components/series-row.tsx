"use client"

import Image from "next/image"
import Link from "next/link"
import type { Band } from "@/lib/catalog"
import { seriesForBands, thumbOf } from "@/lib/catalog"

export function SeriesRow({ bands }: { bands: Band[] }) {
  const items = seriesForBands(bands)
  // `series` already drops anything with fewer than two readable books, so an
  // empty list here means no series is followable yet. The guard used to be
  // `< 1`, which contradicted that rule and would have rendered a shelf of one.
  if (items.length === 0) return null

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
          /* A Link, not a bare <article>. These cards looked exactly like the
             clickable book cards beside them and did nothing at all when pressed
             — there was no href, no handler, and no page for them to open. */
          <Link
            key={s.id}
            href={`/series/${s.id}`}
            aria-label={`${s.name}, ${s.count} stories`}
            className="group relative w-[85vw] shrink-0 snap-start sm:w-[440px]"
          >
            <div className="relative aspect-[21/10] overflow-hidden rounded-md ring-1 ring-border transition-all duration-500 group-hover:ring-primary/40">
              <Image
                src={thumbOf(s.image)}
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
          </Link>
        ))}
        <div className="shrink-0" aria-hidden />
      </div>
    </section>
  )
}
