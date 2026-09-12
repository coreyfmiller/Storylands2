"use client"

import { useCallback, useMemo, useState } from "react"
import type { Profile, Story } from "@/lib/catalog"
import {
  profiles,
  shelvesForProfile,
  continueForProfile,
} from "@/lib/catalog"
import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { ContinueRow } from "@/components/continue-row"
import { StoryRow } from "@/components/story-row"
import { SeriesRow } from "@/components/series-row"
import { Modal } from "@/components/modal"
import { StoryDetail } from "@/components/story-detail"
import { ReaderPreview } from "@/components/reader-preview"
import { SearchOverlay } from "@/components/search-overlay"
import { ParentFooter } from "@/components/parent-footer"
import { storyById } from "@/lib/catalog"

export function StorylandsApp() {
  const [active, setActive] = useState<Profile>(profiles[0]) // Avery · 6 (ages 4–7)
  const [detail, setDetail] = useState<Story | null>(null)
  const [reader, setReader] = useState<Story | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const selectProfile = useCallback((p: Profile) => {
    setActive(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const heroStory = useMemo(() => storyById(active.heroId), [active])
  const shelves = useMemo(() => shelvesForProfile(active), [active])

  const isResuming = useCallback(
    (s: Story) => continueForProfile(active).some((c) => c.story.id === s.id),
    [active],
  )

  const openDetail = useCallback((s: Story) => setDetail(s), [])
  const openReader = useCallback((s: Story) => {
    setDetail(null)
    setSearchOpen(false)
    setReader(s)
  }, [])

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
        <Hero story={heroStory} onBegin={openReader} onInfo={openDetail} />

        <div className="relative z-10 -mt-8 pb-8">
          <ContinueRow profile={active} onResume={openReader} />

          {topShelves.map((shelf) => (
            <StoryRow key={shelf.title} shelf={shelf} onOpen={openDetail} />
          ))}

          <SeriesRow profile={active} />

          {bottomShelves.map((shelf) => (
            <StoryRow key={shelf.title} shelf={shelf} onOpen={openDetail} />
          ))}
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

      <ReaderPreview story={reader} onClose={() => setReader(null)} />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpen={openDetail}
      />
    </div>
  )
}
