"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { Profile } from "@/lib/catalog"
import { thumbOf } from "@/lib/catalog"
import { Logo } from "@/components/logo"
import { Search, ChevronDown, Check } from "lucide-react"

const LINKS = ["Home", "Stories", "Series", "New"]

export function SiteNav({
  profiles,
  active,
  onSelect,
  onSearch,
}: {
  profiles: Profile[]
  active: Profile
  onSelect: (p: Profile) => void
  onSearch: () => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("Home")
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <nav className="flex h-16 items-center gap-6 px-4 sm:px-6 lg:px-10">
        <a href="#top" className="mr-2">
          <Logo />
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <li key={l}>
              <button
                onClick={() => setActiveLink(l)}
                className={`text-sm transition-colors ${
                  activeLink === l
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onSearch}
            aria-label="Search stories"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-white/10"
            >
              <Avatar profile={active} size={30} />
              <span className="hidden text-sm text-foreground sm:inline">
                {active.name}
              </span>
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
                  Who's reading?
                </p>
                {profiles.map((p) => {
                  const isActive = p.id === active.id
                  return (
                    <button
                      key={p.id}
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => {
                        onSelect(p)
                        setMenuOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06] ${
                        isActive ? "bg-white/[0.04]" : ""
                      }`}
                    >
                      <Avatar profile={p} size={38} />
                      <span className="flex-1">
                        <span className="block text-sm text-foreground">
                          {p.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          Age {p.age}
                        </span>
                      </span>
                      {isActive && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  )
                })}
                <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  Switch profiles to see how Storylands surfaces different
                  stories — the design never changes, only what's on the shelf.
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

function Avatar({ profile, size }: { profile: Profile; size: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-white/20"
      style={{ width: size, height: size }}
    >
      <Image
        src={thumbOf(profile.avatar) || "/placeholder.svg"}
        alt=""
        fill
        sizes="40px"
        className="object-cover"
      />
      <span
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `inset 0 0 0 2px ${profile.color.replace(")", " / 45%)")}` }}
      />
    </span>
  )
}
