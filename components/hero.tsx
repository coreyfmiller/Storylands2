"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import type { Story } from "@/lib/catalog"
import { Play, Info } from "lucide-react"

export function Hero({
  story,
  onBegin,
  onInfo,
  rotation,
}: {
  story: Story
  onBegin: (s: Story) => void
  onInfo: (s: Story) => void
  rotation?: { index: number; count: number; onSelect: (i: number) => void }
}) {
  const frame = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return
    const el = frame.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setOffset({ x: px * -18, y: py * -12 })
  }

  const isFirefly = story.id === "firefly"

  return (
    <section
      ref={frame}
      onPointerMove={onMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      className="relative isolate flex min-h-[68svh] items-center overflow-hidden sm:min-h-[74svh]"
    >
      <div
        key={story.id}
        className="absolute inset-0 -z-10 animate-fade-in"
        style={{ transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)", transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.08)` }}
      >
        <Image
          src={story.heroImage || story.landscape || "/placeholder.svg"}
          alt={`Key art for ${story.title}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* readability + atmospheric grade */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/35 to-background/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      <div
        className="absolute inset-0 -z-10 mix-blend-soft-light opacity-60"
        style={{ background: `radial-gradient(80% 60% at 25% 70%, ${story.tint.replace(")", " / 45%)")}, transparent 70%)` }}
      />

      {isFirefly && <Fireflies />}

      <div className="relative w-full px-4 pb-10 pt-24 sm:px-6 sm:pb-12 lg:px-10">
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="max-w-xl animate-fade-up">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">
              {story.kicker}
            </p>
            <h1 className="font-serif text-5xl font-medium leading-[0.95] tracking-tight text-white text-shadow-cinema sm:text-6xl lg:text-7xl">
              {story.title}
            </h1>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
              {story.hook}
            </p>
            <p className="mt-4 text-sm text-white/60">
              {story.ages} · {story.minutes} min · {story.genres.join(" · ")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onBegin(story)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              >
                <Play className="h-4 w-4 fill-current" />
                Begin Story
              </button>
              <button
                onClick={() => onInfo(story)}
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/20 transition-colors hover:bg-white/20"
              >
                <Info className="h-4 w-4" />
                More Info
              </button>
            </div>
          </div>

          {/* The painted book cover, shown beside the key art. Tapping it begins the story.
              Hidden on the smallest screens so the headline stays the focus. */}
          {story.portrait && (
            <button
              key={`cover-${story.id}`}
              onClick={() => onBegin(story)}
              aria-label={`Begin ${story.title}`}
              className="group relative hidden shrink-0 animate-fade-up sm:block"
            >
              <div className="relative aspect-[9/16] w-[150px] overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/20 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03] lg:w-[190px]">
                <Image
                  src={story.portrait}
                  alt={story.title}
                  fill
                  sizes="(min-width: 1024px) 190px, 150px"
                  className="object-cover"
                />
              </div>
            </button>
          )}
        </div>

        {/* Rotation dots */}
        {rotation && rotation.count > 1 && (
          <div className="mt-8 flex items-center gap-2">
            {Array.from({ length: rotation.count }).map((_, i) => (
              <button
                key={i}
                onClick={() => rotation.onSelect(i)}
                aria-label={`Show featured story ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === rotation.index ? "w-6 bg-primary" : "w-1.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function Fireflies() {
  const dots = [
    { top: "38%", left: "18%", d: "0s" },
    { top: "55%", left: "30%", d: "1.1s" },
    { top: "44%", left: "62%", d: "0.6s" },
    { top: "66%", left: "74%", d: "1.8s" },
    { top: "30%", left: "82%", d: "2.4s" },
    { top: "72%", left: "46%", d: "0.3s" },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      {dots.map((d, i) => (
        <span
          key={i}
          className="firefly absolute h-1.5 w-1.5 rounded-full"
          style={{
            top: d.top,
            left: d.left,
            animationDelay: d.d,
            background: "oklch(0.9 0.14 90)",
            boxShadow: "0 0 10px 3px oklch(0.85 0.14 85 / 70%)",
          }}
        />
      ))}
    </div>
  )
}
