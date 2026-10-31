"use client"

import Image from "next/image"
import Link from "next/link"
import { charactersForBands, thumbOf, type Band } from "@/lib/catalog"

/**
 * Browse by who, which is how a child asks.
 *
 * Shown at every catalog size, like the series row and unlike the tag rows.
 * A four-year-old does not want "Big Adventures", they want "the dragon one",
 * and nine characters were sitting in this library with no way to ask for any
 * of them by name.
 *
 * Round portraits on purpose: these are people, not products. A row of 9:16
 * rectangles would read as more book covers and the whole point is that this
 * row is a different question.
 */
export function CharacterRow({ bands }: { bands: Band[] }) {
  const items = charactersForBands(bands)
  // One character is not a browse. With a single name this row says nothing the
  // shelf below it does not already say.
  if (items.length < 2) return null

  return (
    <section className="py-5">
      <div className="mb-3 px-4 sm:px-6 lg:px-10">
        <h2 className="font-serif text-xl font-medium tracking-tight sm:text-2xl">
          Who would you like to read about?
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-1 sm:px-6 lg:px-10">
        {items.map(({ character, stories }) => (
          <Link
            key={character.id}
            href={`/characters/${character.id}`}
            className="group w-[108px] shrink-0 text-center"
            aria-label={`${character.name}, ${stories.length} ${stories.length === 1 ? "story" : "stories"}`}
          >
            <div className="relative mx-auto aspect-square w-[92px] overflow-hidden rounded-full ring-2 ring-border transition-all group-hover:ring-primary/60">
              <Image
                src={thumbOf(`/characters/${character.id}.webp`)}
                alt=""
                fill
                sizes="92px"
                /* object-top because these are tall painted portraits and the
                   face is near the top; centring them crops to the body. */
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 font-serif text-sm leading-tight text-foreground">
              {character.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {stories.length} {stories.length === 1 ? "story" : "stories"}
            </p>
          </Link>
        ))}
        <div className="shrink-0" aria-hidden />
      </div>
    </section>
  )
}
