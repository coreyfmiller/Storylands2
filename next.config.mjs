/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Every image in public/ is already a WebP produced at display size by
    // scripts/optimize-art.mjs and scripts/optimize-books.mjs — a page is ~130 KB
    // and a card thumbnail ~40 KB. Routing those through the optimizer would bill
    // a transform per size per image for no measurable saving, so the files are
    // served as-is. If raw uploads ever reach public/, turn this back off.
    unoptimized: true,
  },
  // Allow the dev server's client JS/fonts to load when opened from the LAN (e.g. a phone
  // on the same Wi-Fi). Without this, Next 16 blocks cross-origin dev resources and the
  // page renders but nothing interactive works.
  allowedDevOrigins: ["192.168.2.28"],
}

export default nextConfig
