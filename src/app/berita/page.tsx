import { getMarketNews } from "@/services/news"
import { BeritaClient } from "@/components/berita/berita-client"
import { scrapeCorporateActions } from "@/services/scraper"

export const revalidate = 3600 // revalidate every hour

export default async function BeritaPage() {
  const news = await getMarketNews()
  const corpActionResult = await scrapeCorporateActions()

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-5xl">
      <div className="flex flex-col items-center text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Portal Pasar Modal</h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl">
          Pantau jadwal aksi korporasi dan baca rangkuman berita terkini.
        </p>
      </div>

      <BeritaClient 
        news={news} 
        corpActionNews={corpActionResult.data} 
      />
    </div>
  )
}
