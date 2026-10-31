// Verify the child lock and the page turn in a real browser.
//
// Both are behaviour that only exists at runtime: whether a press-and-hold
// actually unlocks, whether a tap does NOT, and whether the turn classes are
// applied in the right direction. None of it is visible to a unit test.

import { createRequire } from "node:module"

const require = createRequire(
  "C:/Users/corey/Desktop/Projects/PERSONAL PROJECTS/Duelly/package.json",
)
const puppeteer = require("puppeteer-core")

const BASE = process.env.BASE_URL ?? "http://localhost:3167"
const SLUG = process.env.SLUG ?? "nibs-perfect-acorn"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const results = []
function check(name, pass, detail = "") {
  results.push({ name, pass })
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`)
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: `${process.env.TEMP}\\storylands-reader-${Date.now()}`,
  args: ["--no-sandbox"],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.goto(`${BASE}/read/${SLUG}`, { waitUntil: "networkidle2", timeout: 60000 })

  const start = await page.$('[aria-label="Start reading"], [aria-label="Keep reading"]')
  await start.click()
  await wait(700)

  // ---- the page turn ----
  const dir = () =>
    page.$eval(".reader-page", (e) =>
      e.classList.contains("turn-forward")
        ? "forward"
        : e.classList.contains("turn-back")
          ? "back"
          : "none",
    )
  check("a page carries a turn direction", (await dir()) === "forward", await dir())

  const hasTurnTargets = await page.evaluate(
    () => !!document.querySelector(".turn-art") && !!document.querySelector(".turn-text"),
  )
  check("the art and the prose are separately animated", hasTurnTargets)

  // The art must actually be moving, not cross-fading. Read the running
  // animation name rather than trusting the class.
  const anim = await page.$eval(".turn-art", (e) => getComputedStyle(e).animationName)
  check("the art slides rather than cross-fades", anim === "turn-art-forward", anim)

  await page.click('[aria-label="Next page"]')
  await wait(500)
  check("still forward after Next", (await dir()) === "forward", await dir())

  await page.click('[aria-label="Previous page"]')
  await wait(500)
  check("reverses direction on Previous", (await dir()) === "back", await dir())
  const backAnim = await page.$eval(".turn-art", (e) => getComputedStyle(e).animationName)
  check("and the art slides the other way", backAnim === "turn-art-back", backAnim)

  // ---- the child lock ----
  check("the book can be closed while unlocked", !!(await page.$('[aria-label="Close book"]')))

  const lockBtn = await page.$('[aria-label^="Lock for a child"]')
  check("a lock control is offered", !!lockBtn)
  await lockBtn.click()
  await wait(400)

  check(
    "locking removes the close button",
    (await page.$('[aria-label="Close book"]')) === null,
  )
  const holdBtn = await page.$('[aria-label^="Hold to unlock"]')
  check("and replaces it with a hold-to-unlock", !!holdBtn)

  // A page turn must still work while locked: the lock removes the ways out,
  // not the book.
  const before = await page.$eval('[role="progressbar"]', (e) =>
    e.getAttribute("aria-valuenow"),
  )
  await page.click('[aria-label="Next page"]')
  await wait(400)
  const after = await page.$eval('[role="progressbar"]', (e) => e.getAttribute("aria-valuenow"))
  check("pages still turn while locked", Number(after) === Number(before) + 1, `${before} -> ${after}`)

  // A TAP must not unlock. This is the whole point: a toddler taps.
  const box = await holdBtn.boundingBox()
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await wait(500)
  check(
    "a tap does not unlock",
    (await page.$('[aria-label="Close book"]')) === null,
    "close button reappeared after a tap",
  )

  // A short hold must not unlock either.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await wait(600)
  await page.mouse.up()
  await wait(300)
  check(
    "a 600ms hold does not unlock",
    (await page.$('[aria-label="Close book"]')) === null,
  )

  // A full hold must.
  await page.mouse.down()
  await wait(1900)
  await page.mouse.up()
  await wait(400)
  check(
    "a full hold unlocks",
    (await page.$('[aria-label="Close book"]')) !== null,
    "close button did not come back",
  )

  // And the lock survives a reload, since a parent sets it once.
  await (await page.$('[aria-label^="Lock for a child"]')).click()
  await wait(300)
  await page.reload({ waitUntil: "networkidle2" })
  await wait(800)
  check(
    "the lock survives a reload",
    (await page.$('[aria-label="Close book"]')) === null &&
      (await page.$('[aria-label^="Hold to unlock"]')) !== null,
  )
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length === 0 ? 0 : 1)
