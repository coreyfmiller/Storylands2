# Storylands Reader Layout (phone-first picture book)

Rules for how a Storylands book is presented to a reader. These are product requirements,
not suggestions. The reader is a read-aloud picture book on a phone first; everything below
serves that.

## Hard rules

1. NO TEXT INSIDE THE ILLUSTRATION, AND NO SIGNAGE, EVER.
   Story words, titles, captions, labels, and speech never appear painted on or overlaid on
   the artwork. Illustrations are always textless. All words live only in the dedicated text
   panel. Do NOT stage a sign/signpost/board/placard/label at all — not even blank, because a
   blank board looks like the art broke. If a beat seems to need one, redesign the beat around
   a wordless visual and put the words in the text panel. (See visual-consistency steering.)

2. TEXT ALWAYS FITS ITS PANEL WITH NO SCROLLING.
   On every page, on every phone size, the full page text must be visible at once. The reader
   NEVER scrolls to read a page. This is enforced two ways and both must hold:
   - Runtime: `useBookTextSize` in components/book-reader.tsx picks **one size for the whole
     book** (preferred 34px, floor 17px) and every page is read at it. Measured once per book
     by probing **every page** and taking the smallest winner, because the longest page is
     the binding constraint and nothing else is.
     Things that were wrong here, all of which a browser check caught and none of which a
     unit test could:
     - **It must measure every page, not the one with the most characters.** Rendered height
       comes from how the prose WRAPS and from the blank line between paragraphs. Pip's page
       1 is shorter than his page 13 and two lines taller, because it is two paragraphs.
     - **The text panel needs `min-h-0`.** Without it the panel's min-height is content-based,
       so a long page made the panel GROW past its 11/20 share, squeezing the illustration,
       and `overflow-hidden` quietly clipped the last line. 158 page/viewport combinations
       were overflowing this way while the code reported a confident 34px.
     - **The measuring surface must overlay the real panel.** A standalone clone with
       hand-computed height came out 45px short of the truth and sized the type a step small.
     - **Use a callback ref for it.** The panel does not exist on the cover, so an effect
       keyed on anything else runs while the ref is null, bails, and never runs again.
     - **Don't key the text panel on the page number.** Remounting it per turn would
       re-measure all thirteen pages on every page turn. The key belongs on the image and
       the prose, which is what needs to re-animate.
     - It binary searches rather than stepping down a pixel at a time: a larger font never
       fits better, so halving finds the same answer in five layout reads instead of forty.
     - It re-fits on resize via ResizeObserver; rotating a phone changes the panel height.
   - **One size per book means the longest page sets the type for every page.** Nibs reads at
     24px on a phone because one of its pages is 45 words. That is a content problem, not a
     mechanism problem — `validate-book.mjs` warns when a book's word counts span more than
     20, and evening the pages out is what makes the whole book bigger.
   - Authoring: pages are written SHORT enough that they fit at a large, comfortable size
     without shrinking to the floor. Auto-fit is a safety net, not a license to overwrite
     long pages. If a page has to shrink noticeably to fit, the page text is too long — split
     it into two pages or trim it.

3. LARGE, READ-ALOUD TYPE.
   Body text targets a large phone size (roughly 30-34px) so an adult can read it aloud at
   arm's length and an early reader can follow along. Warm serif on the parchment panel.

## Layout

- Each page is a vertical split: illustration on top, warm parchment text panel below.
- **ABSOLUTE RULE — the illustration ALWAYS fills the top region edge-to-edge (full-bleed).**
  Page art uses `object-cover`, never `object-contain`. No letterbox bars, no floating boxed
  image, no margins around the art. The image must fill its region completely, like page 1 of
  the Oliver book. This is not a preference; do not change it back to `object-contain`.
- **Consequence (also absolute): `object-cover` crops to fill, so page art MUST be authored and
  generated with the main subject centered and with generous margin/headroom around it** — so
  nothing important (a head, ears, the key action) sits near an edge where it can clip. If a
  page clips badly, the fix is to REGENERATE that page's art with more margin, never to switch
  the reader to `object-contain`. Add "keep the subject centered with margin/headroom; nothing
  important near the edges" to page composition notes.
- Split is roughly 45% image / 55% text on a phone (image `flex-[9]`, text `flex-[11]`), giving
  a bold full-bleed image band on top and room for large, no-scroll text below.
- Minimal chrome: a close control, a thin progress bar, and the read-aloud toggle at the top.
  Nothing else competes. The read-aloud button is the only addition that earns its place —
  it's what lets a child who can't read yet open a book alone — and it disappears where the
  browser has no `speechSynthesis` rather than sitting there doing nothing.

## Mobile interaction (phone-first — all three must work)

The reader is used on a phone, one-handed. Page-turning is offered THREE redundant ways so it
is always discoverable and never fiddly. All are implemented once in the shared
`components/book-reader.tsx`, so every book gets them:

1. **Tap** — tapping the art/page turns forward (right ~2/3) or back (left ~1/3). On the
   COVER, tapping the art begins the story (not just the button).
2. **On-screen controls** — visible large (≥44px) prev/next buttons at the bottom, with a
   "current / total" page indicator. The next button is the accent color so it is obvious.
3. **Swipe** — horizontal swipe left/right turns the page, on every stage (cover, page, end).
   A swipe must be clearly horizontal (distance > ~45px AND more horizontal than vertical) so
   a vertical scroll or a plain tap is never mistaken for a page turn. The frame uses
   `touch-pan-y` + `overscroll-none` so the browser's edge back-swipe cannot steal the gesture.

Arrow keys (left/right) also work for desktop. Respect safe-area insets at the bottom so
controls clear the phone's home indicator.

## Authoring implication (page length)

Because text must fit at a large size with no scroll, write picture-book pages SHORT and keep
their length CONSISTENT so the type size stays roughly the same from page to page.

Per-page word budget (measured, enforced):
- **Target ~35 words per page.** The comfortable band is about **18-45 words**.
- **Hard ceiling ~50 words** (and never more than 3 short paragraphs). A page over ~50 words,
  or needing 4+ paragraphs, is TWO pages — split it. (Story Zero's original last page was 67
  words / 4 paragraphs and overflowed on mobile; splitting it into two ~34-word pages fixed it
  and added a dedicated final image.)
- Keep pages within a tight range of each other. Wildly uneven pages make the auto-fit size
  jump around between turns, which feels cheap. Even, consistent lengths read premium.
- Prefer more, shorter pages over fewer, dense ones. Turning the page is part of the rhythm,
  and a new page can earn its own illustration (maximize both text and image).

Acceptance check for every book: run `node scripts/audit-text.mjs` and confirm max words ≤ ~50
and the spread is tight. Treat "does every page fit large with no scroll, at a consistent
size?" as a gate, the same way we treat character visual consistency. Auto-fit is a safety
net, not a license to overwrite a long page.

## Format

- Master illustration canvas: 9:16 portrait, textless (see visual-consistency steering).
- Reader stage is centered and letterboxed on wide screens, full-bleed on phones.
