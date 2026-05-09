"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import Link from "next/link"

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between px-4 md:px-8 bg-transparent pointer-events-none">
      {/* Mobile Brand */}
      <div className="flex items-center md:hidden pointer-events-auto">
        <Link href="/" className="font-black text-xl tracking-tighter uppercase italic text-foreground">
          Rit<span className="text-primary">help</span>
        </Link>
      </div>

      <div className="hidden md:flex flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 bg-card/40 backdrop-blur-md p-1.5 rounded-2xl border border-foreground/5 shadow-xl"
        >
          <ThemeToggle />
        </motion.div>
      </div>
    </header>
  )
}
