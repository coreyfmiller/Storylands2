// STORYLANDS — "Tilly’s Winter Map"
//
// Each page carries BOTH the read-aloud prose and the illustration manifest (the
// canonical truth the image prompt is derived from). One source: the app reads this
// file and so does scripts/generate-book.mjs.
//
// Authored by scripts/create-book.mjs from the premise:
//   Tilly the owl has spent all autumn watching Nibs the squirrel bury things, and she has
//   quietly kept a mental map of every single hiding place in the clearing. When the first
//   frost comes and Nibs cannot find a thing, Tilly realises her map is the most useful
//   thing in the wood - and that telling him everything at once would take away the only
//   thing he actually enjoys. She has to work out how to help someone without doing it for
//   them.
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
  tilly: 'characters/tilly.png',
  nibs: 'characters/nibs.png',
}

/** Short on-model description, written into the prompt alongside the reference. */
export const CHARACTER_BIOS: Record<string, string> = {
  tilly:
    'Tilly, a small brown owl: soft mottled brown and buff feathers with a paler speckled chest, large round amber-gold eyes, tufted ears, a small grey-black hooked beak and a calm, gently knowing expression; she is roughly the same height as Nibs',
  nibs:
    'Nibs, a cute young red squirrel: bright red-orange fur with a cream/white muzzle, chest and belly, a very large bushy red-orange tail, tall tufted ears with lighter insides, big dark expressive eyes, small freckles across the muzzle and two prominent front teeth in an eager grin',
}

// Never allowed in any illustration in this book. The first two are product rules:
// all words live in the reader's text panel, and a blank sign looks like broken art.
const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
]

const rawBook: Book = {
  id: 'tillys-winter-map',
  title: 'Tilly’s Winter Map',
  subtitle: 'Every nut in the clearing, and a map only Tilly can see.',
  character: 'tilly',
  ages: 'Ages 4–6',
  minutes: 6,
  band: 'young',
  seriesId: 'crooked-root',
  seriesOrder: 2,
  // Textless and portrait, so the reader draws the real title over it. See
  // bookCoverArt in ../types.ts and scripts/generate-cover.mjs.
  cover: 'books/tillys-winter-map/cover.webp',
  pages: [
    {
      page: 1,
      text: `Tilly had a whole winter map tucked behind her eyes. Every nut Nibs buried all autumn was on it.\n\nNow frost silvered the clearing, and she could hardly wait to show him.`,
      art: '',
      manifest: {
        charactersPresent: ['tilly'],
        location: 'Woodland clearing beneath Tilly’s nesting tree',
        timeOfDay: 'Early winter morning',
        action: 'Tilly surveys the frosted clearing from a low branch above the large crooked tree root.',
        emotionalBeat: 'Private pride',
        requiredVisualFacts: [
          'Tilly is a small brown owl with mottled brown and buff feathers, a pale speckled chest, amber-gold eyes, tufted ears, and a grey-black hooked beak',
          'The large crooked tree root is the central woodland landmark',
          'Frost covers grass and fallen leaves',
          'No other character is visible',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Nibs or any other character', 'a physical map or diagram'],
        composition: 'Warm handcrafted picture-book art; centre Tilly and the crooked root beneath generous canopy and sky, with wide safe margins.',
        shotType: 'establishing',
      },
    },
    {
      page: 2,
      text: `From her yellow knitted blanket, she counted the places: crooked root, fern hollow, forked birch.\n\n“Well, now. Not one forgotten.”\n\nAbove her nest, yesterday’s snow balanced on a branch like an enormous white sausage.`,
      art: '',
      manifest: {
        charactersPresent: ['tilly'],
        location: 'Tilly’s open nest in the fork of the clearing’s large tree',
        timeOfDay: 'Early winter morning',
        action: 'Tilly sits snugly in a yellow knitted blanket and looks down toward the remembered hiding places.',
        emotionalBeat: 'Cosy confidence',
        requiredVisualFacts: [
          'A treasured yellow knitted blanket surrounds Tilly in her nest',
          'A thick rounded accumulation of snow rests on a branch above',
          'The nest overlooks the clearing',
          'The crooked root, distant fern hollow, and forked birch are visually distinct',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Nibs or any other character', 'a physical map'],
        composition: 'Centre the nest and Tilly, keeping the snow-loaded branch comfortably inside the upper frame; generous side margins.',
        shotType: 'mid',
      },
    },
    {
      page: 3,
      text: `Down in the clearing, frost had made every grassy bump look exactly like every other grassy bump.\n\nTilly rehearsed her directions. Three nuts here. Five over there.\n\nShe would make winter wonderfully easy.`,
      art: '',
      manifest: {
        charactersPresent: ['tilly'],
        location: 'Frosted ground beside the large crooked tree root',
        timeOfDay: 'Winter morning',
        action: 'Tilly stands on the ground, silently pointing between several nearly identical frosted bumps.',
        emotionalBeat: 'Eager usefulness',
        requiredVisualFacts: [
          'Several similar rounded grassy bumps are coated in frost',
          'The crooked root remains plainly visible',
          'Tilly gestures confidently between hiding places',
          'No nuts are exposed',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Nibs or any other character', 'arrows, diagrams, or a physical map'],
        composition: 'Show Tilly full-body in the central clearing with the similar bumps grouped nearby, all well away from the edges.',
        shotType: 'wide',
      },
    },
    {
      page: 4,
      text: `Nibs arrived nose-first, sniffing fiercely. He sneezed into a frosty leaf. The leaf flipped up and stuck across his face.\n\n“Technically,” he said from underneath it, “I’m searching for breakfast. Not wearing it.”`,
      art: '',
      manifest: {
        charactersPresent: ['tilly', 'nibs'],
        location: 'Leaf-strewn entrance to the woodland clearing',
        timeOfDay: 'Winter morning',
        action: 'The newly arrived Nibs has a broad frosty leaf stuck across his muzzle while Tilly watches.',
        emotionalBeat: 'Comic surprise',
        requiredVisualFacts: [
          'Nibs appears for the first time',
          'Nibs has red-orange fur, a cream muzzle and belly, tufted ears, a very large bushy tail, and freckled cheeks',
          'A broad leaf covers Nibs’s nose and mouth without hiding his expressive eyes',
          'Tilly and Nibs are roughly the same height',
          'Tilly is visibly amused',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'extra characters'],
        composition: 'Centre both characters at matching scale, facing one another; leave clear space around the leaf and Nibs’s tail.',
        shotType: 'twoShot',
      },
    },
    {
      page: 5,
      text: `“I know every hiding place,” Tilly began. “First, the root. Then—”\n\n“Do I get to guess any?” Nibs asked.\n\nHe peeled off his leaf. “Technically, finding breakfast is the best bit. I have standards.”`,
      art: '',
      manifest: {
        charactersPresent: ['tilly', 'nibs'],
        location: 'Beside the large crooked root',
        timeOfDay: 'Winter morning',
        action: 'Nibs lowers the peeled-off leaf and looks hopefully at Tilly, whose confident explanation has stopped.',
        emotionalBeat: 'An unexpected hesitation',
        requiredVisualFacts: [
          'Nibs holds the removed leaf below his uncovered face',
          'Tilly’s beak is slightly open as she pauses',
          'Nibs looks hopeful rather than annoyed',
          'The crooked root is readable behind them',
          'Both characters have equal visual importance',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'a physical map', 'exposed food'],
        composition: 'A tight centred two-character grouping, with faces and the lowered leaf inside generous crop-safe margins.',
        shotType: 'twoShot',
      },
    },
    {
      page: 6,
      text: `Tilly closed her beak on the rest of her excellent directions.\n\n“Well, now. Which hiding place has a roof shaped like an elbow?”\n\nNibs inspected the clearing. His ears stood taller. “A very wooden elbow?”`,
      art: '',
      manifest: {
        charactersPresent: ['tilly', 'nibs'],
        location: 'Clearing facing the crooked root',
        timeOfDay: 'Winter morning',
        action: 'Nibs studies the elbow-shaped bend of the crooked root while Tilly waits without pointing.',
        emotionalBeat: 'Curiosity rekindled',
        requiredVisualFacts: [
          'The root has a clearly elbow-shaped bend with a sheltered space beneath it',
          'Nibs’s ears are lifted in interest',
          'Tilly keeps her wings tucked rather than indicating the answer',
          'The hiding place remains unopened',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'an exposed cache', 'a physical map'],
        composition: 'Look over Tilly’s shoulder toward Nibs and the central elbow-shaped root, with all essential clues kept near the middle.',
        shotType: 'overShoulder',
      },
    },
    {
      page: 7,
      text: `Under the crooked root, Nibs unearthed three hazelnuts.\n\n“Excellent crunch potential,” he declared.\n\nTilly scratched a little trail toward the fern hollow. Nibs followed, stopping to examine bumps she would have hurried straight past.`,
      art: '',
      manifest: {
        charactersPresent: ['tilly', 'nibs'],
        location: 'Ground beneath the crooked root, leading toward the fern hollow',
        timeOfDay: 'Winter morning',
        action: 'Nibs cradles three unearthed hazelnuts while Tilly scratches the beginning of a trail in the frosted ground.',
        emotionalBeat: 'Shared satisfaction',
        requiredVisualFacts: [
          'Exactly three hazelnuts rest in Nibs’s paws',
          'A small opened cache lies beneath the root',
          'Tilly makes shallow marks in the frost with one foot',
          'The fern hollow is visible deeper in the clearing',
          'The trail gives a direction rather than revealing another cache',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'letter-shaped or number-shaped ground marks'],
        // Was a `detail` shot whose composition said "characters may be partly
        // cropped". Two characters plus a detail framing means something has to
        // leave the frame, and what left it twice was the tip of one ear — which
        // reads as a mistake rather than a choice, and the character bibles say
        // never cut by an edge. A low angle keeps both of them whole and suits
        // Nibs at his most triumphant. It is also the only unused shot in the
        // book, so the variety improves too.
        composition: 'Both characters whole and central with clear space above their ears; the three hazelnuts in Nibs’s paws and the first trail marks held large in the foreground.',
        shotType: 'low',
      },
    },
    {
      page: 8,
      text: `WHUMP. The enormous snow sausage slid off its branch.\n\nIt swallowed Tilly’s trail, the grassy bumps, and most of the crooked root. Nibs clutched his three nuts.\n\nTheir next clue had disappeared under a whole new clearing.`,
      art: '',
      manifest: {
        charactersPresent: ['tilly', 'nibs'],
        location: 'Clearing below the snow-loaded branch',
        timeOfDay: 'Winter morning',
        action: 'A broad fall of loose snow lands across the clearing ahead of Tilly and Nibs, obliterating the ground trail.',
        emotionalBeat: 'Sudden dismay',
        requiredVisualFacts: [
          'Freshly fallen loose snow covers the scratched trail and grassy bumps',
          'Only a small part of the crooked root remains visible',
          'Tilly and Nibs stand safely outside the falling snow',
          'Nibs holds all three hazelnuts against his chest',
          'The overhead branch is now largely bare of its snow load',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'characters being struck, buried, or injured', 'a still-visible scratched trail'],
        composition: 'Frame the small characters centrally below the broad new snow patch; use the high viewpoint to show how thoroughly the familiar ground has changed.',
        shotType: 'high',
      },
    },
    {
      page: 9,
      text: `Nibs prodded the blank snow. “Technically, this is too much mystery.”\n\nTilly looked from the buried trail to her nest. A yellow corner fluttered above them.\n\nShe liked that blanket best when it was wrapped around her.`,
      art: '',
      manifest: {
        charactersPresent: ['tilly', 'nibs'],
        location: 'Snow-covered clearing beneath Tilly’s nesting tree',
        timeOfDay: 'Winter morning',
        action: 'Tilly looks up toward her yellow blanket while Nibs tentatively touches the featureless snow.',
        emotionalBeat: 'Reluctant possibility',
        requiredVisualFacts: [
          'Tilly’s thoughtful face is the primary focus',
          'A yellow blanket corner is visible hanging from the nest above',
          'Nibs is visible behind Tilly, touching the snow with one paw',
          'The three recovered hazelnuts rest together in a small sheltered hollow beside Nibs',
          'The scratched trail is completely covered',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'a replacement blanket', 'a visible ground trail'],
        composition: 'Centre Tilly’s head and shoulders, with her upward gaze leading to the blanket corner within the safe central frame.',
        shotType: 'close',
      },
    },
    {
      page: 10,
      text: `Back in her nest, Tilly caught a loose yellow loop. One tug. Another.\n\nHer blanket grew shorter. The wool grew longer.\n\nCold slipped around her toes. She paused, then pulled enough for one more bright, dangling clue.`,
      art: '',
      manifest: {
        charactersPresent: ['tilly'],
        location: 'Tilly’s nest in the tree fork',
        timeOfDay: 'Winter morning',
        action: 'Tilly deliberately unravels her favourite yellow knitted blanket into several long lengths of wool.',
        emotionalBeat: 'A costly decision',
        requiredVisualFacts: [
          'The yellow knitted blanket is visibly partly unravelled',
          'Tilly holds a loose loop with her beak and steadies the knitting with a foot',
          'Several long yellow wool lengths lie beside her',
          'Her feet are no longer covered',
          'The remaining blanket is substantially smaller than before',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Nibs or any other character', 'scissors', 'an intact full-sized blanket'],
        composition: 'Hold the working beak, foot, unravelled knitting, and wool large in the centre, with soft nest edges and generous margins.',
        shotType: 'detail',
      },
    },
    {
      page: 11,
      text: `Soon yellow wool dangled from low twigs, safely above the snow. At the last strand, Tilly waited.\n\n“Well, now. What’s underneath those curled brown umbrellas?”\n\n“Ferns!” Nibs said. “And underneath the ferns—let me look.”`,
      art: '',
      manifest: {
        charactersPresent: ['tilly', 'nibs'],
        location: 'Low shrub passage between the clearing and fern hollow',
        timeOfDay: 'Late winter morning',
        action: 'Tilly finishes tying a yellow wool strand to a low twig while Nibs recognises the curled brown fern fronds ahead.',
        emotionalBeat: 'Discovery within reach',
        requiredVisualFacts: [
          'A few separate yellow wool lengths hang from low twigs above the snow',
          'The wool marks a route, not the exact location of any buried nut',
          'Curled brown fern fronds resemble small closed umbrellas',
          'Nibs eagerly examines the ferns',
          'Tilly allows Nibs to move ahead',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'arrows or symbols attached to the wool', 'wool stretched taut across the walking route'],
        composition: 'Centre the nearest wool strand, both characters, and the fern entrance in a compact grouping with clear margins.',
        shotType: 'mid',
      },
    },
    {
      page: 12,
      text: `In the fern hollow, Nibs scraped, sniffed, and scraped again. Five hazelnuts rolled into daylight.\n\n“Technically, these are magnificent.” He pushed half the breakfast toward Tilly.\n\nShe chose a nut. This time, she hadn’t said where to dig.`,
      art: '',
      manifest: {
        charactersPresent: ['tilly', 'nibs'],
        location: 'Sheltered fern hollow',
        timeOfDay: 'Late winter morning',
        action: 'Beside his newly uncovered cache, Nibs shares the combined breakfast while Tilly chooses a hazelnut.',
        emotionalBeat: 'Earned delight',
        requiredVisualFacts: [
          'Five newly found hazelnuts lie beside a small fresh digging hole',
          'The three earlier hazelnuts sit nearby as a separate little group',
          'Nibs nudges a share toward Tilly',
          'Tilly reaches for one nut',
          'A yellow wool strand hangs from a twig in the background',
          'Both characters are roughly the same height',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Tilly digging the cache for Nibs', 'extra characters'],
        composition: 'Centre both friends and the shared nuts beneath the enclosing fern fronds; keep the cache and yellow strand comfortably within crop-safe margins.',
        shotType: 'twoShot',
      },
    },
    {
      page: 13,
      text: `By afternoon, Tilly’s blanket barely covered one foot. Nibs curled his tail around the other.\n\n“Technically, this seats two.”\n\nTilly tucked in beside him. Below their branch, yellow threads bobbed above the snow. She saved the forked birch for tomorrow.`,
      art: '',
      manifest: {
        charactersPresent: ['tilly', 'nibs'],
        location: 'Tilly’s broad nesting fork overlooking the clearing',
        timeOfDay: 'Soft winter afternoon',
        action: 'Tilly nestles beside Nibs, drawing one foot beneath his warm curled tail while the small blanket remnant covers her other foot.',
        emotionalBeat: 'Warm anticipation',
        requiredVisualFacts: [
          'Tilly is the emotional centre of the final image',
          'Only a small remnant of the yellow blanket remains',
          'Nibs’s large bushy tail warmly surrounds Tilly’s uncovered foot',
          'Both characters look comfortable and content',
          'Yellow wool markers bob on low twigs above the snow below',
          'The distinctive forked birch stands beyond the marked route',
          'The large crooked root remains partly snow-covered in the clearing',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'a restored full-sized blanket', 'extra characters', 'a physical map'],
        composition: 'Keep the snug pair central and prominent in the nesting fork, with the marked clearing and forked birch softly visible below; generous headroom and side margins.',
        shotType: 'wide',
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
    art: p.art || pageArt('tillys-winter-map', p.page),
  })),
}
