import { book } from "@/books/lumi-lights-way/book"
import { BookReader } from "@/components/book-reader"

// Phone-format 9:16 tap-through reader for the Lumi picture book.
export default function Page() {
  return <BookReader book={book} />
}
