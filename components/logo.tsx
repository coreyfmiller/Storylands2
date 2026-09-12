export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M12 2.5c1.4 3.6 3.4 5.6 7 7-3.6 1.4-5.6 3.4-7 7-1.4-3.6-3.4-5.6-7-7 3.6-1.4 5.6-3.4 7-7Z"
          fill="var(--primary)"
        />
      </svg>
      <span className="font-serif text-[1.35rem] font-medium leading-none tracking-tight text-foreground">
        Storylands
      </span>
    </span>
  )
}
