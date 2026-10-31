"use client"

import Image from "next/image"
import { stories, thumbOf } from "@/lib/catalog"
import { Logo } from "@/components/logo"
import { useReaders } from "@/components/providers/reader-provider"
import { MAX_AGE, MIN_AGE, NAME_MAX, publishedAges, readerProblem } from "@/lib/readers"
import { useState } from "react"

// The first screen, before anybody has been added.
//
// Storylands used to open straight onto Avery's shelf — a six-year-old the
// family had never met, with three siblings and a progress bar on a book nobody
// had read. One name and one age replaces all of that.

export function Welcome() {
  const published = publishedAges()
  const { addReader } = useReaders()
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [touched, setTouched] = useState(false)

  const problem = readerProblem({ name, age: Number(age) })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (problem) return
    addReader({ name, age: Number(age) })
  }

  // A few real covers, so the first screen shows what is actually inside.
  const covers = stories.filter((s) => s.readerSlug).slice(0, 5)

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-lg">
        <Logo />

        <h1 className="mt-8 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Illustrated picture books, read a page at a time.
        </h1>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
          {covers.length} original stories for ages {published.min} to {published.max},
          hand-illustrated, with every word read aloud if you want it. No ads, no feed, and
          every story has a last page to arrive at.
        </p>

        <div className="mt-8 flex gap-2" aria-hidden>
          {covers.map((s) => (
            <div
              key={s.id}
              className="relative aspect-[9/16] flex-1 overflow-hidden rounded-md ring-1 ring-border"
            >
              <Image
                src={thumbOf(s.portrait || s.landscape)}
                alt=""
                fill
                sizes="90px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-10">
          <h2 className="font-serif text-xl font-medium text-foreground">Who&apos;s reading?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Kept on this device. Nothing is sent anywhere, and there is no account to make.
          </p>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={NAME_MAX}
                placeholder="Avery"
                autoFocus
                /* text-base keeps iOS Safari from zooming the page on focus. */
                className="min-h-11 rounded-md border border-border bg-card px-3 text-base text-foreground outline-none focus:border-primary"
              />
            </label>
            <label className="flex w-20 flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Age</span>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                inputMode="numeric"
                placeholder="5"
                className="min-h-11 rounded-md border border-border bg-card px-3 text-center text-base text-foreground outline-none focus:border-primary"
              />
            </label>
          </div>

          {touched && problem && (
            <p className="mt-3 text-sm text-foreground/80" role="alert">
              {problem}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Open the library
          </button>
        </form>
      </div>
    </main>
  )
}
