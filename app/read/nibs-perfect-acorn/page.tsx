import { book } from "@/books/nibs-perfect-acorn/book"
import { BookReader } from "@/components/book-reader"

// Phone-format 9:16 tap-through reader for the Nibs picture book.
export default function Page() {
  return <BookReader book={book} />
}
