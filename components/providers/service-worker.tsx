"use client"

import { useEffect } from "react"

/**
 * Register the offline worker.
 *
 * Only in production: a service worker in front of the dev server serves stale
 * modules and turns every hot reload into a confusing mystery.
 *
 * Renders nothing. It is a component rather than a script tag so it runs after
 * hydration, where a registration failure cannot block first paint.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return

    // After load, so registration never competes with the first page's images.
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is an enhancement. A browser that refuses it (private
        // mode, an unsupported engine) should still get the whole app.
      })
    }
    if (document.readyState === "complete") register()
    else window.addEventListener("load", register, { once: true })
    return () => window.removeEventListener("load", register)
  }, [])

  return null
}
