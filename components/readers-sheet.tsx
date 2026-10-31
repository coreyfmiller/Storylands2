"use client"

import { useEffect, useState } from "react"
import { Modal } from "@/components/modal"
import { useReaders } from "@/components/providers/reader-provider"
import {
  MAX_AGE,
  MIN_AGE,
  publishedAges,
  NAME_MAX,
  colourOf,
  initialOf,
  readerProblem,
} from "@/lib/readers"
import { Trash2, Plus } from "lucide-react"

// Add, rename and remove readers. The same form is used for both adding and
// editing, so the validation and the bounds cannot drift between them.

export function ReadersSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { readers, active, addReader, updateReader, removeReader, selectReader } = useReaders()

  return (
    <Modal open={open} onClose={onClose} label="Readers">
      <div className="mx-auto max-w-lg overflow-hidden bg-card px-6 pb-10 pt-12 shadow-2xl sm:rounded-xl sm:px-10">
        <h2 className="font-serif text-2xl font-medium text-foreground">Who&apos;s reading?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A name and an age, kept on this device only. Nothing is sent anywhere and there is
          no account to make.
        </p>

        {readers.length > 0 && (
          <ul className="mt-7 flex flex-col gap-2">
            {readers.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-serif text-base font-medium text-black/75"
                  style={{ background: colourOf(r) }}
                  aria-hidden
                >
                  {initialOf(r)}
                </span>
                <EditRow
                  name={r.name}
                  age={r.age}
                  onSave={(name, age) => updateReader(r.id, { name, age })}
                />
                {r.id !== active?.id && (
                  <button
                    onClick={() => selectReader(r.id)}
                    className="min-h-11 rounded-md px-3 text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Use
                  </button>
                )}
                <button
                  onClick={() => removeReader(r.id)}
                  aria-label={`Remove ${r.name}`}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <AddForm onAdd={(name, age) => addReader({ name, age })} hasAny={readers.length > 0} />

        {readers.length > 0 && (
          <button
            onClick={onClose}
            className="mt-8 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Done
          </button>
        )}
      </div>
    </Modal>
  )
}

/** Inline name + age editor. Saves on blur; there is no save button anywhere. */
function EditRow({
  name,
  age,
  onSave,
}: {
  name: string
  age: number
  onSave: (name: string, age: number) => void
}) {
  // Drafts, not the live values. Binding straight to a clamped store erases the
  // field on the first keystroke of a two-digit age.
  const [draftName, setDraftName] = useState(name)
  const [draftAge, setDraftAge] = useState(String(age))

  useEffect(() => {
    setDraftName(name)
    setDraftAge(String(age))
  }, [name, age])

  const commit = () => {
    const parsed = Number(draftAge)
    if (readerProblem({ name: draftName, age: parsed })) {
      setDraftName(name)
      setDraftAge(String(age))
      return
    }
    onSave(draftName, parsed)
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <input
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        onBlur={commit}
        maxLength={NAME_MAX}
        aria-label="Name"
        className="min-h-11 min-w-0 flex-1 rounded-md bg-transparent px-2 text-base text-foreground outline-none focus:bg-white/5"
      />
      <input
        value={draftAge}
        onChange={(e) => setDraftAge(e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
        onBlur={commit}
        inputMode="numeric"
        aria-label="Age"
        className="min-h-11 w-14 rounded-md bg-transparent px-2 text-center text-base text-foreground outline-none focus:bg-white/5"
      />
    </div>
  )
}

function AddForm({
  onAdd,
  hasAny,
}: {
  onAdd: (name: string, age: number) => void
  hasAny: boolean
}) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [touched, setTouched] = useState(false)
  const published = publishedAges()

  const problem = readerProblem({ name, age: Number(age) })
  const empty = name.trim() === "" && age === ""

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (problem) return
    onAdd(name, Number(age))
    setName("")
    setAge("")
    setTouched(false)
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-lg border border-dashed border-border p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {hasAny ? "Add another reader" : "Add a reader"}
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-xs text-muted-foreground">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={NAME_MAX}
            placeholder="Avery"
            /* text-base keeps iOS Safari from zooming the page on focus. */
            className="min-h-11 rounded-md border border-border bg-background px-3 text-base text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="flex w-20 flex-col gap-1">
          <span className="text-xs text-muted-foreground">Age</span>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
            inputMode="numeric"
            placeholder="5"
            className="min-h-11 rounded-md border border-border bg-background px-3 text-center text-base text-foreground outline-none focus:border-primary"
          />
        </label>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      {/* Only complain once something has been attempted. An empty form that is
          already scolding is the thing that makes people close a page. */}
      {touched && !empty && problem && (
        <p className="mt-3 text-xs text-foreground/80" role="alert">
          {problem}
        </p>
      )}
      {/* The ages PUBLISHED, not the ages the field accepts. Those are two
          different facts, and using MIN_AGE/MAX_AGE here claimed books for
          ages 0 to 12 on a library written for 4 to 6. */}
      <p className="mt-3 text-xs text-muted-foreground">
        Storylands books are written for ages {published.min} to {published.max}. Any age can
        have a profile.
      </p>
    </form>
  )
}
