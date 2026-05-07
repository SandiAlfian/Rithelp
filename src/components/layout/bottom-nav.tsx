"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems } from "@/config/nav"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[72px] items-center justify-around border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden px-2 pb-2 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.2)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300 w-[72px] h-full",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground/80"
            )}
          >
            {/* Animated Pill Background */}
            <div className={cn(
              "absolute top-[6px] transition-all duration-300 rounded-full -z-10",
              isActive ? "bg-primary/15 w-14 h-[34px] scale-100 opacity-100" : "bg-transparent w-8 h-8 scale-50 opacity-0"
            )} />
            
            <item.icon className={cn(
              "transition-all duration-300 z-10 mt-1", 
              isActive ? "h-[22px] w-[22px] stroke-[2.5px] fill-primary/20" : "h-5 w-5 stroke-2"
            )} />
            
            <span className={cn(
              "text-[10px] text-center leading-tight transition-all duration-300 px-1 w-full truncate",
              isActive ? "font-bold tracking-tight" : "font-medium opacity-80"
            )}>
              {item.title}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
