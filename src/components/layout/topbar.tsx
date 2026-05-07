"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:justify-end md:px-6">
      <div className="flex items-center md:hidden">
        <span className="font-bold text-lg tracking-tight">
          <span className="text-primary">Rithelp</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
