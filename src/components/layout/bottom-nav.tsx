"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems } from "@/config/nav"
import { useHaptic } from "@/hooks/use-haptic"
export function BottomNav() {
  const pathname = usePathname()
  const haptic = useHaptic()

  return (
    <nav className="fixed bottom-4 left-2 right-2 z-50 flex h-16 items-center justify-between rounded-2xl glass-premium md:hidden px-1 shadow-2xl border border-foreground/5 overflow-hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => haptic("light")}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 transition-all duration-300 flex-1 min-w-0 outline-none flex-shrink-0",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-all duration-300 flex-shrink-0", 
              isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"
            )} />
            
            <span className={cn(
              "text-[8px] font-black tracking-tight transition-all duration-300 uppercase truncate w-full text-center px-1",
              isActive ? "opacity-100" : "opacity-60"
            )}>
              {item.shortTitle || item.title}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
