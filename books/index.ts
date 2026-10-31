// The book registry.
//
// One place that knows which books exist, so `app/read/[slug]` can serve any
// of them and `generateStaticParams` can prerender the lot. Previously each
// book needed its own hand-written four-line route file; adding a book is now
// adding a line here.

import { book as finn } from './finn-little-boat/book.ts'
import { book as lumi } from './lumi-lights-way/book.ts'
import { book as maple } from './maple-backyard-night/book.ts'
import { book as nibs } from './nibs-perfect-acorn/book.ts'
import { book as oliver } from './oliver-vacuum/book.ts'
import { book as pip } from './pip-first-flame/book.ts'
import { book as rusty } from './rusty-loud-day/book.ts'
import { book as pixiesEnormousPlip } from './pixies-enormous-plip/book.ts'
import { book as tillysWinterMap } from './tillys-winter-map/book.ts'
import { book as goodnightLittleLight } from './goodnight-little-light/book.ts'
import { book as oliversBallUnderTheChair } from './olivers-ball-under-the-chair/book.ts'
import type { Book } from './types.ts'

const all: Book[] = [pip, oliver, maple, finn, nibs, rusty, lumi, pixiesEnormousPlip, tillysWinterMap, goodnightLittleLight, oliversBallUnderTheChair]

export const books: Record<string, Book> = Object.fromEntries(
  all.map((b) => [b.id, b]),
)

export const bookSlugs: string[] = all.map((b) => b.id)

export function bookBySlug(slug: string): Book | undefined {
  return books[slug]
}
