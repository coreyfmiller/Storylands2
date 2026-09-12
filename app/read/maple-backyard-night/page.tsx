import { book } from "@/books/maple-backyard-night/book"
import { BookReader } from "@/components/book-reader"

// Phone-format 9:16 tap-through reader for the Maple picture book.
export default function Page() {
  return <BookReader book={book} />
}
