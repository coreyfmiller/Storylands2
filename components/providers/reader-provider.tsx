"use client"

// The single source for who is reading.
//
// Device-local, like reading progress. Nothing about a child — not a name, not
// an age — leaves the browser, and there is no account to make.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { Band } from "@/lib/catalog"
import {
  bandsForAge,
  isValidReader,
  newReaderId,
  READER_COLOURS,
  type Reader,
} from "@/lib/readers"

const KEY = "storylands:readers:v1"
const ACTIVE_KEY = "storylands:reader-active:v1"

type ReaderContext = {
  /** Null until mounted, so the server's HTML and the first client paint agree. */
  ready: boolean
  readers: Reader[]
  active: Reader | null
  /** Shelf bands the active reader can see. Empty when nobody is set up yet. */
  bands: Band[]
  addReader: (input: { name: string; age: number }) => Reader | null
  updateReader: (id: string, patch: { name?: string; age?: number }) => void
  removeReader: (id: string) => void
  selectReader: (id: string) => void
}

const Ctx = createContext<ReaderContext | null>(null)

function parseStored(raw: string | null): Reader[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const out: Reader[] = []
    for (const v of parsed) {
      if (typeof v !== "object" || v === null) continue
      const r = v as Record<string, unknown>
      if (typeof r.id !== "string" || typeof r.name !== "string") continue
      const age = Number(r.age)
      if (!Number.isFinite(age)) continue
      // A stored record is trusted on range: an age that was valid when it was
      // entered should not vanish because the bounds were tightened later.
      out.push({
        id: r.id,
        name: r.name,
        age: Math.round(age),
        colour: Number.isFinite(Number(r.colour)) ? Number(r.colour) : out.length,
      })
    }
    return out
  } catch {
    return []
  }
}

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [readers, setReaders] = useState<Reader[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // Refs mirror state so a mutator never reads a stale value from the render
  // closure. Two taps inside one React batch would otherwise lose the first.
  const readersRef = useRef<Reader[]>([])
  const activeRef = useRef<string | null>(null)

  const load = useCallback(() => {
    const stored = parseStored(window.localStorage.getItem(KEY))
    const storedActive = window.localStorage.getItem(ACTIVE_KEY)
    readersRef.current = stored
    activeRef.current = stored.some((r) => r.id === storedActive)
      ? storedActive
      : (stored[0]?.id ?? null)
    setReaders(stored)
    setActiveId(activeRef.current)
  }, [])

  useEffect(() => {
    load()
    setReady(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY || e.key === ACTIVE_KEY || e.key === null) load()
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [load])

  const persist = useCallback(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(readersRef.current))
      if (activeRef.current) window.localStorage.setItem(ACTIVE_KEY, activeRef.current)
      else window.localStorage.removeItem(ACTIVE_KEY)
    } catch {
      // Private browsing and a full quota both land here. Losing the profile is
      // survivable; failing to open a book is not.
    }
  }, [])

  const addReader = useCallback(
    (input: { name: string; age: number }) => {
      if (!isValidReader(input)) return null
      const reader: Reader = {
        id: newReaderId(),
        name: input.name.trim(),
        age: Math.round(input.age),
        colour: readersRef.current.length % READER_COLOURS.length,
      }
      readersRef.current = [...readersRef.current, reader]
      activeRef.current ??= reader.id
      setReaders(readersRef.current)
      setActiveId(activeRef.current)
      persist()
      return reader
    },
    [persist],
  )

  const updateReader = useCallback(
    (id: string, patch: { name?: string; age?: number }) => {
      const current = readersRef.current.find((r) => r.id === id)
      if (!current) return
      const next = {
        ...current,
        ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
        ...(patch.age !== undefined ? { age: Math.round(patch.age) } : {}),
      }
      // The same validator the form uses, so no caller can store nonsense.
      if (!isValidReader(next)) return
      readersRef.current = readersRef.current.map((r) => (r.id === id ? next : r))
      setReaders(readersRef.current)
      persist()
    },
    [persist],
  )

  const removeReader = useCallback(
    (id: string) => {
      readersRef.current = readersRef.current.filter((r) => r.id !== id)
      if (activeRef.current === id) activeRef.current = readersRef.current[0]?.id ?? null
      setReaders(readersRef.current)
      setActiveId(activeRef.current)
      persist()
    },
    [persist],
  )

  const selectReader = useCallback(
    (id: string) => {
      if (!readersRef.current.some((r) => r.id === id)) return
      activeRef.current = id
      setActiveId(id)
      persist()
    },
    [persist],
  )

  const active = useMemo(
    () => readers.find((r) => r.id === activeId) ?? null,
    [readers, activeId],
  )

  const value = useMemo<ReaderContext>(
    () => ({
      ready,
      readers,
      active,
      bands: active ? bandsForAge(active.age) : [],
      addReader,
      updateReader,
      removeReader,
      selectReader,
    }),
    [ready, readers, active, addReader, updateReader, removeReader, selectReader],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useReaders() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useReaders must be used inside ReaderProvider")
  return ctx
}
