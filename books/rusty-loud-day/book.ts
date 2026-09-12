// STORYLANDS — Book #5: "Rusty and the Loud Day"
// Each page carries BOTH the prose (what the reader reads) and the illustration manifest.
//
// Story spine (see book-production steering): want (enjoy the big, exciting Autumn Fair) ->
// flaw (the bigness overwhelms him; he thinks he must power through and keep smiling, which
// makes his feelings grow "too big for his fur") -> escalating overload (drums, cheering,
// swirling color, all at once) until he bolts and hides, sure he ruined it -> the turn: in
// his quiet hiding place he finds a tiny creature ALSO overwhelmed and hiding, and his
// kindness takes over -> he solves it HIMSELF: doing the calming for the little one (slow
// breaths, a quiet count, soft words) teaches him to do it for himself; big feelings get
// smaller when you slow down and are gentle -> quiet change: he learns a quiet break is
// allowed -> happy ending: he returns and enjoys the fair his own way, with his new small
// friend, taking calm moments when he needs them; still warm, kind Rusty.
//
// Voice: warm, gentle, sensory; big feelings are honored, never mocked; NO stated lesson —
// the calming is SHOWN through action. Textless 9:16 art; words live only in the text panel.

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
  rusty: 'characters/rusty.png',
}

const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
  'frightening or scary imagery, nothing threatening',
  'Rusty as a human; human characters',
  'a different animal; Rusty losing his white tail-tip, black legs, or red maple-leaf bandana',
]

const rawBook: Book = {
  id: 'rusty-loud-day',
  title: 'Rusty and the Loud Day',
  subtitle: 'Kindness makes a bigger world.',
  character: 'rusty',
  ages: 'Ages 4+',
  minutes: 6,
  pages: [
    {
      page: 1,
      text: `It was the day of the Autumn Fair, and Rusty had been looking forward to it all week.\n\nThere were lanterns, and music, and the whole meadow full of friends.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'a bright autumn meadow fair with paper lanterns, colorful bunting (no words), stalls, warm fall foliage and mountains',
        timeOfDay: 'warm sunny afternoon',
        action: 'Rusty the little fox arrives at a cheerful autumn fair, eyes wide with excitement, tail up, taking in all the color and bustle',
        emotionalBeat: 'joyful anticipation; everything is exciting',
        requiredVisualFacts: ['Rusty the red fox with white chest, black legs, white-tipped bushy tail, and red maple-leaf bandana', 'a colorful autumn fair with lanterns and fall leaves', 'a happy, excited expression'],
        forbiddenVisualFacts: [...forbiddenAlways, 'crowds of humans'],
        composition: 'Rusty entering the fair, warm bustle around him but not overwhelming yet, headroom above',
      },
    },
    {
      page: 2,
      text: `At first it was wonderful. Rusty ran from the apple stall to the leaf-pile to the music, laughing.\n\nSo much to see! So much to do!`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'the autumn fair, among cheerful stalls and a big pile of colorful leaves',
        timeOfDay: 'afternoon',
        action: 'Rusty leaps joyfully into a big pile of orange and red autumn leaves, laughing, mid-play, fair color all around',
        emotionalBeat: 'pure delight; the good kind of excitement',
        requiredVisualFacts: ['Rusty leaping happily into a pile of colorful autumn leaves', 'a laughing, delighted face', 'the cheerful fair around him'],
        forbiddenVisualFacts: [...forbiddenAlways, 'crowds of humans'],
        composition: 'dynamic joyful Rusty mid-leap in leaves, warm and lively, centered with margin',
      },
    },
    {
      page: 3,
      text: `Then more friends came. And more. The drums grew louder. The cheering grew bigger.\n\nEverything was happening everywhere, all at once.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'the busier, louder heart of the fair',
        timeOfDay: 'late afternoon',
        action: 'Rusty stands amid a swirl of bright fair activity — drums, streamers, movement all around — starting to look a little overwhelmed, ears tilting back',
        emotionalBeat: 'the fun tipping toward too-much',
        requiredVisualFacts: ['Rusty in the middle of a busy, colorful, swirling fair', 'his ears beginning to tilt back, a flicker of overwhelm', 'lots of cheerful motion around him'],
        forbiddenVisualFacts: [...forbiddenAlways, 'crowds of humans', 'anything scary or menacing'],
        composition: 'Rusty small and central in a swirl of warm color and motion; busy but not frightening',
      },
    },
    {
      page: 4,
      text: `Rusty's ears began to hurt. His heart went fast. His feelings grew and grew, until they felt too big for his fur.\n\nBut everyone else was smiling. So Rusty smiled too.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'the loud fair',
        timeOfDay: 'late afternoon',
        action: 'Rusty holds a slightly-too-big forced smile while his eyes show worry and his paws press to his own chest, the bright fair pressing in around him',
        emotionalBeat: 'masking; overwhelmed but trying to look fine',
        requiredVisualFacts: ['Rusty with a strained, forced smile and worried eyes', 'a paw pressed to his chest', 'the busy bright fair around him'],
        forbiddenVisualFacts: [...forbiddenAlways, 'crowds of humans', 'tears yet', 'scary imagery'],
        composition: 'close on Rusty, the pressure of color/motion at the edges, his face the focus',
      },
    },
    {
      page: 5,
      text: `It was too much. Rusty's big feelings spilled right over.\n\nHe turned and ran — away from the music, away from the lights, all the way to the quiet edge of the meadow.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'running from the fair toward the quiet meadow edge, fair glowing behind',
        timeOfDay: 'late afternoon, softening light',
        action: 'Rusty runs away from the bright fair toward calm tall grass and trees at the meadow edge, ears down, overwhelmed, the fair small and glowing behind him',
        emotionalBeat: 'overflow; needing to escape the noise',
        requiredVisualFacts: ['Rusty running away from the bright fair toward a quiet grassy meadow edge', 'ears down, an overwhelmed expression', 'the fair glowing small in the distance behind'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery', 'crowds of humans'],
        composition: 'Rusty mid-run toward calm space, warm fair behind, quiet ahead; motion and relief',
      },
    },
    {
      page: 6,
      text: `He curled up small under a big fern, wrapped his tail around himself, and squeezed his eyes shut.\n\nHe was sure he had ruined the whole day.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'a quiet, soft, shady spot under a large fern at the meadow edge',
        timeOfDay: 'late afternoon, calm golden light',
        action: 'Rusty curls into a small ball under a big green fern, his bushy tail wrapped around himself, eyes squeezed shut, alone and quiet',
        emotionalBeat: 'the low point: overwhelmed, ashamed, small',
        requiredVisualFacts: ['Rusty curled in a small ball with his tail wrapped around himself under a big fern', 'eyes squeezed shut', 'a soft quiet sheltered spot'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'small curled Rusty nestled under a fern, soft and safe-feeling, gentle light',
      },
    },
    {
      page: 7,
      text: `But he was not alone.\n\nRight beside him, a tiny hedgehog was curled up too — trembling, its little spines shivering, hiding from the very same loud day.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'under the fern at the quiet meadow edge',
        timeOfDay: 'late afternoon, calm light',
        action: 'Rusty opens his eyes to notice a tiny hedgehog curled in a trembling ball in the grass right beside him, also hiding, also overwhelmed',
        emotionalBeat: 'recognition; someone else feels exactly this',
        requiredVisualFacts: ['a tiny hedgehog curled in a small trembling ball in the grass', 'Rusty noticing it with soft, surprised, caring eyes', 'the sheltered fern spot'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a scary or large creature'],
        composition: 'tender two-shot, Rusty and the tiny hedgehog close in the grass, soft and gentle',
      },
    },
    {
      page: 8,
      text: `Rusty forgot about his own big feelings.\n\n"It's alright," he whispered. "Let's be quiet together. Breathe with me — slow."`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'under the fern',
        timeOfDay: 'late afternoon, calm golden light',
        action: 'Rusty leans close and gently to the little hedgehog, one soft paw near it, speaking softly and kindly, his own face calm and warm now',
        emotionalBeat: 'kindness taking over; comforting someone smaller',
        requiredVisualFacts: ['Rusty leaning gently toward the tiny hedgehog with a soft caring expression', 'a calm, kind, reassuring posture', 'warm soft light'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'gentle close two-shot, Rusty soothing the hedgehog, warm and tender, headroom',
      },
    },
    {
      page: 9,
      text: `So they breathed. In, slow, like smelling autumn leaves. Out, slow, like blowing a dandelion.\n\nIn. Out. In. Out.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'under the fern, a floating dandelion seed nearby',
        timeOfDay: 'late afternoon, soft warm light',
        action: 'Rusty and the little hedgehog breathe slowly together, calm, a soft dandelion seed drifting in the golden air between them, both settling',
        emotionalBeat: 'calming; the slow breaths working, for both of them',
        requiredVisualFacts: ['Rusty and the hedgehog calm and breathing slowly together', 'a gentle dandelion seed or two drifting in warm light', 'peaceful, settling body language'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'serene, warm, slow moment; the two small friends and drifting seeds, soft glow',
      },
    },
    {
      page: 10,
      text: `And a funny thing happened. As the hedgehog's shivers grew smaller, so did the big feelings in Rusty's chest.\n\nSlowly, the world felt the right size again.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'under the fern, calm now',
        timeOfDay: 'golden late afternoon',
        action: 'Rusty sits calm and relieved, a gentle smile returning, the little hedgehog now uncurled and peeking out happily beside him, both settled',
        emotionalBeat: 'relief; calm restored by caring',
        requiredVisualFacts: ['Rusty calm and gently smiling', 'the hedgehog now uncurled and peeking out, calmer', 'a soft, settled, warm mood'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'calm warm two-shot, both relaxed now, gentle golden light, headroom',
      },
    },
    {
      page: 11,
      text: `When Rusty was ready — only when he was ready — he stood up.\n\n"Come on," he told his new friend. "We can go back slowly. And we can always come here when it's too much."`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'the meadow edge, the warm fair glowing gently in the distance',
        timeOfDay: 'golden hour',
        action: 'Rusty stands calmly and gently, ready now, the tiny hedgehog beside him, both looking toward the softly glowing fair in the distance, unhurried',
        emotionalBeat: 'readiness on his own terms; a plan that includes rest',
        requiredVisualFacts: ['Rusty standing calm and ready with the little hedgehog beside him', 'the warm fair glowing gently in the distance', 'a calm, unhurried, hopeful mood'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'the two small friends facing the distant warm glow, calm and hopeful, headroom',
      },
    },
    {
      page: 12,
      text: `Rusty went back to the fair — but his own way now.\n\nHe danced when he wanted to, and rested when he needed to. And his little friend stayed close the whole time.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'back at the autumn fair, warm and glowing at golden hour',
        timeOfDay: 'golden evening, lanterns glowing',
        action: 'Rusty enjoys the fair happily and calmly, dancing gently among the lanterns with the little hedgehog beside him, relaxed and joyful now',
        emotionalBeat: 'joy on his own terms; belonging again, calmly',
        requiredVisualFacts: ['Rusty happy and relaxed enjoying the glowing fair', 'the little hedgehog friend close beside him', 'warm lantern-lit evening, gentle not overwhelming'],
        forbiddenVisualFacts: [...forbiddenAlways, 'crowds of humans', 'scary imagery'],
        composition: 'warm festive but gentle fair scene, Rusty and friend central and happy, headroom',
      },
    },
    {
      page: 13,
      text: `The day had been big and loud and a lot.\n\nBut Rusty had learned something: even the biggest feelings get smaller when you are gentle — and kindness, it turns out, makes the whole world feel just the right size.`,
      art: '',
      manifest: {
        charactersPresent: ['rusty'],
        location: 'the fair at dusk, lanterns glowing, peaceful and warm',
        timeOfDay: 'evening, soft glowing lanterns and first stars',
        action: 'Rusty sits contentedly among the warm glowing lanterns with the little hedgehog nestled beside him, both peaceful and happy, the fair calm and beautiful around them',
        emotionalBeat: 'the warm, complete, happy ending: calm, kind, belonging, a friend',
        requiredVisualFacts: ['Rusty peaceful and content with the little hedgehog nestled beside him', 'warm glowing lanterns and a gentle evening sky', 'a calm, happy, complete mood'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery', 'crowds of humans'],
        composition: 'warm, glowing, peaceful final image; Rusty and his friend centered among soft lanterns, headroom',
      },
    },
  ],
}

export const book: Book = {
  ...rawBook,
  pages: rawBook.pages.map((p) => ({
    ...p,
    art: p.art || `books/rusty-loud-day/pages/page-${String(p.page).padStart(2, '0')}.png`,
  })),
}
