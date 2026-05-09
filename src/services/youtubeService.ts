import axios from "axios";
import { TRUSTED_CHANNELS, BLACKLIST_KEYWORDS, POSITIVE_KEYWORDS } from "@/config/insight";
import { deduplicateContent, isPodcast } from "@/lib/insight/engine";
import { Video } from "@/types/insight";
import { youtubeCache } from "./youtubeCache";
import { youtubeRSS } from "./youtubeRSS";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const FIXED_QUERIES = {
  video: [
    "saham untuk pemula",
    "analisa fundamental saham",
    "broker summary saham",
    "volume profile saham",
    "technical analysis saham indonesia"
  ],
  podcast: [
    "podcast saham indonesia",
    "leon hartono saham",
    "the overpost saham"
  ]
};

const parseDurationToSeconds = (isoDuration: string): number => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match?.[1] || "0");
  const minutes = parseInt(match?.[2] || "0");
  const seconds = parseInt(match?.[3] || "0");
  return hours * 3600 + minutes * 60 + seconds;
};

const formatDisplayDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calculateAdvancedScore = (video: any): number => {
  let score = 0;
  const title = (video.snippet?.title || "").toLowerCase();
  const channel = (video.snippet?.channelTitle || "").toLowerCase();
  const stats = video.statistics || {};
  const views = parseInt(stats.viewCount || "0");

  if (TRUSTED_CHANNELS.some(c => channel.includes(c.toLowerCase()))) score += 50;
  if (channel.includes("overpost") || channel.includes("leon hartono")) score += 150;

  POSITIVE_KEYWORDS.forEach(word => {
    if (title.includes(word.toLowerCase())) score += 15;
  });

  BLACKLIST_KEYWORDS.forEach(word => {
    if (title.includes(word.toLowerCase())) score -= 50;
  });

  if (views > 100000) score += 20;

  return score;
};

export const youtubeService = {
  async searchVideos(isPodcastMode = false): Promise<Video[]> {
    const mode = isPodcastMode ? "podcast" : "video";
    
    // 1. PRIORITAS 1: Cek Cache (1 Hari)
    const cachedData = await youtubeCache.get(mode);
    if (cachedData) {
      console.log(`📦 Using Cache for ${mode}`);
      return cachedData;
    }

    // 2. PRIORITAS 2: YouTube API Minimal
    if (!YOUTUBE_API_KEY) return this.fallbackRSS(isPodcastMode);

    try {
      const queries = FIXED_QUERIES[mode];
      
      // Ambil ID Video saja (Hemat Quota: 100 per search)
      // Kita hanya ambil 2 query pertama untuk sangat menghemat kuota
      const searchRequests = queries.slice(0, 2).map(query => 
        axios.get(`${BASE_URL}/search`, {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults: 10,
            relevanceLanguage: "id",
            regionCode: "ID",
            safeSearch: "strict",
            key: YOUTUBE_API_KEY
          },
          timeout: 8000
        })
      );

      const responses = await Promise.all(searchRequests);
      const allItems = responses.flatMap(res => res.data.items || []);
      const videoIds = [...new Set(allItems.map(item => item.id.videoId).filter(Boolean))];

      if (videoIds.length === 0) return this.fallbackRSS(isPodcastMode);

      // Ambil statistics hanya untuk TOP 3 (Hemat Quota: 1 per request)
      // Fetch Snippet only for the rest (to save quota/complexity, actually videos.list is same cost)
      // We will fetch all details in one batch of 15 to be efficient
      const allDetailsResponse = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: "snippet,statistics,contentDetails",
          id: videoIds.slice(0, 15).join(","),
          key: YOUTUBE_API_KEY
        }
      });

      const detailedItems = allDetailsResponse.data.items || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalized: Video[] = detailedItems.map((item: any) => {
        const durationSeconds = parseDurationToSeconds(item.contentDetails?.duration || "PT0M");
        return {
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          channel: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          duration: formatDisplayDuration(durationSeconds),
          durationSeconds: durationSeconds,
          views: parseInt(item.statistics?.viewCount || "0"),
          likes: parseInt(item.statistics?.likeCount || "0"),
          score: calculateAdvancedScore(item),
          trustedChannel: TRUSTED_CHANNELS.some(c => item.snippet.channelTitle.toLowerCase().includes(c.toLowerCase())),
          videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
          embedUrl: `https://www.youtube.com/embed/${item.id}`,
        };
      });

      const deduped = deduplicateContent(normalized);
      const filtered = deduped.filter(v => {
        const text = `${v.title} ${v.description}`.toLowerCase();
        if (BLACKLIST_KEYWORDS.some(word => text.includes(word.toLowerCase()))) return false;
        if ((v.durationSeconds || 0) < 120) return false;
        if (isPodcastMode) {
          return (v.durationSeconds || 0) > 600 || isPodcast(v) || v.channel.toLowerCase().includes("overpost");
        }
        return v.score > -10;
      });

      const result = filtered
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);

      // Simpan ke Cache
      await youtubeCache.set(mode, result);
      return result;

    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isQuotaError = error instanceof Error && (error as any).response?.status === 403;
      if (isQuotaError) {
        console.warn("⚠️ Quota Exceeded. Switching to RSS Fallback.");
        return this.fallbackRSS(isPodcastMode);
      }
      console.error("YouTube API Error:", error instanceof Error ? error.message : "Unknown error");
      return this.fallbackRSS(isPodcastMode);
    }
  },

  async fallbackRSS(isPodcastMode: boolean): Promise<Video[]> {
    // A. Edukasi: Saham dari Nol (UCswSgqh8pCrDohjvE71KUtw)
    // B. Podcast: Leon Hartono (UCFWKvu581DpCRFfadjjIy7w)
    const channelId = isPodcastMode ? "UCFWKvu581DpCRFfadjjIy7w" : "UCswSgqh8pCrDohjvE71KUtw";
    const channelName = isPodcastMode ? "Leon Hartono" : "Saham dari Nol";
    
    const rssVideos = await youtubeRSS.fetchFromChannel(channelId, channelName);
    return rssVideos;
  }
};