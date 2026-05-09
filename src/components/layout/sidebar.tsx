"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems } from "@/config/nav"
import { motion } from "framer-motion"
import { useHaptic } from "@/hooks/use-haptic"

export function Sidebar() {
  const pathname = usePathname()
  const haptic = useHaptic()

  return (
    <aside className="hidden w-72 flex-col bg-card md:flex relative z-50 border-r border-foreground/5 shadow-2xl transition-colors duration-300">
      {/* Brand area */}
      <div className="flex h-20 items-center border-b border-foreground/5 px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-foreground font-black text-2xl tracking-tighter uppercase italic">
            Rit<span className="text-primary">help</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-6 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => haptic("light")}
              className="relative block outline-none group"
            >
              <div
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 relative z-10",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-primary/10 text-primary scale-110 shadow-sm shadow-primary/5" : "bg-muted/50 group-hover:bg-primary/5 group-hover:text-primary"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="tracking-tight">{item.title}</span>
                
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/5 rounded-2xl -z-10 border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
