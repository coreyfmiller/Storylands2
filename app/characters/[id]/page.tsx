import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { charactersWithBooks, storiesForCharacter } from "@/lib/catalog"
import { characterById } from "@/lib/characters"
import { CharacterView } from "@/components/character-view"

// Every book one character is in.
//
// This is how a small child actually asks for a book: not by genre, not by
// reading band, but "the dragon one". Nine characters star in this library and
// until now there was no way to browse by any of them — Tilly is in three
// different books and nothing surfaced that anywhere.

export function generateStaticParams() {
  return charactersWithBooks().map(({ character }) => ({ id: character.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const character = characterById(id)
  if (!character) return { title: "Character not found" }
  return {
    title: character.name,
    description: character.tagline,
    openGraph: {
      title: character.name,
      description: character.tagline,
      images: [`/characters/${character.id}.webp`],
    },
  }
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const character = characterById(id)
  if (!character) notFound()

  const stories = storiesForCharacter(id)
  // A character with no readable book has no page. generateStaticParams already
  // excludes them, so this only catches a hand-typed URL.
  if (stories.length === 0) notFound()

  return <CharacterView character={character} stories={stories} />
}
