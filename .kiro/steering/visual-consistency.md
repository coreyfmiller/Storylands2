# Storylands Visual Consistency (governing rule)

Consistency is the single most important property of Storylands illustration. A book fails
the moment a reader thinks "wait, is that the same squirrel?" Every decision in the image
pipeline is subordinate to keeping characters, style, and world on-model across every page.

This file is the source of truth for HOW we keep art consistent. When any illustration work
conflicts with speed, cleverness, or variety, consistency wins.

## The core problem we are solving

Generating one attractive image is easy. Generating 12-25 images that all look like the same
book, with the same characters, is hard. Reference-conditioning alone (handing the model a
character PNG) gets us most of the way but drifts: color shifts, tail/ear/eye shape changes,
species creep, apparent-age changes, and render-style wobble between pages. The pipeline below
exists specifically to close that gap. Never rely on a prose description alone to hold a
character; always pass approved reference imagery.

## Canonical references come first (never skip this)

Before any story page is generated for a character, that character MUST have an APPROVED
canonical reference set. Order of operations is non-negotiable:

1. Define the character's Visual Bible entry (identity + invariants + forbidden changes).
2. Generate a clean, TEXTLESS reference sheet (single character, plain/simple background,
   neutral + a couple of expressions, front and three-quarter views). The existing
   `public/characters/*.png` cover art is a starting point, but it has baked-in titles and
   poster framing; derive a clean reference from it rather than seeding story pages directly
   from the poster.
3. A human APPROVES the reference. Only approved references seed story pages.
4. Story pages are generated using the approved reference(s) as input images every time.

A character with no approved reference is not ready to appear in a page.

## Visual invariants (the things that must never change)

Every character carries a short list of hard invariants. These are passed into every prompt
AND checked in QA. Invariants describe identity, not pose. Example (Nibs):

- red-orange squirrel; large fluffy tail; large brown expressive eyes; small rounded body
- no clothing unless a story explicitly calls for temporary clothing
- do not alter fur color/pattern, do not change species, do not change apparent age
- warm storybook rendering consistent with the Storylands style reference

Keep invariants SHORT and identity-critical. Long lists dilute; 4-8 items is right.

## NEW CHARACTERS ENTERING A SCENE (highest-risk case)

This is where consistency breaks most often and matters most. Rules:

- When a scene contains two or more characters, pass the approved reference for EACH present
  character on that call, not just the protagonist. A page with Nibs + Tilly gets BOTH
  references as inputs.
- A brand-new character must go through the full reference-first workflow (define -> generate
  reference sheet -> human approve) BEFORE appearing in any multi-character page. Do not
  introduce a new character for the first time inside a busy story page; establish them alone
  first, approve them, then bring them into scenes.
- When adding a new character to an existing cast, regenerate a quick two-up "cast check"
  (the new character beside an established one) and approve it before generating story pages
  that pair them. This catches scale, style, and palette mismatches early.
- Lock relative SCALE explicitly (e.g. "Finn the duckling is about knee-high to Nibs").
  Scale drift between characters is a top consistency failure and text alone rarely holds it.
- Never let a new character's style pull the render toward a different look; the Storylands
  style reference governs, the new character conforms to it, not the reverse.

## The illustration pipeline (canonical order)

VisualBible + IllustrationManifest + approved reference assets
  -> prompt compiler (derives the prompt; the manifest is canonical truth, not the prompt)
  -> image provider (OpenAI gpt-image; reference images passed as input)
  -> QA check (see below)
  -> human approve / reject
  -> approved page art

The Illustration Manifest per page is the canonical record: characters present (+ their
state), location, time of day, action, emotional beat, required visual facts, forbidden
visual facts, composition. The generated prompt is DERIVED from it and is disposable. Never
treat the prompt as the source of truth.

## Story state must constrain the art

Illustrations must reflect facts the page actually establishes. If the lantern is unlit, the
image must never show it glowing. Required/forbidden visual facts per page are enforced, not
suggestions. This keeps art honest to the story and prevents spoilers.

## Automated QA (consistency gate)

Every generated page runs a validation pass before a human sees it as a candidate:

- correct characters present, and each is on-model against its invariants
- correct location / recurring objects present; forbidden objects absent
- required visual facts present; forbidden visual facts absent
- style consistent with the Storylands style reference
- no unwanted text baked into the image (interiors are textless; captions are an overlay)
- age-appropriate, warm, non-scary

QA returns a structured result (pass/score/issues). Failing images are regenerated, not
shipped. For early experiments it is acceptable to show QA results to a human reviewer rather
than auto-regenerate, but the gate must exist.

## No in-image text and no signage (hard rule)

Two simple, non-negotiable rules for every illustration:

1. **No text in the image** — no words, letters, numbers, or titles painted into the art.
   Story words live only in the reader's text panel.
2. **No signage of any kind** — no signs, signposts, boards, placards, plaques, or labels,
   even blank ones. A blank board looks like the art broke; a lettered one breaks rule 1.

If a beat seems to need a sign or label, redesign the beat around something that reads with
zero words, and put the meaning in the read-aloud text. Add "any text; any sign, signpost,
board, placard, or plaque" to each page's `forbiddenVisualFacts` so the generator never
reintroduces it.

## Format and output rules

- Story-page master canvas: 9:16 portrait, 1080x1920, full-bleed, sRGB. Keep important
  content in the central safe zone (top/bottom may be covered by UI or captions).
- Interiors are TEXTLESS and SIGNAGE-FREE (see the hard rule above). Story words are an
  overlay layer, never painted into the image; no signs/labels even when blank.
- Character reference sheets are textless on a plain background.
- Every generated asset stores provenance: provider, model, timestamp, manifest version,
  visual-bible version, prompt-compiler version, reference images used, the compiled prompt,
  API settings, attempt number, output filename, approval status.

## Provider abstraction (do not couple to one model)

Image generation goes through a provider interface so the book/story data never depends on a
specific model. OpenAI gpt-image is the first implementation. Model IDs live in config/env
(e.g. OPENAI_IMAGE_MODEL), never hardcoded in prompt files, and must be confirmed against the
provider's live model list before a real run rather than assumed from memory.

## Secrets

Image/authoring API calls happen server-side only. The API key is read from the environment
(OPENAI_API_KEY in .env.local, which is gitignored). Never hardcode a key in source, never log
a key, never expose it to client code.

## Prove consistency before scaling (required first step)

Before generating a whole book, run the cheap consistency test: take an approved reference and
generate the SAME scene 2-3 times, plus one multi-character page. Judge whether the character
holds. Only scale to full page generation once the character demonstrably stays on-model. Do
not hide consistency problems; the point of the test is to find them.
