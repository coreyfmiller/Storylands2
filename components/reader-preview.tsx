"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Story } from "@/lib/catalog"
import { X } from "lucide-react"

type Passage = {
  chapter: string
  paragraphs: string[]
  prompt: string
  choices: [string, string]
}

const passages: Record<string, Passage> = {
  firefly: {
    chapter: "Chapter One · The Last Night",
    paragraphs: [
      "The field had gone the color of old brass, and Emi stood in the middle of it with her hands cupped around the brightest thing she had ever held. All summer the fireflies had come in their hundreds. Tonight there was only this one, glowing too hard, as if it were trying to be all of them at once.",
      "Far off, the porch light blinked on. That was the signal — time to come in, summer over, school in the morning. Emi did not move. The firefly pulsed against her palms, warm as a held breath, and she understood, the way you understand things at the end of summer, that it was lost.",
      "Beyond the grass the treeline waited, dark and full of smaller lights. That was where it wanted to go. She could feel it leaning that way, tugging at the cage of her fingers.",
    ],
    prompt:
      "The firefly lifts, drifts an inch toward the distant trees, and hovers — waiting to see what you'll do.",
    choices: ["Follow the light into the field", "Stay on the path home"],
  },
  pip: {
    chapter: "Chapter One · Lanterns",
    paragraphs: [
      "Every dragon in the valley had a flame by their first Lantern Festival. Every dragon but Pip. While the others lit the great paper lanterns and sent them wobbling up into the twilight, Pip breathed out and made only a small, disappointing puff of grey smoke.",
      "\u201cIt will come,\u201d said Gran, though even Gran looked out at the rising lights a little too long when she said it. Below them the whole valley glowed amber, lantern after lantern climbing into the deep blue evening.",
      "Pip decided, quietly, that waiting was for other dragons. Tonight Pip would go and find a flame of their own.",
    ],
    prompt:
      "Two paths lead down from the ledge: the bright road through the festival, or the dark road toward the old volcano.",
    choices: ["Take the bright road", "Take the dark road"],
  },
  lighthouse: {
    chapter: "Chapter One · The Beam",
    paragraphs: [
      "Grey Point lighthouse had been dark for thirty years. Everyone knew that the way they knew the tide tables and the names of the drowned — as a fact you did not question and did not test. So when the beam swung out across the cliffs that evening, slow and certain, Sam stopped so suddenly that Priya walked into her.",
      "\u201cTell me you saw that,\u201d Sam said. Theo was already counting under his breath, the way he did when he was frightened. One sweep. Two. Someone, or something, was up there turning the great lamp by hand.",
      "The storm was coming in behind them. The sensible thing was to go home. None of them were feeling especially sensible.",
    ],
    prompt:
      "The path forks at the cliff's edge — down toward the keeper's cottage, or up the switchback stairs to the light itself.",
    choices: ["Go down to the cottage", "Climb toward the light"],
  },
  vanished: {
    chapter: "Chapter One · Cold Side of the Bed",
    paragraphs: [
      "You notice the small things first. The phone face-down and dark. The window latched from the inside. The half of the room that is exactly as it was yesterday, and the other half that has gone quiet in a way rooms are not supposed to go.",
      "Everyone has already decided what this is. The officer was kind and certain. People leave, she said, and they leave for reasons the people closest to them never see. She wrote it down like it was already true.",
      "But you know how the door was locked. You know what was still here that no one takes when they mean to disappear. And you know, standing in the cold half of the room, that you are going to be the only one who keeps asking.",
    ],
    prompt:
      "There are two things you haven't told the officer about: the message sent at 3:14 a.m., and the key that shouldn't still be in the drawer.",
    choices: ["Start with the message", "Start with the key"],
  },
}

function fallback(story: Story): Passage {
  return {
    chapter: "Chapter One",
    paragraphs: [
      story.hook,
      story.synopsis,
      "The choice ahead is small, the way the important ones usually are — a fork in an ordinary evening that will decide everything that comes after.",
    ],
    prompt: "The moment holds. It's yours to decide.",
    choices: ["Step forward", "Wait a little longer"],
  }
}

export function ReaderPreview({
  story,
  onClose,
}: {
  story: Story | null
  onClose: () => void
}) {
  const [chosen, setChosen] = useState<number | null>(null)

  useEffect(() => {
    setChosen(null)
  }, [story?.id])

  useEffect(() => {
    if (!story) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [story, onClose])

  if (!story) return null
  const p = passages[story.id] ?? fallback(story)

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-parchment text-parchment-foreground animate-fade-in">
      {/* minimal reading chrome */}
      <div className="sticky top-0 z-10 border-b border-black/10 bg-parchment/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
          <button
            onClick={onClose}
            aria-label="Close reader"
            className="grid h-9 w-9 place-items-center rounded-full text-parchment-foreground/70 transition-colors hover:bg-black/5 hover:text-parchment-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="flex-1 text-center font-serif text-sm tracking-tight text-parchment-foreground/80">
            {story.title}
          </span>
          <span className="w-9 text-right text-xs text-parchment-foreground/50">
            5%
          </span>
        </div>
        <div className="h-[2px] w-full bg-black/5">
          <div className="h-full w-[5%] bg-parchment-foreground/60" />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-5 pb-32 pt-8 sm:px-8">
        <figure className="overflow-hidden rounded-lg shadow-xl ring-1 ring-black/10">
          <div className="relative aspect-[16/9]">
            <Image
              src={story.landscape || "/placeholder.svg"}
              alt={`Illustration from ${story.title}`}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-sm bg-black/45 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
              {p.chapter}
            </span>
          </div>
        </figure>

        <div className="mt-10 font-serif text-[1.28rem] leading-[1.75] text-parchment-foreground/90 [text-wrap:pretty]">
          <p className="first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.2rem] first-letter:font-medium first-letter:leading-[0.72]">
            {p.paragraphs[0]}
          </p>
          {p.paragraphs.slice(1).map((para, i) => (
            <p key={i} className="mt-6">
              {para}
            </p>
          ))}
        </div>

        {/* a decision, arriving as part of the narrative */}
        <div className="mx-auto mt-14 max-w-xl">
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-black/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-parchment-foreground/45">
              A choice
            </span>
            <span className="h-px flex-1 bg-black/15" />
          </div>

          <p className="text-center font-serif text-lg italic leading-relaxed text-parchment-foreground/75">
            {p.prompt}
          </p>

          {chosen === null ? (
            <div className="mt-8 grid gap-3">
              {p.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setChosen(i)}
                  className="group flex items-center gap-4 rounded-md border border-black/10 bg-black/[0.015] px-5 py-4 text-left transition-all duration-300 hover:border-black/25 hover:bg-black/[0.04]"
                >
                  <span className="h-6 w-px bg-parchment-foreground/25 transition-colors group-hover:bg-parchment-foreground/60" />
                  <span className="font-serif text-lg text-parchment-foreground/90">
                    {c}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-md border border-black/10 bg-black/[0.02] p-6 text-center animate-fade-up">
              <p className="font-serif text-lg italic text-parchment-foreground/85">
                You chose to {p.choices[chosen!].toLowerCase()}.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-parchment-foreground/55">
                This is a preview of the reading experience. In the full story,
                the night continues from here — and remembers what you decided.
              </p>
              <button
                onClick={() => setChosen(null)}
                className="mt-4 text-sm font-medium text-parchment-foreground/70 underline decoration-black/20 underline-offset-4 transition-colors hover:text-parchment-foreground"
              >
                Try the other choice
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
