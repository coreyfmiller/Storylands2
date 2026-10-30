"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Story } from "@/lib/catalog"
import {
  shelvesForBands,
  shouldUseRichShelves,
  libraryForBands,
  heroRotationForBands,
  storyByReaderSlug,
} from "@/lib/catalog"
import { useProgress } from "@/lib/progress"
import { useReaders } from "@/components/providers/reader-provider"
import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { ContinueRow } from "@/components/continue-row"
import { StoryRow } from "@/components/story-row"
import { SeriesRow } from "@/components/series-row"
import { LibraryGrid } from "@/components/library-grid"
import { Modal } from "@/components/modal"
import { StoryDetail } from "@/components/story-detail"
import { ComingSoon } from "@/components/coming-soon"
import { SearchOverlay } from "@/components/search-overlay"
import { ParentFooter } from "@/components/parent-footer"
import { ReadersSheet } from "@/components/readers-sheet"
import { Welcome } from "@/components/welcome"

export function StorylandsApp() {
  const router = useRouter()
  const { ready, readers, active, bands } = useReaders()
  const [detail, setDetail] = useState<Story | null>(null)
  const [comingSoon, setComingSoon] = useState<Story | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [readersOpen, setReadersOpen] = useState(false)

  const [heroIndex, setHeroIndex] = useState(0)

  // The most recently opened book on this device, used to title the
  // "Because You Read" shelf. With nothing read, that shelf is dropped rather
  // than naming a book this reader has never opened.
  const { progress } = useProgress()
  const recent = useMemo(() => {
    const [latest] = Object.entries(progress).sort((a, b) => b[1].updatedAt - a[1].updatedAt)
    return latest ? storyByReaderSlug(latest[0]) : undefined
  }, [progress])

  const richShelves = useMemo(() => shouldUseRichShelves(bands), [bands])
  const shelves = useMemo(() => shelvesForBands(bands, recent), [bands, recent])
  const library = useMemo(() => libraryForBands(bands), [bands])
  const heroRotation = useMemo(() => heroRotationForBands(bands), [bands])
  const heroStory = heroRotation[heroIndex % Math.max(1, heroRotation.length)]

  useEffect(() => {
    setHeroIndex(0)
  }, [active?.id])

  const openDetail = useCallback((s: Story) => setDetail(s), [])
  const openReader = useCallback(
    (s: Story) => {
      setDetail(null)
      setSearchOpen(false)
      // Real books have a linear 9:16 reader route. Go there.
      if (s.readerSlug) {
        router.push(`/read/${s.readerSlug}`)
        return
      }
      // A book whose art is still being generated gets an honest card.
      setComingSoon(s)
    },
    [router],
  )

  // Nothing is rendered until the stored readers have loaded, because the
  // alternative is a flash of the welcome screen for a family that already set
  // up months ago.
  if (!ready) {
    return <div className="min-h-screen bg-background" aria-busy="true" />
  }

  if (readers.length === 0 || !active || !heroStory) {
    return <Welcome />
  }

  const midpoint = Math.min(3, shelves.length)
  const topShelves = shelves.slice(0, midpoint)
  const bottomShelves = shelves.slice(midpoint)

  return (
    <div id="top" className="min-h-screen bg-background">
      <SiteNav onSearch={() => setSearchOpen(true)} onManageReaders={() => setReadersOpen(true)} />

      <main key={active.id} className="animate-fade-in">
        <Hero
          story={heroStory}
          readerName={active.name}
          onBegin={openReader}
          onInfo={openDetail}
          rotation={{
            index: heroIndex % heroRotation.length,
            count: heroRotation.length,
            onSelect: setHeroIndex,
          }}
        />

        <div className="relative z-10 -mt-12 pb-8">
          {/* Renders nothing until a book has actually been started, so a fresh
              install doesn't open on a row of things nobody read. */}
          <ContinueRow bands={bands} onResume={openReader} />

          {richShelves ? (
            <>
              {topShelves.map((shelf) => (
                <StoryRow key={shelf.title} shelf={shelf} onOpen={openDetail} />
              ))}
              <SeriesRow bands={bands} />
              {bottomShelves.map((shelf) => (
                <StoryRow key={shelf.title} shelf={shelf} onOpen={openDetail} />
              ))}
            </>
          ) : (
            // Small catalog: one big, proud cover grid instead of many redundant rows.
            <LibraryGrid
              title="All Stories"
              stories={library}
              onOpen={openDetail}
              paintedCovers={bands.length === 1 && bands[0] === "young"}
            />
          )}
        </div>

        <ParentFooter />
      </main>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        label={detail ? detail.title : "Story details"}
      >
        {detail && (
          <StoryDetail story={detail} resuming={false} onBegin={openReader} onOpen={openDetail} />
        )}
      </Modal>

      <ComingSoon story={comingSoon} onClose={() => setComingSoon(null)} />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpen={openDetail}
      />

      <ReadersSheet open={readersOpen} onClose={() => setReadersOpen(false)} />
    </div>
  )
}
