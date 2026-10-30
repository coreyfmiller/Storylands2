// Verify on the LIVE deploy that the read-aloud speed control is gone and that
// recorded narration plays at its recorded rate.
//
// The previous attempt scraped /_next/static/chunks URLs out of the SSR HTML and
// grepped them for "Quick". It printed "chunks scanned: 0" — the regex matched
// nothing, so it proved nothing either way. The control is a client-rendered
// button, so the only honest check is to open the page in a browser and look at
// the buttons that actually exist.

import { createRequire } from "node:module"

const require = createRequire(
  "C:/Users/corey/Desktop/Projects/PERSONAL PROJECTS/Duelly/package.json",
)
const puppeteer = require("puppeteer-core")

const BASE = process.env.BASE_URL ?? "https://storylands2.vercel.app"
const SLUG = process.env.SLUG ?? "pixies-enormous-plip"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const results = []
function check(name, pass, detail = "") {
  results.push({ name, pass, detail })
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: `${process.env.TEMP}\\storylands-verify-${Date.now()}`,
  args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })

  // Record what playbackRate the app sets on any narration audio it creates.
  await page.evaluateOnNewDocument(() => {
    window.__rates = []
    const native = Object.getOwnPropertyDescriptor(
      HTMLMediaElement.prototype,
      "playbackRate",
    )
    Object.defineProperty(HTMLMediaElement.prototype, "playbackRate", {
      configurable: true,
      get() {
        return native.get.call(this)
      },
      set(v) {
        window.__rates.push({ rate: v, src: this.src })
        return native.set.call(this, v)
      },
    })
  })

  const url = `${BASE}/read/${SLUG}`
  const res = await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 })
  check(`${url} responds 200`, res.status() === 200, `status ${res.status()}`)

  // Cover screen first: press the control that starts the book.
  //
  // Match on aria-label, not text — the start control is a full-bleed invisible
  // button with no textContent. And resolve the handle with a selector rather
  // than an index into a filtered list: filtering the labels but indexing the
  // unfiltered elements silently clicked the read-aloud toggle instead, which
  // turned narration on at the cover and made the rate check look like a fail.
  const startSel = '[aria-label="Start reading"], [aria-label="Keep reading"]'
  const start = await page.$(startSel)
  if (start) {
    await start.click()
    await new Promise((r) => setTimeout(r, 2500))
  }
  // Confirm by the thing only a story page has: the progress bar.
  const onPage = (await page.$('[role="progressbar"]')) !== null
  check("reached a story page", onPage, onPage ? "progress bar present" : "still on cover")

  // 1. No speed control anywhere in the reader.
  const labels = await page.$$eval("button, a[role=button], [role=radio], select, option", (els) =>
    els.map((e) =>
      [e.textContent, e.getAttribute("aria-label"), e.getAttribute("title")]
        .filter(Boolean)
        .join(" ")
        .trim(),
    ),
  )
  const speedy = labels.filter((t) => /\b(slow|quick|speed|normal)\b/i.test(t))
  check("no Slow / Normal / Quick / speed control", speedy.length === 0, speedy.join(" | ") || "none found")

  // 2. Exactly one aria-pressed toggle (the read-aloud on/off).
  const pressed = await page.$$eval("[aria-pressed]", (els) =>
    els.map((e) => ({
      label: e.getAttribute("aria-label") || (e.textContent || "").trim(),
      value: e.getAttribute("aria-pressed"),
    })),
  )
  check(
    "exactly one aria-pressed toggle in the reader",
    pressed.length === 1,
    pressed.map((p) => `${p.label}=${p.value}`).join(" | ") || "none",
  )

  // 3. Turning read-aloud on plays recorded narration at rate 1.
  if (pressed.length === 1) {
    check(
      "read-aloud starts off on a fresh install",
      pressed[0].value === "false",
      `aria-pressed=${pressed[0].value}`,
    )
    const toggle = await page.$("[aria-pressed]")
    // Only click into the ON state; clicking a toggle that is already on would
    // stop the audio and then "no narration seen" reads as a product failure.
    if (pressed[0].value === "false") await toggle.click()
    await new Promise((r) => setTimeout(r, 5000))
    const rates = await page.evaluate(() => window.__rates)
    const narration = rates.filter((r) => /\/audio\/page-/.test(r.src || ""))
    check(
      "recorded narration plays at rate 1 (not 0.85)",
      narration.length > 0 && narration.every((r) => r.rate === 1),
      narration.map((r) => `${r.rate} ${r.src.split("/").slice(-1)[0]}`).join(" | ") ||
        `no narration audio seen; all rates: ${JSON.stringify(rates)}`,
    )
  }

} finally {
  // Close only what this script launched. Never a name match on chrome.exe.
  await browser.close()
}

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length === 0 ? 0 : 1)
