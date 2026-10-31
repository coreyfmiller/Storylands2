// STORYLANDS — "Goodnight, Little Light"
//
// Each page carries BOTH the read-aloud prose and the illustration manifest (the
// canonical truth the image prompt is derived from). One source: the app reads this
// file and so does scripts/generate-book.mjs.
//
// Authored by scripts/create-book.mjs from the premise:
//   Pip the little dragon says goodnight to the lantern valley. One warm thing at a time:
//   the lanterns, the river, a sleepy bird, his own small flame. Each one makes its own
//   soft sound. The refrain is a question the grown-up asks the baby, and the answer is
//   always something to point at.
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
}

/** Short on-model description, written into the prompt alongside the reference. */
export const CHARACTER_BIOS: Record<string, string> = {
  pip:
    'Pip, a small cute baby dragon: warm red scaled body with a soft cream / pale-gold belly and chest, a row of small dark-red curved horns and spines down his head and back, big expressive amber-brown eyes, small orange bat-like wings with a lighter membrane, four little clawed feet and a long ridged tail; a gentle, friendly, kind face',
}

// Never allowed in any illustration in this book. The first two are product rules:
// all words live in the reader's text panel, and a blank sign looks like broken art.
const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
]

const rawBook: Book = {
  id: 'goodnight-little-light',
  title: 'Goodnight, Little Light',
  subtitle: 'Soft sounds in the lantern valley.',
  character: 'pip',
  ages: 'Ages 0–2',
  minutes: 2,
  band: 'baby',
  cover: 'books/goodnight-little-light/cover.webp',
  pages: [
    {
      page: 1,
      text: `Here is Pip. Hush, hush.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'A rounded grassy hollow in the lantern valley',
        timeOfDay: 'Early dusk',
        action: 'Pip rests on his haunches in the hollow, his little wings folded and his front feet tucked against his cream belly.',
        emotionalBeat: 'A soft, sleepy welcome',
        requiredVisualFacts: [
          'Pip has warm red scales, a cream belly, small dark-red curved horns and spines, amber-brown eyes, small orange wings, four clawed feet, and a long ridged tail',
          'Pip is the single large subject',
          'One simple valley curve behind Pip establishes the outdoor setting',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'additional characters', 'distant buildings, crowds, or decorative clutter'],
        composition: 'Centre Pip with his face, folded wings, and tucked feet comfortably inside generous side margins; leave ample headroom against a plain deep-blue sky.',
        shotType: 'mid',
      },
    },
    {
      page: 2,
      text: `Flick. Goodnight, little light.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'The same grassy hollow in the lantern valley',
        timeOfDay: 'Dusk',
        action: "A single round amber lantern rests in a shallow dip in the grass, its small enclosed flame leaning gently to one side; Pip's red front feet rest together just behind its base.",
        emotionalBeat: 'Warm attention to one tiny flicker',
        requiredVisualFacts: [
          'One large, simple round lantern is the dominant subject',
          'A small enclosed flame is clearly visible',
          'The lantern casts one broad pool of warm light',
          "Only Pip's warm-red front feet and a small portion of his cream chest are visible behind the lantern",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'additional characters', 'additional lanterns', 'ornate metalwork or tiny decorative details'],
        composition: "Place the lantern centrally and large, with Pip's feet grouped closely behind its base; leave generous empty space around the handle and warm pool of light, keeping all important features away from the side edges.",
        shotType: 'detail',
      },
    },
    {
      page: 3,
      text: `Where is the river? Plip, plip.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'A quiet river bend beside the grassy hollow',
        timeOfDay: 'Dusk',
        action: 'One small bubble breaks on the smooth river surface, leaving two broad circular ripples; Pip crouches on the bank, with only his red front feet visible at the bottom centre.',
        emotionalBeat: 'An easy invitation to point',
        requiredVisualFacts: [
          'The river surface is the single clear focal subject',
          'One small bubble and two large simple ripples sit at the centre',
          'A broad amber reflection warms the dark-blue water',
          'Only a minimal curved bank establishes the river',
          "Pip's two red front feet rest on the bank at the bottom centre, away from the water",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'additional characters', 'fish, boats, reeds, or scattered stones', 'rough water'],
        composition: "Fill the central area with the river and its large readable ripples; keep Pip's feet subordinate on a narrow bank below them, with generous margins around the entire grouping.",
        shotType: 'detail',
      },
    },
    {
      page: 4,
      text: `Hush. Goodnight, little light.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'The same quiet river bend',
        timeOfDay: 'Late dusk',
        action: "A single oval of lantern light rests on the now-smooth river surface; Pip's red front feet remain together on the bank below it.",
        emotionalBeat: 'Stillness after the little plip',
        requiredVisualFacts: [
          'The reflected light on the river is the single large focal subject',
          'The reflection is one soft amber oval with only two broad horizontal breaks',
          'The river remains dark blue and calm',
          "Pip's red front feet are visible at the bottom centre on a minimal strip of bank",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'additional characters', 'a visible lantern competing with its reflection', 'numerous sparkles, busy ripples, or rough water'],
        composition: "Centre the broad amber reflection within a generous field of blue water, with Pip's feet subordinate below it; keep the reflection and feet safely inside the central crop with generous margins.",
        shotType: 'detail',
      },
    },
    {
      page: 5,
      text: `Where is the bird? Hush, hush.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'The grassy hollow beside the river',
        timeOfDay: 'Late dusk',
        action: "A plump bird-shaped lantern sits in a shallow grassy nest, its beak tucked down and its carved eye closed; Pip's red front feet rest together just behind the nest.",
        emotionalBeat: 'A sleepy little pointing surprise',
        requiredVisualFacts: [
          'The focal subject is a bird-shaped lantern, not a living bird or an additional character',
          'The lantern has one bold rounded body, one simple tucked beak, and one closed-eye curve',
          'Its translucent amber body glows warmly',
          'The nest is a single smooth grass bowl without individual twigs',
          "Only Pip's red front feet and a small portion of his cream chest appear behind the nest",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'living birds or additional characters', 'detailed feathers, nest twigs, or decorative patterns'],
        composition: "Make the sleepy bird silhouette large and central, with Pip's feet subordinate behind its nest; leave clear space around its beak and rounded back, generous headroom, and broad side margins.",
        shotType: 'detail',
      },
    },
    {
      page: 6,
      text: `Whoosh. Goodnight, little light.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'The grassy hollow beside the river',
        timeOfDay: 'Nightfall',
        action: 'Pip lets one tiny rounded puff of golden flame hover just beyond his gently pursed snout.',
        emotionalBeat: "Pip's own small bedtime glow",
        requiredVisualFacts: [
          'Pip retains his established red scales, dark-red horns, cream colouring, and amber-brown eyes',
          'One tiny golden flame is the focal subject',
          "Pip's relaxed face appears immediately behind the flame",
          'The flame is separated from all grass and other objects',
          'The flame has no face or character features',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'additional characters', 'large fire, smoke, sparks, burning objects, or alarmed expressions'],
        // A wing tip ran into the left edge twice. On a close shot the wings
        // should not be in frame at all — saying so is more reliable than asking
        // for a margin around something that does not need to be there.
        composition: "A tight close shot of Pip's face and the tiny flame at the centre, with ample empty dark-blue background on every side. Crop above the shoulders so the WINGS ARE NOT IN FRAME; nothing may touch the left or right edge.",
        shotType: 'close',
      },
    },
    {
      page: 7,
      text: `Pip curls up. Hush, hush.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'The soft grassy hollow in the lantern valley',
        timeOfDay: 'Night',
        action: 'Pip curls into a round bundle, his ridged tail wrapped beside his nose and his little wings folded against his back.',
        emotionalBeat: 'A snug, drowsy curl',
        requiredVisualFacts: [
          'Pip is the single large subject',
          'His eyelids are nearly closed',
          'His cream belly shows as a small warm crescent inside his red curl',
          'His tail and folded orange wing remain recognisable',
          'There is no remaining flame',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'additional characters', 'active flames', 'extra props or intricate grass textures'],
        composition: "Centre Pip's round curled silhouette in one simple grass bowl, leaving generous space on all sides and above his horns.",
        shotType: 'high',
      },
    },
    {
      page: 8,
      text: `Hush. Goodnight, little light.`,
      art: '',
      manifest: {
        charactersPresent: ['pip'],
        location: 'The same soft grassy hollow',
        timeOfDay: 'Night',
        action: 'Pip sleeps with his cheek resting on his tucked front feet and the tip of his tail beside his nose.',
        emotionalBeat: 'Completely asleep and comfortably held by the hollow',
        requiredVisualFacts: [
          'Pip is visibly asleep with both eyes fully closed',
          'His gentle red face, small dark-red horns, cream cheek-side chest, and tucked clawed feet remain identifiable',
          'A soft amber light from outside the frame rests on his face',
          'No flame is present',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'additional characters', 'open eyes, active flames, dream bubbles, or sleep symbols', 'visible lanterns or other competing subjects'],
        composition: "Fill the centre with Pip's sleeping face and tucked feet, surrounded by a broad quiet margin of deep blue and simple grass; allow ample headroom above his horns.",
        shotType: 'close',
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
    art: p.art || pageArt('goodnight-little-light', p.page),
  })),
}
