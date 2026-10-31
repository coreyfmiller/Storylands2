// STORYLANDS — "Pip and the First Flame"
//
// Each page carries BOTH the read-aloud prose and the illustration manifest (the
// canonical truth the image prompt is derived from). One source: the app reads this
// file and so does scripts/generate-book.mjs.
//
// Authored by scripts/create-book.mjs from the premise:
//   It is the night of the Lantern Festival in the valley, when every dragon lights a
//   lantern with their own fire. Pip can only make smoke. He has a plan to light his
//   lantern anyway and it goes wrong in a way that matters, and the thing that finally
//   lights it is not more trying.
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
  pip: 'characters/pip.png',
  lumi: 'characters/lumi.png',
}

/** Short on-model description, written into the prompt alongside the reference. */
export const CHARACTER_BIOS: Record<string, string> = {
  pip:
    'Pip, a small cute baby dragon: warm red scaled body with a soft cream / pale-gold belly and chest, a row of small dark-red curved horns and spines down his head and back, big expressive amber-brown eyes, small orange bat-like wings with a lighter membrane, four little clawed feet and a long ridged tail; a gentle, friendly, kind face',
  lumi:
    'Lumi, a cute small fluffy snowy owl (owlet): white feathers with soft grey-brown speckles and little heart-shaped spots, big round expressive amber-gold eyes, feathered white eyebrows, a tiny orange-yellow hooked beak often in a small happy smile, fluffy white wings with faint barred markings, and small orange-yellow talons; she carries a glowing star-shaped lantern',
}

// Never allowed in any illustration in this book. The first two are product rules:
// all words live in the reader's text panel, and a blank sign looks like broken art.
const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
]

const rawBook: Book = {
  id: 'pip-first-flame',
  title: 'Pip and the First Flame',
  subtitle: 'A little lantern with a very grand tail.',
  character: 'pip',
  ages: 'Ages 4–6',
  minutes: 6,
  band: 'young',
  seriesId: 'pip',
  seriesOrder: 1,
  pages: [
    {
      page: 1,
      text: `For the Lantern Festival, Pip had dressed his little tin lantern as a magnificent golden dragon.\n\nThe curly paper tail had taken all week. Tonight, every dragon would light a lantern with their own fire.\n\nPip opened his mouth.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: "Pip's cottage porch overlooking the festival valley",
        timeOfDay: 'Dusk',
        action: 'Pip proudly opens his mouth beside his elaborate, still-unlit lantern.',
        emotionalBeat: 'Grand anticipation',
        requiredVisualFacts: [
          'Pip is a small warm-red baby dragon with a pale-gold belly, dark-red horns and back spines, orange wings, amber-brown eyes, and a long ridged tail',
          'A small tin candle lantern is enclosed in a removable golden-paper dragon costume',
          'The costume has broad folded wings and an especially elaborate long curled paper tail',
          // Said "the candle inside the tin lantern is unlit" and came back lit
          // twice. A lantern in a dusk scene reads as glowing unless the glow
          // itself is forbidden, and this is page one of a book whose entire
          // premise is that he cannot light it — a lit candle here gives the
          // ending away and makes the story make no sense.
          'The candle inside the tin lantern is COMPLETELY UNLIT: a plain white wick, no flame, no spark, no glow, no warm light anywhere inside or around the lantern. The lantern is dark and the only light on it is the dusk sky',
          'Distant festival lantern lights are visible in the valley without visible additional characters',
        ],
        forbiddenVisualFacts: [
          ...forbiddenAlways,
          'Lumi',
          'flame coming from Pip',
          'additional characters',
          'any flame, spark, ember, glow or warm light inside the tin lantern',
          'light spilling from the lantern onto Pip or the porch',
        ],
        composition: 'Warm, hand-crafted picture-book art. Centre Pip and the golden lantern together, small within the porch and valley setting, with generous sky, headroom, and side margins. The lantern, including the whole curled paper tail, must be entirely inside the frame.',
        shotType: 'establishing',
      },
    },
    {
      page: 2,
      text: `Out came smoke.\n\nIt tickled his nose. Pip swatted, sneezed, and sat straight into the empty watering can. CLONK.\n\nActually, that was rather a lot of noise for no fire. He wriggled his bottom free and inspected the lantern.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: "Pip's cottage porch",
        timeOfDay: 'Dusk',
        action: 'Pip wriggles out of an empty watering can after sneezing and sitting in it.',
        emotionalBeat: 'Embarrassed surprise',
        requiredVisualFacts: [
          "Pip's hindquarters are awkwardly caught in a squat empty watering can",
          'A soft curl of harmless grey smoke hangs near his snout',
          'The golden dragon lantern stands intact and unlit beside him',
          "Pip's expression combines surprise and mild indignation",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Lumi', 'visible sound-effect lettering', 'fire from Pip', 'injury'],
        composition: "Centre Pip's comic pose and the watering can. Keep the lantern close beside him within the central safe area, with ample margin around wings and tail.",
        shotType: 'mid',
      },
    },
    {
      page: 3,
      text: `Behind the old bakehouse, oven coals still glowed beneath the ashes.\n\nPip found a little clay cup. He could carry a coal to the festival entrance, then blow it into one enormous flame.\n\nThat would surely light his candle.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'Sheltered yard behind the old stone bakehouse',
        timeOfDay: 'Early evening',
        action: 'Pip examines glowing coals in a low outdoor oven while holding an empty clay cup.',
        emotionalBeat: 'Inventive confidence',
        requiredVisualFacts: [
          'A low stone baking oven contains mostly grey ashes and a few glowing coals',
          'Pip holds a shallow, plain clay cup',
          'The elaborate golden dragon lantern rests beside him, still unlit',
          'The oven is quiet and unattended, with no additional characters',
        ],
        forbiddenVisualFacts: [
          ...forbiddenAlways,
          'Lumi',
          'a roaring oven fire',
          'a lit candle',
          'any flame, spark or glow inside the golden dragon lantern',
        ],
        // The lantern's lower body was cut off by the BOTTOM edge. On an
        // overShoulder shot the model crops low to get the viewpoint, so the
        // object that must survive has to be named rather than covered by a
        // general "generous crop margins".
        composition: "Look over Pip's shoulder toward the small glowing coals. Keep his cup and the oven opening central. The golden dragon lantern must sit WHOLE and complete well inside the frame, with clear space below it — its base and its full curled tail must not touch or cross the bottom edge.",
        shotType: 'overShoulder',
      },
    },
    {
      page: 4,
      text: `A star-shaped glow bobbed around the bakehouse.\n\n“Feathers and fluff! What a tail!” said Lumi. “I'm on my lantern round. Coming over the bridge? It's perfectly calm tonight.”\n\nShe landed beside Pip. “Though I prefer little lanterns. Less flapping about.”`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Sheltered yard behind the old stone bakehouse',
        timeOfDay: 'Early evening',
        action: "Lumi arrives carrying her glowing star-shaped lantern and lands beside Pip's elaborate lantern.",
        emotionalBeat: 'Welcoming interruption',
        requiredVisualFacts: [
          'Lumi appears for the first time',
          'Lumi is a small fluffy white owlet with grey-brown speckles, heart-shaped spots, amber-gold eyes, feathered eyebrows, and an orange-yellow beak and talons',
          'Lumi carries a glowing star-shaped lantern',
          'Lumi is smaller than Pip',
          'The sheltered yard appears still, with the paper costume hanging quietly',
          "Pip's clay cup is still empty",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'additional characters', "a visible candle or open flame inside Lumi's star lantern"],
        composition: "Centre the two friends facing each other at their correct relative sizes. Place the golden paper tail between them and Lumi's star lantern above her feet, all well inside the crop-safe area.",
        shotType: 'twoShot',
      },
    },
    {
      page: 5,
      text: `Pip explained about the enormous flame.\n\nLumi cocked her head. “Does a candle-sized wick need a dragon-sized fire?”\n\nHe peered through the golden dragon's mouth. Inside, the little white wick stood waiting. “Oh,” said Pip. “Perhaps not an enormous one.”`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Sheltered yard behind the old stone bakehouse',
        timeOfDay: 'Early evening',
        action: "Pip peers through the paper dragon's open mouth at the tiny candle wick while Lumi tilts her head beside him.",
        emotionalBeat: 'A small, surprising possibility',
        requiredVisualFacts: [
          'The paper dragon mouth is an opening that reveals the tin lantern and its small white candle',
          'The candle wick is clearly unlit and very small compared with the paper costume',
          "Pip's expression is thoughtful rather than straining",
          'Lumi watches with her head tilted and her star lantern glowing',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'fire from Pip', 'a lit candle'],
        composition: "Frame Pip's face large beside the costume opening, with Lumi's face close enough to remain central. Let the tiny wick be visible between them; retain generous headroom.",
        shotType: 'close',
      },
    },
    {
      page: 6,
      text: `Instead of a shovelful, Pip chose one little coal.\n\nHe settled its clay cup inside the tin lantern, beside the candle. Then he followed Lumi towards the bridge, carrying the golden dragon carefully.\n\n“At the meadow,” he whispered. “Just one tiny puff.”`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Path from the bakehouse to the valley footbridge',
        timeOfDay: 'Evening',
        action: 'Pip carries his elaborate lantern along the path behind Lumi and her glowing star.',
        emotionalBeat: 'Careful optimism',
        requiredVisualFacts: [
          "Pip's golden paper dragon costume remains intact",
          'Through its open mouth, a little glowing coal is visible in a shallow clay cup beside the unlit candle',
          'Lumi leads by a short distance with her star-shaped lantern',
          'A narrow wooden footbridge lies ahead',
          'The friends are walking rather than flying',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, "a lit candle in Pip's lantern", 'additional characters'],
        composition: 'Use a central path to lead the eye from the two friends to the bridge. Show both full bodies, with the lantern and bridge entrance comfortably away from the side edges.',
        shotType: 'wide',
      },
    },
    {
      page: 7,
      text: `Halfway across—WHUMP!\n\nA gust caught the paper wings. The golden dragon yanked Pip sideways. His claws grabbed the rail, but the clay cup tipped through the slats.\n\nDown went the coal. The beautiful paper wings tore from end to end.`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Middle of the low wooden footbridge',
        timeOfDay: 'Evening',
        action: 'A sudden gust catches the paper costume; Pip grips the bridge rail as the clay cup and most of its coal fall through the slats.',
        emotionalBeat: 'Sudden alarm',
        requiredVisualFacts: [
          'Pip remains on the bridge with his claws firmly gripping a rail',
          'The golden paper wings billow and tear',
          'The clay cup and its main coal fall through a gap between bridge slats',
          'A tiny glowing fragment breaks away and lands inside the tin lantern',
          'The elaborate curled paper tail remains intact',
          'Lumi braces low on the bridge with her star lantern secured',
          'The bridge crosses a shallow stream and is not dangerously high',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Pip falling from the bridge', 'injury', 'the paper costume catching fire'],
        composition: "Frame the gust and Pip's secure grip from a low angle near bridge level. Centre all action, including the tipping cup, with generous room above the billowing costume.",
        shotType: 'low',
      },
    },
    {
      page: 8,
      text: `Under the bridge, Pip laid the wreckage on a dry stone.\n\nHis grand dragon was scraps. His coal was gone. Almost.\n\nIn the tin lantern's bottom, one crumb still glimmered red. Beside it lay the perfect curly tail, untouched.`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Dry sheltered bank beneath the low footbridge',
        timeOfDay: 'Evening',
        action: 'Pip examines the damaged lantern and its tiny surviving ember while Lumi lights their sheltered spot.',
        emotionalBeat: 'Crushed disappointment with a fragile opening',
        requiredVisualFacts: [
          'Both friends are safely beneath the bridge on a dry bank beside the shallow stream',
          'The golden paper costume is torn beyond use as a complete dragon',
          'The plain tin lantern and its unlit candle remain intact',
          "One tiny red ember rests on the tin lantern's floor",
          'The elaborate curled golden paper tail remains intact beside the lantern',
          'The clay cup is absent',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'a large surviving coal', 'a lit candle', 'wet or injured characters'],
        composition: 'Look down on the small friends and their gathered wreckage, tightly grouped on the central dry stone. Keep the glowing crumb visible without enlarging it into a substantial coal.',
        shotType: 'high',
      },
    },
    {
      page: 9,
      text: `“Feathers and fluff,” Lumi said softly. “I was wrong about that bridge.”\n\nShe lowered her star lantern. Its light showed every careful curl in the tail.\n\nPip stroked the golden tip. He could take it home. Make another dragon around it.`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Dry sheltered bank beneath the footbridge',
        timeOfDay: 'Evening',
        action: 'Pip gently touches the surviving paper tail while Lumi lowers her star lantern to illuminate it.',
        emotionalBeat: 'Tender reluctance',
        requiredVisualFacts: [
          'Pip touches the carefully curled golden paper tail with one small claw',
          'His face shows how much he values it',
          'Lumi holds her star lantern low with an apologetic expression',
          'The intact tin lantern and tiny ember remain nearby',
          'Torn paper wings are gathered behind the intact tail',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'a restored paper dragon', 'a lit candle', "flame inside Lumi's star lantern"],
        composition: "Bring Pip's face and the golden tip close together at centre, with Lumi's face and lowered star just behind. Preserve breathing room around both heads.",
        shotType: 'close',
      },
    },
    {
      page: 10,
      text: `Instead, Pip uncurled the tail.\n\nSlowly, carefully, he tore off a long golden strip and tucked its edge against the ember. Lumi cupped her wings around the lantern.\n\nNeither of them blew. The paper browned. Curled. Then a tiny flame stood up.`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Dry sheltered bank beneath the footbridge',
        timeOfDay: 'Evening',
        action: 'Pip feeds a strip torn from his treasured paper tail to the ember while Lumi shields the lantern with her wings.',
        emotionalBeat: 'Costly commitment',
        requiredVisualFacts: [
          'The once-perfect curled tail has been deliberately uncurled and torn',
          'One end of a long golden paper strip touches the ember inside the tin lantern',
          'A tiny flame has begun at that end of the strip',
          'Pip holds only the far, unburnt end',
          'Lumi cups her wings outside the lantern as a windbreak, safely clear of the flame',
          'Both characters have relaxed closed mouths and are not blowing',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, "fire coming from Pip's mouth", 'a large blaze', 'flames touching feathers or claws', 'an intact curled paper tail'],
        composition: 'Make the small flame, torn golden strip, and helping claws and wings the central detail. Include partial faces above the lantern, with ample crop-safe margin around all essential actions.',
        shotType: 'detail',
      },
    },
    {
      page: 11,
      text: `Pip tipped the burning strip towards the wick. A little blue foot. A yellow head.\n\nHis candle caught. “Oh,” he breathed.\n\nThe golden paper crumbled into ash, but the candle kept burning inside the small, bare lantern. Pip watched until his shoulders softened.`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Dry sheltered bank beneath the footbridge',
        timeOfDay: 'Nightfall',
        action: 'The candle catches from the burning paper strip, and Pip relaxes as its flame becomes steady.',
        emotionalBeat: 'Quiet wonder and release',
        requiredVisualFacts: [
          "The candle in Pip's tin lantern is now clearly lit with a small steady flame",
          'The spent golden strip crumbles into ash inside the tin lantern',
          'The remaining damaged paper costume is detached and lies well away from the flame',
          "Pip's shoulders relax and his eyes reflect the candlelight",
          'Lumi watches beside him with her glowing star lantern',
          'The candle flame is the only flame in the scene',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'a flame shaped as a person', 'fire from Pip', 'a restored golden paper costume', 'paper scraps burning outside the tin lantern'],
        composition: 'Frame Pip from the knees up, his face and the small lit lantern centrally aligned. Include Lumi beside him and allow the candlelight to warm both faces without losing the sheltered setting.',
        shotType: 'mid',
      },
    },
    {
      page: 12,
      text: `At the festival meadow, lanterns shone like a second sky. Pip set his little tin lantern among them.\n\n“Feathers and fluff,” said Lumi. “Room for one more?”\n\nHe shuffled his lantern sideways, and she set her star beside it.`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Lantern Festival meadow',
        timeOfDay: 'Night',
        action: "Pip makes space beside his lit tin lantern for Lumi's glowing star lantern.",
        emotionalBeat: 'Happy belonging',
        requiredVisualFacts: [
          "Pip's small bare tin lantern is clearly lit",
          'Lumi places her glowing star lantern immediately beside it',
          'Many other lit lanterns rest on stones or hang from tree branches in the meadow',
          'No additional characters are visible',
          "Pip's lantern has no golden paper dragon costume",
          'Pip is pleased and attentive to making room',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'additional characters', "an unlit candle in Pip's lantern", 'floating lanterns released into the sky'],
        composition: 'Show both friends full-body at the centre of a warmly glowing meadow. Keep their two adjacent lanterns prominent in the foreground, with other lights forming a soft surrounding canopy and ample margins.',
        shotType: 'wide',
      },
    },
    {
      page: 13,
      text: `When Lumi lifted her star for the next part of her round, Pip picked up his lantern too.\n\n“Tomorrow as well?” he asked. “Tomorrow as well.”\n\nPip held his little flame low over the path and made room for her beside him.`,
      art: '',
      manifest: {
        charactersPresent: ['pip', 'lumi'],
        location: 'Gentle path leaving the festival meadow',
        timeOfDay: 'Night',
        action: 'Pip holds his lit lantern low to illuminate the path while making space for Lumi to walk beside him.',
        emotionalBeat: 'Warm companionship looking forward',
        requiredVisualFacts: [
          'Pip is the visual focus and is clearly present',
          'Pip carries his small bare tin lantern with its candle still steadily burning',
          'He holds the lantern low enough to illuminate the path ahead of both friends',
          'Lumi walks beside him carrying her glowing star lantern',
          'Their shoulders are comfortably close at their correct relative heights',
          'Festival lanterns glow softly behind them',
          'The path ahead is gentle, welcoming, and clearly visible',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'an extinguished candle', 'the golden paper dragon costume', 'additional characters', 'a threatening or obscured path'],
        composition: 'Centre the friends walking together, with Pip slightly forward and his small lantern lighting their shared next steps. Keep both faces visible in three-quarter view, generous headroom above, and all important detail away from side edges.',
        shotType: 'twoShot',
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
    art: p.art || pageArt('pip-first-flame', p.page),
  })),
}
