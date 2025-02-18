"use client"
import { Search } from "lucide-react"

export function SearchCommand() {
  return (
    <button
      className="inline-flex items-center rounded-lg border border-input/40 bg-background px-3 py-1.5 text-sm shadow-sm transition-all hover:border-input hover:bg-accent/50 hover:text-accent-foreground group"
    >
      <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
      <span className="hidden lg:inline-flex text-muted-foreground group-hover:text-foreground">
        Search docs...
      </span>
      <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  )
}