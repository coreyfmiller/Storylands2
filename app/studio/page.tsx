import { notFound } from 'next/navigation'
import { StudioView } from '@/components/studio/studio-view'

// The authoring console, for development only.
//
// Books are code: `create-book.mjs` writes a TypeScript file that the app
// imports, and that is deliberate — nothing reaches a child without a human
// reading it and a commit. But it also meant you could not see what the engine
// was doing without a terminal.
//
// This is the terminal, in a browser, with the cast and the validator attached.
// It never ships: `notFound()` in production means the route does not exist on
// Vercel, so there is no authoring surface on the public site and no API key
// anywhere near it.
export const metadata = { title: 'Studio' }

export default function StudioPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <StudioView />
}
