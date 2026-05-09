"use client"

import { useState } from "react"
import { AverageDownCalculator } from "@/components/calculators/average-down"
import { RightIssueCalculator } from "@/components/calculators/right-issue"
import { DividendCalculator } from "@/components/calculators/dividend"
import { ArrowDownToLine, Briefcase, Landmark, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const menus = [
  { id: "average-down", label: "Average Down/Up", icon: ArrowDownToLine },
  { id: "right-issue", label: "Right Issue", icon: Briefcase },
  { id: "dividend", label: "Dividen", icon: Landmark },
]

export default function KalkulatorPage() {
  const [activeCalc, setActiveCalc] = useState("average-down")

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-12 max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-4">

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black tracking-tighter"
        >
          Kalkulator <span className="text-primary text-glow">Saham</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base max-w-xl font-bold tracking-tight opacity-80"
        >
          Hitung rata-rata harga, simulasi right issue, dan estimasi dividen dengan akurasi tinggi dalam satu dashboard terintegrasi.
        </motion.p>
      </div>

      <div className="flex flex-col space-y-10 w-full">
        {/* Modern Interactive Menu */}
        <div className="relative flex flex-wrap justify-center gap-2 p-2 bg-card/30 backdrop-blur-xl rounded-3xl border border-foreground/5 shadow-2xl w-full max-w-2xl mx-auto">
          {menus.map((menu) => {
            const isActive = activeCalc === menu.id
            const Icon = menu.icon
            return (
              <button
                key={menu.id}
                onClick={() => setActiveCalc(menu.id)}
                className={cn(
                  "relative flex-1 min-w-[140px] flex items-center justify-center gap-3 py-4 md:py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 outline-none whitespace-nowrap z-10",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="calc-active-tab"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("w-4 h-4 transition-transform duration-500", isActive ? "scale-110" : "")} />
                <span>{menu.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content Area with AnimatePresence */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCalc}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="w-full"
            >
              {activeCalc === "average-down" && <AverageDownCalculator />}
              {activeCalc === "right-issue" && <RightIssueCalculator />}
              {activeCalc === "dividend" && <DividendCalculator />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
