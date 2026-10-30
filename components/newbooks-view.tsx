"use client"

import Image from "next/image"
import Link from "next/link"
import { newShelf, mainShelf, thumbOf } from "@/lib/catalog"
import { Logo } from "@/components/logo"

// The staging shelf. Deliberately plain and honest: what is here, what bar it
// was held to, and what is still missing.

const BAR = [
  {
    rule: "Nothing states the moral",
    why: "Five of the seven original books end by explaining themselves. The two that don't are the two best.",
  },
  {
    rule: "A named second character who speaks, and arrives",
    why: "In five originals the companion is an unnamed glow-moth or dragonfly. No cast means no series.",
  },
  {
    rule: "Dialogue on at least three pages",
    why: "Spoken lines are what a parent performs out loud.",
  },
  {
    rule: "A reversal, not just a realisation",
    why: "Oliver works because the monster turns out to be useful. Nothing else has a surprise.",
  },
  {
    rule: "Varied framing, declared per page",
    why: "Left alone, the illustrator draws a centred mid-shot thirteen times.",
  },
  {
    rule: "Page lengths within 12 words of each other",
    why: "The longest page sets the type size for the whole book. Nibs reads at 24px where it could read at 34.",
  },
]

export function NewBooksView() {
  const shelf = newShelf()
  const readable = shelf.filter((s) => s.readerSlug)

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Logo />

        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          Staging shelf
        </p>
        <h1 className="mt-3 font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl">
          The second generation
        </h1>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          New books land here first, held to a stricter bar than the original seven. Nothing
          on this page is on the main shelf, and the library at{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-foreground">
            /
          </Link>{" "}
          does not link here.
        </p>

        {/* ---- the shelf ---- */}
        <section className="mt-12">
          <h2 className="font-serif text-xl text-foreground">
            {shelf.length === 0 ? "Nothing here yet" : `${shelf.length} book${shelf.length === 1 ? "" : "s"}`}
          </h2>

          {shelf.length === 0 ? (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              An empty shelf is the correct state before the first book clears the bar. It is
              not a loading failure.
            </p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {shelf.map((s) => {
                const openable = !!s.readerSlug
                const card = (
                  <>
                    <div className="relative aspect-[9/16] overflow-hidden rounded-lg ring-1 ring-border transition-all group-hover:ring-primary/60">
                      <Image
                        src={thumbOf(s.portrait || s.landscape)}
                        alt={s.title}
                        fill
                        sizes="(min-width: 640px) 220px, 45vw"
                        className="object-cover"
                      />
                      {!openable && (
                        <div className="absolute inset-0 grid place-items-center bg-black/65">
                          <span className="text-[11px] uppercase tracking-[0.18em] text-white/80">
                            no art yet
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 font-serif text-sm leading-tight text-foreground">
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.minutes} min</p>
                  </>
                )
                return openable ? (
                  <Link key={s.id} href={`/read/${s.readerSlug}`} className="group block">
                    {card}
                  </Link>
                ) : (
                  <div key={s.id} className="opacity-70">
                    {card}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ---- the bar ---- */}
        <section className="mt-14">
          <h2 className="font-serif text-xl text-foreground">The bar</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Enforced in <code className="text-foreground/80">scripts/lib/validate-book.mjs</code>.
            All seven original books fail it, on five to seven counts each.
          </p>
          <dl className="mt-5 flex flex-col gap-4">
            {BAR.map((b) => (
              <div key={b.rule} className="border-l-2 border-primary/40 pl-4">
                <dt className="text-sm font-semibold text-foreground">{b.rule}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.why}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>
            Main shelf: {mainShelf().length} books.{" "}
            {readable.length > 0
              ? `${readable.length} here can be read.`
              : "Nothing here can be read yet."}
          </p>
        </footer>
      </div>
    </main>
  )
}
