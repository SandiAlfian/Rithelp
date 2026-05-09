"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-xl hover:bg-primary/10 transition-all group"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <motion.div
        animate={{ rotate: theme === "dark" ? 0 : 90, scale: theme === "dark" ? 1 : 0 }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(108,189,143,0.5)]" />
      </motion.div>
      <motion.div
        animate={{ rotate: theme === "light" ? 0 : -90, scale: theme === "light" ? 1 : 0 }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-warning" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
      
      {/* Decorative dot */}
      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  )
}
