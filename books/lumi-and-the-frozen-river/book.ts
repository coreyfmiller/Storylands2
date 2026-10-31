// STORYLANDS — "Lumi and the Frozen River"
//
// Each page carries BOTH the read-aloud prose and the illustration manifest (the
// canonical truth the image prompt is derived from). One source: the app reads this
// file and so does scripts/generate-book.mjs.
//
// Authored by scripts/create-book.mjs from the premise:
//   The river through the lantern valley has frozen for the first time anyone can
//   remember, trapping the valley's floating lanterns in the ice halfway downstream. Lumi
//   the owl decides to carry every one home herself before dark. Pip the little dragon
//   offers to melt a channel with his flame and Lumi refuses - she has done the lantern
//   round alone for years and she is good at it. She is wrong, and it costs her something
//   she cannot get back.
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
  lumi: 'characters/lumi.png',
  pip: 'characters/pip.png',
}

/** Short on-model description, written into the prompt alongside the reference. */
export const CHARACTER_BIOS: Record<string, string> = {
  lumi:
    'Lumi, a cute small fluffy snowy owl (owlet): white feathers with soft grey-brown speckles and little heart-shaped spots, big round expressive amber-gold eyes, feathered white eyebrows, a tiny orange-yellow hooked beak often in a small happy smile, fluffy white wings with faint barred markings, and small orange-yellow talons; she carries a glowing star-shaped lantern',
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
  id: 'lumi-and-the-frozen-river',
  title: 'Lumi and the Frozen River',
  subtitle: 'Six lanterns, one stubborn owl, and a very expensive hook.',
  character: 'lumi',
  ages: 'Ages 4–6',
  minutes: 6,
  band: 'young',
  seriesId: 'pip',
  seriesOrder: 3,
  cover: 'books/lumi-and-the-frozen-river/cover.webp',
  pages: [
    {
      page: 1,
      text: `The river had frozen overnight. Nobody in Lantern Valley could remember that happening before.\n\nHalfway home, six floating lanterns sat stuck in the ice.\n\n“I’ll carry you,” Lumi told them. “Every last one. Before dark.”`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'The broad frozen bend of the river in Lantern Valley',
        timeOfDay: 'Late afternoon',
        action: 'Lumi stands on the snowy bank, looking at six floating lanterns frozen into the river nearby.',
        emotionalBeat: 'Confident responsibility',
        requiredVisualFacts: [
          'Lumi is a small fluffy white owlet with grey-brown speckles, heart-shaped spots, amber-gold eyes, and orange-yellow beak and talons',
          'Lumi carries her intact glowing copper-framed star lantern with five blue glass panes',
          'Exactly six round floating lanterns, each with a loop handle and a broad buoyant base, are trapped together in the ice',
          'The river curves toward a small sheltered home inlet downstream',
          'Pip is absent',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Pip or any additional character', 'Open water around the six trapped lanterns'],
        composition: 'Warm handcrafted picture-book art; keep Lumi and the six lanterns grouped centrally with generous side margins and ample pale winter sky.',
        shotType: 'establishing',
      },
    },
    {
      page: 2,
      text: `Her own star lantern swung from her wing: soft copper, five blue windows, each one fitted by Lumi herself.\n\nShe set it beneath the willow. Then she scratched around the first frozen handle with one careful claw.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'The willow-lined bank beside the trapped lanterns',
        timeOfDay: 'Late afternoon',
        action: "Lumi carefully scratches ice away from a floating lantern's loop handle; her personal star lantern rests beside the willow roots.",
        emotionalBeat: 'Affectionate self-assurance',
        requiredVisualFacts: [
          'The intact star lantern has a soft copper frame and five distinct blue glass panes',
          "Lumi's talon scratches a small groove around a round lantern's handle",
          'Long fallen willow switches and flexible reeds lie naturally beside the roots',
          'The other five floating lanterns remain nearby in the ice',
          'Pip is absent',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Pip or any additional character', "Damage to Lumi's star lantern"],
        composition: 'Centre the working talon, loop handle, and star lantern in a compact triangle; leave generous crop-safe margins around every important object.',
        shotType: 'detail',
      },
    },
    {
      page: 3,
      text: `The handle came loose. So did Lumi’s feet.\n\nThey shot forward. Her wings went round like windmills. Her bottom landed first and slid all the way back to the bank.\n\n“That,” she announced, “was not carrying.”`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'The smooth ice beside the willow bank',
        timeOfDay: 'Late afternoon',
        action: 'Lumi slides backward on her fluffy bottom, feet lifted in front and wings windmilling.',
        emotionalBeat: 'Undignified surprise',
        requiredVisualFacts: [
          "Lumi's bottom touches the ice while both orange-yellow feet point forward",
          'Her wings spread in an unbalanced windmilling gesture',
          'A short skid trail leads toward the snowy bank',
          'All six floating lanterns remain together behind her',
          'Her intact star lantern remains safely beneath the willow',
          'Pip is absent',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Pip or any additional character', 'Injury or frightened distress', 'A freed lantern flying through the air'],
        composition: "Use a low view along the ice, with Lumi's sliding body centred and clear space around her lifted feet and wings.",
        shotType: 'low',
      },
    },
    {
      page: 4,
      text: `By the time the shadows reached the willow, Lumi had loosened five lanterns. She gathered them on a shelf of ice beside the bank.\n\n“One more,” she puffed.\n\nThe shelf gave a tiny creak.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi'],
        location: 'A thin ice shelf along the willow bank',
        timeOfDay: 'Late afternoon with lengthening shadows',
        action: 'Lumi places a fifth freed lantern with four others on a thin shelf of ice while the sixth remains trapped nearby.',
        emotionalBeat: 'Strained determination',
        requiredVisualFacts: [
          'Exactly five freed round lanterns crowd the ice shelf',
          'The sixth round lantern remains frozen a short distance away',
          'A small hairline crack appears beneath the crowded shelf',
          'Lumi looks tired but intent',
          'Her intact star lantern rests beneath the willow',
          'Pip is absent',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Pip or any additional character', 'A fully collapsed shelf', 'Broken floating lanterns'],
        composition: 'Frame Lumi and the crowded shelf centrally, with the remaining trapped lantern visible immediately beside them rather than near an edge.',
        shotType: 'mid',
      },
    },
    {
      page: 5,
      text: `Snow crunched. Pip came down the bank.\n\n“Sizzle and crumbs! Why carry things that already float?” he asked. “I could melt a channel home. I vote for floating.”\n\nA hopeful little flame flickered between his teeth.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi', 'pip'],
        location: 'The snowy approach to the willow bank',
        timeOfDay: 'Late afternoon',
        action: 'Pip arrives beside Lumi and gestures along the frozen river, offering a small controlled flame.',
        emotionalBeat: 'An inviting new possibility',
        requiredVisualFacts: [
          "This is Pip's first appearance",
          'Pip is a small warm-red baby dragon with a cream belly, dark-red curved horns and spines, amber-brown eyes, orange wings, four clawed feet, and a long ridged tail',
          "A tiny friendly flame appears just in front of Pip's mouth",
          'Lumi turns toward her familiar friend',
          'Five freed lanterns occupy the shelf and one remains trapped',
          'The star lantern remains intact beneath the willow',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'A threatening fire blast', 'Additional characters', 'A melted channel already completed'],
        composition: 'Centre both friends at their correct relative sizes, facing each other, with the lantern shelf clearly visible between and slightly behind them.',
        shotType: 'twoShot',
      },
    },
    {
      page: 6,
      text: `Lumi tucked her wings tight.\n\n“I’ve done the lantern round alone for years, Pip. I’m good at it.”\n\nShe turned away before he could answer and tugged the last lantern free. There. Six. All hers to carry.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi', 'pip'],
        location: 'The edge of the thin ice shelf',
        timeOfDay: 'Late afternoon',
        action: "Lumi turns away from Pip with a stiff, proud expression while gripping the sixth lantern's handle.",
        emotionalBeat: 'Defensive pride',
        requiredVisualFacts: [
          "Lumi's face and tightly tucked wings communicate refusal",
          'The sixth round lantern is newly freed and held close',
          'Pip is visible softly behind her with a disappointed but patient expression',
          'Five lanterns remain on the shelf',
          'No channel has been melted',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'An angry or mocking Pip', 'Damage to the star lantern', 'A collapsed shelf'],
        composition: "Lumi's head and shoulders fill the central frame; keep the held handle and Pip's small background face within the crop-safe central area.",
        shotType: 'close',
      },
    },
    {
      page: 7,
      text: `When the sixth lantern touched the shelf—CRACK.\n\nThe ice tipped like a tray. All six slid into black water and vanished beneath the frozen river. Their lights moved downstream.\n\nLumi’s empty claws stayed curled around nothing.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi', 'pip'],
        location: 'The broken shelf at the willow bank',
        timeOfDay: 'Approaching dusk',
        action: 'The shelf tips into the current, sending all six buoyant lanterns beneath the adjacent translucent ice while Lumi remains on the solid bank.',
        emotionalBeat: 'Shock and loss of control',
        requiredVisualFacts: [
          'The thin shelf has broken and tilted into open dark water',
          'Exactly six lantern glows are visible beneath the adjoining ice, moving downstream',
          'Lumi stands safely on the bank with empty curled talons',
          'Pip stands beside her, startled',
          'The intact personal star lantern remains beneath the willow',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Either character falling into water', 'Lanterns sinking to the riverbed', 'Extinguished or broken floating lanterns'],
        composition: 'Look down on the small friends and the broken shelf, keeping them and the six underwater glows grouped centrally with generous surrounding ice.',
        shotType: 'high',
      },
    },
    {
      page: 8,
      text: `Around the bend, the lights stopped beneath a tangle of reeds. Water pressed them farther under the ice.\n\nLumi swallowed. “Pip? Please make your channel.”\n\nHe nodded once. His little flame bent low over the river.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi', 'pip'],
        location: 'A narrow reed-choked bend downstream',
        timeOfDay: 'Approaching dusk',
        action: 'Lumi looks toward six lanterns caught beneath reeds while Pip begins melting a narrow channel toward them.',
        emotionalBeat: 'Vulnerable trust',
        requiredVisualFacts: [
          'Exactly six floating lanterns are caught under a dense reed tangle at the ice edge',
          'Pip directs a small controlled flame onto the ice, away from the reeds',
          'A short narrow strip of melted water begins beside him',
          'Lumi has brought her still-intact star lantern from the willow',
          'Both friends remain on firm snowy ground',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Burning reeds', 'A freed lantern', 'Characters standing in deep water'],
        composition: "Frame over Lumi's shoulder toward Pip and the trapped lights, keeping the flame, reeds, and lantern group in the central crop-safe area.",
        shotType: 'overShoulder',
      },
    },
    {
      page: 9,
      text: `The channel opened, but the reeds held fast. Lumi reached. The nearest handle bobbed just beyond her claws.\n\n“Sizzle and crumbs,” said Pip. “We need a hook.”\n\nLumi looked at the copper points of her star.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi', 'pip'],
        location: 'The bank beside the newly melted channel',
        timeOfDay: 'Dusk beginning',
        action: 'Lumi withdraws from an unsuccessful reach and looks down at her personal star lantern as Pip studies the snagged handles.',
        emotionalBeat: 'Painful recognition',
        requiredVisualFacts: [
          'A narrow open-water channel runs past the reed snag toward the home inlet',
          "All six lanterns remain caught, their loop handles beyond Lumi's reach",
          'The intact copper star lantern with five blue panes is prominent beside Lumi',
          'Long fallen willow switches and loose reeds are available on the bank',
          "Pip's flame is no longer touching the ice",
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'A ready-made hook or fishing rod', 'Any lantern already rescued', 'Broken blue glass'],
        composition: "Keep both friends and the star lantern central; use Lumi's downward gaze to connect her expression with the copper points.",
        shotType: 'twoShot',
      },
    },
    {
      page: 10,
      text: `Lumi laid her star on a stone.\n\n“The windows will break,” Pip whispered. “I know.”\n\nShe pressed hard with another stone. Five blue windows crunched. Pip warmed the copper, and Lumi bent one point into a hook. Her star would never shine again.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi', 'pip'],
        location: 'A flat stone beside the reed-choked channel',
        timeOfDay: 'Dusk',
        action: "Lumi bends a warmed copper point into a hook beside the shattered remains of her star lantern's blue panes.",
        emotionalBeat: 'Deliberate sacrifice',
        requiredVisualFacts: [
          'The personal star lantern is permanently destroyed as a working lantern',
          "All five blue panes are shattered on the flat stone, away from the characters' feet",
          'The copper frame is scorched and crushed, with one point drawn into a usable hook',
          'Lumi uses a small stone to press the frame without touching hot copper',
          'Pip has supplied a tiny controlled warming flame',
          'The six floating lanterns remain safe but snagged in the background',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'An intact or glowing personal star lantern', 'Cuts, burns, or injuries', "Pip breaking the lantern against Lumi's wishes"],
        composition: 'Centre the ruined copper frame, scattered blue panes, and working paws on the stone; include the friends only partially, with generous margins around the tools.',
        shotType: 'detail',
      },
    },
    {
      page: 11,
      text: `With reeds, they lashed the hook to a willow pole.\n\nLumi caught one handle. Pulled. Released. A lantern bobbed down Pip’s channel. Then another. Then four more.\n\n“Sizzle and crumbs!” Pip cheered. “Look at them go!”`,
      art: '',
      manifest: {
        charactersPresent: ['lumi', 'pip'],
        location: 'The reed snag beside the melted river channel',
        timeOfDay: 'Dusk',
        action: 'Lumi uses the long willow pole and ruined-star hook to free the last lantern while Pip watches the rescued lanterns float downstream.',
        emotionalBeat: 'Shared exhilaration',
        requiredVisualFacts: [
          'The scorched ruined copper star frame is securely lashed to a willow pole with reeds',
          "Its hooked point catches the final lantern's loop handle",
          'Five other lanterns float freely in the narrow channel',
          'Exactly six floating lanterns are accounted for',
          'Lumi works from firm ground and Pip celebrates beside her',
          'The broken blue glass remains safely on the flat stone',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'A repaired star lantern', 'A seventh floating lantern', 'Burning reeds or damaged floating lanterns'],
        composition: "Use a central diagonal from Lumi's pole to the caught handle, with the five released lanterns clustered along the channel behind it and ample side margins.",
        shotType: 'mid',
      },
    },
    {
      page: 12,
      text: `Before the last pink left the sky, all six lanterns floated into their home inlet.\n\nLumi counted twice. Six safe lights.\n\nPip shook river water off his toes. Lumi leaned her tired, empty wing against his warm side.`,
      art: '',
      manifest: {
        charactersPresent: ['lumi', 'pip'],
        location: "The sheltered home inlet beside Lumi's little riverside house",
        timeOfDay: 'Last pink light of dusk',
        action: 'All six rescued lanterns float safely in the enclosed inlet while Lumi rests against Pip on the bank.',
        emotionalBeat: 'Relief and closeness',
        requiredVisualFacts: [
          'Exactly six intact round lanterns float and glow inside the sheltered home inlet',
          'A low stone rim and a narrow entrance keep the lanterns gathered safely',
          "Lumi leans her wing against Pip's warm side",
          'Pip has wet toes but is comfortable and unharmed',
          'The willow pole with the ruined copper star hook rests nearby',
          'Lumi carries no working personal star lantern',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'Missing or broken floating lanterns', 'An intact personal star lantern', 'Additional characters'],
        composition: 'Keep the friends and the complete group of six lanterns in a central, intimate cluster, with the home entrance behind them and soft dusk around the scene.',
        shotType: 'wide',
      },
    },
    {
      page: 13,
      text: `Next evening, Lumi set two carrying baskets beside the inlet. On her windowsill lay the blackened star frame and a dish of broken blue glass.\n\nShe slid one basket toward Pip.\n\n“Ready? You take the wobbly ones.”`,
      art: '',
      manifest: {
        charactersPresent: ['lumi', 'pip'],
        location: "Outside Lumi's riverside home beside the sheltered inlet",
        timeOfDay: 'The following evening, before sunset',
        action: 'Lumi pushes one of two baskets toward Pip as they prepare to collect the six floating lanterns together.',
        emotionalBeat: 'Easy anticipation',
        requiredVisualFacts: [
          'Lumi is the active focal character, smiling as she offers Pip a basket',
          'Two carrying baskets sit between the friends',
          'All six rescued floating lanterns remain safely gathered in the nearby inlet',
          'On the low windowsill behind Lumi rests the visibly blackened, crushed copper star frame, still bent into a hook',
          'A small dish beside the ruined frame contains the broken blue panes',
          'The destroyed personal star lantern has not been repaired or replaced',
          'Pip reaches toward the offered basket',
        ],
        forbiddenVisualFacts: [...forbiddenAlways, 'A restored or glowing personal star lantern', 'A replacement personal lantern for Lumi', 'Additional characters', 'The ruined star hidden from view'],
        composition: "Centre Lumi's offering gesture and both baskets, with Pip close beside her; place the low windowsill and unmistakable ruined star directly behind Lumi within the central crop-safe area.",
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
    art: p.art || pageArt('lumi-and-the-frozen-river', p.page),
  })),
}
