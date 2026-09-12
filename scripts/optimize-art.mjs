import { readdir, mkdir, stat } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"

const ART = "public/art"
const THUMB = join(ART, "thumb")

await mkdir(THUMB, { recursive: true })

const files = (await readdir(ART)).filter((f) => f.endsWith(".png"))

let before = 0
let after = 0

for (const file of files) {
  const src = join(ART, file)
  const base = file.replace(/\.png$/, "")
  before += (await stat(src)).size

  // Full-size showcase image (hero, detail, reader): capped, compressed WebP
  const fullOut = join(ART, `${base}.webp`)
  await sharp(src)
    .resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(fullOut)
  after += (await stat(fullOut)).size

  // Small thumbnail for repeated card shelves and the search grid
  const thumbOut = join(THUMB, `${base}.webp`)
  await sharp(src)
    .resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 60 })
    .toFile(thumbOut)
  after += (await stat(thumbOut)).size
}

console.log(
  `Optimized ${files.length} images: ${(before / 1e6).toFixed(1)}MB PNG -> ${(after / 1e6).toFixed(1)}MB WebP (full+thumb)`,
)
