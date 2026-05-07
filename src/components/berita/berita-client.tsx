"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Newspaper, Building2, Search } from "lucide-react"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)

  const handleTabClick = (tab: "corp" | "news") => {
    if (tab === activeTab) return
    setIsAnimating(true)
    setTimeout(() => {
      setActiveTab(tab)
      setIsAnimating(false)
    }, 150)
  }

  const currentList = activeTab === "corp" ? corpActionNews : news

  const filteredItems = currentList.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.source.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col space-y-8 w-full">
      {/* Modern Interactive Menu - Sejajar (Horizontal) */}
      <div className="relative flex flex-row gap-2 p-1 md:p-2 bg-muted/30 rounded-xl md:rounded-full border shadow-inner overflow-x-auto no-scrollbar w-full">
        <button
          onClick={() => handleTabClick("corp")}
          className={`relative flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-2 md:px-6 rounded-lg md:rounded-full text-xs md:text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap ${
            activeTab === "corp"
              ? "text-primary shadow-md bg-background scale-100 z-10 border border-primary/20"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Building2 className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${activeTab === "corp" ? "scale-110" : ""}`} />
          <span>Berita Aksi Korporasi</span>
        </button>
        <button
          onClick={() => handleTabClick("news")}
          className={`relative flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-2 md:px-6 rounded-lg md:rounded-full text-xs md:text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap ${
            activeTab === "news"
              ? "text-primary shadow-md bg-background scale-100 z-10 border border-primary/20"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Newspaper className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${activeTab === "news" ? "scale-110" : ""}`} />
          <span>Berita Terkini</span>
        </button>
      </div>

      {/* Content Area with Crossfade */}
      <div className="relative min-h-[400px]">
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            isAnimating ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
          }`}
        >
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-semibold">
                {activeTab === "corp" ? "Berita & Informasi Emiten" : "Berita Pasar Modal Terkini"}
              </h2>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari berita atau emiten..." 
                  className="pl-9 w-full bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {activeTab === "corp" && (
              <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50">
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <strong>Peringatan:</strong> Berita di bawah ini memuat indikasi rencana aksi korporasi yang akan datang (seperti Dividen atau RUPS). Jadwal resmi mungkin berbeda dengan spekulasi rilis. Harap selalu tinjau sumber resmi emiten untuk kepastian.
                </p>
              </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.length === 0 ? (
                <p className="text-muted-foreground col-span-full py-8 text-center border rounded-xl border-dashed">
                  {activeTab === "corp" 
                    ? `Tidak ada berita rencana aksi korporasi terbaru yang cocok dengan "${searchQuery}".` 
                    : `Tidak ada berita yang cocok dengan pencarian "${searchQuery}".`
                  }
                </p>
              ) : (
                filteredItems.map((item, i) => (
                  <a href={item.link} target="_blank" rel="noreferrer" key={i} className="block group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                    <Card className="h-full overflow-hidden hover:bg-muted/30 transition-all duration-300 hover:shadow-lg hover:border-primary/30 flex flex-col">
                      {item.imageUrl && (
                        <div className="w-full h-48 bg-muted overflow-hidden relative border-b">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardContent className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">{item.source}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(item.pubDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors mb-2 line-clamp-3">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mt-auto">
                          {item.contentSnippet}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
