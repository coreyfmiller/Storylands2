import { book } from "@/books/rusty-loud-day/book"
import { BookReader } from "@/components/book-reader"

// Phone-format 9:16 tap-through reader for the Rusty picture book.
export default function Page() {
  return <BookReader book={book} />
}
