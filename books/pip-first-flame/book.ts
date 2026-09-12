// STORYLANDS — Book #3: "Pip and the First Flame"
// Each page carries BOTH the prose (what the reader reads) and the illustration manifest
// (canonical truth the image prompt is derived from).
//
// Story spine (see book-production steering): want (get his flame so he can light a lantern
// at the festival like every other dragon) -> flaw (believes he is broken/behind; tries to
// FORCE the fire, measures himself against others) -> escalating tries (huffs, puffs, only
// smoke, more desperate) -> the turn: he finds a tiny glow-moth whose light has gone out,
// cold and afraid in the dark; the puncturing question is the moment he stops trying to make
// fire and simply cares for something smaller than himself -> he solves it himself: warmth,
// not force, is where his flame comes from; a small true flame arrives while he is being kind
// -> quiet change (he lights his lantern gently, from warmth) -> happy ending: his flame is
// small but real, the moth is safe, and Pip understands his big heart WAS the flame all along.
//
// Voice: warm, lyrical narrator; Pip's feelings are earnest and tender; gentle festival magic.
// Theme shown never stated. Textless 9:16 art; words live only in the reader's text panel.

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
  pip: 'characters/pip.png',
}

const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
  'frightening or dark imagery',
  'Pip wearing clothing',
  'a different dragon; Pip changing color or losing his cream belly, horns, or small orange wings',
]

const rawBook: Book = {
  id: 'pip-first-flame',
  title: 'Pip and the First Flame',
  subtitle: 'A small dragon with a big heart.',
  character: 'pip',
  ages: 'Ages 4+',
  minutes: 6,
  pages: [
    {
      page: 1,
      text: `Every dragon in the valley had a flame. Every dragon but Pip.\n\nTonight was the Lantern Festival, when each dragon lit a lantern of their very own.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'a warm fantasy valley at dusk, a village of little dragon homes with unlit paper lanterns strung between them, mountains and a far castle',
        timeOfDay: 'early evening, soft golden dusk',
        action: 'Pip the small red dragon sits on a rock looking up at rows of paper lanterns waiting to be lit, hopeful and a little wistful',
        emotionalBeat: 'gentle longing; the night is special and Pip wants to belong to it',
        requiredVisualFacts: ['Pip the small red dragon with cream belly, small horns, and little orange wings', 'strings of unlit paper lanterns above a cozy valley village', 'warm dusk light'],
        forbiddenVisualFacts: [...forbiddenAlways, 'visible fire or flames yet', 'other dragons crowding the frame'],
        composition: 'Pip lower-center looking up, lanterns arcing overhead, valley behind; warm and inviting',
      },
    },
    {
      page: 2,
      text: `Pip took a big breath. He puffed. He huffed.\n\nOut came a tiny curl of grey smoke, and nothing more.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the same rock in the valley village',
        timeOfDay: 'dusk',
        action: 'Pip puffs his cheeks and breathes out hard, producing only a small wisp of grey smoke, looking cross-eyed at it',
        emotionalBeat: 'earnest effort, comic disappointment',
        requiredVisualFacts: ['Pip breathing out a small curl of grey smoke (no fire)', 'puffed cheeks and a determined face', 'the cozy village behind'],
        forbiddenVisualFacts: [...forbiddenAlways, 'actual flames or fire', 'scary imagery'],
        composition: 'close on Pip and the little wisp of smoke; warm dusk',
      },
    },
    {
      page: 3,
      text: `He tried standing tall. He tried squeezing his eyes shut. He tried thinking very hot thoughts about spicy soup.\n\nStill only smoke.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the valley village clearing',
        timeOfDay: 'dusk',
        action: 'Pip stands on tiptoe with eyes squeezed shut and cheeks puffed, straining comically to breathe fire, a small puff of smoke escaping',
        emotionalBeat: 'trying too hard; forcing it',
        requiredVisualFacts: ['Pip straining with eyes shut and puffed cheeks', 'only a puff of smoke', 'a comic, effortful pose'],
        forbiddenVisualFacts: [...forbiddenAlways, 'actual flames or fire'],
        composition: 'full-body Pip mid-strain, generous space around him, warm light',
      },
    },
    {
      page: 4,
      text: `All around, the older dragons breathed bright ribbons of fire and lit their lanterns one by one.\n\nPip watched. His own lantern stayed dark.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the festival square, glowing lanterns lighting up in the distance',
        timeOfDay: 'evening, growing dark',
        action: 'Pip stands beside his own small unlit paper lantern, watching many warm glowing lanterns light up across the valley beyond him',
        emotionalBeat: 'left out; the quiet ache of being the only one',
        requiredVisualFacts: ['Pip beside a single dark, unlit lantern', 'many warm glowing lanterns in the distance', 'Pips wistful expression'],
        forbiddenVisualFacts: [...forbiddenAlways, 'other dragons shown in clear detail (keep them distant/implied)', 'scary imagery'],
        composition: 'Pip and his dark lantern in the foreground, distant glow behind; gentle contrast',
      },
    },
    {
      page: 5,
      text: `Pip slipped away into the cool dark at the edge of the valley, where the lantern light did not reach.\n\nAnd there, in the grass, something was crying.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the shadowy edge of the valley, tall grass, away from the festival glow',
        timeOfDay: 'night',
        action: 'Pip walks alone into soft blue-dark grass at the valleys edge, ears/horns drooping, then pauses, hearing a tiny sound',
        emotionalBeat: 'lonely, then a flicker of curiosity',
        requiredVisualFacts: ['Pip alone in cool blue-toned tall grass at night', 'the festival glow small and far behind him', 'a curious, listening pause'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary or threatening imagery', 'the glow-moth clearly visible yet'],
        composition: 'small Pip in a large soft-dark space, distant warm glow behind; calm not scary',
      },
    },
    {
      page: 6,
      text: `It was a little glow-moth. Its light had gone out, and it shivered in the cold, too frightened to fly.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the dark grass at the valley edge',
        timeOfDay: 'night',
        action: 'Pip crouches gently over a tiny pale glow-moth sitting in the grass with its glow gone dark, its wings drawn in, shivering',
        emotionalBeat: 'tender concern for something smaller than himself',
        requiredVisualFacts: ['a tiny pale glow-moth with its light gone out, sitting small in the grass', 'Pip leaning down gently and softly', 'a caring, worried expression on Pip'],
        forbiddenVisualFacts: [...forbiddenAlways, 'the moth glowing brightly yet', 'scary imagery'],
        composition: 'close, tender two-shot of Pip and the small dark moth; soft night',
      },
    },
    {
      page: 7,
      text: `Pip forgot all about flames and festivals.\n\nHe curled around the little moth to keep the wind away, and held it close, and whispered that it was safe.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the dark grass',
        timeOfDay: 'night',
        action: 'Pip curls his body and wings gently around the tiny moth cupped in his paws, sheltering it from the wind, speaking softly to it',
        emotionalBeat: 'pure kindness; caring with his whole heart',
        requiredVisualFacts: ['Pip curled protectively around the tiny moth cupped in his paws', 'his little wings sheltering it', 'a gentle, loving expression'],
        forbiddenVisualFacts: [...forbiddenAlways, 'flames', 'scary imagery'],
        composition: 'intimate, warm-cool blend; Pip wrapped around the tiny moth, centered with headroom',
      },
    },
    {
      page: 8,
      text: `And as he held it, something warm began to glow deep in Pip's chest — not from trying, but from caring.\n\nA small, gentle warmth he had never felt before.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the dark grass',
        timeOfDay: 'night',
        action: 'A soft warm glow begins to shine from within Pips chest and cupped paws, lighting his face gently as he cradles the moth; he looks surprised and moved',
        emotionalBeat: 'wonder; warmth arriving quietly from the inside',
        requiredVisualFacts: ['a soft warm glow coming from within Pips chest and paws', 'the gentle light on Pips surprised, tender face', 'the moth cradled safely'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a big or scary blaze of fire', 'burning or danger'],
        composition: 'the inner glow is the light source; Pip centered, soft warm halo, generous margin',
      },
    },
    {
      page: 9,
      text: `Pip breathed out — softly this time, the way you breathe on cold paws to warm them.\n\nAnd a small, bright flame flickered to life on the tip of his nose.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the dark grass',
        timeOfDay: 'night',
        action: 'Pip breathes out gently and a small bright warm flame appears softly at the tip of his snout, lighting up his amazed happy face',
        emotionalBeat: 'joyful astonishment; his first flame, born of warmth',
        requiredVisualFacts: ['a small, gentle, bright flame at the tip of Pips nose', 'Pips amazed and delighted face lit by it', 'the little moth nearby, warmed'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a large or frightening fire', 'anything burning or dangerous'],
        composition: 'the small flame as the warm focal point; Pip centered with headroom, soft night around',
      },
    },
    {
      page: 10,
      text: `The little moth felt the warmth. Slowly, its own light flickered back — a soft golden glow.\n\nThen it lifted into the air, bright and unafraid.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the grass at the valley edge',
        timeOfDay: 'night',
        action: 'The little moth glows golden again and lifts up into the air, glowing happily, while Pip watches with delight, his small flame still warm',
        emotionalBeat: 'relief and shared joy; the kindness returned as light',
        requiredVisualFacts: ['the glow-moth now glowing warm gold and flying up happily', 'Pip watching with a joyful face', 'gentle warm light in the dark'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery', 'large fire'],
        composition: 'the rising glowing moth draws the eye upward; Pip below watching, warm and happy',
      },
    },
    {
      page: 11,
      text: `Pip walked back to his little lantern, the flame still warm on his nose.\n\nHe leaned close and, gently, lit it.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'back at the festival, at Pips own small lantern',
        timeOfDay: 'night',
        action: 'Pip leans toward his own paper lantern and lights it softly with his small nose-flame; the lantern glows warmly to life',
        emotionalBeat: 'quiet pride; doing it his own gentle way',
        requiredVisualFacts: ['Pip gently lighting his own paper lantern with a small flame', 'the lantern glowing warmly to life', 'Pips calm, proud, happy face'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a big blaze', 'scary imagery'],
        composition: 'warm pool of new lantern light on Pip; centered, cozy, headroom above',
      },
    },
    {
      page: 12,
      text: `His flame was not the biggest in the valley. It was small, and soft, and warm.\n\nBut it was his — and it had come from his own big heart.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the festival, Pips glowing lantern beside him, other lanterns warm in the distance',
        timeOfDay: 'night',
        action: 'Pip sits proudly and happily beside his own softly glowing lantern, the little glow-moth hovering near him, the valley full of warm lantern light',
        emotionalBeat: 'warm, complete belonging; small but truly his',
        requiredVisualFacts: ['Pip beside his own warmly glowing lantern', 'the friendly glow-moth glowing near him', 'many warm lanterns across the happy valley'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery', 'a giant fire'],
        composition: 'warm, full, festive glow; Pip and his lantern centered, the valley bright behind',
      },
    },
    {
      page: 13,
      text: `And every Lantern Festival after that, a small golden glow-moth would find Pip in the crowd — and light its way to him.\n\nBecause Pip's flame was small. But his heart was the biggest in the valley.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'the glowing festival valley, full of warm light',
        timeOfDay: 'night, festive and bright',
        action: 'Pip sits happily among the warm festival glow with the little golden glow-moth resting on his nose, both content, the valley full of lantern light behind',
        emotionalBeat: 'the warm, complete, happy ending: friendship, belonging, a bright future',
        requiredVisualFacts: ['Pip happy and content with the golden glow-moth resting on or near his nose', 'a valley full of warm glowing lanterns', 'a bright, joyful, peaceful mood'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery', 'a giant fire'],
        composition: 'warm celebratory final image; Pip and the glow-moth centered, festival glow all around, headroom',
      },
    },
  ],
}

export const book: Book = {
  ...rawBook,
  pages: rawBook.pages.map((p) => ({
    ...p,
    art: p.art || `books/pip-first-flame/pages/page-${String(p.page).padStart(2, '0')}.png`,
  })),
}
