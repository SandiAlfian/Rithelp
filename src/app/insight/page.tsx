import { InsightClient } from "@/components/insight/insight-client"

export const metadata = {
  title: "Insight Saham - Edukasi Investasi Rithelp",
  description: "Pusat edukasi saham terlengkap: Ebook gratis, Video edukasi, dan Podcast Saham populer.",
}

export default function InsightPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 max-w-7xl">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
          Insight <span className="text-primary italic">Saham</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base font-bold tracking-tight max-w-2xl opacity-80">
          Tingkatkan pemahaman Anda tentang pasar modal melalui kurasi sumber daya terbaik mulai dari Ebook gratis hingga video edukasi dan podcast terpopuler.
        </p>
      </div>

      <InsightClient />
    </div>
  )
}
