// STORYLANDS — Book #4: "Maple and the Backyard Night"
// Each page carries BOTH the prose (what the reader reads) and the illustration manifest.
//
// Story spine (see book-production steering): want (camp out all night by herself, like a
// real adventurer) -> flaw (her courage is daytime bravado; she thinks brave means not being
// scared at all, and has planned everything except how the dark FEELS) -> escalating tries
// (every ordinary night sound becomes a monster; she mounts sillier and sillier defenses) ->
// the turn/low point: she nearly bolts for home -> she solves it HERSELF by stopping to check
// each scary sound and naming what it really is (an owl, a pinecone, the wind), discovering
// brave means looking anyway -> quiet change: she stops fighting the dark and lies back to
// watch the stars -> happy ending: she stays out all night, the dark is wonderful now, and
// the forest keeps her company; still a big-ideas planner, now braver in a truer way.
//
// Voice: warm, funny, close third person; Maple is plucky and dramatic; comedy from the gap
// between her grand plans and the harmless truth. Theme shown, never stated. Textless 9:16 art.

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
  maple: 'characters/maple.png',
}

const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
  'frightening or scary imagery, no real monsters, nothing threatening',
  'Maple as a human; human characters',
  'a different animal; Maple losing her raccoon mask, ringed tail, or teal backpack',
]

const rawBook: Book = {
  id: 'maple-backyard-night',
  title: 'Maple and the Backyard Night',
  subtitle: 'Big ideas. Slightly questionable plans.',
  character: 'maple',
  ages: 'Ages 4+',
  minutes: 6,
  pages: [
    {
      page: 1,
      text: `Maple had a big idea and a small tent.\n\nTonight she would camp out all by herself, like a real adventurer. She had planned everything.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'a cozy little campsite in a sunny forest clearing by a calm lake, mountains behind, a small tent pitched',
        timeOfDay: 'late afternoon, warm golden light',
        action: 'Maple the young raccoon stands proudly beside her small pitched tent with her teal backpack, paws on hips, beaming, ready for her big adventure',
        emotionalBeat: 'bold, proud, brimming with confidence',
        requiredVisualFacts: ['Maple the raccoon with black bandit mask, ringed tail, cream belly, and teal backpack', 'a small pitched tent in a forest clearing by a lake', 'warm afternoon light'],
        forbiddenVisualFacts: [...forbiddenAlways, 'darkness or night yet'],
        composition: 'Maple proud and central beside her tent, lake and mountains behind, warm and inviting',
      },
    },
    {
      page: 2,
      text: `She had snacks. She had a flashlight. She had a list of Brave Things To Do.\n\nBrave adventurers, Maple was quite sure, were never, ever scared.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'inside/beside the tent at the campsite',
        timeOfDay: 'early evening, sun getting low',
        action: 'Maple sits cross-legged laying out her gear — a flashlight, a little pile of snacks, a hand-drawn checklist with no readable text — looking very organized and pleased',
        emotionalBeat: 'earnest over-preparation; comic self-importance',
        requiredVisualFacts: ['Maple with a flashlight and a small pile of snacks laid out', 'a little hand-drawn checklist with NO readable words, just marks', 'a confident, tidy, prepared pose'],
        forbiddenVisualFacts: [...forbiddenAlways, 'readable words or letters on the list', 'night yet'],
        composition: 'Maple central with her neatly arranged gear, warm low-sun light, headroom above',
      },
    },
    {
      page: 3,
      text: `But the sun went down faster than she planned.\n\nAnd the forest that had been so friendly by day turned deep and blue and very, very dark.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the campsite as night falls, forest going dark blue',
        timeOfDay: 'dusk turning to night',
        action: 'Maple sits by her tent looking around as the clearing darkens into deep blues, her confident smile fading into uncertainty, clutching her flashlight',
        emotionalBeat: 'confidence wobbling as the dark arrives',
        requiredVisualFacts: ['Maple beside her tent as the forest turns deep blue with dusk', 'she clutches her flashlight, smile fading', 'first stars appearing'],
        forbiddenVisualFacts: [...forbiddenAlways, 'truly frightening darkness (keep it soft, cozy-blue, not scary)'],
        composition: 'Maple small and central in a softening blue clearing, gentle not scary, one warm flashlight glow',
      },
    },
    {
      page: 4,
      text: `HOO, said something in a tree.\n\nMaple froze. A monster, surely. She built a wall of pinecones and hid behind it.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the night campsite',
        timeOfDay: 'night, soft moonlight',
        action: 'Maple crouches comically behind a tiny hastily-built wall of pinecones, peeking over it with wide eyes toward a tree, her flashlight beam pointing up',
        emotionalBeat: 'spooked but plucky; a very questionable plan',
        requiredVisualFacts: ['Maple hiding behind a small silly wall of pinecones', 'peeking over it with big wide eyes', 'her flashlight beam pointing up toward a tree'],
        forbiddenVisualFacts: [...forbiddenAlways, 'an actual monster', 'a scary creature'],
        composition: 'comic: tiny pinecone wall foreground, Maple peeking, soft moonlit clearing, headroom',
      },
    },
    {
      page: 5,
      text: `SNAP went a twig. CRUNCH went the leaves.\n\nMaple pulled her blanket over her head. Adventurers were not scared. So why was her tail shaking?`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the night campsite',
        timeOfDay: 'night, moonlight',
        action: 'Maple sits with a blanket pulled up over her head like a hood, only her masked face and shaking ringed tail poking out, eyes darting nervously',
        emotionalBeat: 'trying to be brave but genuinely scared; tender and funny',
        requiredVisualFacts: ['Maple with a blanket pulled over her head, face and ringed tail poking out', 'a nervous, wide-eyed expression', 'her tail visibly bushed up / shaking'],
        forbiddenVisualFacts: [...forbiddenAlways, 'anything actually threatening'],
        composition: 'Maple bundled and small in the soft-dark clearing, cozy-scared not frightening',
      },
    },
    {
      page: 6,
      text: `She almost packed up. She almost ran all the way home.\n\nThen she stopped. A real adventurer, she thought, would at least LOOK.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the night campsite, edge of the clearing',
        timeOfDay: 'night, moonlight',
        action: 'Maple stands half-turned toward home with her backpack half-on, then pauses, one paw raised, a new determined thought crossing her face',
        emotionalBeat: 'the turn: choosing to look instead of run',
        requiredVisualFacts: ['Maple pausing mid-flee with her backpack half-on', 'a determined, deciding expression', 'soft moonlit clearing'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'Maple caught in a turning pose, moonlit, calm; the decision is the focus',
      },
    },
    {
      page: 7,
      text: `So she lifted her flashlight and looked.\n\nThe HOO was just a sleepy owl, blinking down at her. "Oh," said Maple. "Hello."`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the night campsite, looking up into a tree',
        timeOfDay: 'night, moonlight',
        action: 'Maple bravely shines her flashlight up to reveal a small sleepy round owl on a branch blinking gently down; Maple looks relieved and a little sheepish',
        emotionalBeat: 'relief and gentle humor; the monster was nothing scary',
        requiredVisualFacts: ['Maple shining her flashlight up at a small friendly sleepy owl on a branch', 'the owl blinking gently, not scary', 'Maples relieved, sheepish face'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a scary or large owl; a threatening creature'],
        composition: 'flashlight beam connecting Maple below to the gentle owl above; soft and warm',
      },
    },
    {
      page: 8,
      text: `She looked at the SNAP. Just a pinecone falling.\n\nShe looked at the CRUNCH. Just her own footprints from before. The dark was full of ordinary things.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the night clearing, checking the ground',
        timeOfDay: 'night, moonlight',
        action: 'Maple crouches with her flashlight examining a fallen pinecone and a little line of her own paw prints in the dirt, understanding dawning, calmer now',
        emotionalBeat: 'understanding; the scary sounds were ordinary all along',
        requiredVisualFacts: ['Maple calmly examining a fallen pinecone and a line of paw prints with her flashlight', 'a calmer, understanding expression', 'the gentle moonlit clearing'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'Maple low and curious with her flashlight on ordinary objects; calm night',
      },
    },
    {
      page: 9,
      text: `Maple let out a long breath.\n\nMaybe brave didn't mean never being scared. Maybe brave meant looking anyway.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the night clearing beside her tent',
        timeOfDay: 'night, soft moonlight',
        action: 'Maple sits calmly outside her tent, shoulders relaxed, letting out a relieved breath, a small wise smile, her tail no longer bushed',
        emotionalBeat: 'quiet growth; making peace with being scared and brave at once',
        requiredVisualFacts: ['Maple sitting relaxed and calm outside her tent', 'a soft, relieved, slightly wiser smile', 'a peaceful moonlit clearing'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'calm centered Maple, softened posture, gentle moonlight, headroom',
      },
    },
    {
      page: 10,
      text: `And now that she was not so busy being frightened, Maple noticed something.\n\nAbove her, the whole sky was awake with stars.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the clearing, looking up at a huge starry sky',
        timeOfDay: 'night, brilliant stars',
        action: 'Maple lies back on her bedroll gazing up in wonder at a vast sky full of stars, mouth open in awe, flashlight off beside her',
        emotionalBeat: 'wonder; the dark reveals something beautiful she would never have seen at home',
        requiredVisualFacts: ['Maple lying back gazing up at a huge sky full of bright stars', 'an awed, delighted expression', 'the peaceful moonlit campsite around her'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'big beautiful starry sky filling the frame, Maple small and wonderstruck below, headroom for stars',
      },
    },
    {
      page: 11,
      text: `She stayed out all night after all.\n\nThe owl kept watch. The stars kept her company. And the dark, it turned out, was not so bad with a friend in it.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the cozy night campsite under the stars',
        timeOfDay: 'night, starry and peaceful',
        action: 'Maple sits happily wrapped in her blanket by her tent under the stars, the little owl on a branch nearby, both content and peaceful',
        emotionalBeat: 'cozy contentment; the dark is friendly now',
        requiredVisualFacts: ['Maple content and cozy in her blanket by her tent under a starry sky', 'the small friendly owl on a nearby branch', 'a warm, peaceful night mood'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery'],
        composition: 'cozy wide night scene; Maple and the distant owl both visible, stars above, calm',
      },
    },
    {
      page: 12,
      text: `In the morning, Maple packed up her tent and her snacks and her list.\n\nShe had done every Brave Thing on it — and one that wasn't: she had been scared, and stayed anyway.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'the campsite at sunrise, warm morning light returning',
        timeOfDay: 'early morning, golden sunrise',
        action: 'Maple stands proudly with her packed teal backpack and rolled tent in warm morning light, beaming, her checklist tucked under one arm, triumphant and happy',
        emotionalBeat: 'the warm, complete, happy ending: proud, grown, still herself',
        requiredVisualFacts: ['Maple with her packed teal backpack and rolled-up tent in golden morning light', 'a proud, happy, triumphant expression', 'the sunny lake and forest around her'],
        forbiddenVisualFacts: [...forbiddenAlways, 'readable words on the list', 'night'],
        composition: 'warm sunrise, Maple proud and central, the friendly forest bright around her, headroom',
      },
    },
    {
      page: 13,
      text: `Maple already had her next big idea.\n\nThe plan, of course, was slightly questionable. But that had never once stopped her — and now the dark couldn't either.`,
      art: '',
      manifest: {
        charactersPresent: ['maple'],
        location: 'a bright forest trail leading onward by the lake, morning',
        timeOfDay: 'bright cheerful morning',
        action: 'Maple sets off down a sunny forest trail with her backpack and walking stick, tail up, grinning with a new plan, adventurous and confident, the world bright ahead',
        emotionalBeat: 'the forward-looking, happy send-off: braver, bolder, off on the next adventure',
        requiredVisualFacts: ['Maple striding happily down a sunny forest trail with her backpack and a walking stick', 'a big confident grin, tail up', 'a bright, hopeful, adventurous mood'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary imagery', 'night'],
        composition: 'Maple heading off down the trail toward bright open forest, hopeful and warm, headroom',
      },
    },
  ],
}

export const book: Book = {
  ...rawBook,
  pages: rawBook.pages.map((p) => ({
    ...p,
    art: p.art || `books/maple-backyard-night/pages/page-${String(p.page).padStart(2, '0')}.png`,
  })),
}
