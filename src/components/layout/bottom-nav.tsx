"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems } from "@/config/nav"
import { motion } from "framer-motion"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 flex h-20 items-center justify-around rounded-3xl glass-premium md:hidden px-4 shadow-2xl border border-foreground/5">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 transition-all duration-300 flex-1 outline-none",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn(
              "transition-all duration-300", 
              isActive ? "h-6 w-6 stroke-[2.5px]" : "h-5 w-5 stroke-2"
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
