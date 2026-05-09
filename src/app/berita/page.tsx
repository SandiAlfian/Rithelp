import { getMarketNews } from "@/services/news"
import { BeritaClient } from "@/components/berita/berita-client"
import { scrapeCorporateActions } from "@/services/scraper"

export const revalidate = 3600 // revalidate every hour

export default async function BeritaPage() {
  const news = await getMarketNews()
  const corpActionResult = await scrapeCorporateActions()

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-12 max-w-6xl">
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
          Portal <span className="text-primary text-glow">Pasar Modal</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-xl font-bold tracking-tight opacity-80">
          Pantau jadwal aksi korporasi dan analisis berita terkini secara real-time.
        </p>
      </div>

      <BeritaClient 
        news={news} 
        corpActionNews={corpActionResult.data} 
      />
    </div>
  )
}
