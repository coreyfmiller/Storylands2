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
  count: number
  band: Band
  glow: string
}

export type Profile = {
  id: string
  name: string
  age: number
  bands: Band[]
  heroId: string
  avatar: string
  color: string
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
    landscape: "/characters/pip.png",
    portrait: "/characters/pip.png",
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
    landscape: "/characters/oliver.png",
    portrait: "/characters/oliver.png",
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
    landscape: "/characters/maple.png",
    portrait: "/characters/maple.png",
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
    landscape: "/characters/finn.png",
    portrait: "/characters/finn.png",
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
    landscape: "/characters/nibs.png",
    portrait: "/characters/nibs.png",
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
    landscape: "/characters/rusty.png",
    portrait: "/characters/rusty.png",
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
    landscape: "/characters/lumi.png",
    portrait: "/characters/lumi.png",
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

  // ---------- MIDDLE · approx 8–10 ----------
  {
    id: "firefly",
    title: "The Last Firefly",
    kicker: "A Storylands Original",
    hook: "Summer ends tomorrow. Tonight there is still time for one small adventure.",
    synopsis:
      "On the final night of summer, Emi finds a single firefly glowing brighter than all the rest — and clearly lost. Helping it home means crossing the whole field in the dark, and the field is far bigger after sunset than it ever is by day.",
    landscape: "/art/firefly-hero.webp",
    ages: "Ages 9+",
    targetAge: 10,
    band: "middle",
    minutes: 15,
    genres: ["Adventure", "Heart"],
    tags: ["adventure", "heart", "quick", "magic"],
    glow: "oklch(0.82 0.13 72)",
    tint: "oklch(0.3 0.08 255)",
  },
  {
    id: "juniper",
    title: "Juniper's Moonlight Delivery",
    kicker: "A Storylands Original",
    hook: "One parcel. One moonlit forest. Several shortcuts that probably aren't shortcuts.",
    synopsis:
      "Juniper has one job tonight: deliver a small glowing parcel to the far side of the woods before the moon sets. The main path is long. The shortcuts are tempting. And the forest, it turns out, has opinions about which way she should go.",
    landscape: "/art/juniper.webp",
    ages: "Ages 8+",
    targetAge: 9,
    band: "middle",
    minutes: 18,
    genres: ["Adventure", "Friendship"],
    tags: ["adventure", "friendship", "magic", "rainy"],
    seriesId: "juniper",
    glow: "oklch(0.8 0.09 210)",
    tint: "oklch(0.3 0.06 250)",
  },
  {
    id: "shed",
    title: "The Thing Under the Shed",
    kicker: "A Storylands Original",
    hook: "Something keeps stealing Nora's strawberries. Tonight she's waiting.",
    synopsis:
      "Every morning another strawberry is gone. Nora has a flashlight, a blanket, and a plan to stay awake all night until she catches the thief. What she finds under the shed is stranger — and gentler — than she expected.",
    landscape: "/art/shed.webp",
    ages: "Ages 8+",
    targetAge: 9,
    band: "middle",
    minutes: 15,
    genres: ["Mystery", "Discovery"],
    tags: ["mystery", "rainy", "strange"],
    glow: "oklch(0.78 0.09 155)",
    tint: "oklch(0.28 0.05 180)",
  },
  {
    id: "maple-camp",
    title: "Maple's Very Bad Camping Idea",
    kicker: "A Storylands Original",
    hook: "The backyard is twenty steps from home. At night, it feels considerably farther.",
    synopsis:
      "Maple was sure about the plan at noon. A tent, a torch, a whole night of adventure in the backyard. But the dark has a way of stretching twenty steps into twenty miles, and every ordinary sound now needs investigating.",
    landscape: "/art/maple.webp",
    ages: "Ages 8+",
    targetAge: 9,
    band: "middle",
    minutes: 15,
    genres: ["Adventure", "Comedy"],
    tags: ["adventure", "funny", "rainy"],
    glow: "oklch(0.78 0.1 230)",
    tint: "oklch(0.27 0.06 250)",
  },

  // ---------- OLDER MIDDLE-GRADE · approx 11–13 ----------
  {
    id: "lighthouse",
    title: "The Lighthouse at Grey Point",
    kicker: "A Storylands Original",
    hook: "Three friends discover a light flashing from a lighthouse abandoned for thirty years.",
    synopsis:
      "Grey Point lighthouse has been dark since before any of them were born. So when the beam sweeps the cliffs one stormy evening, Sam, Priya and Theo have a choice: pretend they never saw it, or find out who — or what — turned it back on.",
    landscape: "/art/lighthouse.webp",
    portrait: "/art/portrait-lighthouse.webp",
    ages: "Ages 11+",
    targetAge: 12,
    band: "older",
    minutes: 30,
    genres: ["Mystery", "Adventure"],
    tags: ["mystery", "adventure", "rainy", "strange"],
    seriesId: "greypoint",
    glow: "oklch(0.75 0.08 220)",
    tint: "oklch(0.26 0.05 230)",
  },
  {
    id: "map",
    title: "The Map That Wasn't There Yesterday",
    kicker: "A Storylands Original",
    hook: "A hand-drawn map appears inside Leo's locker. It shows a place underneath the school.",
    synopsis:
      "No one admits to leaving it. The paper is old, the ink is fresh, and the map is unmistakably of the school — plus three floors that shouldn't exist. Leo has until the last bell to decide whether some doors are better left unopened.",
    landscape: "/art/map.webp",
    ages: "Ages 11+",
    targetAge: 12,
    band: "older",
    minutes: 25,
    genres: ["Mystery", "Adventure"],
    tags: ["mystery", "adventure", "strange"],
    glow: "oklch(0.78 0.11 60)",
    tint: "oklch(0.27 0.05 200)",
  },
  {
    id: "seven",
    title: "Seven Minutes Missing",
    kicker: "A Storylands Original",
    hook: "Every clock in town skipped exactly seven minutes. Maya seems to be the only one who noticed.",
    synopsis:
      "At 8:14 the whole town blinked forward to 8:21. No one remembers the gap. No one but Maya, who counted every second of it. Now she has to work out where seven minutes go when an entire town agrees to forget them.",
    landscape: "/art/seven-minutes.webp",
    ages: "Ages 11+",
    targetAge: 12,
    band: "older",
    minutes: 30,
    genres: ["Mystery", "Sci-Fi"],
    tags: ["mystery", "strange", "suspense"],
    glow: "oklch(0.75 0.08 300)",
    tint: "oklch(0.26 0.05 290)",
  },
  {
    id: "bellweather",
    title: "The Last Train to Bellweather",
    kicker: "A Storylands Original",
    hook: "The train shouldn't stop here. Tonight it did.",
    synopsis:
      "Bellweather station closed decades ago, but the 11:50 has just pulled in, doors open, lamps warm against the fog. It is waiting. The only question left is whether to step aboard and find out where a train goes when it stops somewhere it shouldn't.",
    landscape: "/art/bellweather.webp",
    ages: "Ages 12+",
    targetAge: 12,
    band: "older",
    minutes: 35,
    genres: ["Adventure", "Mystery"],
    tags: ["adventure", "mystery", "rainy", "strange"],
    glow: "oklch(0.8 0.11 70)",
    tint: "oklch(0.25 0.05 250)",
  },

  // ---------- TEEN · approx 14–16 ----------
  {
    id: "vanished",
    title: "Vanished",
    kicker: "A Storylands Original",
    hook: "The police think they left. You don't.",
    synopsis:
      "Yesterday they were here. Today their phone is off and their side of the room is cold. Everyone has decided this is simple. You are the only one still asking the questions that don't have simple answers.",
    landscape: "/art/vanished.webp",
    ages: "Ages 14+",
    targetAge: 15,
    band: "teen",
    minutes: 45,
    genres: ["Mystery", "Thriller"],
    tags: ["mystery", "suspense"],
    glow: "oklch(0.72 0.05 250)",
    tint: "oklch(0.24 0.03 250)",
  },
  {
    id: "blackriver",
    title: "Black River",
    kicker: "A Storylands Original",
    hook: "Something happened near Black River. Everyone remembers it differently.",
    synopsis:
      "The town agrees on the date and nothing else. Six people, six versions, one stretch of dark water that keeps its own counsel. The truth is somewhere between the stories — if you can stand to line them up beside each other.",
    landscape: "/art/black-river.webp",
    ages: "Ages 14+",
    targetAge: 15,
    band: "teen",
    minutes: 45,
    genres: ["Mystery", "Suspense"],
    tags: ["mystery", "suspense", "rainy"],
    seriesId: "blackriver",
    glow: "oklch(0.7 0.06 160)",
    tint: "oklch(0.23 0.04 175)",
  },
  {
    id: "signal",
    title: "Signal Lost",
    kicker: "A Storylands Original",
    hook: "Only four appear in the photograph taken that night.",
    synopsis:
      "Five friends hiked past the last cell tower for the quiet. They got it. The photo from the ridge shows the sunset, the treeline, and four of them — and no one can explain the empty space where the fifth was standing.",
    landscape: "/art/signal-lost.webp",
    portrait: "/art/portrait-signal.webp",
    ages: "Ages 14+",
    targetAge: 15,
    band: "teen",
    minutes: 40,
    genres: ["Mystery", "Adventure"],
    tags: ["adventure", "suspense", "mystery"],
    glow: "oklch(0.76 0.1 55)",
    tint: "oklch(0.24 0.04 250)",
  },
  {
    id: "room217",
    title: "Room 217",
    kicker: "A Storylands Original",
    hook: "The hotel says the room doesn't exist. Your key says otherwise.",
    synopsis:
      "The front desk is polite and completely certain: there is no 217. The corridor disagrees. So does the brass key warming in your hand. Between the second and third floor there is a door, and behind it a night that never quite ends.",
    landscape: "/art/room-217.webp",
    ages: "Ages 13+",
    targetAge: 15,
    band: "teen",
    minutes: 35,
    genres: ["Mystery", "Suspense"],
    tags: ["mystery", "suspense", "strange"],
    glow: "oklch(0.72 0.09 40)",
    tint: "oklch(0.23 0.04 30)",
  },
]

export const series: Series[] = [
  {
    id: "pip",
    name: "Pip",
    tagline: "The little dragon with a late-arriving flame.",
    image: "/characters/pip.png",
    count: 2,
    band: "young",
    glow: "oklch(0.82 0.13 68)",
  },
  {
    id: "juniper",
    name: "Juniper",
    tagline: "Moonlit errands in a forest with a mind of its own.",
    image: "/art/juniper.webp",
    count: 3,
    band: "middle",
    glow: "oklch(0.8 0.09 210)",
  },
  {
    id: "greypoint",
    name: "Grey Point Mysteries",
    tagline: "Three friends. One coast. A great many things that won't stay explained.",
    image: "/art/lighthouse.webp",
    count: 5,
    band: "older",
    glow: "oklch(0.75 0.08 220)",
  },
  {
    id: "blackriver",
    name: "Black River",
    tagline: "A town, a river, and the versions of the truth it keeps.",
    image: "/art/black-river.webp",
    count: 3,
    band: "teen",
    glow: "oklch(0.7 0.06 160)",
  },
]

export const profiles: Profile[] = [
  {
    id: "avery",
    name: "Avery",
    age: 6,
    bands: ["young"],
    heroId: "pip",
    avatar: "/characters/pip.png",
    color: "oklch(0.82 0.13 68)",
  },
  {
    id: "maya",
    name: "Maya",
    age: 10,
    bands: ["young", "middle"],
    heroId: "firefly",
    avatar: "/art/firefly-hero.webp",
    color: "oklch(0.8 0.12 72)",
  },
  {
    id: "leo",
    name: "Leo",
    age: 13,
    bands: ["middle", "older"],
    heroId: "lighthouse",
    avatar: "/art/lighthouse.webp",
    color: "oklch(0.75 0.08 220)",
  },
  {
    id: "alex",
    name: "Alex",
    age: 16,
    bands: ["older", "teen"],
    heroId: "vanished",
    avatar: "/art/vanished.webp",
    color: "oklch(0.72 0.05 250)",
  },
]

export type Shelf = {
  title: string
  layout: "landscape" | "portrait"
  stories: Story[]
  /** Covers already have the title painted into the art (ages 4–7); hide the text label. */
  paintedCovers?: boolean
}

const byId = (id: string) => stories.find((s) => s.id === id)!

export function storyById(id: string) {
  return byId(id)
}

/** Map a full-size art path to its lightweight thumbnail variant. */
export function thumbOf(src: string) {
  return src.replace("/art/", "/art/thumb/")
}

export function seriesForProfile(p: Profile) {
  return series.filter((s) => p.bands.includes(s.band))
}

type ContinueItem = { story: Story; label: string; progress: number }

const continueMap: Record<string, ContinueItem[]> = {
  avery: [
    { story: byId("pip"), label: "Chapter 2", progress: 0.45 },
    { story: byId("finn"), label: "6 min left", progress: 0.7 },
    { story: byId("oliver"), label: "Just started", progress: 0.12 },
  ],
  maya: [
    { story: byId("firefly"), label: "8 min left", progress: 0.62 },
    { story: byId("shed"), label: "Chapter 3", progress: 0.4 },
    { story: byId("juniper"), label: "18 min left", progress: 0.25 },
  ],
  leo: [
    { story: byId("lighthouse"), label: "Chapter 4", progress: 0.55 },
    { story: byId("bellweather"), label: "22 min left", progress: 0.3 },
    { story: byId("map"), label: "Just started", progress: 0.1 },
  ],
  alex: [
    { story: byId("vanished"), label: "Chapter 6", progress: 0.68 },
    { story: byId("blackriver"), label: "30 min left", progress: 0.35 },
    { story: byId("signal"), label: "Chapter 2", progress: 0.2 },
  ],
}

export function continueForProfile(p: Profile) {
  return continueMap[p.id] ?? []
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

export function poolForProfile(p: Profile): Story[] {
  return stories.filter((s) => p.bands.includes(s.band))
}

export function shouldUseRichShelves(p: Profile): boolean {
  return poolForProfile(p).length >= RICH_SHELVES_THRESHOLD
}

// The books a profile can actually read right now (built = has a reader route), for the hero
// rotation and the library grid ordering (built first, then coming-soon).
export function libraryForProfile(p: Profile): Story[] {
  const pool = poolForProfile(p)
  const built = pool.filter((s) => s.readerSlug)
  const comingSoon = pool.filter((s) => !s.readerSlug)
  return [...built, ...comingSoon]
}

// Hero rotation candidates: built books in the band (fall back to whole pool if none built).
export function heroRotationForProfile(p: Profile): Story[] {
  const pool = poolForProfile(p)
  const built = pool.filter((s) => s.readerSlug)
  return built.length > 0 ? built : pool
}

export function shelvesForProfile(p: Profile): Shelf[] {
  const pool = stories.filter((s) => p.bands.includes(s.band))
  const shelves: Shelf[] = []
  const heroId = p.heroId
  // Ages 4–7 read as a picture-book shelf: show the tall 9:16 character covers as
  // portrait "book covers" rather than letterboxed landscape thumbnails.
  const youngOnly = p.bands.length === 1 && p.bands[0] === "young"
  const defaultLayout: "landscape" | "portrait" = youngOnly ? "portrait" : "landscape"

  for (const def of shelfDefs) {
    // Tailor the firefly-affinity shelf label to the active profile
    let title = def.title
    if (title.startsWith("Because You Read")) {
      const seed = continueMap[p.id]?.[0]?.story
      if (seed) title = `Because You Read ${seed.title}`
    }

    let items = pool.filter(def.filter)
    if (def.sort) items = [...items].sort(def.sort)
    if (def.max) items = items.slice(0, def.max)

    const min = def.min ?? 4
    if (items.length < min) continue

    shelves.push({ title, layout: def.layout ?? defaultLayout, stories: items, paintedCovers: youngOnly })
  }

  // Always surface a "Popular With Readers Your Age" shelf tuned to the band
  const ageShelf = pool.filter((s) => s.id !== heroId)
  if (ageShelf.length >= 4) {
    shelves.splice(2, 0, {
      title: "Popular With Readers Your Age",
      layout: defaultLayout,
      stories: ageShelf,
      paintedCovers: youngOnly,
    })
  }

  return shelves
}

export const moodFilters = [
  "Funny",
  "Mystery",
  "Magic",
  "Adventure",
  "Friendship",
  "Suspense",
  "Under 15 min",
  "Under 30 min",
] as const
