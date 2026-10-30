import type { MetadataRoute } from 'next'

// Makes Storylands installable to a phone home screen.
//
// Worth it for one reason: these books get read at bedtime, in a car, and on a
// plane. A browser tab needs a connection and shows a child a URL bar; an
// installed app opens full-screen from an icon and, with the service worker,
// works with no signal at all.
//
// Keep background_color and theme_color in step with --background in
// globals.css and the viewport themeColor in layout.tsx, or the splash screen
// flashes a different colour than the app it is launching.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Storylands — Illustrated Stories',
    short_name: 'Storylands',
    description:
      'Original illustrated picture books, read a page at a time. For ages 2 to 12.',
    start_url: '/',
    display: 'standalone',
    // The reader is a 9:16 stage and the books are portrait art. Locking the
    // orientation is tempting and wrong: a child holding a phone sideways
    // should still get a readable page, which is why the text panel re-fits.
    orientation: 'portrait-primary',
    background_color: '#141210',
    theme_color: '#141210',
    categories: ['books', 'education', 'kids'],
    icons: [
      { src: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
