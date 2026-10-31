// STORYLANDS — "Oliver’s Ball Under the Chair"
//
// Each page carries BOTH the read-aloud prose and the illustration manifest (the
// canonical truth the image prompt is derived from). One source: the app reads this
// file and so does scripts/generate-book.mjs.
//
// Authored by scripts/create-book.mjs from the premise:
//   Oliver the little dog has pushed his squeaky ball under the big armchair and it is
//   just out of reach. He tries with a paw. He tries with his nose. He tries wriggling
//   right under. Each time the ball stays exactly where it is. The fourth time he tries
//   something slightly different - he goes round to the other side and pushes it out the
//   way it went in.
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
  oliver: 'characters/oliver.png',
}

/** Short on-model description, written into the prompt alongside the reference. */
export const CHARACTER_BIOS: Record<string, string> = {
  oliver:
    'Oliver, a scruffy young spaniel-type puppy: mostly white fluffy coat with ginger / red-orange patches (a patch over one eye, ginger ears, back and tail), long floppy ginger ears, big round brown eyes, a black nose, one little goofy tooth showing, and a RED collar with a gold bone-shaped tag',
}

// Never allowed in any illustration in this book. The first two are product rules:
// all words live in the reader's text panel, and a blank sign looks like broken art.
const forbiddenAlways = [
  'any text, words, letters, numbers, or title in the image',
  'any sign, signpost, board, placard, label, or plaque',
  'any additional character',
]

const rawBook: Book = {
  id: 'olivers-ball-under-the-chair',
  title: 'Oliver’s Ball Under the Chair',
  subtitle: 'A little nose tries another way.',
  character: 'oliver',
  ages: 'Ages 2–4',
  minutes: 4,
  band: 'toddler',
  cover: 'books/olivers-ball-under-the-chair/cover.webp',
  pages: [
    {
      page: 1,
      text: `Oliver’s blue ball rolls under the big armchair. “Come back!” He plants his paws on the rug.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Living room, on the round rug in front of a large mustard-yellow armchair; wooden floor runs beside it, with a window alcove behind it.',
        timeOfDay: 'Morning',
        action: 'Oliver braces his front paws on the rug and watches his blue squeaky ball settle beneath the chair.',
        emotionalBeat: 'Sudden longing',
        requiredVisualFacts: [
          'Oliver is a scruffy, mostly white spaniel-type puppy with ginger patches, including one over an eye, long floppy ginger ears, a ginger back and tail, round brown eyes, a black nose, and one little tooth showing.',
          'Oliver wears a red collar with a plain gold bone-shaped tag.',
          'The large mustard-yellow armchair has four stout wooden legs and an open gap underneath, without a fabric skirt.',
          'The small blue ball rests under the chair, closer to the rear opening than the front opening.',
          'The chair faces the rug; its back faces an accessible window alcove.',
          'The under-chair gap can admit Oliver’s head but not his fluffy shoulders.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'a second ball', 'a chair skirt hiding the ball'],
        composition: 'Establish the whole cozy chair area with generous wall and window space above. Keep Oliver, the chair, and the visible blue ball grouped centrally with broad side margins.',
        shotType: 'establishing',
      },
    },
    {
      page: 2,
      text: `Scritch, scritch! Oliver stretches one paw. His claws tickle only dust.\n\nStill there. Still stuck.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Front opening beneath the armchair, at the rug’s edge.',
        timeOfDay: 'Morning',
        action: 'Oliver reaches one front paw beneath the chair, stopping short of the blue ball.',
        emotionalBeat: 'Eager effort',
        requiredVisualFacts: [
          'One white paw stretches toward the ball without touching it.',
          'A tiny dust wisp sits beside the reaching claws.',
          'The blue ball remains in its original position, nearer the rear opening.',
          'Part of Oliver’s ginger ear and red collar is visible.',
          'The chair remains stationary.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'the paw touching the ball', 'the ball moving from its original position'],
        // The ball ran off the right edge on the first attempt. On a detail shot
        // the character may be cropped, but the OBJECT the beat is about cannot
        // be — so the margin has to be stated for the ball specifically rather
        // than as a general "crop-safe" note the model can satisfy loosely.
        composition: 'Frame the reaching paw on the left and the blue ball on the right, BOTH COMPLETE and well inside the picture, with a clearly readable stretch of empty floor between them. The ball must be whole and sit no closer than a fifth of the width from the right edge.',
        shotType: 'detail',
      },
    },
    {
      page: 3,
      text: `“Come here, squeaky!” Oliver drops his chest onto the rug. His long ears flop beside his paws.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Rug directly in front of the armchair.',
        timeOfDay: 'Morning',
        // Reworded after the original phrasing — "Oliver lowers his chest and
        // chin toward the floor", "his chest is low between his front paws" —
        // was refused by the image model's safety system. Nothing about it is
        // objectionable; a classifier reading pose language out of context is.
        // Naming the behaviour a play-bow makes it unmistakably a dog.
        action: 'Oliver does a happy play-bow on the rug, front legs stretched out ahead of him and tail up, peering under the chair.',
        emotionalBeat: 'Playful invitation',
        requiredVisualFacts: [
          'Oliver is in a play-bow: front legs stretched forward along the rug, bottom up, tail wagging.',
          'His long ginger ears lie flopped on the rug.',
          'His brown eyes look beneath the chair.',
          'His black nose, little tooth, red collar, and plain gold bone-shaped tag are visible.',
          'The chair’s front opening is readable behind his lowered head.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'the ball outside the chair', 'speech bubbles'],
        composition: 'Place Oliver’s face and flattened ears centrally, with generous space around both ears and above his head. Show enough chair behind him to establish his gaze.',
        shotType: 'close',
      },
    },
    {
      page: 4,
      text: `Snuff! He stretches his nose underneath. The ball sits one nose-tip too far away.\n\nStill there. Still stuck.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Front opening beneath the armchair.',
        timeOfDay: 'Morning',
        action: 'Oliver extends his head under the chair, but his nose stops just short of the ball.',
        emotionalBeat: 'Almost-there frustration',
        requiredVisualFacts: [
          'Oliver’s black nose points directly toward the blue ball.',
          'A small but unmistakable gap separates nose and ball.',
          'His shoulders remain outside the chair’s front opening.',
          'The ball remains at its original position near the rear opening.',
          'His ginger ears trail flat behind his head.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'nose-to-ball contact', 'the ball moving', 'Oliver fully beneath the chair'],
        composition: 'Use a floor-level side view into the chair gap. Centre the nose, empty gap, and ball together; keep the chair legs away from the frame edges.',
        shotType: 'detail',
      },
    },
    {
      page: 5,
      text: `Down goes his chin. Up goes his bottom. Oliver wriggles under the chair, with his ears like pancakes.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Rug at the armchair’s front edge.',
        timeOfDay: 'Morning',
        action: 'Oliver wriggles headfirst into the front gap with his bottom raised and ears spread flat.',
        emotionalBeat: 'Whole-body enthusiasm',
        requiredVisualFacts: [
          'Only Oliver’s head and front paws fit beneath the chair.',
          'His fluffy shoulders meet the lower upholstered front edge.',
          'His hindquarters remain raised outside the chair.',
          'Both ginger ears spread flat against the rug.',
          'The blue ball remains untouched in its original position.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Oliver’s whole body fitting beneath the chair', 'the chair lifting or tipping', 'the ball moving'],
        composition: 'Show Oliver’s full body and the lower chair centrally in profile. Leave generous space around his raised bottom, ears, and paws.',
        shotType: 'wide',
      },
    },
    {
      page: 6,
      text: `Oof! His fluffy shoulders stop him. His back paws paddle the rug.\n\nStill there. Still stuck.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Rug immediately in front of the armchair.',
        timeOfDay: 'Morning',
        action: 'Oliver’s hind paws paddle in place while his shoulders prevent him from wriggling farther beneath the chair.',
        emotionalBeat: 'Comical exasperation',
        requiredVisualFacts: [
          'Oliver’s shoulders are gently blocked, not painfully trapped.',
          'His raised bottom and splayed hind paws make the physical comedy clear.',
          'His head remains short of the ball.',
          'The blue ball stays exactly where it settled on page one.',
          'The chair is stable and unmoved.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'injury or distress', 'the ball moving', 'the chair tipping'],
        composition: 'Look down diagonally at Oliver’s paddling back paws and fluffy body, with the ball visible through the front gap. Keep the entire action in the central crop-safe area.',
        shotType: 'high',
      },
    },
    {
      page: 7,
      text: `Pitter-pat. Oliver pads round the chair, past its big soft side. Behind it, a blue bit peeks out.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Wooden-floor passage beside the armchair, opening into the window alcove behind it.',
        timeOfDay: 'Morning',
        action: 'Oliver walks around the side of the chair and looks toward its rear opening.',
        emotionalBeat: 'Fresh curiosity',
        requiredVisualFacts: [
          'Oliver is completely clear of the chair.',
          'His body follows the narrow wooden-floor path around its side.',
          'The rear opening is now visible ahead of him.',
          'A small portion of the blue ball is visible just inside that rear opening.',
          'The ball has not changed position.',
          'Soft daylight enters the alcove behind the chair.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'the ball already outside the chair', 'a second chair or ball'],
        composition: 'Frame from just behind Oliver as he rounds the chair. Centre his shoulder, the curved chair side, and the glimpse of blue; preserve generous margins and headroom.',
        shotType: 'overShoulder',
      },
    },
    {
      page: 8,
      text: `From behind the chair, one little nose gives one little nudge. Squeak! The ball rolls out onto the rug.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Window alcove behind the armchair, looking through its underside toward the front rug.',
        timeOfDay: 'Morning',
        action: 'Oliver nudges the ball from the rear opening, sending it forward and out onto the rug.',
        emotionalBeat: 'Sudden success',
        requiredVisualFacts: [
          'Oliver is behind the chair with his nose pointed through the rear opening.',
          'The blue ball is visibly rolling clear of the front opening onto the rug.',
          'The ball exits through the same front opening it originally entered.',
          'The open floor beneath the chair provides an unobstructed path.',
          'Oliver’s eyes are wide and his ears hang loosely.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'a second ball', 'the ball exiting from the rear', 'the chair moving'],
        composition: 'Use a low, three-quarter side view showing Oliver at the rear and the emerging ball at the front. Keep the entire nose-to-ball path central with broad side margins.',
        shotType: 'wide',
      },
    },
    {
      page: 9,
      text: `Back on the rug, Oliver catches the ball between his paws. “There you are!” His mouth opens wide.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Round rug in front of the armchair.',
        timeOfDay: 'Morning',
        action: 'Oliver holds the recovered ball between his front paws and lowers his open mouth toward it.',
        emotionalBeat: 'Delighted reunion',
        requiredVisualFacts: [
          'The blue ball is fully outside the chair and securely between Oliver’s paws.',
          'Oliver’s open mouth is poised above the ball.',
          'His little goofy tooth is visible.',
          'His red collar and plain gold bone-shaped tag remain consistent.',
          'The armchair is softly visible behind him.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'the ball beneath the chair', 'speech bubbles'],
        composition: 'Centre Oliver’s delighted face, paws, and ball in a compact triangle. Leave generous room around his ears and above his head.',
        shotType: 'mid',
      },
    },
    {
      page: 10,
      text: `Oliver curls beside the chair, his squeaky ball snug in his mouth. His tail thumps the rug. Thump, thump.`,
      art: '',
      manifest: {
        charactersPresent: ['oliver'],
        location: 'Round rug beside the front of the armchair.',
        timeOfDay: 'Morning',
        action: 'Oliver curls comfortably on the rug with the blue ball held in his mouth and his tail tapping beside him.',
        emotionalBeat: 'Warm contentment',
        requiredVisualFacts: [
          'Oliver is the clear focal point.',
          'The blue squeaky ball is visibly and securely held in his mouth.',
          'His relaxed brown eyes, floppy ginger ears, red collar, and plain gold bone-shaped tag are visible.',
          'His ginger tail rests against the rug in a gentle wag.',
          'The ball is well away from the chair’s underside.',
          'Warm daylight falls across the rug.',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'the ball outside Oliver’s mouth', 'a new problem or unreachable object'],
        composition: 'Make Oliver’s curled body and ball-filled mouth a large, cosy central shape. Include his tail within the safe central area, with generous margins and calm space above.',
        shotType: 'mid',
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
    art: p.art || pageArt('olivers-ball-under-the-chair', p.page),
  })),
}
