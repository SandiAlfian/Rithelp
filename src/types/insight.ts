export interface Ebook {
  id: string
  title: string
  author: string
  cover?: string
  year?: string
  description?: string
  link: string
  source: string
  score: number
  category: string
}

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  channel: string
  publishedAt: string
  duration: string
  durationSeconds?: number
  views?: number
  likes?: number
  score: number
  trustedChannel: boolean
  videoUrl: string
  embedUrl: string
  isFallbackRSS?: boolean
}

export interface InsightResponse {
  success: boolean
  data: {
    videos: Video[]
    total: number
    keyword: string
    mode: "video" | "podcast"
    timestamp: string
    isFallbackRSS?: boolean
  }
}

export interface EbookResult {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  format: string;
  size?: string;
  relevanceScore: number;
}