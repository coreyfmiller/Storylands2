/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow the dev server's client JS/fonts to load when opened from the LAN (e.g. a phone
  // on the same Wi-Fi). Without this, Next 16 blocks cross-origin dev resources and the
  // page renders but nothing interactive works.
  allowedDevOrigins: ["192.168.2.28"],
}

export default nextConfig
