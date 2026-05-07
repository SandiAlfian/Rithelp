import Parser from "rss-parser"

export interface NewsItem {
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  source: string
  imageUrl?: string
  priority?: number
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

const parser = new Parser<Record<string, unknown>, RssItem>({
  customFields: {
    item: ['enclosure', 'content:encoded', 'media:content'],
  },
})

// Fungsi pintar pengukur kesamaan judul berita
export function calculateSimilarity(title1: string, title2: string): number {
  const clean1 = title1.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/)
  const clean2 = title2.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/)
  
  // Hapus kata hubung
  const stopwords = ["dan", "atau", "yang", "di", "ke", "dari", "ini", "itu", "untuk", "dengan", "pada", "dalam", "bakal", "segera"]
  const tokens1 = clean1.filter(t => !stopwords.includes(t) && t.length > 2)
  const tokens2 = clean2.filter(t => !stopwords.includes(t) && t.length > 2)
  
  let matchCount = 0
  for (const token of tokens1) {
    if (tokens2.includes(token)) matchCount++
  }
  
  const minLength = Math.min(tokens1.length, tokens2.length)
  if (minLength === 0) return 0
  
  return matchCount / minLength
}

export async function getMarketNews(): Promise<NewsItem[]> {
  const feeds = [
    { url: "https://www.cnbcindonesia.com/market/rss", source: "CNBC Indonesia", priority: 1 },
    { url: "https://www.cnnindonesia.com/ekonomi/rss", source: "CNN Indonesia", priority: 2 },
    { url: "https://www.antaranews.com/rss/ekonomi-bisnis", source: "Antara News", priority: 3 },
  ]

  const allNews: NewsItem[] = []

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url)
      const items = parsed.items.slice(0, 20).map((item) => {
        let imageUrl = item.enclosure?.url ?? item['media:content']?.$?.url ?? ""
        if (!imageUrl && item['content:encoded']) {
          const imgMatch = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/)
          if (imgMatch) imageUrl = imgMatch[1]
        }
        if (!imageUrl && item.content) {
          const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/)
          if (imgMatch) imageUrl = imgMatch[1]
        }

        return {
          title: item.title ?? "",
          link: item.link ?? "",
          pubDate: item.pubDate ?? new Date().toISOString(),
          contentSnippet: item.contentSnippet ?? "",
          source: feed.source,
          imageUrl,
          priority: feed.priority
        } satisfies NewsItem
      })
      allNews.push(...items)
    } catch (error) {
      console.error(`Failed to fetch RSS from ${feed.source}:`, error)
    }
  }

  // Deduplikasi menggunakan algoritma kesamaan teks (threshold 60%)
  const deduplicatedNews: NewsItem[] = []

  for (const news of allNews) {
    let isDuplicate = false
    
    for (let i = 0; i < deduplicatedNews.length; i++) {
      const existing = deduplicatedNews[i]
      const similarity = calculateSimilarity(news.title, existing.title)
      
      if (similarity > 0.6) {
        isDuplicate = true
        // Ganti jika berita baru punya prioritas lebih tinggi (angka priority lebih kecil)
        if ((news.priority ?? 99) < (existing.priority ?? 99)) {
          deduplicatedNews[i] = news
        }
        break
      }
    }
    
    if (!isDuplicate) {
      deduplicatedNews.push(news)
    }
  }

  // Sort by date descending
  return deduplicatedNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 15)
}
