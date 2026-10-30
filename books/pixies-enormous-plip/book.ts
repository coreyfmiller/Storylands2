// STORYLANDS — "Pixie's Enormous Plip"
//
// Each page carries BOTH the read-aloud prose and the illustration manifest (the
// canonical truth the image prompt is derived from). One source: the app reads this
// file and so does scripts/generate-book.mjs.
//
// Authored by scripts/create-book.mjs from the premise:
//   Pixie is certain something enormous has to happen today for the day to count, and she
//   spends it chasing one big spectacular thing after another while missing the small ones
//   happening right beside her. Tilly the owl keeps noticing the small things Pixie flies
//   straight past.
//
// Reviewed and edited by hand afterwards — the generator clears the mechanical bar
// (word budget, textless art, the ending resting on the hero); whether it is any
// GOOD is still a human call. See .kiro/steering/product-standard.md.

import { pageArt, type Book, type BookPage, type IllustrationManifest } from '../types.ts'

// Re-exported so anything that imported these from this module still resolves.
export type { Book, BookPage, IllustrationManifest }

/**
 * Approved reference art, seeded into every page prompt that character appears on.
 * Paths resolve against assets/ — these are generation masters and are not served.
 */
export const CHARACTER_REFS: Record<string, string> = {
  pixie: 'characters/pixie.png',
  tilly: 'characters/Tilly.png',
}

/** Short on-model description, written into the prompt alongside the reference. */
export const CHARACTER_BIOS: Record<string, string> = {
  pixie:
    'Pixie, a cute small butterfly: a soft cream-and-tan furry body with darker brown markings down her abdomen, large rounded wings patterned in lilac-purple, pale blue and cream with soft yellow spots, fine pink-red veining and a thin warm gold edge, two long curling gold antennae each tipped with a tiny point of light, a small round cream face with very large dark eyes ringed in amber, soft eyelashes, rosy cheeks and a tiny smiling mouth, and two small teardrop-shaped tails hanging from her lower wings',
  tilly:
    'Tilly, a small brown owl: soft mottled brown and buff feathers with a paler speckled chest, large round amber-gold eyes, tufted ears, a small grey-black hooked beak and a calm, gently knowing expression; she is roughly the same height as Nibs',
}

// Never allowed in any illustration in this book. The first two are product rules:
// all words live in the reader's text panel, and a blank sign looks like broken art.
const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
]

const rawBook: Book = {
  id: 'pixies-enormous-plip',
  title: "Pixie's Enormous Plip",
  subtitle: 'One enormous plan. One very small pond.',
  character: 'pixie',
  ages: 'Ages 4+',
  minutes: 5,
  pages: [
    {
      page: 1,
      text: `Pixie woke beneath a clover leaf with an enormous plan.\n\n“Something BIG must happen today,” she said. “Something worth telling tomorrow.”\n\nBeside her, a dewdrop slipped down a stem. Pixie was already looking over the hill.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie'],
        location: 'Clover patch below a low garden hill',
        timeOfDay: 'Early morning',
        action: 'Pixie hovers above her clover-leaf sleeping place, looking toward the hill while a tiny dewdrop slides down a stem beside her.',
        emotionalBeat: 'Grand anticipation',
        requiredVisualFacts: [
          "Pixie's canonical butterfly appearance",
          'A dewdrop visibly sliding down a nearby clover stem',
          'A low hill beyond the clover',
          "Pixie's attention directed away from the droplet",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Tilly or any additional character'],
        composition: 'Vertical 9:16 establishing composition with Pixie and the droplet within the central safe area, generous canopy and sky above, and ample margins around all important elements.',
        shotType: 'establishing',
      },
    },
    {
      page: 2,
      text: `In Bluebell Hollow, she found the biggest bell.\n\n“One enormous DONG, please!” She pulled its rim. The flower sprang back and powdered her face yellow.\n\nPixie wiped her mouth. Even her sneeze tasted flowery.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie'],
        location: 'Bluebell Hollow',
        timeOfDay: 'Early morning',
        action: 'A flexed bluebell springs upright after Pixie releases its rim, puffing yellow pollen across her surprised face.',
        emotionalBeat: 'Spluttering indignation',
        requiredVisualFacts: [
          'One oversized bluebell on a flexible curved stem',
          'Pixie hovering immediately beside its opening',
          "A small yellow pollen cloud across Pixie's mouth and cheeks",
          "Pixie's wings remain clean and recognizable",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'A manufactured bell', 'Tilly or any additional character'],
        composition: "Centre Pixie's upper body and the bluebell opening together, leaving generous headroom and side margins for the pollen cloud within the vertical crop.",
        shotType: 'mid',
      },
    },
    {
      page: 3,
      text: `On Thistle Ridge, a fluffy seed head promised a magnificent WHOOSH.\n\nPixie charged straight through it. The seeds hardly travelled at all. Most stuck to her bottom.\n\nShe flew away wearing a pair of enormous fluffy trousers.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie'],
        location: 'Thistle Ridge',
        timeOfDay: 'Morning',
        action: 'Pixie flies away from a partly dispersed thistle seed head with loose white seed fluff clustered around her lower abdomen.',
        emotionalBeat: 'Ridiculous disappointment',
        requiredVisualFacts: [
          'A natural thistle seed head with some seeds missing',
          "Seed fluff forming a trouser-like cluster around Pixie's lower abdomen",
          'The fluffy trousers are loose plant seeds, not clothing',
          "Pixie's wings and tiny wing tails remain visible",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Actual trousers or other clothing', 'Tilly or any additional character'],
        composition: "Show Pixie's full body centrally against open sky, with the seed head below her and generous clear margins around the comic silhouette.",
        shotType: 'wide',
      },
    },
    {
      page: 4,
      text: `Down by the little pond, the last seeds floated off.\n\n“An enormous splash,” Pixie decided. “I’ll make the WHOLE pond move.”\n\nA drop fell from the bank grass. A ring spread beside her. She looked for something bigger.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie'],
        location: 'Grassy bank of a small sheltered garden pond',
        timeOfDay: 'Morning',
        action: 'Pixie scans the bank for a large object while a fresh circular ripple expands from a fallen dewdrop beside her.',
        emotionalBeat: 'Impatient ambition',
        requiredVisualFacts: [
          'A small, still garden pond with its opposite bank visible',
          'Dew-bearing grass arching over the water',
          'One clearly visible circular ripple below a wet grass tip',
          'The last few loose thistle seeds drifting away from Pixie',
          'A large fallen dock leaf resting farther along the bank',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Tilly or any additional character', 'Large waves or a splash caused by Pixie'],
        composition: "Frame over Pixie's shoulder toward the central pond; keep the small ripple, dewy grass, and fallen leaf safely inside the central crop with ample breathing room.",
        shotType: 'overShoulder',
      },
    },
    {
      page: 5,
      text: `There! A fallen dock leaf, broad as a blanket.\n\nPixie hauled it towards the water. It scraped. It snagged. It collected an impressive amount of mud.\n\n“This,” she puffed, “will be a splash with elbows.”`,
      art: '',
      manifest: {
        charactersPresent: ['pixie'],
        location: 'Muddy strip along the garden pond',
        timeOfDay: 'Morning',
        action: "Pixie grips the dry dock leaf's stalk with her forefeet and pulls backward, dragging its broad blade through sticky mud toward the pond.",
        emotionalBeat: 'Puffed-up determination',
        requiredVisualFacts: [
          'The same large fallen dock leaf introduced on the previous page',
          'Dry brittle leaf edges and an intact central blade',
          "Mud accumulated along the leaf's trailing edge",
          'Pixie exerting herself without human hands',
          'Pond water immediately beyond the muddy strip',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Literal elbows on the leaf', 'Tilly or any additional character'],
        composition: 'Use a low viewpoint to make the leaf feel enormous beside Pixie; keep her, the stalk, and the muddy leading edge centrally grouped with generous headroom.',
        shotType: 'low',
      },
    },
    {
      page: 6,
      text: `Tilly landed on a mossy root. “Well, now. You’re moving half the bank.”\n\n“I’m making an enormous splash.”\n\n“I prefer plips,” said Tilly. “You can hear the next one coming.” Pixie gave the leaf another mighty heave.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie', 'tilly'],
        location: 'Mossy root beside the garden pond',
        timeOfDay: 'Morning',
        action: 'Tilly has just landed on a low mossy root and watches Pixie pull the muddy leaf toward the water.',
        emotionalBeat: 'Companionable disagreement',
        requiredVisualFacts: [
          "Tilly's canonical mottled brown and buff owl appearance",
          'Tilly newly arrived on a moss-covered root',
          'Tilly naturally much larger than the small butterfly',
          'Pixie still gripping the dock leaf stalk',
          'The same muddy, intact dock leaf',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Additional characters', 'Tilly pulling or carrying the leaf'],
        composition: 'Place both characters centrally at their natural relative scale, with Tilly perched low enough to face Pixie; preserve generous margins around both silhouettes.',
        shotType: 'twoShot',
      },
    },
    {
      page: 7,
      text: `A breeze lifted the leaf. Pixie pulled harder. Its edge caught on a stiff reed.\n\nRrrrrip.\n\nInstead of an enormous splash, she had an enormous hole. Through it, she could see the pond doing absolutely nothing.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie', 'tilly'],
        location: 'Reedy edge of the garden pond',
        timeOfDay: 'Morning',
        action: 'The lifted dock leaf catches on a stiff reed and tears open as Pixie pulls; Tilly remains on the mossy root behind her.',
        emotionalBeat: 'Deflated shock',
        requiredVisualFacts: [
          'A large fresh tear through the dock leaf',
          'A stiff reed protruding through the torn area',
          "Pixie's forefeet still holding the stalk",
          'Still pond water visible through the hole',
          'Tilly observing without intervening',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Pixie trapped or injured', 'An enormous splash', 'Additional characters'],
        composition: "Make the torn leaf and Pixie's small gripping forefeet the central focus, with calm water visible through the hole and Tilly softly readable behind; keep the entire tear away from crop edges.",
        shotType: 'detail',
      },
    },
    {
      page: 8,
      text: `Pixie let go. The ruined leaf slumped onto the mud.\n\n“Nothing enormous,” she whispered. “Not one thing.”\n\nTilly tucked her feet beneath her feathers. “Well, now. What happened beside you while you were looking for that leaf?”`,
      art: '',
      manifest: {
        charactersPresent: ['pixie', 'tilly'],
        location: 'Muddy bank beneath the mossy root',
        timeOfDay: 'Morning',
        action: 'Pixie sits small beside the collapsed torn leaf while Tilly settles on the nearby root and gently addresses her.',
        emotionalBeat: 'Discouragement interrupted by curiosity',
        requiredVisualFacts: [
          'The torn dock leaf collapsed on mud',
          "Pixie's lowered posture and empty forefeet",
          'Tilly perched nearby with feet tucked beneath her feathers',
          'Dewy bank grass still visible over the pond',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Tilly fixing the leaf or demonstrating a solution', 'Additional characters'],
        composition: 'Look down gently on Pixie and the oversized ruined leaf, with Tilly on the root within the same central safe area; leave open water and generous margin around the small figures.',
        shotType: 'high',
      },
    },
    {
      page: 9,
      text: `For once, Pixie looked down instead of up.\n\n“The drop,” she said slowly. “It made a ring.”\n\nShe watched a bead of dew swell on a grass tip. “That ring kept getting bigger. Without getting any heavier.”`,
      art: '',
      manifest: {
        charactersPresent: ['pixie'],
        location: "Dewy grass at the pond's edge",
        timeOfDay: 'Morning',
        action: 'Pixie studies a bead of dew hanging from a grass tip, her expression changing from disappointment to focused realization.',
        emotionalBeat: 'A dawning possibility',
        requiredVisualFacts: [
          "Pixie's face and attentive downward gaze",
          'One distinct bead of dew on an arching grass tip',
          'A softly visible strip of still water below',
          "Pixie's forefeet not yet touching the grass",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Thought bubbles or diagrams', 'Tilly or any additional character', 'An already falling droplet'],
        composition: "Centre Pixie's head and shoulders with the dew bead close beneath her gaze; preserve clear space around her antennae and a generous margin below the droplet.",
        shotType: 'close',
      },
    },
    {
      page: 10,
      text: `She settled lightly on the blade of grass. No charging. No hauling. Just one careful lean.\n\nThe bead stretched into a tiny pear, let go, and fell.\n\nPlip. Pixie stayed perfectly still to see what happened next.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie'],
        location: 'Arching grass blade above the garden pond',
        timeOfDay: 'Morning',
        action: "Pixie's weight gently bends the grass blade, releasing its single dewdrop toward the water below.",
        emotionalBeat: 'Delicate suspense',
        requiredVisualFacts: [
          'Pixie perched lightly on the grass blade',
          'The blade bending under her small weight',
          'One released droplet falling just above the pond surface',
          "Pixie's wings held clear of the water",
          'No other disturbance on the pond',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Tilly or any additional character', 'Pixie falling into the pond', 'Multiple falling drops'],
        composition: "Frame the grass tip, Pixie's forefeet, and the falling droplet large in the centre, with sufficient water beneath and generous margins around the action.",
        shotType: 'detail',
      },
    },
    {
      page: 11,
      text: `One ring opened. Then another. They widened past a floating petal, past the reed, right out to the opposite bank.\n\nThe whole little pond was moving.\n\nPixie’s enormous thing had arrived without so much as a WHOOSH.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie', 'tilly'],
        location: 'The whole sheltered garden pond',
        timeOfDay: 'Morning',
        action: "Concentric ripples from Pixie's droplet spread across the small pond to its banks while Pixie watches from the bent grass and Tilly watches from her root.",
        emotionalBeat: 'Expansive wonder',
        requiredVisualFacts: [
          'A genuinely small pond, with both banks visible',
          'Broad concentric ripples sharing one origin below the grass tip',
          'Ripples reaching the far bank',
          'A single floating petal and the established reed',
          'Pixie on the grass and Tilly on the mossy root',
          'The torn leaf remains abandoned on the near bank',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Huge ocean waves or an explosive splash', 'Magical light causing the ripples', 'Additional characters'],
        composition: 'Show the pond as a central oval in a vertical wide view, with ripples readable across its full surface; keep both friends and both banks comfortably inside generous crop margins.',
        shotType: 'wide',
      },
    },
    {
      page: 12,
      text: `“Well, now,” said Tilly. “That was a very good plip.”\n\nAnother broad leaf lay nearby. Pixie stepped around it and settled beside her friend.\n\n“Listen,” she whispered. They waited together until the next small drop was ready.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie', 'tilly'],
        location: 'Mossy root beside the pond',
        timeOfDay: 'Morning',
        action: 'Pixie settles beside Tilly on the mossy root, leaving another broad fallen leaf untouched as both listen toward the dewy grass.',
        emotionalBeat: 'Contented restraint',
        requiredVisualFacts: [
          'Pixie and Tilly sitting companionably at their established relative sizes',
          'An intact broad fallen leaf nearby, deliberately untouched',
          'Dew-bearing grass above the water',
          'Soft remaining ripples on the pond',
          "Pixie's relaxed wings and attentive posture",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Pixie dragging the new leaf', 'Tilly applauding or awarding a prize', 'Additional characters'],
        composition: 'Centre the two friends together on the mossy root, facing partly toward each other and partly toward the water; keep the untouched leaf and dewy grass within generous margins.',
        shotType: 'twoShot',
      },
    },
    {
      page: 13,
      text: `Plip. A fresh ring spread towards their reflections.\n\n“Tomorrow,” Pixie said, “shall we sit here again?” “Certainly. This root fits us nicely.”\n\nPixie nestled beside Tilly’s warm feathers. Together they watched the little pond grow wide with circles.`,
      art: '',
      manifest: {
        charactersPresent: ['pixie', 'tilly'],
        location: 'Mossy pondside root overlooking the water',
        timeOfDay: 'Bright morning',
        action: "Pixie nestles beside Tilly's feathers on the root while a new set of gentle ripples expands toward their reflections.",
        emotionalBeat: "Warm belonging and tomorrow's promise",
        requiredVisualFacts: [
          'Pixie clearly visible beside Tilly',
          "Comfortable physical closeness without obscuring Pixie's wings",
          "Both friends' reflections in the pond",
          'Fresh expanding circular ripples approaching the reflections',
          'Soft morning light and living green bank plants',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Additional characters', 'A departing or lonely protagonist', 'Storm clouds or threatening water'],
        composition: 'Frame from just behind the two centrally seated friends, showing their companionable silhouettes above and their reflections and widening circles below; leave generous headroom and safe margins around every important detail.',
        shotType: 'overShoulder',
      },
    },
  ],
}

// `art` is derived, never written by hand: pageArt owns the directory, the zero
// padding and the file extension, so changing the image format is one edit.
export const book: Book = {
  ...rawBook,
  pages: rawBook.pages.map((p) => ({
    ...p,
    art: p.art || pageArt('pixies-enormous-plip', p.page),
  })),
}
