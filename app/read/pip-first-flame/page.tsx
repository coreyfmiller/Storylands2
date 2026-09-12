import { book } from "@/books/pip-first-flame/book"
import { BookReader } from "@/components/book-reader"

// Phone-format 9:16 tap-through reader for the Pip picture book.
export default function Page() {
  return <BookReader book={book} />
}
