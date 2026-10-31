"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { BANDS } from "@/lib/bands"
import { seriesById, thumbOf, type Story } from "@/lib/catalog"
import type { Character } from "@/lib/characters"
import { isResumable, useProgress } from "@/lib/progress"

/**
 * One character, and every book they are in.
 *
 * Grouped by band and labelled with the age, because a character can now span
 * bands — Pip is in a board book and a 4-6 picture book — and handing a parent
 * an undifferentiated list of "Pip books" would hide that one of them is eight
 * pages of six words and the other is a thirteen-page story.
 */
export function CharacterView({
  character,
  stories,
}: {
  character: Character
  stories: Story[]
}) {
  const { progress } = useProgress()

  // Band order is already the sort order from storiesForCharacter, so grouping
  // in encounter order keeps youngest-first without re-sorting.
  const groups: { band: string; label: string; ages: string; stories: Story[] }[] = []
  for (const s of stories) {
    const last = groups[groups.length - 1]
    if (last && last.band === s.band) last.stories.push(s)
    else
      groups.push({
        band: s.band,
        label: BANDS[s.band].label,
        ages: BANDS[s.band].agesLabel,
        stories: [s],
      })
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9]">
        <Image
          src={`/characters/${character.id}.webp`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <Link
          href="/"
          aria-label="Back to the library"
          className="tap absolute left-3 top-3 z-10 flex items-center justify-center rounded-full bg-black/45 text-white/85 backdrop-blur transition-colors hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-5 sm:px-8">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/65">
            {stories.length} {stories.length === 1 ? "story" : "stories"} · {character.species}
          </p>
          <h1 className="font-serif text-4xl leading-none text-white text-shadow-cinema">
            {character.name}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-snug text-white/80">
            {character.tagline}
          </p>
        </div>
      </div>

      {groups.map((group) => (
        <section key={group.band} className="mt-8 px-4 sm:px-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {group.ages}
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {group.stories.map((s) => {
              const p = s.readerSlug ? progress[s.readerSlug] : undefined
              const resumable = isResumable(p)
              const run = s.seriesId ? seriesById(s.seriesId) : undefined
              return (
                <li key={s.id}>
                  <Link
                    href={`/read/${s.readerSlug}`}
                    className="group flex items-center gap-4 rounded-lg p-2 ring-1 ring-transparent transition-colors hover:bg-white/5 hover:ring-border"
                  >
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
                      <p className="font-serif text-base leading-tight text-foreground">
                        {s.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
                        {s.hook}
                      </p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        {s.minutes} min
                        {run ? ` · ${run.name}` : ""}
                        {resumable && p ? ` · page ${p.page + 1}` : ""}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}
