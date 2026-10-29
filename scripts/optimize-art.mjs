// Convert showcase art to WebP, full size plus a thumbnail.
//
// Two directories, same treatment:
//   public/art        — hero banners and key art for the catalog
//   public/characters — the painted 9:16 covers, which double as profile avatars
//
// The character covers were 2.2 MB PNGs, and the home grid shows seven of them
// at once: fifteen megabytes to paint the first screen. The avatar in the nav
// loaded the same 2.2 MB file to fill 32 pixels. Hence the thumbnails, which
// `thumbOf()` in lib/catalog.ts points every card and avatar at.
//
// Page illustrations are handled separately by scripts/optimize-books.mjs.
// Run with `node scripts/optimize-art.mjs`.

import { readdir, mkdir, stat } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"

const DIRS = ["public/art", "public/characters"]
const FULL = { width: 1280, height: 1280, quality: 72 }
const THUMB = { width: 640, height: 640, quality: 60 }

let before = 0
let after = 0
let count = 0

for (const dir of DIRS) {
  const thumbDir = join(dir, "thumb")
  await mkdir(thumbDir, { recursive: true })

  const files = (await readdir(dir)).filter((f) => f.endsWith(".png"))

  for (const file of files) {
    const src = join(dir, file)
    const base = file.replace(/\.png$/, "")
    before += (await stat(src)).size

    for (const [out, cfg] of [
      [join(dir, `${base}.webp`), FULL],
      [join(thumbDir, `${base}.webp`), THUMB],
    ]) {
      await sharp(src)
        .resize({ width: cfg.width, height: cfg.height, fit: "inside", withoutEnlargement: true })
        .webp({ quality: cfg.quality })
        .toFile(out)
      after += (await stat(out)).size
    }
    count += 1
  }
}

console.log(
  `Optimized ${count} images: ${(before / 1e6).toFixed(1)}MB PNG -> ${(after / 1e6).toFixed(1)}MB WebP (full+thumb)`,
)
