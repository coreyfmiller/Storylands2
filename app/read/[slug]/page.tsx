import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { bookBySlug, bookSlugs } from "@/books"
import { bookCover } from "@/books/types"
import { BookReader } from "@/components/book-reader"

// One route for every picture book.
//
// There were seven of these files, each four identical lines, so adding a book
// meant remembering to add a route and a 404 was the symptom when you didn't.
// The registry in books/index.ts is now the only list.

export function generateStaticParams() {
  return bookSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const book = bookBySlug(slug)
  if (!book) return {}
  return {
    title: book.title,
    description: book.subtitle,
    openGraph: {
      title: book.title,
      description: book.subtitle,
      images: [`/${bookCover(book)}`],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const book = bookBySlug(slug)
  if (!book) notFound()
  return <BookReader book={book} slug={slug} />
}
