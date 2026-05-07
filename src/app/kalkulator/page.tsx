"use client"

import { useState } from "react"
import { AverageDownCalculator } from "@/components/calculators/average-down"
import { RightIssueCalculator } from "@/components/calculators/right-issue"
import { DividendCalculator } from "@/components/calculators/dividend"
import { ArrowDownToLine, Briefcase, Landmark } from "lucide-react"

const menus = [
  { id: "average-down", label: "Average Down/Up", icon: ArrowDownToLine },
  { id: "right-issue", label: "Right Issue", icon: Briefcase },
  { id: "dividend", label: "Dividen", icon: Landmark },
]

export default function KalkulatorPage() {
  const [activeCalc, setActiveCalc] = useState("average-down")
  const [isAnimating, setIsAnimating] = useState(false)

  const handleMenuClick = (id: string) => {
    if (id === activeCalc) return
    setIsAnimating(true)
    setTimeout(() => {
      setActiveCalc(id)
      setIsAnimating(false)
    }, 150) // smooth transition duration
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-4xl">
      <div className="flex flex-col items-center text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Kalkulator Saham</h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl">
          Pilih modul di bawah ini dengan sekali klik untuk analisis yang lebih cepat.
        </p>
      </div>

      <div className="flex flex-col space-y-8 w-full">
        {/* Modern Interactive Menu - Sejajar (Horizontal) */}
        <div className="relative flex flex-row gap-2 p-1 md:p-2 bg-muted/30 rounded-xl md:rounded-full border shadow-inner overflow-x-auto no-scrollbar w-full">
          {menus.map((menu) => {
            const isActive = activeCalc === menu.id
            const Icon = menu.icon
            return (
              <button
                key={menu.id}
                onClick={() => handleMenuClick(menu.id)}
                className={`relative flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-2 md:px-6 rounded-lg md:rounded-full text-xs md:text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap ${
                  isActive
                    ? "text-primary shadow-md bg-background scale-100 z-10 border border-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                <span>{menu.label}</span>
              </button>
            )
          })}
        </div>

        {/* Calculator Content Area with Crossfade */}
        <div className="relative min-h-[400px]">
          <div
            className={`w-full transition-all duration-300 ease-in-out ${
              isAnimating ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
            }`}
          >
            {activeCalc === "average-down" && <AverageDownCalculator />}
            {activeCalc === "right-issue" && <RightIssueCalculator />}
            {activeCalc === "dividend" && <DividendCalculator />}
          </div>
        </div>
      </div>
    </div>
  )
}
