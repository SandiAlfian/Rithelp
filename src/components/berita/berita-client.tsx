"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Newspaper, Building2, Search, ArrowUpRight, AlertCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useHaptic } from "@/hooks/use-haptic"

interface NewsItem {
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  source: string
  imageUrl?: string
}

export function BeritaClient({ 
  news, 
  corpActionNews,
}: { 
  news: NewsItem[]; 
  corpActionNews: NewsItem[];
}) {
  const [activeTab, setActiveTab] = useState<"corp" | "news">("corp")
  const haptic = useHaptic()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 12

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = (tab: "corp" | "news") => {
    setIsLoading(true)
    setActiveTab(tab)
    setCurrentPage(1)
    haptic("medium")
    setTimeout(() => setIsLoading(false), 600)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const currentList = activeTab === "corp" ? corpActionNews : news

  const filteredItems = currentList.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.source.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="flex flex-col space-y-10 w-full">
      {/* Modern Interactive Menu */}
      <div className="relative flex flex-wrap justify-center gap-2 p-2 bg-card/30 backdrop-blur-xl rounded-3xl border border-foreground/5 shadow-2xl w-full max-w-2xl mx-auto">
        <button
          onClick={() => handleTabChange("corp")}
          className={cn(
            "relative flex-1 min-w-[140px] flex items-center justify-center gap-3 py-4 md:py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 outline-none whitespace-nowrap z-10",
            activeTab === "corp" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeTab === "corp" && (
            <motion.div
              layoutId="news-active-tab"
              className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Building2 className={cn("w-4 h-4 shrink-0 transition-transform duration-500", activeTab === "corp" ? "scale-110" : "")} />
          <span className="truncate">Aksi Korporasi</span>
        </button>
        <button
          onClick={() => handleTabChange("news")}
          className={cn(
            "relative flex-1 min-w-[120px] md:min-w-[140px] flex items-center justify-center gap-2 md:gap-3 py-3 md:py-3 px-3 md:px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 outline-none whitespace-nowrap z-10",
            activeTab === "news" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeTab === "news" && (
            <motion.div
              layoutId="news-active-tab"
              className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Newspaper className={cn("w-4 h-4 shrink-0 transition-transform duration-500", activeTab === "news" ? "scale-110" : "")} />
          <span className="truncate">Berita Terkini</span>
        </button>
      </div>

      {/* Search & Warning */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-2xl font-black tracking-tight text-foreground/90 uppercase italic">
            {activeTab === "corp" ? "Corporate Action" : "Berita Pasar"}
          </h2>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Cari berita atau emiten..." 
              className="pl-11 h-11 bg-card/40 border-foreground/5 rounded-2xl focus:bg-card/60 transition-all duration-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {activeTab === "corp" && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 p-4 rounded-2xl border border-primary/20 backdrop-blur-md flex items-start gap-4"
          >
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
               <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed font-bold tracking-tight opacity-90">
              <strong>Disclaimer:</strong> Berita ini memuat indikasi rencana aksi korporasi (Dividen, RUPS, dll). Jadwal resmi mungkin berbeda. Selalu verifikasi melalui keterbukaan informasi di situs resmi BEI atau emiten terkait.
            </p>
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-24 md:py-40 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse scale-150" />
                <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:w-20 bg-card/50 backdrop-blur-xl rounded-full border border-primary/20 shadow-2xl">
                  <Loader2 className="w-7 h-7 md:w-8 md:h-8 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground/90">
                  <span className="shimmer-text">Memuat data</span>
                  <span className="loading-dots text-primary/60" />
                </h3>
                <p className="text-[11px] md:text-xs font-medium text-muted-foreground/60 max-w-[240px] md:max-w-xs mx-auto leading-relaxed">
                  Kami sedang menyiapkan informasi pasar modal terbaru untuk Anda.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={activeTab + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
            {paginatedItems.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-card/30 rounded-3xl border-dashed border-foreground/10">
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No Results Found</p>
              </div>
            ) : (
              paginatedItems.map((item, i) => (
                <motion.a 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  href={item.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  key={i} 
                  className="block group outline-none"
                >
                  <Card className="h-full bg-card/30 hover:bg-card/50 border-foreground/5 hover:border-primary/30 flex flex-col relative overflow-hidden group-hover:-translate-y-2 transition-all duration-500">
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                       <div className="p-2 rounded-xl bg-card/80 backdrop-blur-md border border-foreground/10 text-foreground">
                          <ArrowUpRight className="w-4 h-4" />
                       </div>
                    </div>

                    {item.imageUrl && (
                      <div className="w-full h-48 bg-muted/50 overflow-hidden relative border-b border-foreground/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-60" />
                      </div>
                    )}
                    <CardContent className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-5 gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10">
                          {item.source}
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight opacity-70">
                          {new Date(item.pubDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <h3 className="font-black text-lg group-hover:text-primary transition-colors mb-4 line-clamp-3 leading-tight tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 font-bold tracking-tight opacity-80 leading-relaxed">
                        {item.contentSnippet}
                      </p>
                    </CardContent>
                  </Card>
                </motion.a>
              ))
            )}
          </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={currentPage === 1}
              className="rounded-xl border-foreground/5 bg-card/30 backdrop-blur-md px-6 h-10"
            >
              Previous
            </Button>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-card/30 px-4 py-2.5 rounded-xl border border-foreground/5 backdrop-blur-md">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={currentPage === totalPages}
              className="rounded-xl border-foreground/5 bg-card/30 backdrop-blur-md px-6 h-10"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
