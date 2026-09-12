"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  label: string
}

export function Modal({ open, onClose, children, label }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const mounted = useMounted()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-black/70 backdrop-blur-md"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        className="relative z-10 w-full min-h-full sm:min-h-0 sm:my-10 sm:w-[min(980px,92vw)]"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-background/70 text-foreground/80 backdrop-blur transition-colors hover:bg-background hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}

function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  return m
}
