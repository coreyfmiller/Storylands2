// Verify the series work and the cover no longer renders its title twice.
//
// Driven in a real browser rather than asserted from the catalog, because the
// three things being checked are all rendering behaviour: whether a painted
// title is duplicated in HTML, whether a series card is actually clickable, and
// whether the end of a book offers the next book in its series.

import { createRequire } from "node:module"

const require = createRequire(
  "C:/Users/corey/Desktop/Projects/PERSONAL PROJECTS/Duelly/package.json",
)
const puppeteer = require("puppeteer-core")

const BASE = process.env.BASE_URL ?? "http://localhost:3150"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const results = []
function check(name, pass, detail = "") {
  results.push({ name, pass })
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: `${process.env.TEMP}\\storylands-series-${Date.now()}`,
  args: ["--no-sandbox"],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })

  // ---- 1. the series page exists and lists its books in order ----
  let res = await page.goto(`${BASE}/series/pip`, { waitUntil: "networkidle2" })
  check("/series/pip responds 200", res.status() === 200, `status ${res.status()}`)

  const heading = await page.$eval("h1", (e) => e.textContent?.trim() ?? "")
  check(
    "the series is named for its world, not one character",
    heading === "Lantern Valley",
    heading,
  )

  const listed = await page.$$eval("ol li", (els) =>
    els.map((e) => e.textContent?.replace(/\s+/g, " ").trim() ?? ""),
  )
  check("both books are listed", listed.length === 2, `${listed.length}: ${listed.join(" // ")}`)
  check(
    "numbered in reading order, Pip first",
    /^1\s*Pip and the First Flame/.test(listed[0] ?? "") &&
      /^2\s*Lumi Lights the Way/.test(listed[1] ?? ""),
    listed.join(" // "),
  )

  // ---- 2. a painted cover is not titled twice ----
  res = await page.goto(`${BASE}/read/pip-first-flame`, { waitUntil: "networkidle2" })
  check("the reader responds 200", res.status() === 200, `status ${res.status()}`)

  const coverText = await page.evaluate(() => document.body.innerText)
  const titleCount = (coverText.match(/Pip and the First Flame/g) ?? []).length
  check(
    "the painted cover does not repeat its title in HTML",
    titleCount === 0,
    `title appears ${titleCount}x in text; the art carries it`,
  )
  const h1s = await page.$$eval("h1", (els) => els.map((e) => e.textContent?.trim()))
  check("no HTML heading over the painted cover", h1s.length === 0, JSON.stringify(h1s))

  // ---- 3. the end of book one offers book two ----
  // Walk to the end card by pressing Next.
  const start = await page.$('[aria-label="Start reading"], [aria-label="Keep reading"]')
  if (start) await start.click()
  await new Promise((r) => setTimeout(r, 800))

  for (let i = 0; i < 30; i++) {
    const next = await page.$('[aria-label="Next page"]')
    if (!next) break
    await next.click()
    await new Promise((r) => setTimeout(r, 120))
    const ended = await page.evaluate(() => document.body.innerText.includes("The End"))
    if (ended) break
  }

  const endText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " "))
  check("reached the end card", /The End/.test(endText), endText.slice(0, 120))
  check(
    "the end card says where this book sits in its series",
    /Book 1 of 2/.test(endText),
    endText.slice(0, 200),
  )
  check(
    "the handover names the series rather than saying 'Read next'",
    // Case-insensitive: the label is uppercased in CSS, so innerText reads
    // "MORE LANTERN VALLEY" and a case-sensitive match fails on styling alone.
    /more lantern valley/i.test(endText) && !/read next/i.test(endText),
    endText.slice(0, 220),
  )

  const offered = await page.$$eval("a[aria-label^='Read ']", (els) =>
    els.map((e) => e.getAttribute("href")),
  )
  check(
    "book one offers book two, not an arbitrary next book",
    offered.includes("/read/lumi-lights-way"),
    JSON.stringify(offered),
  )

  // ---- 4. the end card must not hand over a staging book ----
  // Nibs is standalone and last-but-one in catalog order; whatever it offers
  // must be on the main shelf.
  res = await page.goto(`${BASE}/read/nibs-perfect-acorn`, { waitUntil: "networkidle2" })
  const s2 = await page.$('[aria-label="Start reading"], [aria-label="Keep reading"]')
  if (s2) await s2.click()
  await new Promise((r) => setTimeout(r, 600))
  for (let i = 0; i < 30; i++) {
    const next = await page.$('[aria-label="Next page"]')
    if (!next) break
    await next.click()
    await new Promise((r) => setTimeout(r, 120))
    const ended = await page.evaluate(() => document.body.innerText.includes("The End"))
    if (ended) break
  }
  const nibsOffers = await page.$$eval("a[aria-label^='Read ']", (els) =>
    els.map((e) => e.getAttribute("href")),
  )
  check(
    "a published book never hands over the staging book",
    !nibsOffers.includes("/read/pixies-enormous-plip"),
    JSON.stringify(nibsOffers),
  )
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length === 0 ? 0 : 1)
