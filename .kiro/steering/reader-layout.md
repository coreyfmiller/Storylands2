# Storylands Reader Layout (phone-first picture book)

Rules for how a Storylands book is presented to a reader. These are product requirements,
not suggestions. The reader is a read-aloud picture book on a phone first; everything below
serves that.

## Hard rules

1. NO TEXT INSIDE THE ILLUSTRATION, EVER.
   Story words, titles, captions, sign text, labels, and speech never appear painted on or
   overlaid on the artwork. Illustrations are always textless. All words live only in the
   dedicated text panel. If a story beat involves a sign/letter/label, the ART shows it BLANK
   and the words are read in the text panel. Do not reintroduce on-image text overlays.

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
- The illustration is never cropped to make room for text; the split gives text its own space.
- Split is roughly 45% image / 55% text on a phone, tuned so large text fits without scrolling.
- Tapping anywhere turns the page (right/forward, left/back); swipe and arrow keys also work.
- Minimal chrome: a close control and a thin progress bar at the top. Nothing else competes.

## Authoring implication (page length)

Because text must fit at a large size with no scroll, write picture-book pages SHORT:
- Aim for roughly 1-3 short sentences per page (about 12-45 words).
- A page that needs four+ paragraphs is two pages, not one.
- Prefer more, shorter pages over fewer, dense ones. Turning the page is part of the rhythm.

When generating or editing a book, treat "does every page fit large with no scroll?" as an
acceptance check, the same way we treat character visual consistency.

## Format

- Master illustration canvas: 9:16 portrait, textless (see visual-consistency steering).
- Reader stage is centered and letterboxed on wide screens, full-bleed on phones.
