export type Band = "young" | "middle" | "older" | "teen"

export type Story = {
  id: string
  title: string
  kicker: string
  hook: string
  synopsis: string
  landscape: string
  portrait?: string
  /** Optional dedicated full-bleed hero banner art (textless, 16:9). Falls back to landscape. */
  heroImage?: string
  /**
   * Slug of a real, built linear reader at /read/<readerSlug>. When present, "Begin Story"
   * navigates to the actual 9:16 picture-book reader. When absent, the story is not yet
   * built and falls back to the sample preview. Storylands books are linear, not CYOA.
   */
  readerSlug?: string
  ages: string
  targetAge: number
  band: Band
  minutes: number
  genres: string[]
  tags: string[]
  seriesId?: string
  /** OKLCH color used for atmospheric hero/detail theming */
  glow: string
  tint: string
}

export type Series = {
  id: string
  name: string
  tagline: string
  image: string
  /** Derived from `stories`, never stated. See `series`. */
  count: number
  band: Band
  glow: string
}

export const stories: Story[] = [
  // ---------- YOUNGER · approx 5–7 ----------
  {
    id: "pip",
    title: "Pip and the First Flame",
    kicker: "A Storylands Original",
    hook: "A small dragon with a big heart, whose flame hasn't arrived yet.",
    synopsis:
      "It's the night of the Lantern Festival, when every dragon lights a lantern with their own fire. Every dragon but Pip, who can only make smoke. But when Pip finds someone small and frightened in the dark, he discovers that the warmest flames don't come from trying harder — they come from a big heart.",
    readerSlug: "pip-first-flame",
    landscape: "/characters/pip.webp",
    portrait: "/characters/pip.webp",
    ages: "Ages 4+",
    targetAge: 5,
    band: "young",
    minutes: 10,
    genres: ["Magic", "Family"],
    tags: ["magic", "family", "heart", "quick"],
    seriesId: "pip",
    glow: "oklch(0.82 0.13 68)",
    tint: "oklch(0.32 0.07 265)",
  },
  {
    id: "oliver",
    title: "Oliver vs. The Vacuum",
    kicker: "A Storylands Original",
    hook: "A brave little dog. One loud monster. And a home that must be defended.",
    synopsis:
      "The closet opens, and out comes the Monster: tall, loud, and dragging a long tail across the floor. Oliver has one job — keep everyone safe — and he is very good at it. But the Monster might not be what he thinks, and winning might mean something braver than barking.",
    landscape: "/characters/oliver.webp",
    portrait: "/characters/oliver.webp",
    readerSlug: "oliver-vacuum",
    ages: "Ages 4+",
    targetAge: 5,
    band: "young",
    minutes: 6,
    genres: ["Comedy", "Family"],
    tags: ["funny", "family", "quick"],
    glow: "oklch(0.8 0.14 55)",
    tint: "oklch(0.34 0.06 40)",
  },
  {
    id: "maple",
    title: "Maple and the Backyard Night",
    kicker: "A Storylands Original",
    hook: "Big ideas. A small tent. And a dark that feels much bigger after sunset.",
    synopsis:
      "Maple has planned the perfect solo campout — snacks, a flashlight, and a list of Brave Things To Do. But when the sun goes down, every ordinary sound turns into a monster, and Maple learns that being brave isn't about never being scared. It's about looking anyway.",
    landscape: "/characters/maple.webp",
    portrait: "/characters/maple.webp",
    readerSlug: "maple-backyard-night",
    ages: "Ages 4+",
    targetAge: 6,
    band: "young",
    minutes: 6,
    genres: ["Adventure", "Comedy"],
    tags: ["adventure", "funny", "cozy"],
    glow: "oklch(0.78 0.1 230)",
    tint: "oklch(0.3 0.06 250)",
  },
  {
    id: "finn",
    title: "Finn and the Big Lake",
    kicker: "A Storylands Original",
    hook: "One small duckling. One enormous lake. And a very big plan.",
    synopsis:
      "Finn wants to swim all the way across the lake in one big, brave splash, just like the big ducks. But up close the water looks enormous, and his brave splash gets stuck inside him. Then Finn discovers a secret: even the biggest lake is only ever one small splash at a time.",
    landscape: "/characters/finn.webp",
    portrait: "/characters/finn.webp",
    readerSlug: "finn-little-boat",
    ages: "Ages 4+",
    targetAge: 5,
    band: "young",
    minutes: 6,
    genres: ["Adventure", "Heart"],
    tags: ["adventure", "heart", "quick"],
    glow: "oklch(0.8 0.09 210)",
    tint: "oklch(0.3 0.06 240)",
  },
  {
    id: "nibs",
    title: "Nibs and the Absolutely Perfect Acorn",
    kicker: "A Storylands Original",
    hook: "Nibs found the perfect acorn. Keeping it safe is where the trouble starts.",
    synopsis:
      "Nibs is a squirrel with very high standards, and he has finally found the Absolutely Perfect Acorn. The only problem with a perfect thing is that now you can lose it — and Nibs is about to hide it so well that even he can't find it again.",
    landscape: "/characters/nibs.webp",
    portrait: "/characters/nibs.webp",
    readerSlug: "nibs-perfect-acorn",
    ages: "Ages 4+",
    targetAge: 5,
    band: "young",
    minutes: 6,
    genres: ["Comedy", "Heart"],
    tags: ["funny", "heart", "quick"],
    glow: "oklch(0.82 0.12 74)",
    tint: "oklch(0.34 0.05 70)",
  },
  {
    id: "rusty",
    title: "Rusty and the Loud Day",
    kicker: "A Storylands Original",
    hook: "The Autumn Fair is loud, bright, and a lot. Rusty's feelings get big.",
    synopsis:
      "Rusty has been looking forward to the Autumn Fair all week. But when the drums get louder and everything happens at once, his feelings grow too big for his fur. Hiding at the edge of the meadow, Rusty finds someone even smaller who feels the same — and discovers that being gentle is how big feelings get small again.",
    landscape: "/characters/rusty.webp",
    portrait: "/characters/rusty.webp",
    readerSlug: "rusty-loud-day",
    ages: "Ages 4+",
    targetAge: 6,
    band: "young",
    minutes: 6,
    genres: ["Family", "Heart"],
    tags: ["family", "heart", "cozy"],
    glow: "oklch(0.8 0.1 55)",
    tint: "oklch(0.34 0.05 30)",
  },
  {
    id: "lumi",
    title: "Lumi Lights the Way",
    kicker: "A Storylands Original",
    hook: "Lumi lights the way home for everyone. But who lights the way for Lumi?",
    synopsis:
      "Lumi the little owl has a bright star lantern and a very important job: lighting the way home. When she helps a lost firefly, she insists on doing everything herself — until her lantern flickers out in the dark. It's the firefly's own tiny glow that shows Lumi a little light goes a long way, especially when it's shared.",
    landscape: "/characters/lumi.webp",
    portrait: "/characters/lumi.webp",
    readerSlug: "lumi-lights-way",
    ages: "Ages 4+",
    targetAge: 6,
    band: "young",
    minutes: 6,
    genres: ["Magic", "Family"],
    tags: ["magic", "family", "heart"],
    seriesId: "pip",
    glow: "oklch(0.82 0.13 68)",
    tint: "oklch(0.32 0.07 265)",
  },

]

export type Shelf = {
  title: string
  layout: "landscape" | "portrait"
  stories: Story[]
  /** Covers already have the title painted into the art (ages 4–7); hide the text label. */
  paintedCovers?: boolean
}

/**
 * The series a reader can actually follow.
 *
 * `count` is COUNTED, not written down. The hand-written numbers claimed
 * Juniper had 3 books, Grey Point 5 and Black River 3; each had exactly one
 * story in the catalog and none of the three had a book anybody could open. A
 * series with fewer than two readable books is not a series, so it is left out
 * rather than shown as a shelf of one.
 */
const seriesDefs: Omit<Series, "count">[] = [
  {
    id: "pip",
    name: "Pip",
    tagline: "The little dragon with a late-arriving flame.",
    image: "/characters/pip.webp",
    band: "young",
    glow: "oklch(0.82 0.13 68)",
  },
]

export const series: Series[] = seriesDefs
  .map((s) => ({ ...s, count: stories.filter((x) => x.seriesId === s.id && x.readerSlug).length }))
  .filter((s) => s.count >= 2)

export function storyById(id: string) {
  return stories.find((s) => s.id === id)
}

/**
 * Map a full-size art path to its lightweight thumbnail variant.
 *
 * Both art directories have a `thumb/` beside them, written by
 * scripts/optimize-art.mjs. `/characters/` was missing here, which is why the
 * 32px avatar in the nav was downloading the full-size cover.
 */
export function thumbOf(src: string) {
  return src.replace("/art/", "/art/thumb/").replace("/characters/", "/characters/thumb/")
}

export function seriesForBands(bands: Band[]) {
  return series.filter((s) => bands.includes(s.band))
}

/** The story whose reader lives at /read/<slug>, if one does. */
export function storyByReaderSlug(slug: string) {
  return stories.find((s) => s.readerSlug === slug)
}

type ShelfDef = {
  title: string
  layout?: "landscape" | "portrait"
  filter: (s: Story) => boolean
  sort?: (a: Story, b: Story) => number
  min?: number
  max?: number
}

const shelfDefs: ShelfDef[] = [
  {
    title: "Trending in Storylands",
    filter: () => true,
    max: 8,
  },
  {
    title: "New This Week",
    layout: "portrait",
    filter: (s) => !!s.portrait,
    min: 2,
  },
  {
    title: "Because You Read The Last Firefly",
    filter: (s) => s.tags.includes("adventure") || s.tags.includes("heart"),
    min: 3,
  },
  {
    title: "Mysteries Worth Solving",
    filter: (s) => s.tags.includes("mystery"),
    min: 3,
  },
  {
    title: "Laugh Out Loud",
    filter: (s) => s.tags.includes("funny"),
    min: 2,
  },
  {
    title: "Worlds of Magic",
    filter: (s) => s.tags.includes("magic"),
    min: 2,
  },
  {
    title: "Strange Things Are Happening",
    filter: (s) => s.tags.includes("strange"),
    min: 3,
  },
  {
    title: "Big Adventures",
    filter: (s) => s.tags.includes("adventure"),
    min: 3,
  },
  {
    title: "Stories for a Rainy Night",
    filter: (s) => s.tags.includes("rainy"),
    min: 3,
  },
  {
    title: "15 Minutes or Less",
    filter: (s) => s.minutes <= 15,
    sort: (a, b) => a.minutes - b.minutes,
    min: 3,
  },
]

// Below this many titles in a profile's band(s), the Netflix-style recommendation rows are
// pure redundancy — every row surfaces nearly the same handful of books under a different
// heading. Until the catalog is large enough for rows to be genuinely distinct, we show a
// single big cover grid instead. The full shelf engine stays wired and turns on automatically
// once a band crosses this threshold.
export const RICH_SHELVES_THRESHOLD = 20

export function poolForBands(bands: Band[]): Story[] {
  return stories.filter((s) => bands.includes(s.band))
}

export function shouldUseRichShelves(bands: Band[]): boolean {
  return poolForBands(bands).length >= RICH_SHELVES_THRESHOLD
}

/**
 * The books this reader can open, readable ones first.
 *
 * Everything in the catalog is readable now — the twelve entries that only had a
 * cover moved to docs/STUDIO_SLATE.md, because twelve of nineteen titles opening
 * an apology is a facade, not a library. The split is kept because the engine
 * will add books faster than the art can be generated, and a half-finished book
 * should sort last rather than disappear.
 */
export function libraryForBands(bands: Band[]): Story[] {
  const pool = poolForBands(bands)
  const readable = pool.filter((s) => s.readerSlug)
  const comingSoon = pool.filter((s) => !s.readerSlug)
  return [...readable, ...comingSoon]
}

/** Hero rotation candidates: books that can actually be opened. */
export function heroRotationForBands(bands: Band[]): Story[] {
  const pool = poolForBands(bands)
  const readable = pool.filter((s) => s.readerSlug)
  return readable.length > 0 ? readable : pool
}

/**
 * @param recent The last book actually opened on this device, if any. It only
 *   titles the "Because You Read" shelf — with nothing read, that shelf is
 *   dropped rather than naming a book the reader has never seen.
 */
export function shelvesForBands(bands: Band[], recent?: Story): Shelf[] {
  const pool = poolForBands(bands)
  const shelves: Shelf[] = []
  // Ages 4–7 read as a picture-book shelf: show the tall 9:16 character covers as
  // portrait "book covers" rather than letterboxed landscape thumbnails.
  const youngOnly = bands.length === 1 && bands[0] === "young"
  const defaultLayout: "landscape" | "portrait" = youngOnly ? "portrait" : "landscape"

  for (const def of shelfDefs) {
    let title = def.title
    if (title.startsWith("Because You Read")) {
      if (!recent) continue
      title = `Because You Read ${recent.title}`
    }

    let items = pool.filter(def.filter)
    if (def.sort) items = [...items].sort(def.sort)
    if (def.max) items = items.slice(0, def.max)

    const min = def.min ?? 4
    if (items.length < min) continue

    shelves.push({ title, layout: def.layout ?? defaultLayout, stories: items, paintedCovers: youngOnly })
  }

  if (pool.length >= 4) {
    shelves.splice(2, 0, {
      title: "Popular With Readers Your Age",
      layout: defaultLayout,
      stories: pool,
      paintedCovers: youngOnly,
    })
  }

  return shelves
}

/**
 * Mood chips in the search overlay.
 *
 * Only moods that match something. The list used to offer Mystery, Suspense,
 * "Under 30 min" and two more that returned nothing at all for a four-year-old,
 * which is a filter that tells a child their search broke.
 */
export const moodFilters = (
  [
    "Funny",
    "Magic",
    "Adventure",
    "Friendship",
    "Heart",
    "Cozy",
    "Family",
    "Under 15 min",
  ] as const
).filter((mood) => {
  if (mood === "Under 15 min") return stories.some((s) => s.minutes <= 15)
  const needle = mood.toLowerCase()
  return stories.some(
    (s) => s.tags.includes(needle) || s.genres.some((g) => g.toLowerCase() === needle),
  )
})
