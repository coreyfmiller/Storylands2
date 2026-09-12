// STORYLANDS — Book #6: "Finn and the Big Lake"
// Each page carries BOTH the prose (what the reader reads) and the illustration manifest.
//
// Story spine (see book-production steering): want (swim all the way across the big lake to
// the far side, where the best adventures must be, like the big ducks do) -> flaw (thinks
// being ready means being unafraid and doing it all at once in one big splash; impatient with
// small steps, so he freezes at the edge because the lake looks enormous) -> escalating tries
// (dramatic run-ups, chickening out at the water's edge; the lake seems bigger each time;
// nearly gives up, deciding he's "too small") -> the turn: he notices the lake is not one
// huge scary thing — it's made of little ripples and small splashes -> he solves it HIMSELF:
// one webbed foot, one small splash at a time, resting on stones along the way; small splashes
// carry him across -> quiet change: big things are made of small brave steps -> happy ending:
// he reaches the far side his own way, looks back at how far small splashes carried him;
// still eager little Finn, now one who knows how to begin.
//
// Voice: bright, buoyant, encouraging; Finn is eager and dramatic; gentle water-adventure joy.
// Theme shown, never stated. Textless 9:16 art; words live only in the reader's text panel.

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
  finn: 'characters/finn.png',
}

const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
  'frightening or scary imagery, nothing threatening, no deep dangerous water peril',
  'Finn as a human; human characters',
  'a different animal; Finn losing his orange bill, orange webbed feet, or blue water-pattern bandana',
]

const rawBook: Book = {
  id: 'finn-little-boat',
  title: 'Finn and the Big Lake',
  subtitle: 'Small splashes. Big adventures.',
  character: 'finn',
  ages: 'Ages 4+',
  minutes: 6,
  pages: [
    {
      page: 1,
      text: `Finn was a small duckling with a big plan.\n\nToday he would swim all the way across the lake to the far green shore, where the very best adventures surely lived.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the rocky, grassy shore of a big clear blue mountain lake, pine forest and snowy peaks beyond, a far green shore across the water',
        timeOfDay: 'bright sunny morning',
        action: 'Finn the little yellow duckling stands proudly at the edge of the lake, one wing raised, gazing across the wide water toward the distant far shore with big dreams',
        emotionalBeat: 'eager ambition; a big dream',
        requiredVisualFacts: ['Finn the fluffy yellow duckling with orange bill, orange webbed feet, and blue water-pattern bandana', 'a wide clear blue mountain lake with a far green shore', 'bright sunny morning'],
        forbiddenVisualFacts: [...forbiddenAlways, 'deep or scary water'],
        composition: 'Finn small on the near shore, the big lake stretching out before him, far shore in the distance; sense of scale but bright and inviting',
      },
    },
    {
      page: 2,
      text: `The big ducks crossed the whole lake in one long, splendid swim.\n\nFinn puffed out his chest. He would do it all at once too — one big, brave splash!`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the near lake shore',
        timeOfDay: 'morning',
        action: 'Finn puffs out his fluffy chest and strikes a bold heroic pose at the waters edge, determined to leap in dramatically, big ducks swimming far out on the lake behind',
        emotionalBeat: 'bravado; all-or-nothing confidence',
        requiredVisualFacts: ['Finn in a bold, chest-out heroic pose at the waters edge', 'a few big ducks swimming far out on the lake (small, distant)', 'a determined, excited face'],
        forbiddenVisualFacts: [...forbiddenAlways, 'the big ducks shown large or in detail; scary water'],
        composition: 'Finn bold and central on the shore, distant ducks tiny on the lake, bright morning',
      },
    },
    {
      page: 3,
      text: `Finn ran at the water. Then he stopped.\n\nUp close, the lake was SO big, and SO wide, and SO deep-looking. His brave splash stayed stuck inside him.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'right at the lake edge, water lapping at his feet',
        timeOfDay: 'morning',
        action: 'Finn skids to a stop at the very edge of the water, one webbed foot lifted, eyes wide at how enormous the lake looks up close, hesitating',
        emotionalBeat: 'the dream meeting the scary reality; freezing up',
        requiredVisualFacts: ['Finn skidding to a stop at the waters edge with one foot lifted', 'the lake looking very big and wide from his small point of view', 'a wide-eyed, hesitant expression'],
        forbiddenVisualFacts: [...forbiddenAlways, 'dangerous or dark water'],
        composition: 'low angle making the calm lake look big to tiny Finn; bright, not scary, headroom',
      },
    },
    {
      page: 4,
      text: `He tried again. And stopped again.\n\nEach time he looked at the whole enormous lake, his feet would not go in. Maybe, thought Finn, he was just too small.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the lake edge',
        timeOfDay: 'morning',
        action: 'Finn sits down glumly on a rock at the shore, wings drooping, gazing out at the vast lake, feeling small and discouraged',
        emotionalBeat: 'discouragement; feeling too small for the dream',
        requiredVisualFacts: ['Finn sitting glumly on a rock with drooping wings', 'the wide lake stretching before him', 'a small, discouraged expression'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary water'],
        composition: 'small dejected Finn on a rock, big calm lake beyond, gentle and quiet',
      },
    },
    {
      page: 5,
      text: `A dragonfly skimmed past and touched the water — tip, tip, tip.\n\nEach little touch made a tiny ring. And Finn noticed something he had missed.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the calm shallow lake edge, close to the water surface',
        timeOfDay: 'morning',
        action: 'Finn watches closely as a friendly little dragonfly skims and taps the calm water, leaving tiny expanding ripple-rings on the surface, curiosity waking in him',
        emotionalBeat: 'a small noticing; the seed of an idea',
        requiredVisualFacts: ['a small friendly dragonfly touching the calm water', 'tiny ripple rings spreading on the surface', 'Finn watching closely, curious'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary water'],
        composition: 'close on the water surface, dragonfly and little ripples, Finn leaning in curious',
      },
    },
    {
      page: 6,
      text: `The big lake was not one giant scary thing.\n\nIt was made of little ripples. Little splashes. Small enough, maybe, for a small duck after all.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the shallow calm lake edge',
        timeOfDay: 'morning',
        action: 'Finn looks at the gently rippling water with a dawning, hopeful realization, the calm surface sparkling with countless tiny ripples',
        emotionalBeat: 'realization; the big thing is made of small things',
        requiredVisualFacts: ['the calm lake surface full of small sparkling ripples', 'Finn with a hopeful, dawning expression', 'bright gentle morning light on the water'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary water'],
        composition: 'sparkling rippled water, Finn small and hopeful at the edge, bright and calm',
      },
    },
    {
      page: 7,
      text: `So Finn did not make one big brave splash.\n\nHe made one small one. He dipped a single webbed foot in the water — splish — and it was just fine.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the shallow lake edge, one foot in the water',
        timeOfDay: 'morning',
        action: 'Finn carefully dips one orange webbed foot into the shallow clear water, making a small splash, looking pleasantly surprised that it is fine',
        emotionalBeat: 'the first small brave step; relief and delight',
        requiredVisualFacts: ['Finn dipping one webbed foot into the clear shallow water with a small splash', 'a pleasantly surprised, delighted face', 'bright shallow sparkling water'],
        forbiddenVisualFacts: [...forbiddenAlways, 'deep or scary water'],
        composition: 'close warm moment, Finn and the small splash at his foot, bright water, headroom',
      },
    },
    {
      page: 8,
      text: `Then another small splash. And another.\n\nBefore he knew it, Finn was paddling — not across the whole lake, just to the first flat stone. And he made it!`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'paddling in the shallow clear lake to a nearby flat stone',
        timeOfDay: 'morning',
        action: 'Finn paddles happily through the calm shallow water toward a nearby flat stepping stone, small splashes around him, thrilled with himself',
        emotionalBeat: 'momentum; small steps adding up, joyful',
        requiredVisualFacts: ['Finn paddling in calm clear shallow water toward a flat stone', 'cheerful small splashes around him', 'a thrilled, proud expression'],
        forbiddenVisualFacts: [...forbiddenAlways, 'deep or scary water'],
        composition: 'Finn mid-paddle toward a nearby stone, bright shallow water, hopeful and warm',
      },
    },
    {
      page: 9,
      text: `From the first stone he paddled to the next. Then he rested. Then he paddled again.\n\nStone by stone. Splash by splash. The far shore came slowly closer.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'a line of flat stepping stones across the calm bright lake',
        timeOfDay: 'midday',
        action: 'Finn stands resting on a flat stone partway across the calm lake, looking ahead to the next stone, the far green shore closer now, water sparkling',
        emotionalBeat: 'steady progress; patient, small-step bravery',
        requiredVisualFacts: ['Finn resting on a flat stone out in the calm lake', 'more stepping stones leading toward the closer far shore', 'bright sparkling calm water'],
        forbiddenVisualFacts: [...forbiddenAlways, 'deep or scary water'],
        composition: 'Finn on a stone mid-lake, stones leading onward, the far shore nearer; hopeful, airy',
      },
    },
    {
      page: 10,
      text: `The dragonfly darted along beside him the whole way, like a tiny cheering friend.\n\n"Almost there!" Finn told himself. "One more small splash."`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the calm lake near the far green shore',
        timeOfDay: 'midday',
        action: 'Finn paddles the last little stretch toward the green far shore with the friendly dragonfly darting cheerfully beside him, both nearly there',
        emotionalBeat: 'encouraged, nearly there, joyful determination',
        requiredVisualFacts: ['Finn paddling the last stretch toward the green far shore', 'the little dragonfly darting cheerfully beside him', 'the shore close now, bright calm water'],
        forbiddenVisualFacts: [...forbiddenAlways, 'deep or scary water'],
        composition: 'Finn and dragonfly approaching the near green shore, warm and hopeful, headroom',
      },
    },
    {
      page: 11,
      text: `And then — his webbed feet touched the soft green grass of the far shore.\n\nFinn had crossed the whole enormous lake. All by himself.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the green far shore of the lake, arriving',
        timeOfDay: 'midday',
        action: 'Finn steps up onto the soft green grass of the far shore, wings thrown up in triumph, absolutely delighted, water dripping happily off him',
        emotionalBeat: 'triumph and joy; he did it himself',
        requiredVisualFacts: ['Finn stepping onto the green far shore with wings up in triumph', 'a delighted, victorious expression', 'the bright lake behind him'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary water'],
        composition: 'triumphant Finn arriving on the green shore, lake behind, bright and joyful, headroom',
      },
    },
    {
      page: 12,
      text: `Finn looked back across the water he had crossed.\n\nIt still looked big. But now he knew a secret: even the biggest lake is only ever one small splash at a time.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the far green shore, looking back across the lake',
        timeOfDay: 'midday, golden and bright',
        action: 'Finn sits happily on the far shore looking back across the wide sparkling lake he crossed, proud and thoughtful, the whole journey behind him',
        emotionalBeat: 'proud reflection; understanding how he did it',
        requiredVisualFacts: ['Finn on the far shore looking back across the wide bright lake', 'a proud, content, thoughtful expression', 'the sparkling water and distant near shore'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary water'],
        composition: 'Finn foreground on the shore, the crossed lake spread behind him, warm and reflective',
      },
    },
    {
      page: 13,
      text: `After that, no adventure ever looked too big again.\n\nBecause Finn had learned the best thing a small duck can know: big dreams are just small splashes, one after another, all the way across.`,
      art: '',
      manifest: {
        charactersPresent: ['finn'],
        location: 'the sunny far shore, a new adventure waiting ahead, bright lake behind',
        timeOfDay: 'bright golden midday',
        action: 'Finn stands proud and happy on the sunny shore, wings out, ready for whatever comes next, the friendly dragonfly nearby, the bright world open ahead',
        emotionalBeat: 'the warm, complete, happy, forward-looking ending: confident, capable, ready for more',
        requiredVisualFacts: ['Finn proud and happy on the bright shore with wings out, ready for the next adventure', 'the friendly dragonfly nearby', 'a bright, hopeful, open world ahead'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary water'],
        composition: 'confident joyful Finn on the sunny shore facing the bright world, hopeful send-off, headroom',
      },
    },
  ],
}

export const book: Book = {
  ...rawBook,
  pages: rawBook.pages.map((p) => ({
    ...p,
    art: p.art || `books/finn-little-boat/pages/page-${String(p.page).padStart(2, '0')}.png`,
  })),
}
