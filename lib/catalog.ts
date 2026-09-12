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
      "Tonight the whole valley lights its lanterns, and every dragon is expected to light one of their own. Every dragon but Pip. With the festival beginning and no flame in sight, Pip sets out to discover that some kinds of light take a little longer to arrive.",
    // Pip always uses its own painted cover for cards; the featured hero banner uses a
    // separate textless landscape so Pip's art is never stretched into the wide hero.
    landscape: "/characters/pip.png",
    portrait: "/characters/pip.png",
    heroImage: "/characters/hero.png",
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
    hook: "A family dog prepares to defend his home against his greatest enemy.",
    synopsis:
      "It hums. It roars. It comes for the crumbs Oliver has been saving. Today is the day Oliver stops running and makes his stand — one very brave, very small dog against the loudest monster in the house.",
    landscape: "/characters/oliver.png",
    portrait: "/characters/oliver.png",
    ages: "Ages 4+",
    targetAge: 5,
    band: "young",
    minutes: 8,
    genres: ["Comedy", "Family"],
    tags: ["funny", "family", "quick"],
    glow: "oklch(0.8 0.14 55)",
    tint: "oklch(0.34 0.06 40)",
  },
  {
    id: "maple",
    title: "Maple and the Backyard Night",
    kicker: "A Storylands Original",
    hook: "The backyard is twenty steps from home. At night, it feels much farther.",
    synopsis:
      "Maple was sure about the plan at bedtime: a tent, a torch, and a whole night of adventure just outside the back door. But the dark has a way of stretching twenty steps into twenty miles, and every ordinary sound suddenly needs looking into.",
    landscape: "/characters/maple.png",
    portrait: "/characters/maple.png",
    ages: "Ages 4+",
    targetAge: 6,
    band: "young",
    minutes: 9,
    genres: ["Adventure", "Comedy"],
    tags: ["adventure", "funny", "cozy"],
    glow: "oklch(0.78 0.1 230)",
    tint: "oklch(0.3 0.06 250)",
  },
  {
    id: "finn",
    title: "Finn and the Little Boat",
    kicker: "A Storylands Original — placeholder",
    hook: "Finn has a boat, a paddle, and one very big puddle to cross.",
    synopsis:
      "Placeholder story for Finn. A gentle first-adventure about trying something a little bigger than you feel ready for, and finding out you can. Rename and rewrite when the real Finn book is ready.",
    landscape: "/characters/finn.png",
    portrait: "/characters/finn.png",
    ages: "Ages 4+",
    targetAge: 5,
    band: "young",
    minutes: 8,
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
    kicker: "A Storylands Original — placeholder",
    hook: "Some days are loud and bright. Rusty is learning to be brave in them.",
    synopsis:
      "Placeholder story for Rusty. A warm story about big feelings on a busy day, and the little tricks that make them smaller. Rename and rewrite when the real Rusty book is ready.",
    landscape: "/characters/rusty.png",
    portrait: "/characters/rusty.png",
    ages: "Ages 4+",
    targetAge: 6,
    band: "young",
    minutes: 9,
    genres: ["Family", "Heart"],
    tags: ["family", "heart", "cozy"],
    glow: "oklch(0.8 0.1 55)",
    tint: "oklch(0.34 0.05 30)",
  },
  {
    id: "lumi",
    title: "Lumi Lights the Way",
    kicker: "A Storylands Original — placeholder",
    hook: "Pip's big sister knows every path home, even in the dark.",
    synopsis:
      "Placeholder story for Lumi. A companion tale to Pip, about looking after someone smaller than you and letting them be brave too. Rename and rewrite when the real Lumi book is ready.",
    landscape: "/characters/lumi.png",
    portrait: "/characters/lumi.png",
    ages: "Ages 4+",
    targetAge: 6,
    band: "young",
    minutes: 10,
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
