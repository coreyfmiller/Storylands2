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
   - Runtime: the text panel auto-fits — it renders the prose as large as possible and steps
     the font size down only as far as needed to fit (down to a readable floor). See
     AutoFitText in components/book-reader.tsx (preferred ~34px phone, floor ~17px).
   - Authoring: pages are written SHORT enough that they fit at a large, comfortable size
     without shrinking to the floor. Auto-fit is a safety net, not a license to overwrite
     long pages. If a page has to shrink noticeably to fit, the page text is too long — split
     it into two pages or trim it.

3. LARGE, READ-ALOUD TYPE.
   Body text targets a large phone size (roughly 30-34px) so an adult can read it aloud at
   arm's length and an early reader can follow along. Warm serif on the parchment panel.

## Layout

- Each page is a vertical split: illustration on top, warm parchment text panel below.
- **The illustration is NEVER cropped.** Show the whole picture — use `object-contain`, never
  `object-cover`, for page art. A cut-off head or a chopped scene is a defect; a small
  letterbox margin is fine. The image region's background matches the parchment (#f4e9d6) so
  any margin blends into the page instead of showing black bars.
- Split is roughly 55% image / 45% text on a phone (image `flex-[11]`, text `flex-[9]`), so the
  tall 9:16 art shows large and uncropped while the short text still fits at a large size with
  no scroll. Because our text is short (~35 words), the image gets the larger share.
- Minimal chrome: a close control and a thin progress bar at the top. Nothing else competes.

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
