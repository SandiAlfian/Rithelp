"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Newspaper, LineChart, ArrowRight } from "lucide-react"

function AnimatedRithelp() {
  const text = "RITHELP"
  const [prevIndex, setPrevIndex] = useState(-1)
  const [hoverStates, setHoverStates] = useState(Array(text.length).fill(0))

  useEffect(() => {
    // Efek gelombang animasi naik saat halaman pertama dimuat
    text.split("").forEach((_, i) => {
      setTimeout(() => {
        setHoverStates(prev => {
          const newStates = [...prev]
          newStates[i] = -1 // Bergerak naik
          return newStates
        })
        
        // Kembali ke posisi awal
        setTimeout(() => {
          setHoverStates(prev => {
            const newStates = [...prev]
            newStates[i] = 0 // Posisi normal
            return newStates
          })
        }, 300)
      }, i * 100) // Jeda 100ms antar huruf
    })
  }, [])

  const handleMouseEnter = (index: number) => {
    let direction = -1 // default UP (-y)
    if (prevIndex !== -1) {
      if (index > prevIndex) direction = -1 // left to right -> UP
      else if (index < prevIndex) direction = 1 // right to left -> DOWN
    }
    setPrevIndex(index)
    
    const newStates = [...hoverStates]
    newStates[index] = direction
    setHoverStates(newStates)
  }

  const handleMouseLeave = (index: number) => {
    const newStates = [...hoverStates]
    newStates[index] = 0
    setHoverStates(newStates)
  }

  return (
    <div 
      className="flex justify-center space-x-1 sm:space-x-2 text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-primary mb-4 cursor-crosshair"
      onMouseLeave={() => setPrevIndex(-1)}
    >
      {text.split("").map((letter, i) => (
        <span
          key={i}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
          className={`transition-all duration-300 ease-out inline-block hover:text-emerald-500 drop-shadow-sm hover:drop-shadow-lg ${
            hoverStates[i] === -1 
              ? "-translate-y-4 sm:-translate-y-6 md:-translate-y-8" 
              : hoverStates[i] === 1 
              ? "translate-y-4 sm:translate-y-6 md:translate-y-8" 
              : "translate-y-0"
          }`}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}

const features = [
  {
    title: "Kalkulator Saham",
    description: "Hitung Average Down/Up, Harga Teoretis Right Issue, dan Dividen Yield secara instan.",
    href: "/kalkulator",
    icon: Calculator,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Berita Informasi",
    description: "Pantau jadwal emiten dan baca rangkuman berita ekonomi terkini dari sumber terpercaya.",
    href: "/berita",
    icon: Newspaper,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Analisis Chart",
    description: "Analisa teknikal interaktif dengan indikator VMA, Auto Support/Resistance, atau analisis gambar.",
    href: "/chart",
    icon: LineChart,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-5xl">
      <div className="flex flex-col items-center text-center space-y-4 py-8 md:py-12">
        <AnimatedRithelp />
        
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
          Versi 1.0.0
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Pusat Analisis <span className="text-primary">IHSG</span> Anda
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Pilih alat analisis yang Anda butuhkan untuk mempermudah pengambilan keputusan investasi saham yang lebih cerdas dan terukur.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Link key={i} href={feature.href} className="group outline-none">
            <Card className="h-full transition-all duration-500 border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/60 group-focus-visible:ring-2 group-focus-visible:ring-emerald-500 overflow-hidden relative bg-card">
              
              {/* Highlight Catur (Chessboard Pattern) pada saat Hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" 
                style={{
                  backgroundImage: "linear-gradient(45deg, rgba(16, 185, 129, 0.05) 25%, transparent 25%, transparent 75%, rgba(16, 185, 129, 0.05) 75%, rgba(16, 185, 129, 0.05)), linear-gradient(45deg, rgba(16, 185, 129, 0.05) 25%, transparent 25%, transparent 75%, rgba(16, 185, 129, 0.05) 75%, rgba(16, 185, 129, 0.05))",
                  backgroundPosition: "0 0, 60px 60px",
                  backgroundSize: "120px 120px",
                  WebkitMaskImage: "radial-gradient(circle at top right, black 5%, transparent 70%)",
                  maskImage: "radial-gradient(circle at top right, black 5%, transparent 70%)"
                }} 
              />
              
              {/* Aksent Lingkaran Bawaan */}
              <div className={`absolute top-0 right-0 p-32 -mr-16 -mt-16 rounded-full transition-transform duration-500 ease-out group-hover:scale-150 opacity-10 ${feature.bg} z-0`} />
              
              <CardHeader className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 ${feature.bg} ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-emerald-500 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pt-4 flex items-center text-sm font-semibold text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                <span>Buka Modul</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
