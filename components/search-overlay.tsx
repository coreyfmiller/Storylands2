"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import type { Story } from "@/lib/catalog"
import { stories, moodFilters, thumbOf } from "@/lib/catalog"
import { StoryMeta } from "@/components/story-card"
import { Search, X } from "lucide-react"

const moodPredicate: Record<string, (s: Story) => boolean> = {
  Funny: (s) => s.tags.includes("funny"),
  Mystery: (s) => s.tags.includes("mystery"),
  Magic: (s) => s.tags.includes("magic"),
  Adventure: (s) => s.tags.includes("adventure"),
  Friendship: (s) => s.tags.includes("friendship"),
  Suspense: (s) => s.tags.includes("suspense"),
  "Under 15 min": (s) => s.minutes <= 15,
  "Under 30 min": (s) => s.minutes <= 30,
}

export function SearchOverlay({
  open,
  onClose,
  onOpen,
}: {
  open: boolean
  onClose: () => void
  onOpen: (s: Story) => void
}) {
  const [query, setQuery] = useState("")
  const [moods, setMoods] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      clearTimeout(t)
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setMoods([])
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return stories.filter((s) => {
      const matchQ =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.hook.toLowerCase().includes(q) ||
        s.genres.some((g) => g.toLowerCase().includes(q))
      const matchMood = moods.every((m) => moodPredicate[m]?.(s))
      return matchQ && matchMood
    })
  }, [query, moods])

  if (!open) return null

  const active = query.trim() || moods.length > 0

  return (
    <div className="fixed inset-0 z-[105] flex flex-col bg-background/97 backdrop-blur-xl animate-fade-in">
      <div className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, character, genre or mood"
            className="w-full bg-transparent font-serif text-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none sm:text-2xl"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {moodFilters.map((m) => {
            const on = moods.includes(m)
            return (
              <button
                key={m}
                onClick={() =>
                  setMoods((prev) =>
                    on ? prev.filter((x) => x !== m) : [...prev, m],
                  )
                }
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  on
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {m}
              </button>
            )
          })}
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {active
            ? `${results.length} ${results.length === 1 ? "story" : "stories"}`
            : "Browse the full library"}
        </p>

        {results.length === 0 ? (
          <div className="grid place-items-center py-20 text-center">
            <p className="font-serif text-2xl text-foreground">
              Nothing here yet
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              No stories match that combination. Try a different mood or a
              shorter reading time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((s) => (
              <button
                key={s.id}
                onClick={() => onOpen(s)}
                className="group text-left"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-md ring-1 ring-border transition-all group-hover:ring-primary/50">
                  <Image
                    src={thumbOf(s.landscape) || "/placeholder.svg"}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <h3 className="mt-2 line-clamp-1 font-serif text-[15px] text-foreground">
                  {s.title}
                </h3>
                <StoryMeta story={s} className="line-clamp-1" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
