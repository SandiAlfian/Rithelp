import Parser from "rss-parser"
import type { NewsItem } from "./news"
import { calculateSimilarity } from "./news"

const bulanMap: Record<string, number> = {
  'januari': 0, 'jan': 0,
  'februari': 1, 'feb': 1,
  'maret': 2, 'mar': 2,
  'april': 3, 'apr': 3,
  'mei': 4,
  'juni': 5, 'jun': 5,
  'juli': 6, 'jul': 6,
  'agustus': 7, 'agu': 7, 'agt': 7,
  'september': 8, 'sep': 8,
  'oktober': 9, 'okt': 9,
  'november': 10, 'nov': 10,
  'desember': 11, 'des': 11
}

function parseIndonesianDate(text: string, defaultYear: number): number | null {
  // Hanya mencari tanggal yang diawali konteks pelaksanaan (jarak maks 60 karakter)
  // Contoh: "cum date pada 15 Mei 2026", "jadwal pembagian dividen tanggal 12 Agustus"
  const dateRegex = /(?:cum date|ex date|jadwal|dibagikan|jatuh pada|pelaksanaan|pembayaran)[^\d]{0,60}?(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|jan|feb|mar|apr|jun|jul|agu|agt|sep|okt|nov|des)\s*(\d{4})?/i
  const match = text.match(dateRegex)
  
  if (match) {
    const day = parseInt(match[1], 10)
    const monthStr = match[2].toLowerCase()
    const month = bulanMap[monthStr]
    const year = match[3] ? parseInt(match[3], 10) : defaultYear
    
    if (month !== undefined) {
      return new Date(year, month, day).getTime()
    }
  }
  return null
}

// Typed RSS item shape matching our customFields
type RssItem = {
  title?: string
  link?: string
  pubDate?: string
  contentSnippet?: string
  enclosure?: { url?: string }
  'content:encoded'?: string
  'media:content'?: { $?: { url?: string } }
  content?: string
}

export async function scrapeCorporateActions(): Promise<{ data: NewsItem[], error: string | null }> {
  try {
    const parser = new Parser<Record<string, unknown>, RssItem>({
      customFields: {
        item: ['enclosure', 'content:encoded', 'media:content'],
      },
    })
    
    // Tarik berita dari CNBC dan Antara untuk cakupan yang luas
    const feeds = [
      { url: "https://www.cnbcindonesia.com/market/rss", source: "CNBC Indonesia", priority: 1 },
      { url: "https://www.cnnindonesia.com/ekonomi/rss", source: "CNN Indonesia", priority: 2 },
      { url: "https://www.antaranews.com/rss/ekonomi-bisnis", source: "Antara News", priority: 3 },
    ]
    
    const actions: NewsItem[] = []
    
    // Kata kunci untuk aksi korporasi yang "akan datang"
    const caRegex = /dividen|rups|rapat umum|stock split|right issue|hmetd|jadwal|cum date|bakal bagi|tebar|segera/i
    
    const now = new Date()
    const currentTimestamp = now.getTime()

    for (const feed of feeds) {
      try {
        const parsed = await parser.parseURL(feed.url)
        
        for (const item of parsed.items) {
          const title = item.title ?? ""
          const snippet = item.contentSnippet ?? ""
          const text = `${title} ${snippet}`
          
          // Jika berita membahas aksi korporasi
          if (caRegex.test(text)) {
            const pubDateObj = new Date(item.pubDate ?? now)
            
            // Filter 1: Pastikan usia berita maksimal 30 hari (2592000000 ms)
            const ageInMs = currentTimestamp - pubDateObj.getTime()
            if (ageInMs > 30 * 24 * 60 * 60 * 1000) {
              continue // Abaikan berita usang
            }

            // Filter 2: Cek apakah ada tanggal eksplisit (Cum Date/Pelaksanaan) di dalam teks
            const extractedTimestamp = parseIndonesianDate(text, pubDateObj.getFullYear())
            
            if (extractedTimestamp !== null) {
              // Jika tanggal yang disebutkan sudah terlewat lebih dari 1 hari (86400000 ms),
              // berarti aksi korporasi sudah selesai, jangan munculkan beritanya.
              if (extractedTimestamp < currentTimestamp - 86400000) {
                continue // Lewati iterasi (jangan di-push ke actions)
              }
            }

            // Ekstrak gambar (jika ada)
            let imageUrl = item.enclosure?.url ?? item['media:content']?.$?.url ?? ""
            if (!imageUrl && item['content:encoded']) {
              const imgMatch = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/)
              if (imgMatch) imageUrl = imgMatch[1]
            }
            if (!imageUrl && item.content) {
              const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/)
              if (imgMatch) imageUrl = imgMatch[1]
            }

            actions.push({
              title: title,
              link: item.link ?? "",
              pubDate: item.pubDate ?? now.toISOString(),
              contentSnippet: snippet,
              source: feed.source,
              imageUrl,
              priority: feed.priority
            })
          }
        }
      } catch (err) {
        console.error(`Failed to fetch RSS from ${feed.source}:`, err)
      }
    }

    // Deduplikasi menggunakan algoritma kesamaan teks dari modul news
    const deduplicatedActions: NewsItem[] = []

    for (const action of actions) {
      let isDuplicate = false
      for (let i = 0; i < deduplicatedActions.length; i++) {
        const existing = deduplicatedActions[i]
        const similarity = calculateSimilarity(action.title, existing.title)
        
        if (similarity > 0.6) {
          isDuplicate = true
          // Ganti jika berita baru punya prioritas lebih tinggi
          if ((action.priority ?? 99) < (existing.priority ?? 99)) {
            deduplicatedActions[i] = action
          }
          break
        }
      }
      if (!isDuplicate) {
        deduplicatedActions.push(action)
      }
    }

    // Urutkan berdasarkan tanggal terbaru
    const sortedActions = deduplicatedActions.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    if (sortedActions.length > 0) {
      // Ambil 15 berita terbaru
      return { data: sortedActions.slice(0, 15), error: null }
    } else {
      return { data: [], error: "Tidak ada berita aksi korporasi terbaru hari ini." }
    }
  } catch (error: unknown) {
    console.error("Gagal mengekstrak RSS:", error instanceof Error ? error.message : "Unknown error")
    return { data: [], error: "Gagal terhubung ke server berita untuk ekstraksi." }
  }
}
