import Link from 'next/link'
import { Logo } from '@/components/logo'

// Shown when a navigation is attempted with no connection and nothing cached.
// Deliberately plain and reassuring: nothing is broken, and anything already
// read is still here.
export const metadata = { title: 'Offline' }

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <div className="max-w-sm text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-8 font-serif text-3xl font-medium leading-tight text-foreground">
          No connection
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Storylands needs the internet the first time it opens a book. Any book you have
          already read is still on this device and will open as normal.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground"
        >
          Back to the library
        </Link>
      </div>
    </main>
  )
}
