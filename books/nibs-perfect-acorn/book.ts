// STORYLANDS — Story Zero: "Nibs and the Absolutely Perfect Acorn"
// Hand-authored benchmark book. Each page carries BOTH the prose (what the reader reads)
// and the illustration manifest (canonical truth the image prompt is derived from).
//
// Architecture followed: want (keep the acorn perfectly safe) -> flaw (over-protection) ->
// escalating hiding measures -> Tilly's puncturing question (midpoint) -> "it's gone" ->
// investigation misreading his own clues -> Nibs's own choice to look at himself -> the
// sprout -> quiet behavioral turn (he lets it be) -> personality callback (the sign).
//
// Voice: warm restrained narrator, sparse Nibs dialogue, Tilly carries most spoken lines,
// meaning stays underneath. Textless 9:16 art; the text is an overlay in the reader.

export type IllustrationManifest = {
  charactersPresent: string[] // reference character ids to seed with
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
  text: string // the read-aloud prose for this page
  art: string // generated illustration path (filled after generation)
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

// Reference character files live in /public/characters. Seed image generation with these.
export const CHARACTER_REFS: Record<string, string> = {
  nibs: 'characters/nibs.png',
  tilly: 'characters/Tilly.png',
}

const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'frightening or dark imagery',
  'human characters',
  'Nibs wearing clothing',
]

const rawBook: Book = {
  id: 'nibs-perfect-acorn',
  title: 'Nibs and the Absolutely Perfect Acorn',
  subtitle: 'Small but a bit nutty.',
  character: 'nibs',
  ages: 'Ages 4+',
  minutes: 6,
  pages: [
    {
      page: 1,
      text: `Nibs was a squirrel with very high standards.\n\nMost acorns were fine. Fine was not good enough. He had thrown back three that very morning: one too round, one slightly dented, and one that looked at him funny.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs'],
        location: 'a bright woodland clearing floor scattered with acorns',
        timeOfDay: 'morning',
        action: 'Nibs sits among several acorns, inspecting one closely and frowning with great seriousness, a small pile of rejected acorns beside him',
        emotionalBeat: 'fussy, particular, self-important',
        requiredVisualFacts: ['several ordinary acorns on the ground', 'Nibs holding one acorn up to inspect it', 'a small pile of set-aside acorns'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a sprout or seedling', 'Tilly the owl'],
        composition: 'Nibs centered-low, acorns around him, warm morning light',
      },
    },
    {
      page: 2,
      text: `And then he found it.\n\nIt sat in a patch of sun as if it had been waiting for him. The shape was right. The little hat was right. It was, without any doubt at all, the Absolutely Perfect Acorn.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs'],
        location: 'the woodland clearing, one bright patch of sunlight on the ground',
        timeOfDay: 'morning',
        action: 'Nibs holds up a single flawless acorn in both paws, eyes wide with wonder, a beam of sunlight on it',
        emotionalBeat: 'awe and joy',
        requiredVisualFacts: ['one single perfect acorn held reverently in both paws', 'a warm shaft of sunlight highlighting the acorn', 'Nibs looking amazed'],
        forbiddenVisualFacts: [...forbiddenAlways, 'many acorns', 'a sprout or seedling', 'Tilly the owl'],
        composition: 'close, tender, the acorn is the focal point',
      },
    },
    {
      page: 3,
      text: `For one whole minute, Nibs was perfectly happy.\n\nThen a terrible thought arrived. Now that he had it, he could lose it.\n\nNibs decided, right there, that he would not.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs'],
        location: 'the woodland clearing',
        timeOfDay: 'morning',
        action: 'Nibs clutches the acorn to his chest and glances over his shoulder with sudden worry, as if someone might be watching',
        emotionalBeat: 'joy tipping into worry',
        requiredVisualFacts: ['Nibs holding the acorn protectively against his chest', 'a wary, worried expression', 'glancing over his shoulder'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a sprout or seedling', 'Tilly the owl', 'an actual threat or predator'],
        composition: 'Nibs slightly hunched and protective, clearing quiet behind him',
      },
    },
    {
      page: 4,
      text: `First he buried it under the crooked root, where no one would ever look.\n\nThen he worried that someone might have seen him bury it. So he dug it up again.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs'],
        location: 'the base of a large crooked tree root in the clearing',
        timeOfDay: 'midday',
        action: 'Nibs pats fresh earth over a spot beneath a crooked root with his paws, focused and secretive',
        emotionalBeat: 'earnest, industrious, secretive',
        requiredVisualFacts: ['a distinctive crooked tree root', 'freshly patted earth', 'Nibs working with his paws in the dirt'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a sprout or seedling', 'Tilly the owl'],
        composition: 'the crooked root prominent (recurring landmark), Nibs low beside it',
      },
    },
    {
      page: 5,
      text: `So he made a plan.\n\nHe buried a plain acorn as a decoy. He buried a second decoy to guard the first one. He drew a map so he would remember, then hid the map.\n\nThen, because a map can be stolen, he drew a second map that was wrong on purpose.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs'],
        location: 'the clearing, now dotted with several small patches of dug earth',
        timeOfDay: 'afternoon',
        action: 'Nibs stands proudly amid a ridiculous number of little dig-marks, holding a scrappy hand-drawn map, several other marked spots around him',
        emotionalBeat: 'proud of an absurdly elaborate plan (comedy peak of the escalation)',
        requiredVisualFacts: ['many small patches of disturbed earth across the clearing', 'Nibs holding a crude little map (with no readable text, just scribbles and arrows)', 'an over-serious, satisfied expression'],
        forbiddenVisualFacts: ['frightening or dark imagery', 'human characters', 'Nibs wearing clothing', 'readable words or letters on the map', 'a sprout or seedling', 'Tilly the owl'],
        composition: 'wide enough to show the comic sprawl of dig-marks; Nibs central and pleased',
      },
    },
    {
      page: 6,
      text: `That was when Tilly drifted down onto a branch to watch.\n\n"Nibs," she said, in the careful way she had. "When did you last actually see it?"\n\nNibs opened his mouth. He closed it again. He could not remember.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs', 'tilly'],
        location: 'the clearing with the dig-marks, a low branch above',
        timeOfDay: 'late afternoon',
        action: 'Tilly the owl perches on a low branch tilting her head with gentle curiosity; Nibs stands below, caught mid-thought, one paw raised, suddenly uncertain',
        emotionalBeat: 'a quiet, puncturing question; dawning uncertainty',
        requiredVisualFacts: ['Tilly the brown owl perched on a low branch, head tilted, calm and curious', 'Nibs looking up, caught off guard and uncertain', 'the dig-marked clearing visible'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a sprout or seedling'],
        composition: 'two-character: Tilly upper-right on branch, Nibs lower-left; both clearly on-model; similar small scale',
      },
    },
    {
      page: 7,
      text: `They hurried to the crooked root and dug.\n\nThe hole was empty.\n\nThe Absolutely Perfect Acorn was gone.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs', 'tilly'],
        location: 'the base of the crooked root',
        timeOfDay: 'late afternoon',
        action: 'Nibs stares in horror into an empty hole beneath the crooked root; Tilly leans in beside him looking thoughtful',
        emotionalBeat: 'alarm and disbelief (the mystery turn)',
        requiredVisualFacts: ['an empty hole in the earth beneath the crooked root', 'Nibs looking shocked and dismayed', 'Tilly observing calmly nearby'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a sprout or seedling', 'the acorn visible'],
        composition: 'both characters focused on the empty hole; the crooked root frames it',
      },
    },
    {
      page: 8,
      text: `"Someone took it," said Nibs.\n\nHe found paw prints. They were his own. He found freshly dug earth. That was his too.\n\nEvery clue he found pointed straight back at Nibs.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs', 'tilly'],
        location: 'the clearing, following a trail of small paw prints',
        timeOfDay: 'evening approaching',
        action: 'Nibs crouches like a detective following a line of paw prints that loop back toward himself; Tilly walks behind, glancing between the prints and Nibs',
        emotionalBeat: 'determined but comically wrong; Tilly quietly noticing the truth',
        requiredVisualFacts: ['a line of small squirrel paw prints in the dirt', 'Nibs following the prints with intense focus', 'Tilly noticing that the prints lead back to Nibs'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a sprout or seedling'],
        composition: 'the looping prints visible on the ground; two characters mid-investigation',
      },
    },
    {
      page: 9,
      text: `Nibs sat down in the middle of his ruined, dug-up clearing. He had done everything right, and still he had lost the one thing that mattered.\n\nTilly settled beside him. "Nibs," she said gently. "What if the thief was being very, very careful?"`,
      art: '',
      manifest: {
        charactersPresent: ['nibs', 'tilly'],
        location: 'the middle of the dug-up clearing at dusk',
        timeOfDay: 'dusk',
        action: 'Nibs sits slumped and defeated among the dig-marks; Tilly sits close beside him, offering a gentle idea rather than a lecture',
        emotionalBeat: 'low point: quiet defeat, then a gentle reframe',
        requiredVisualFacts: ['Nibs sitting down, deflated, surrounded by his own dig-marks', 'Tilly sitting companionably beside him', 'soft dusk light'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a sprout or seedling'],
        composition: 'intimate two-shot, warm low light, small figures in a big quiet clearing',
      },
    },
    {
      page: 10,
      text: `Nibs went very still.\n\nHe thought about how careful he had been. The safest place of all, he realized, would be the decoy hidden to guard the other decoy. He walked to it. He dug.\n\nAnd there it was.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs'],
        location: 'a particular spot in the clearing, away from the crooked root',
        timeOfDay: 'dusk',
        action: 'Nibs digs at one specific spot and uncovers the perfect acorn at last, a look of relief and recognition on his face',
        emotionalBeat: 'realization and relief; he solved it himself',
        requiredVisualFacts: ['Nibs uncovering the acorn from the earth', 'the acorn visible in the freshly opened hole', 'a look of dawning realization on Nibs'],
        forbiddenVisualFacts: [...forbiddenAlways, 'Tilly the owl', 'the acorn sprouting yet'],
        composition: 'Nibs and the just-uncovered acorn as the focal point, dusk glow',
      },
    },
    {
      page: 11,
      text: `But the Absolutely Perfect Acorn was not perfect anymore.\n\nA small pale root had split the shell. It had started, quietly, to grow.\n\nNibs reached out to pull the root away.\n\nAnd then he stopped.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs'],
        location: 'the spot where he uncovered it, close on his paws',
        timeOfDay: 'dusk',
        action: 'Nibs holds the sprouting acorn: a tiny pale root and first green shoot have split the shell; he pauses, paw hovering, uncertain',
        emotionalBeat: 'dismay turning to something quieter and more thoughtful',
        requiredVisualFacts: ['the acorn with a small pale root and a tiny green sprout emerging from a cracked shell', 'Nibs looking at it closely, paw hovering, hesitating', 'a tender, thoughtful expression'],
        forbiddenVisualFacts: [...forbiddenAlways, 'Tilly the owl', 'a fully grown tree'],
        composition: 'very close on Nibs and the sprouting acorn; the quiet emotional center of the book',
      },
    },
    {
      page: 12,
      text: `For a long moment, Nibs looked at the small green thing that used to be his acorn.\n\nThen he patted the earth back around it.\n\n"Well," he said. "You're doing something."`,
      art: '',
      manifest: {
        charactersPresent: ['nibs'],
        location: 'the spot where he uncovered it, close on the sprout in the earth',
        timeOfDay: 'dusk turning to evening',
        action: 'Nibs gently pats soft earth back around the tiny sprouted acorn with both paws, looking at it with a soft, accepting expression rather than dismay',
        emotionalBeat: 'the quiet turn: letting go of "perfect" and choosing to let it grow',
        requiredVisualFacts: ['the little sprouted acorn set in the earth with its tiny green shoot', 'Nibs patting the soil around it with both paws', 'a gentle, accepting expression on Nibs'],
        forbiddenVisualFacts: [...forbiddenAlways, 'Tilly the owl', 'a fully grown tree', 'a fence or barrier yet'],
        composition: 'close and tender, warm low evening light; Nibs and the sprout share the frame',
      },
    },
    {
      page: 13,
      text: `By morning, the little sprout had a fence around it. And a gate. And a second, smaller fence, just in case.\n\nTilly looked at the fences. Then at Nibs, standing guard over a sprout the size of her toe.\n\nHe had not changed quite as much as she had hoped.`,
      art: '',
      manifest: {
        charactersPresent: ['nibs', 'tilly'],
        location: 'the clearing next morning, a small fenced-off patch of earth with the sprout',
        timeOfDay: 'morning',
        action: 'Nibs stands guard proudly beside a tiny sprout he has ringed with an absurdly elaborate little twig fence (with a tiny gate, and a second smaller fence inside the first); Tilly watches from a branch with a knowing, amused look',
        emotionalBeat: 'affectionate comic callback: he is still exactly himself',
        requiredVisualFacts: ['a tiny green sprout in a patch of earth', 'an absurdly elaborate little twig fence ringing the sprout (a tiny gate, and a second smaller fence inside the first)', 'Nibs standing guard proudly', 'Tilly watching with a knowing, amused expression'],
        forbiddenVisualFacts: ['frightening or dark imagery', 'human characters', 'Nibs wearing clothing', 'readable words or letters anywhere in the image', 'any sign, signpost, board, placard, or plaque', 'a fully grown tree'],
        composition: 'morning light, comic reversal; Nibs proudly guarding the over-fenced sprout, Tilly observing from a branch',
      },
    },
  ],
}

// Fill each page's art path from its page number (matches scripts/generate-book.mjs output).
export const book: Book = {
  ...rawBook,
  pages: rawBook.pages.map((p) => ({
    ...p,
    art: p.art || `books/nibs-perfect-acorn/pages/page-${String(p.page).padStart(2, '0')}.png`,
  })),
}
