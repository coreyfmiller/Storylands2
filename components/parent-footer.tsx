import { Logo } from "@/components/logo"

export function ParentFooter() {
  return (
    <>
      {/* Editorial parchment moment — a quiet promise to parents */}
      <section className="mt-10 bg-parchment px-4 py-20 text-parchment-foreground sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-parchment-foreground/50">
            The Storylands promise
          </p>
          <h2 className="mt-4 max-w-2xl text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            Built for stories, not scrolling.
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-parchment-foreground/70">
            Every Storylands story has a beginning, a middle and an ending.
            Children finish something here — they don't fall into a feed that
            never lets them go.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-3">
            {promises.map((p) => (
              <div key={p.title} className="bg-parchment p-6">
                <h3 className="font-serif text-lg">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-parchment-foreground/65">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A premium destination for interactive illustrated fiction, for
              readers of every age.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3">
            {footerCols.map((col) => (
              <nav key={col.heading} className="flex flex-col gap-2">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/70">
                  {col.heading}
                </p>
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#top"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </a>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Storylands. A prototype for interactive
          illustrated fiction.
        </p>
      </footer>
    </>
  )
}

const promises = [
  {
    title: "No endless feeds",
    body: "Stories end on purpose. There is always a last page to arrive at.",
  },
  {
    title: "No ads, ever",
    body: "Nothing is sold inside a story. The reading is the whole experience.",
  },
  {
    title: "No hollow mechanics",
    body: "No streaks, coins or rewards engineered to keep a child coming back.",
  },
]

const footerCols = [
  { heading: "Discover", links: ["Stories", "Series", "New This Week", "Genres"] },
  { heading: "Ages", links: ["5–7", "8–10", "11–13", "14–16"] },
  { heading: "Storylands", links: ["For Families", "For Schools", "About", "Support"] },
]
