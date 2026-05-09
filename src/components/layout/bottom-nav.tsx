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
    <nav className="fixed bottom-4 left-4 right-4 z-50 flex h-20 items-center justify-around rounded-3xl glass-premium md:hidden px-4 shadow-2xl border border-foreground/5">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => haptic("light")}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 transition-all duration-300 flex-1 outline-none",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-all duration-300", 
              isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"
            )} />
            
            <span className={cn(
              "text-[9px] font-black tracking-tight transition-all duration-300 uppercase",
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
