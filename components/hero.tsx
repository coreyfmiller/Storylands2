"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { Story } from "@/lib/catalog"
import { Play, Info } from "lucide-react"

/**
 * Does this visitor want motion?
 *
 * The featured story used to advance every 7 seconds with no way to stop it,
 * which fails WCAG 2.2.2 and, more to the point, changes the book under a child
 * who is still reading the sentence. The CSS reset in globals.css could not help:
 * the rotation is a JS interval, so it has to ask.
 */
function usePrefersMotion() {
  const [wants, setWants] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setWants(!mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])
  return wants
}

export function Hero({
  story,
  readerName,
  onBegin,
  onInfo,
  rotation,
}: {
  story: Story
  readerName?: string
  onBegin: (s: Story) => void
  onInfo: (s: Story) => void
  rotation?: { index: number; count: number; onSelect: (i: number) => void }
}) {
  const frame = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const wantsMotion = usePrefersMotion()
  const [playing, setPlaying] = useState(true)

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || !wantsMotion) return
    const el = frame.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setOffset({ x: px * -18, y: py * -12 })
  }

  const count = rotation?.count ?? 0
  const advance = rotation?.onSelect
  const index = rotation?.index ?? 0
  const rotating = playing && wantsMotion && count > 1

  useEffect(() => {
    if (!rotating || !advance) return
    const t = setInterval(() => advance((index + 1) % count), 7000)
    return () => clearInterval(t)
  }, [rotating, advance, index, count])

  const isFirefly = story.id === "firefly"

  return (
    <section
      ref={frame}
      onPointerMove={onMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      aria-roledescription="carousel"
      aria-label="Featured stories"
      className="relative isolate flex min-h-[68svh] items-center overflow-hidden sm:min-h-[74svh]"
    >
      <div
        key={story.id}
        className="absolute inset-0 -z-10 animate-fade-in"
        style={{ transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)", transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.08)` }}
      >
        <Image
          src={story.heroImage || story.landscape}
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
        <div className="flex items-center">
          <div className="max-w-xl animate-fade-up">
            {readerName && (
              <p className="mb-2 font-serif text-lg text-white/80">Hello, {readerName}.</p>
            )}
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
        </div>

        {/* Rotation dots, and a stop control — a carousel that advances itself
            must be stoppable. Choosing a dot also stops it, because somebody who
            picked a story is not waiting to be shown another one. */}
        {rotation && rotation.count > 1 && (
          <div className="mt-8 flex items-center gap-3">
            {/* The dot is the indicator; the button around it is the target. A
                12px dot is a guess with a thumb, so each one carries a 44px
                box and only the pill inside it is painted. */}
            <div className="-mx-2 flex items-center">
              {Array.from({ length: rotation.count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPlaying(false)
                    rotation.onSelect(i)
                  }}
                  aria-label={`Show featured story ${i + 1} of ${rotation.count}`}
                  aria-current={i === rotation.index}
                  className="grid h-11 w-7 place-items-center"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === rotation.index ? "w-6 bg-primary" : "w-1.5 bg-white/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            {wantsMotion && (
              <button
                onClick={() => setPlaying((p) => !p)}
                className="min-h-11 rounded-full px-3 text-[11px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
              >
                {playing ? "Stop" : "Play"}
              </button>
            )}
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
