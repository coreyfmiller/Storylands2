// STORYLANDS — Book #7: "Lumi Lights the Way"
// A companion to "Pip and the First Flame" — same warm lantern-lit valley world.
// Each page carries BOTH the prose (what the reader reads) and the illustration manifest.
//
// Story spine (see book-production steering): want (Lumi is the one who lights the way home;
// she loves being the reliable big light everyone depends on) -> flaw (she over-does it — she
// carries ALL the light and does everything FOR a smaller creature, never letting it try,
// sure that "little ones can't, only I can") -> escalating over-helping (she shoos the little
// firefly's own small light away, insists on leading every step) -> the turn/low point: far
// from home in the dark, Lumi's star-lantern flickers low and goes dim; now SHE is stuck and
// scared and cannot fix it alone -> she solves it HERSELF by realizing the little firefly has
// its own light, and letting it help; two small shared lights are enough to find the way ->
// quiet change: she shares the leading instead of hoarding it -> happy ending: they reach
// home guided by BOTH their lights, the little one proud, Lumi proud of it; a little light
// goes a long way, especially when it is shared.
//
// Voice: warm, gentle, luminous; Lumi is caring and a touch bossy in her helpfulness; the
// lesson (letting someone be brave is its own kind of light) is SHOWN. Textless 9:16 art.

export type IllustrationManifest = {
  charactersPresent: string[]
  location: string
  timeOfDay: string
  action: string
  emotionalBeat: string
  requiredVisualFacts: string[]
  forbiddenVisualFacts: string[]
  composition: string
}

export type BookPage = {
  page: number
  text: string
  art: string
  manifest: IllustrationManifest
}

export type Book = {
  id: string
  title: string
  subtitle: string
  character: string
  ages: string
  minutes: number
  pages: BookPage[]
}

export const CHARACTER_REFS: Record<string, string> = {
  lumi: 'characters/lumi.png',
}

const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
  'frightening or scary imagery, nothing threatening, the dark is cozy not scary',
  'Lumi as a human; human characters',
  'a different bird; Lumi losing her white speckled feathers, amber eyes, or her star-shaped lantern',
]

const rawBook: Book = {
  id: 'lumi-lights-way',
  title: 'Lumi Lights the Way',
  subtitle: 'A little light goes a long way.',
  character: 'lumi',
  ages: 'Ages 4+',
  minutes: 6,
  pages: [
    {
      page: 1,
      text: `Lumi was a little owl with a bright star lantern and a very important job.\n\nWhen the sun went down over the valley, it was Lumi who lit the way home.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'a warm twilight forest above a valley with a distant lantern-lit village and a river, sunset purples and oranges',
        timeOfDay: 'dusk, soft sunset',
        action: 'Lumi the small snowy owl perches proudly on a branch holding her glowing star-shaped lantern, lighting the path below, looking capable and pleased',
        emotionalBeat: 'proud purpose; she is the dependable light',
        requiredVisualFacts: ['Lumi the small white speckled owl with big amber eyes', 'her glowing star-shaped lantern', 'a warm twilight valley with a distant lantern-lit village'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'Lumi on a branch with her star lantern casting warm light, valley glowing below, dusk sky, headroom',
      },
    },
    {
      page: 2,
      text: `One evening, a tiny firefly fluttered up to her, lost and far from home.\n\n"Don't worry," said Lumi. "I'll light the way. Just stay close and let me do everything."`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the twilight forest branch',
        timeOfDay: 'dusk',
        action: 'A tiny firefly with a small soft glow flutters up to Lumi, who leans in kindly and reassuringly with her bright star lantern raised, taking charge',
        emotionalBeat: 'warm helpfulness, tipping into taking over',
        requiredVisualFacts: ['a tiny firefly with a small gentle glow', 'Lumi leaning in kindly with her bright star lantern raised', 'warm dusk forest'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'Lumi and the tiny glowing firefly close together, her lantern bright, soft twilight',
      },
    },
    {
      page: 3,
      text: `So off they went, Lumi lighting every step.\n\nThe little firefly tried to help with its own small glow — but Lumi said, "Oh, you're too little for that. Leave the light to me."`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'a winding forest path in the twilight',
        timeOfDay: 'evening, deepening blue',
        action: 'Lumi leads confidently down a forest path holding her big bright star lantern, while the tiny firefly behind her dims its own little glow, gently waved off',
        emotionalBeat: 'over-helping; unintentionally keeping the little one small',
        requiredVisualFacts: ['Lumi leading with her bright star lantern', 'the tiny firefly behind her with its glow dimmed/held back', 'a winding twilight forest path'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'Lumi ahead and bright, the little firefly small and dim behind; gentle blue evening',
      },
    },
    {
      page: 4,
      text: `Lumi carried the lantern over the log. Lumi lit the way past the ferns.\n\n"See?" she said. "It's easy, when you let me do it all."`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the forest path, crossing a mossy log',
        timeOfDay: 'evening',
        action: 'Lumi busily lights the way over a mossy log with her star lantern, doing everything herself, the little firefly just following along doing nothing',
        emotionalBeat: 'busy self-importance; doing it all',
        requiredVisualFacts: ['Lumi actively lighting the way over a mossy log with her lantern', 'the tiny firefly following passively', 'twilight forest detail'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'Lumi central and busy with her light, firefly small alongside, cozy evening',
      },
    },
    {
      page: 5,
      text: `But the night grew deeper, and the path grew longer.\n\nAnd Lumi's star lantern, which had been glowing all evening, began to flicker.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'deeper in the dark twilight forest',
        timeOfDay: 'night, deep blue',
        action: 'Lumi pauses on the path as her star lantern flickers and dims, its light wavering, a flicker of worry crossing her face',
        emotionalBeat: 'the first wobble; her reliable light is failing',
        requiredVisualFacts: ['Lumis star lantern flickering and dimming', 'a flicker of worry on Lumis face', 'the deep-blue night forest around her'],
        forbiddenVisualFacts: [...forbiddenAlways, 'total scary darkness (keep it soft, deep-blue, cozy)'],
        composition: 'Lumi and her failing lantern the focus, soft dark forest around, gentle not scary',
      },
    },
    {
      page: 6,
      text: `Then, with a tiny hiss, the star lantern went out.\n\nThe forest went dark and quiet. And for the first time, it was Lumi who felt small and afraid.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the dark forest path, lantern out',
        timeOfDay: 'night, soft moonlit dark',
        action: 'Lumi sits with her now-dark star lantern, feathers drawn in, looking small and uncertain in the soft moonlit dark, the confident helper suddenly unsure',
        emotionalBeat: 'the low point: the light-giver is now the one in the dark',
        requiredVisualFacts: ['Lumis star lantern now dark and unlit', 'Lumi looking small, uncertain, feathers drawn in', 'soft moonlit darkness, gentle not frightening'],
        forbiddenVisualFacts: [...forbiddenAlways, 'harsh or scary darkness'],
        composition: 'small Lumi with her dark lantern in soft moonlit dark, tender and quiet, headroom',
      },
    },
    {
      page: 7,
      text: `But then — a small, soft glow lit up beside her.\n\nIt was the little firefly. Its own light was tiny, but in the dark, it was just enough to see by.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the dark forest path, Lumis star lantern completely dark and unlit',
        timeOfDay: 'night, only the fireflys tiny glow for light',
        action: 'In the dark, the tiny firefly is the ONLY source of light, glowing warmly beside Lumi and lighting a small circle around them; Lumi holds her dark, unlit star lantern and gazes at the fireflys glow with surprise and dawning hope',
        emotionalBeat: 'the turn: Lumis light is out, and the little one has a light of its own',
        requiredVisualFacts: ['the tiny firefly is the single source of light, glowing warmly in the dark', 'Lumis star lantern held but DARK and unlit (no glow from the lantern at all)', 'a small circle of warm firefly-light in the surrounding dark', 'Lumis surprised, hopeful face lit only by the firefly'],
        forbiddenVisualFacts: [...forbiddenAlways, 'the star lantern glowing or lit', 'any light source other than the firefly (besides soft moonlight)'],
        composition: 'the firefly is the one small warm light; Lumis unlit dark lantern clearly visible; Lumi leaning toward the firefly hopefully, soft moonlit dark around',
      },
    },
    {
      page: 8,
      text: `Lumi looked at the little firefly's brave glow, and understood.\n\n"I was so busy being the light," she said softly, "that I never let you shine."`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the dark forest, in the firefly glow',
        timeOfDay: 'night',
        action: 'Lumi looks warmly and a little humbled at the glowing firefly, a gentle realizing smile, the two lit together in the small warm glow',
        emotionalBeat: 'understanding and humility; seeing the little one truly',
        requiredVisualFacts: ['Lumi with a warm, humbled, realizing expression', 'the firefly glowing proudly beside her', 'the two lit in a small shared circle of light'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'tender close two-shot in the firefly glow, warm in the soft dark, headroom',
      },
    },
    {
      page: 9,
      text: `"Will you help me find the way?" asked Lumi.\n\nThe little firefly glowed brighter than it ever had. And together, they set off into the dark.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the dark forest path, setting off',
        timeOfDay: 'night',
        action: 'Lumi and the brightly glowing firefly set off down the path together, the firefly lighting the way now while Lumi follows and guides, a true team',
        emotionalBeat: 'shared courage; letting the little one lead',
        requiredVisualFacts: ['the firefly glowing brightly and leading', 'Lumi walking/flying alongside, following its light, encouraging', 'a warm little pool of light on the dark path'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'the two heading down the path together, firefly light leading, hopeful, soft dark',
      },
    },
    {
      page: 10,
      text: `The firefly's little light showed the path. Lumi's gentle voice kept them calm.\n\nOne small light, and one kind friend — it turned out, that was plenty.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the forest path, the village lights appearing in the distance',
        timeOfDay: 'night',
        action: 'Lumi and the glowing firefly travel together along the path as the warm lights of the distant village begin to appear ahead through the trees',
        emotionalBeat: 'teamwork working; home coming into view',
        requiredVisualFacts: ['Lumi and the glowing firefly traveling together', 'the warm lights of the distant village appearing ahead', 'a hopeful warm-in-the-dark mood'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'the pair with firefly light, distant village glow ahead drawing them on, warm night',
      },
    },
    {
      page: 11,
      text: `Guided by their two small lights, they came at last to the edge of the village.\n\nThe little firefly's family was waiting — and it flew to them, glowing proud as anything.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the warm edge of the lantern-lit village at night',
        timeOfDay: 'night, warm village lanterns glowing',
        action: 'At the glowing edge of the village, the little firefly flies off glowing proudly toward tiny waiting firefly lights, while Lumi watches warmly, happy for it',
        emotionalBeat: 'joy and pride in the little one; safe arrival',
        requiredVisualFacts: ['the warm lantern-lit village edge', 'the little firefly glowing proudly flying toward tiny waiting firefly lights', 'Lumi watching warmly and happily'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'warm village glow, the proud little firefly reunited, Lumi watching fondly, cozy night',
      },
    },
    {
      page: 12,
      text: `Lumi flew home under the stars, her lantern still dark — and she did not mind at all.\n\nShe had learned something brighter than any lantern.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the night sky above the valley, flying home under stars',
        timeOfDay: 'night, starry and peaceful',
        action: 'Lumi flies peacefully home through the starry night above the glowing valley, carrying her dark lantern, wearing a calm, content, wiser smile',
        emotionalBeat: 'quiet growth; content even without her own light',
        requiredVisualFacts: ['Lumi flying peacefully under a starry sky above the glowing valley', 'her star lantern carried but unlit', 'a calm, content, wiser expression'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'Lumi gliding across a starry sky over the warm valley, serene, headroom for stars',
      },
    },
    {
      page: 13,
      text: `Now, when Lumi lights the way, she always leaves room for other little lights to shine too.\n\nBecause a little light goes a long way — and shared, it goes even farther.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'the twilight valley, Lumi with her relit star lantern among many small glows',
        timeOfDay: 'dusk, warm and glowing',
        action: 'Lumi perches happily with her star lantern glowing again, surrounded by many tiny fireflies all glowing together, sharing the light, the valley warm and bright',
        emotionalBeat: 'the warm, complete, happy ending: shared light, friendship, belonging',
        requiredVisualFacts: ['Lumi with her star lantern glowing again', 'many tiny fireflies glowing all around her, sharing the light', 'a warm, joyful, glowing valley'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'warm glowing final image; Lumi and many little shared lights together, bright and happy, headroom',
      },
    },
  ],
}

export const book: Book = {
  ...rawBook,
  pages: rawBook.pages.map((p) => ({
    ...p,
    art: p.art || `books/lumi-lights-way/pages/page-${String(p.page).padStart(2, '0')}.png`,
  })),
}
