"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Newspaper, LineChart, ArrowRight, Sparkles, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

function AnimatedRithelp() {
  const letters = ["R", "I", "T", "H", "E", "L", "P"]
  
  return (
    <div className="flex justify-center space-x-1 sm:space-x-3 text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-4 cursor-default select-none">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ 
            opacity: 0, 
            y: 20,
            color: i >= 3 ? "inherit" : "#6CBD8F"
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            color: i >= 3 ? "#6CBD8F" : "inherit"
          }}
          transition={{ 
            duration: 0.8, 
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
            color: { duration: 1.2, delay: 0.5 + (i * 0.1) }
          }}
          whileHover={{ 
            y: -20, 
            color: i >= 3 ? "inherit" : "#6CBD8F",
            transition: { duration: 0.2 }
          }}
          className={cn(
            "inline-block transition-colors duration-500 drop-shadow-[0_0_20px_rgba(108,189,143,0.1)]",
            i >= 3 ? "text-primary" : "text-foreground"
          )}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  )
}

const features = [
  {
    title: "Analisis Chart",
    description: "Gunakan AI untuk mendeteksi pola harga dan mendapatkan panduan teknikal yang lebih cerdas.",
    href: "/chart",
    icon: LineChart,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "Kalkulator Saham",
    description: "Hitung rata-rata harga (Average Down/Up), simulasi Right Issue, dan estimasi Dividen dengan akurasi tinggi.",
    href: "/kalkulator",
    icon: Calculator,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "Insight Saham",
    description: "Perdalam ilmu pasar modal dengan kurasi Ebook, video edukasi, dan podcast populer.",
    href: "/insight",
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "Berita Informasi",
    description: "Pantau jadwal aksi korporasi emiten dan rangkuman berita pasar modal terkini secara real-time.",
    href: "/berita",
    icon: Newspaper,
    color: "text-primary",
    bg: "bg-primary/10"
  },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Background Glow Decorations - Mint & Sage Theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="container mx-auto p-6 md:p-12 space-y-12 max-w-7xl">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-10 pt-4 pb-12 md:pt-12 md:pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary shadow-lg shadow-primary/5 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Rithelp V.1.0
          </motion.div>
          
          <div className="space-y-6">
            <AnimatedRithelp />
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-3xl md:text-5xl font-black tracking-tight leading-tight"
            >
              Asisten Analisis <span className="text-primary text-glow italic">Saham Personal</span> Anda
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-bold tracking-tight opacity-80"
            >
              Kalkulator finansial presisi, berita emiten terkini, dan analisis chart berbasis AI dalam satu platform modern yang dirancang untuk investor cerdas.
            </motion.p>
          </div>

          {/* Labels removed as requested */}
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto pb-24">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + (i * 0.2), duration: 0.8 }}
            >
              <Link href={feature.href} className="group block h-full">
                <Card className="h-full bg-card/30 hover:bg-card/50 border-foreground/5 hover:border-primary/40 relative overflow-hidden group-hover:-translate-y-2 transition-all duration-500">
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-all duration-700" />
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 bg-primary/10 text-primary shadow-inner`}>
                        <feature.icon className="w-7 h-7" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-500">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-4 leading-relaxed font-bold tracking-tight opacity-80">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex items-center text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0">
                    <span>Mulai Sekarang</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
