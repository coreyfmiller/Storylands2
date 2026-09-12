import { book } from "@/books/oliver-vacuum/book"
import { BookReader } from "@/components/book-reader"

// Phone-format 9:16 tap-through reader for the Oliver picture book.
export default function Page() {
  return <BookReader book={book} />
}
