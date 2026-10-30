"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { BANDS } from "@/lib/bands"
import { thumbOf, type Series, type Story } from "@/lib/catalog"
import { useProgress, isResumable } from "@/lib/progress"

/**
 * One series, in reading order.
 *
 * The books are numbered on purpose. A child who has just finished book one
 * needs to see that there is a book two and which one it is, and a grid of
 * identical-looking covers in arbitrary order cannot tell them that — which is
 * what the shelf did before `seriesOrder` existed.
 *
 * Progress is read so a part-finished book says so. A series page that treats
 * every book as unopened is the one screen where a child most obviously knows
 * better than the app.
 */
export function SeriesView({ series, books }: { series: Series; books: Story[] }) {
  const { progress } = useProgress()
  const band = BANDS[series.band]

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* ---- banner ---- */}
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        <Image
          src={series.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${series.glow.replace(")", " / 28%)")} 0%, transparent 60%), linear-gradient(0deg, var(--background), rgba(0,0,0,0.15))`,
          }}
        />

        <Link
          href="/"
          aria-label="Back to the library"
          className="tap absolute left-3 top-3 z-10 flex items-center justify-center rounded-full bg-black/45 text-white/85 backdrop-blur transition-colors hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-5 sm:px-8">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/65">
            Series · {books.length} {books.length === 1 ? "story" : "stories"} · {band.agesLabel}
          </p>
          <h1 className="font-serif text-3xl leading-none text-white text-shadow-cinema sm:text-4xl">
            {series.name}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-snug text-white/80">{series.tagline}</p>
        </div>
      </div>

      {/* ---- the books, in order ---- */}
      <ol className="mt-8 flex flex-col gap-3 px-4 sm:px-8">
        {books.map((s, i) => {
          const p = s.readerSlug ? progress[s.readerSlug] : undefined
          const resumable = p && s.readerSlug ? isResumable(p) : false
          return (
            <li key={s.id}>
              <Link
                href={`/read/${s.readerSlug}`}
                className="group flex items-center gap-4 rounded-lg p-2 ring-1 ring-transparent transition-colors hover:bg-white/5 hover:ring-border"
              >
                <span className="w-6 shrink-0 text-center font-serif text-lg text-muted-foreground">
                  {i + 1}
                </span>
                <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-border">
                  <Image
                    src={thumbOf(s.portrait || s.landscape)}
                    alt={s.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-base leading-tight text-foreground">{s.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
                    {s.hook}
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {s.minutes} min
                    {resumable && p ? ` · page ${p.page + 1}` : ""}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>

      {/* A series is defined as two or more readable books, so this cannot
          normally render — but saying it plainly beats an empty page if the
          filter ever changes. */}
      {books.length === 0 && (
        <p className="px-4 pt-8 text-sm text-muted-foreground sm:px-8">
          No books in this series can be read yet.
        </p>
      )}
    </main>
  )
}
