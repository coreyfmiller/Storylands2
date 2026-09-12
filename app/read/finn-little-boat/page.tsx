import { book } from "@/books/finn-little-boat/book"
import { BookReader } from "@/components/book-reader"

// Phone-format 9:16 tap-through reader for the Finn picture book.
export default function Page() {
  return <BookReader book={book} />
}
