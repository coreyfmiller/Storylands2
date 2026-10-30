"use client"

import { useEffect, useRef, useState } from "react"
import { useReaders } from "@/components/providers/reader-provider"
import { colourOf, initialOf, type Reader } from "@/lib/readers"
import { Logo } from "@/components/logo"
import { Search, ChevronDown, Check, Plus } from "lucide-react"

// The nav used to carry four links — Home, Stories, Series, New — that set a
// local `activeLink` and navigated nowhere. Four controls that looked like
// navigation and were decoration. There is one page, so there is no nav.

export function SiteNav({
  onSearch,
  onManageReaders,
}: {
  onSearch: () => void
  onManageReaders: () => void
}) {
  const { readers, active, selectReader } = useReaders()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    // Escape closes it and returns focus to the control that opened it, which is
    // what a keyboard user expects and what the menu did not do.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <nav className="flex h-16 items-center gap-6 px-4 sm:px-6 lg:px-10">
        <a
          href="#top"
          aria-label="Back to the top of the library"
          className="mr-auto flex min-h-11 items-center"
        >
          <Logo />
        </a>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onSearch}
            aria-label="Search stories"
            className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {active ? (
            <div ref={menuRef} className="relative">
              <button
                ref={buttonRef}
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex min-h-11 items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-white/10"
              >
                <Avatar reader={active} size={30} />
                <span className="hidden text-sm text-foreground sm:inline">{active.name}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-lg border border-border bg-popover/95 shadow-2xl backdrop-blur-xl animate-fade-up"
                >
                  <p className="px-4 pb-1.5 pt-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Who&apos;s reading?
                  </p>
                  {readers.map((r) => {
                    const isActive = r.id === active.id
                    return (
                      <button
                        key={r.id}
                        role="menuitemradio"
                        aria-checked={isActive}
                        onClick={() => {
                          selectReader(r.id)
                          setMenuOpen(false)
                        }}
                        className={`flex w-full min-h-11 items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06] ${
                          isActive ? "bg-white/[0.04]" : ""
                        }`}
                      >
                        <Avatar reader={r} size={38} />
                        <span className="flex-1">
                          <span className="block text-sm text-foreground">{r.name}</span>
                          <span className="block text-xs text-muted-foreground">Age {r.age}</span>
                        </span>
                        {isActive && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    )
                  })}
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false)
                      onManageReaders()
                    }}
                    className="flex w-full min-h-11 items-center gap-3 border-t border-border px-3 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                  >
                    <span className="grid h-[38px] w-[38px] place-items-center rounded-full border border-dashed border-border">
                      <Plus className="h-4 w-4" />
                    </span>
                    Add or edit readers
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  )
}

/**
 * An initial on the reader's own colour.
 *
 * The old avatar used a character cover as a stand-in photo, which quietly told
 * a child that Pip was them. A letter is honest and needs no image.
 */
function Avatar({ reader, size }: { reader: Reader; size: number }) {
  const colour = colourOf(reader)
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-full font-serif font-medium text-black/75 ring-1 ring-white/20"
      style={{ width: size, height: size, background: colour, fontSize: Math.round(size * 0.46) }}
      aria-hidden
    >
      {initialOf(reader)}
    </span>
  )
}
