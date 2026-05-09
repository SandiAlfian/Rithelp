"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  Library, PlayCircle, Mic, ExternalLink, Play, 
  Shield, BookOpen, AlertTriangle, RefreshCw, 
  Video, X, Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEbooks } from "@/hooks/insight/useEbooks"
import { useVideos } from "@/hooks/insight/useVideos"
import { usePodcasts } from "@/hooks/insight/usePodcasts"

type TabType = "ebook" | "video" | "podcast"

interface EbookItem {
  id: string | number;
  title: string;
  author: string;
  cover?: string;
  category: string;
  year?: string;
  source: string;
  description: string;
  link: string;
}

interface VideoItem {
  id: string | number;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: string;
  embedUrl?: string;
  trustedChannel?: boolean;
  isFallbackRSS?: boolean;
}

function CustomBookCover({ title, author }: { title: string, author: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex flex-col items-center justify-center p-6 text-center border-b border-foreground/5 relative overflow-hidden">
      <div className="absolute top-0 left-4 w-4 h-full bg-primary/10" />
      <BookOpen className="w-12 h-12 text-primary/40 mb-4" />
      <h3 className="text-sm font-black uppercase tracking-tighter leading-tight line-clamp-3 mb-2">{title}</h3>
      <p className="text-[10px] font-bold text-muted-foreground opacity-70">{author}</p>
    </div>
  )
}


export function InsightClient() {
  const [activeTab, setActiveTab] = useState<TabType>("ebook")
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Real Data Hooks - Clean & Quota Efficient
  const { data: ebooks, isLoading: isLoadingEbooks, refetch: refetchEbooks, isError: isErrorEbooks } = useEbooks("investasi saham")
  const { data: videoData, isLoading: isLoadingVideos, refetch: refetchVideos, isError: isErrorVideos } = useVideos()
  const { data: podcastData, isLoading: isLoadingPodcasts, refetch: refetchPodcasts, isError: isErrorPodcasts } = usePodcasts()

  const openInYoutube = (v: VideoItem) => {
    setSelectedVideo(v)
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const isLoading = 
    (activeTab === "ebook" && isLoadingEbooks) || 
    (activeTab === "video" && isLoadingVideos) || 
    (activeTab === "podcast" && isLoadingPodcasts)

  const isError = 
    (activeTab === "ebook" && isErrorEbooks) || 
    (activeTab === "video" && isErrorVideos) || 
    (activeTab === "podcast" && isErrorPodcasts)

  const currentItems = (() => {
    const data = activeTab === "ebook" ? ebooks : activeTab === "video" ? videoData?.videos : podcastData?.videos
    if (!data) return []
    const start = (currentPage - 1) * itemsPerPage
    return data.slice(start, start + itemsPerPage)
  })()

  const totalPages = (() => {
    const data = activeTab === "ebook" ? ebooks : activeTab === "video" ? videoData?.videos : podcastData?.videos
    if (!data) return 0
    return Math.ceil(data.length / itemsPerPage)
  })()


  return (
    <div className="flex flex-col space-y-8 w-full pb-20 pt-8">


      {/* Tabs Menu */}
      <div className="relative flex flex-wrap justify-center gap-2 p-2 bg-card/30 backdrop-blur-xl rounded-3xl border border-foreground/5 shadow-2xl w-full max-w-4xl mx-auto">
        <button
          onClick={() => handleTabChange("ebook")}
          className={cn(
            "relative flex-1 min-w-[120px] md:min-w-[140px] flex items-center justify-center gap-3 py-4 md:py-3 px-4 md:px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 outline-none whitespace-nowrap z-10",
            activeTab === "ebook" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeTab === "ebook" && (
            <motion.div
              layoutId="insight-active-tab"
              className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Library className={cn("w-4 h-4 shrink-0 transition-transform duration-500", activeTab === "ebook" ? "scale-110" : "")} />
          <span>Ebook Saham</span>
        </button>

        <button
          onClick={() => handleTabChange("video")}
          className={cn(
            "relative flex-1 min-w-[120px] md:min-w-[140px] flex items-center justify-center gap-3 py-4 md:py-3 px-4 md:px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 outline-none whitespace-nowrap z-10",
            activeTab === "video" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeTab === "video" && (
            <motion.div
              layoutId="insight-active-tab"
              className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <PlayCircle className={cn("w-4 h-4 shrink-0 transition-transform duration-500", activeTab === "video" ? "scale-110" : "")} />
          <span>Video Edukasi</span>
        </button>

        <button
          onClick={() => handleTabChange("podcast")}
          className={cn(
            "relative flex-1 min-w-[120px] md:min-w-[140px] flex items-center justify-center gap-3 py-4 md:py-3 px-4 md:px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 outline-none whitespace-nowrap z-10",
            activeTab === "podcast" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeTab === "podcast" && (
            <motion.div
              layoutId="insight-active-tab"
              className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Mic className={cn("w-4 h-4 shrink-0 transition-transform duration-500", activeTab === "podcast" ? "scale-110" : "")} />
          <span>Podcast Populer</span>
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + (isLoading ? "-loading" : "-ready")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {isLoading ? (
            <div className="col-span-full py-40 flex flex-col items-center text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse scale-150" />
                <div className="relative flex items-center justify-center w-20 h-20 bg-card/50 backdrop-blur-xl rounded-full border border-primary/20 shadow-2xl">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground/90">
                  <span className="shimmer-text">Memuat data</span>
                  <span className="loading-dots text-primary/60" />
                </h3>
                <p className="text-xs font-medium text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
                  Kami sedang menyiapkan konten edukasi terbaik untuk strategi trading Anda.
                </p>
              </div>
            </div>
          ) : isError ? (
            <div className="col-span-full py-40 flex flex-col items-center text-center space-y-8">
              <div className="relative flex items-center justify-center w-20 h-20 bg-red-500/5 rounded-full border border-red-500/10">
                <AlertTriangle className="w-8 h-8 text-red-500/40" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold tracking-tight text-red-500/80">
                  Koneksi terputus
                </h3>
                <p className="text-xs font-medium text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
                  Gagal menghubungi server. Pastikan koneksi internet stabil lalu coba lagi.
                </p>
              </div>
              <Button 
                onClick={() => {
                  if (activeTab === "ebook") refetchEbooks()
                  else if (activeTab === "video") refetchVideos()
                  else refetchPodcasts()
                }}
                className="rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest h-11 px-8 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
              >
                <RefreshCw className="w-4 h-4" />
                Coba Lagi
              </Button>
            </div>
          ) : (
            <>
              {activeTab === "ebook" && currentItems.map((eb: EbookItem) => (
                <Card key={eb.id} className="bg-card/40 backdrop-blur-md border-foreground/5 hover:border-primary/40 group transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                  <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                    {/* eslint-disable @next/next/no-img-element */}
                    {eb.cover ? (
                      <img src={eb.cover} alt={eb.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <CustomBookCover title={eb.title} author={eb.author} />
                    )}
                    {/* eslint-enable @next/next/no-img-element */}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter">
                          {eb.category}
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60">
                        {eb.year && eb.year !== "N/A" ? eb.year : eb.source}
                      </span>
                    </div>
                    <CardTitle className="text-sm md:text-base group-hover:text-primary transition-colors duration-300 line-clamp-2">{eb.title}</CardTitle>
                    <CardDescription className="font-bold text-[10px] mt-2 uppercase opacity-70 italic">{eb.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 font-medium opacity-80">
                      {eb.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest h-11 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 group/btn"
                      onClick={() => window.open(eb.link, "_blank")}
                    >
                      <Library className="w-4 h-4" />
                      Baca Ebook
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-all ml-auto" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {(activeTab === "video" || activeTab === "podcast") && currentItems.map((v: VideoItem) => (
                <Card key={v.id} className="bg-card/40 backdrop-blur-md border-foreground/5 hover:border-primary/40 group transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                  <div className="aspect-video relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div 
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => setSelectedVideo(v)}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-transform duration-500">
                        <Play className="w-6 h-6 fill-current" />
                      </div>
                    </div>
                    {v.trustedChannel && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-primary/90 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <Shield className="w-3 h-3 fill-current" />
                        Verified
                      </div>
                    )}
                    {v.isFallbackRSS && (
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-amber-500/90 backdrop-blur-md text-[8px] font-black text-white uppercase tracking-widest shadow-lg">
                        RSS Mode
                      </div>
                    )}
                  </div>
                  <CardHeader className="flex-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 opacity-80 flex items-center gap-1">
                      {activeTab === "video" ? <Video className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      {v.channel}
                    </p>
                    <CardTitle className="text-sm leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {v.title}
                    </CardTitle>
                    {v.duration && v.duration !== "RSS Mode" && (
                      <span className="text-[9px] font-black text-muted-foreground/60 uppercase mt-2">Duration: {v.duration}</span>
                    )}
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      className="w-full rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest h-11 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                      onClick={() => openInYoutube(v)}
                    >
                      {activeTab === "video" ? <PlayCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {activeTab === "video" ? "Tonton Video" : "Dengar Podcast"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded-xl border-foreground/5 bg-card/30 backdrop-blur-md px-6 h-10"
          >
            Next
          </Button>
        </div>
      )}

      {/* Video Player Modal */}
      {isMounted && createPortal(
        <AnimatePresence>
          {selectedVideo && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl bg-card border border-foreground/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-foreground/5 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {activeTab === "video" ? <Video className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm line-clamp-1">{selectedVideo.title}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">{selectedVideo.channel}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={selectedVideo.embedUrl || `https://www.youtube.com/embed/${selectedVideo.id}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
