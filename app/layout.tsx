import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Geist } from 'next/font/google'
import { ReaderProvider } from '@/components/providers/reader-provider'
import { ServiceWorker } from '@/components/providers/service-worker'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

// Storylands books are linear picture books, read a page at a time. This used to
// promise "meaningful choices" and "interactive stories", which the app has never
// had and deliberately doesn't — see components/coming-soon.tsx.
// Open Graph images are referenced by path, so they need an origin to resolve against.
// Without this Next falls back to localhost:3000 and every shared book link previews a
// broken image.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Storylands — Illustrated Stories for Children',
    template: '%s — Storylands',
  },
  description:
    'Original illustrated picture books, read a page at a time. Warm, hand-crafted art and gentle stories for children aged four and up.',
  // The icon files were in public/ but nothing pointed at them, so every tab
  // showed a blank page glyph and /favicon.ico 404'd on load.
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#141210',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geist.variable} bg-background`}
    >
      <body className="antialiased">
        <ReaderProvider>{children}</ReaderProvider>
        <ServiceWorker />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
