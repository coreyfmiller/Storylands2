"use client"

import Image from "next/image"
import type { Story } from "@/lib/catalog"
import { Modal } from "@/components/modal"

// Shown when a reader taps "Begin" on a story whose picture book is not built yet.
// Storylands books are linear picture books; unbuilt stories get an honest, warm
// "coming soon" — never a placeholder mechanic.
export function ComingSoon({
  story,
  onClose,
}: {
  story: Story | null
  onClose: () => void
}) {
  const paintedCover = story?.band === "young"

  return (
    <Modal
      open={!!story}
      onClose={onClose}
      label={story ? `${story.title} — coming soon` : "Coming soon"}
    >
      {story && (
        <div className="overflow-hidden rounded-none bg-card shadow-2xl sm:rounded-xl">
          <div className="relative w-full bg-black">
            <div className="relative mx-auto aspect-[9/16] max-h-[48svh] w-auto">
              <Image
                src={story.portrait || story.landscape || "/placeholder.svg"}
                alt={`Cover for ${story.title}`}
                fill
                sizes="(min-width: 640px) 320px, 100vw"
                className={paintedCover ? "object-contain" : "object-cover"}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          </div>

          <div className="px-6 pb-9 pt-2 text-center sm:px-10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              Coming soon
            </p>
            <h2 className="font-serif text-2xl font-medium leading-tight text-foreground sm:text-3xl">
              {story.title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty font-serif text-lg italic leading-snug text-foreground/80">
              {story.hook}
            </p>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              We&apos;re still illustrating this one. It isn&apos;t ready to read
              just yet — check back soon.
            </p>
            <button
              onClick={onClose}
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            >
              Back to stories
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
