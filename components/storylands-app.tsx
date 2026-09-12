"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Profile, Story } from "@/lib/catalog"
import {
  profiles,
  shelvesForProfile,
  continueForProfile,
  shouldUseRichShelves,
  libraryForProfile,
  heroRotationForProfile,
} from "@/lib/catalog"
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

export function StorylandsApp() {
  const router = useRouter()
  const [active, setActive] = useState<Profile>(profiles[0]) // Avery · 6 (ages 4–7)
  const [detail, setDetail] = useState<Story | null>(null)
  const [comingSoon, setComingSoon] = useState<Story | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  // Featured hero rotates through the band's built books.
  const [heroIndex, setHeroIndex] = useState(0)

  const selectProfile = useCallback((p: Profile) => {
    setActive(p)
    setHeroIndex(0)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const richShelves = useMemo(() => shouldUseRichShelves(active), [active])
  const shelves = useMemo(() => shelvesForProfile(active), [active])
  const library = useMemo(() => libraryForProfile(active), [active])
  const heroRotation = useMemo(() => heroRotationForProfile(active), [active])
  const heroStory = heroRotation[heroIndex % heroRotation.length]

  // Auto-advance the featured hero (pauses implicitly while a modal covers the page).
  useEffect(() => {
    if (heroRotation.length <= 1) return
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroRotation.length)
    }, 7000)
    return () => clearInterval(t)
  }, [heroRotation])

  const isResuming = useCallback(
    (s: Story) => continueForProfile(active).some((c) => c.story.id === s.id),
    [active],
  )

  const openDetail = useCallback((s: Story) => setDetail(s), [])
  const openReader = useCallback(
    (s: Story) => {
      setDetail(null)
      setSearchOpen(false)
      // Real, built books have a linear 9:16 reader route. Go there.
      if (s.readerSlug) {
        router.push(`/read/${s.readerSlug}`)
        return
      }
      // Not-yet-built stories show an honest "coming soon" (Storylands books are linear
      // picture books — never a choose-your-own-adventure placeholder).
      setComingSoon(s)
    },
    [router],
  )

  // Split shelves so Series sits between discovery rows
  const midpoint = Math.min(3, shelves.length)
  const topShelves = shelves.slice(0, midpoint)
  const bottomShelves = shelves.slice(midpoint)

  return (
    <div id="top" className="min-h-screen bg-background">
      <SiteNav
        profiles={profiles}
        active={active}
        onSelect={selectProfile}
        onSearch={() => setSearchOpen(true)}
      />

      <main key={active.id} className="animate-fade-in">
        <Hero
          story={heroStory}
          onBegin={openReader}
          onInfo={openDetail}
          rotation={{
            index: heroIndex % heroRotation.length,
            count: heroRotation.length,
            onSelect: setHeroIndex,
          }}
        />

        <div className="relative z-10 -mt-12 pb-8">
          <ContinueRow profile={active} onResume={openReader} />

          {richShelves ? (
            // Large catalog: the full Netflix-style recommendation rows (distinct per row).
            <>
              {topShelves.map((shelf) => (
                <StoryRow key={shelf.title} shelf={shelf} onOpen={openDetail} />
              ))}
              <SeriesRow profile={active} />
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
              paintedCovers={active.bands.length === 1 && active.bands[0] === "young"}
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
          <StoryDetail
            story={detail}
            resuming={isResuming(detail)}
            onBegin={openReader}
            onOpen={openDetail}
          />
        )}
      </Modal>

      <ComingSoon story={comingSoon} onClose={() => setComingSoon(null)} />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpen={openDetail}
      />
    </div>
  )
}
