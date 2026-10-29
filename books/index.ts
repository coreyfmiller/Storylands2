// The book registry.
//
// One place that knows which books exist, so `app/read/[slug]` can serve any
// of them and `generateStaticParams` can prerender the lot. Previously each
// book needed its own hand-written four-line route file; adding a book is now
// adding a line here.

import { book as finn } from './finn-little-boat/book'
import { book as lumi } from './lumi-lights-way/book'
import { book as maple } from './maple-backyard-night/book'
import { book as nibs } from './nibs-perfect-acorn/book'
import { book as oliver } from './oliver-vacuum/book'
import { book as pip } from './pip-first-flame/book'
import { book as rusty } from './rusty-loud-day/book'
import type { Book } from './types'

const all: Book[] = [pip, oliver, maple, finn, nibs, rusty, lumi]

export const books: Record<string, Book> = Object.fromEntries(
  all.map((b) => [b.id, b]),
)

export const bookSlugs: string[] = all.map((b) => b.id)

export function bookBySlug(slug: string): Book | undefined {
  return books[slug]
}
