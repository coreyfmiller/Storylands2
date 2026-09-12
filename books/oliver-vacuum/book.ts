// STORYLANDS — Book #2: "Oliver vs. The Vacuum"
// Second book, built via the book-production pipeline as the real consistency test.
// Each page carries BOTH the prose (what the reader reads) and the illustration manifest
// (canonical truth the image prompt is derived from).
//
// Story spine (see book-production steering): want (protect the house from the loud monster)
// -> flaw (treats a harmless machine as a real enemy; misreads it) -> escalating campaign
// (bark, hide, ambush, guard) -> the monster is put away and Oliver "wins" (midpoint) -> but
// the mess it cleaned was his, and his family is not afraid of it (the turn) -> Oliver stops
// fighting and WATCHES, and works out it is helping, not attacking (he solves it himself) ->
// he makes peace and naps beside it (quiet change) -> happy ending: still himself (one last
// bark) but now brave AND at peace, close with his family.
//
// Voice: warm, playful narrator; Oliver's thoughts are dramatic and earnest (he believes he
// is a heroic guard dog); comedy comes from the gap between his epic framing and the ordinary
// reality. Textless 9:16 art; the words live only in the reader's text panel.

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
  oliver: 'characters/oliver.png',
}

// Oliver's identity invariants, passed into every prompt so he stays on-model.
const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
  'frightening or dark imagery',
  'Oliver wearing clothing',
  'a different dog breed or color; Oliver losing his red collar with the gold bone tag',
]

const rawBook: Book = {
  id: 'oliver-vacuum',
  title: 'Oliver vs. The Vacuum',
  subtitle: 'Same dog. New disasters.',
  character: 'oliver',
  ages: 'Ages 4+',
  minutes: 6,
  pages: [
    {
      page: 1,
      text: `Oliver had one job in this house: keep everyone safe.\n\nHe was very good at it. He had never once let a squirrel into the kitchen.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'a cozy sunlit family living room with wood floors and a big soft couch',
        timeOfDay: 'bright morning',
        action: 'Oliver sits proudly and alertly in the middle of the living room, chest puffed out, on duty like a small heroic guard',
        emotionalBeat: 'proud, self-important, lovable',
        requiredVisualFacts: ['Oliver sitting proudly and alert', 'a warm tidy family living room', 'morning sunlight through a window'],
        forbiddenVisualFacts: [...forbiddenAlways, 'the vacuum cleaner', 'a mess'],
        composition: 'Oliver centered, heroic little posture, warm room around him',
      },
    },
    {
      page: 2,
      text: `Then, one Saturday, the closet door opened.\n\nAnd out came the Monster.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room, near an open hall closet',
        timeOfDay: 'morning',
        action: 'Oliver freezes and stares in alarm as an upright vacuum cleaner is pulled out of an open closet; his ears are up, eyes wide',
        emotionalBeat: 'sudden alarm and dramatic dread',
        requiredVisualFacts: ['an ordinary upright vacuum cleaner coming out of a closet', 'Oliver frozen and staring, ears up, eyes wide', 'the living room'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a real monster', 'human faces in close detail'],
        composition: 'the vacuum prominent as the "threat"; Oliver small and alert facing it',
      },
    },
    {
      page: 3,
      text: `It was tall. It had a long tail. And when it woke up, it ROARED.\n\nNobody else seemed worried. That, thought Oliver, was the scariest part.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room',
        timeOfDay: 'morning',
        action: 'The vacuum is upright with its cord trailing like a tail; Oliver crouches low and braced, barking at it, fur bristling comically',
        emotionalBeat: 'brave terror; convinced it is dangerous',
        requiredVisualFacts: ['the upright vacuum with a long trailing cord like a tail', 'Oliver crouched low and barking bravely', 'a comic sense of a standoff'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a real monster', 'the vacuum with a scary face'],
        composition: 'low dramatic angle, Oliver squared off against the tall vacuum',
      },
    },
    {
      page: 4,
      text: `Oliver knew exactly what to do. He barked his biggest, bravest bark.\n\nThe Monster did not even flinch.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room',
        timeOfDay: 'morning',
        action: 'Oliver barks with his whole body, front paws off the ground, at the unbothered vacuum standing still',
        emotionalBeat: 'full effort, comic futility',
        requiredVisualFacts: ['Oliver mid-bark with huge effort, paws bouncing', 'the vacuum standing completely still and unbothered', 'the living room'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a real monster'],
        composition: 'Oliver in energetic motion; the vacuum calm and immovable beside him',
      },
    },
    {
      page: 5,
      text: `So he made a plan.\n\nHe hid behind the couch. He hid under the table. He watched from behind a very brave houseplant.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the bright living room, beside a leafy potted houseplant',
        timeOfDay: 'midday',
        action: 'Oliver playfully peeks out from beside a leafy potted houseplant with a curious happy expression, one ear flopped, the household vacuum cleaner standing quietly across the tidy room',
        emotionalBeat: 'playful, curious, gently comic',
        requiredVisualFacts: ['Oliver peeking out from beside a leafy potted houseplant with a curious happy face', 'the ordinary household vacuum cleaner standing across the room', 'a bright cheerful living room'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'plant in the foreground with Oliver peeking beside it; the vacuum cleaner further back',
      },
    },
    {
      page: 6,
      text: `He guarded the hallway. He guarded his bowl. He guarded the one sock he was definitely not supposed to have.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room floor, near his food bowl',
        timeOfDay: 'afternoon',
        action: 'Oliver lies protectively over a small pile of his treasures — his food bowl and a single stolen sock — chin down, eyes up and watchful',
        emotionalBeat: 'earnest, guarding, a little guilty about the sock',
        requiredVisualFacts: ['Oliver lying protectively over his food bowl and one lone sock', 'a watchful, slightly guilty expression', 'the living room'],
        forbiddenVisualFacts: [...forbiddenAlways, 'the vacuum in this frame', 'a real monster'],
        composition: 'Oliver low and protective over his little hoard, warm afternoon light',
      },
    },
    {
      page: 7,
      text: `And then, at last, the Monster went quiet.\n\nSomeone rolled it back into the closet. The door clicked shut.\n\nOliver had won.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room, in front of the now-closed closet door',
        timeOfDay: 'late afternoon',
        action: 'Oliver stands tall and triumphant in front of the closed closet door where the vacuum has been put away, chest out, one paw raised like a little champion',
        emotionalBeat: 'triumph and pride (false victory / midpoint)',
        requiredVisualFacts: ['a closed closet door', 'Oliver standing proud and triumphant in front of it', 'a victorious little posture'],
        forbiddenVisualFacts: [...forbiddenAlways, 'the vacuum visible', 'a real monster'],
        composition: 'Oliver heroic and central; the shut closet door behind him',
      },
    },
    {
      page: 8,
      text: `But that night, the house felt strange.\n\nOliver walked through the rooms. Something was different, and he could not say what.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room and hallway at night, soft lamplight',
        timeOfDay: 'night',
        action: 'Oliver walks slowly through the dim, quiet house looking around, thoughtful and a little unsettled, tail low',
        emotionalBeat: 'quiet unease; something is off',
        requiredVisualFacts: ['Oliver walking through a dim quiet house at night', 'soft warm lamplight', 'a thoughtful, searching expression, tail low'],
        forbiddenVisualFacts: [...forbiddenAlways, 'scary shadows or frightening imagery', 'the vacuum'],
        composition: 'wider quiet interior, small Oliver mid-room, cozy not scary night light',
      },
    },
    {
      page: 9,
      text: `In the morning he understood. The floor was covered in crumbs — HIS crumbs, from a week of very important guarding.\n\nThe house needed the Monster.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room floor in the morning, scattered with crumbs and fluff',
        timeOfDay: 'morning',
        action: 'Oliver looks down at a floor scattered with crumbs, kibble bits and fluff, ears drooping slightly in dawning realization that the mess is his',
        emotionalBeat: 'sheepish realization; he caused this',
        requiredVisualFacts: ['a floor scattered with crumbs, kibble and bits of fluff', 'Oliver looking down at the mess with drooping ears', 'a sheepish, dawning expression'],
        forbiddenVisualFacts: [...forbiddenAlways, 'the vacuum in this frame'],
        composition: 'Oliver small above a comically messy floor, morning light',
      },
    },
    {
      page: 10,
      text: `The closet opened. The Monster came out.\n\nThis time, Oliver did not bark.\n\nThis time, he watched.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the tidy living room, the household vacuum cleaner standing out again',
        timeOfDay: 'bright morning',
        action: 'Oliver sits calmly and cheerfully and looks at the ordinary household vacuum cleaner with friendly curiosity, head tilted, ears perked, a gentle happy expression',
        emotionalBeat: 'warm, gentle, curious; a happy calm moment',
        requiredVisualFacts: ['an ordinary household upright vacuum cleaner standing in the room', 'Oliver sitting calmly with a friendly curious tilt of the head', 'a bright cheerful mood'],
        forbiddenVisualFacts: [...forbiddenAlways],
        composition: 'Oliver near the vacuum cleaner, calm and curious, bright cheerful room',
      },
    },
    {
      page: 11,
      text: `The Monster hummed across the floor. Wherever it went, the crumbs disappeared.\n\nIt was not chasing anyone. It was cleaning up.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room, mid-clean',
        timeOfDay: 'morning',
        action: 'The vacuum moves across the floor leaving a clean stripe behind it; Oliver trots alongside a step behind, watching the crumbs vanish with dawning understanding',
        emotionalBeat: 'understanding; the enemy was never an enemy',
        requiredVisualFacts: ['the vacuum leaving a clean stripe on the messy floor', 'Oliver following a step behind watching the crumbs disappear', 'a look of understanding'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a real monster'],
        composition: 'the clean path behind the vacuum clearly visible; Oliver following, curious',
      },
    },
    {
      page: 12,
      text: `So Oliver made a new plan.\n\nHe would let the Monster help. He would even supervise.\n\nSomeone, after all, had to be in charge.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room, now tidy',
        timeOfDay: 'midday',
        action: 'Oliver walks proudly right beside the moving vacuum like a supervisor escorting it, tail up, clearly having decided they are a team now',
        emotionalBeat: 'peace, teamwork, restored self-importance (comic)',
        requiredVisualFacts: ['Oliver walking proudly alongside the vacuum like its supervisor', 'a tidy clean floor', 'a confident, cooperative mood'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a real monster'],
        composition: 'Oliver and the vacuum side by side, a comic "team", tidy bright room',
      },
    },
    {
      page: 13,
      text: `When the work was done, the Monster went back to its closet for a rest.\n\nOliver curled up nearby, just in case it needed him.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the living room, beside the closet, warm afternoon',
        timeOfDay: 'warm afternoon',
        action: 'Oliver lies curled up and content on the floor near the closed closet where the vacuum rests, relaxed and dozing, at peace',
        emotionalBeat: 'peace and contentment; the truce',
        requiredVisualFacts: ['Oliver curled up contentedly near the closet', 'a relaxed, peaceful, dozing posture', 'warm cozy afternoon light'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a real monster'],
        composition: 'cozy, warm, Oliver settled and content near the closet door',
      },
    },
    {
      page: 14,
      text: `The house was clean. The family was happy. And Oliver was, once again, a hero.\n\nHe still barked at the Monster now and then.\n\nJust so it knew who was boss.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'the cozy tidy living room with the family feeling near, warm golden light',
        timeOfDay: 'warm golden evening',
        action: 'Oliver sits happily and proudly in the clean, warm living room, mid-cheerful-bark with a wagging tail, content and beloved, home feeling safe and cozy',
        emotionalBeat: 'the warm, complete, happy ending: brave, at peace, and loved; still himself',
        requiredVisualFacts: ['Oliver sitting happily and proudly in a clean cozy living room', 'a cheerful open-mouthed bark and a wagging tail', 'warm golden light and a safe, happy home feeling'],
        forbiddenVisualFacts: [...forbiddenAlways, 'a real monster', 'a mess'],
        composition: 'warm, bright, happy final image; Oliver joyful and at home, glowing evening light',
      },
    },
  ],
}

// Fill each page's art path from its page number (matches scripts/generate-book.mjs output).
export const book: Book = {
  ...rawBook,
  pages: rawBook.pages.map((p) => ({
    ...p,
    art: p.art || `books/oliver-vacuum/pages/page-${String(p.page).padStart(2, '0')}.png`,
  })),
}
