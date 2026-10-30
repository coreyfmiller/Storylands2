import type { Metadata } from 'next'
import { NewBooksView } from '@/components/newbooks-view'

// The staging shelf.
//
// Everything written against the strict bar lands here first, next to a plain
// statement of what that bar is, so a new book can be read and judged before it
// goes anywhere near the main library. The seven original books pass the loose
// bar and fail the strict one on five to seven counts each — which is most of
// what auditing them concluded — so mixing the generations would just hide
// whether the new work is actually better.
//
// Not linked from the app. You get here by typing the URL.
export const metadata: Metadata = {
  title: 'New books',
  description: 'The second generation, held to a stricter bar.',
  robots: { index: false, follow: false },
}

export default function NewBooksPage() {
  return <NewBooksView />
}
