import { Logo } from "@/components/logo"
import { publishedAges } from "@/lib/readers"

export function ParentFooter() {
  const published = publishedAges()
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
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Original illustrated picture books for ages {published.min} to {published.max},
              read a page at a time.
            </p>
          </div>
          {/* There were eleven links here across three columns — Discover, Ages,
              Storylands — and every one of them pointed at #top. Eleven controls
              that looked like a site map for a site with one page. */}
          <div className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            <p>
              Everything is stored on this device. No account, no sign-in, and nothing about
              your child is sent anywhere.
            </p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Storylands.
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


