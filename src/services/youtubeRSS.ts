import axios from "axios";
import { Video } from "@/types/insight";

export const youtubeRSS = {
  async fetchFromChannel(channelId: string, channelName: string): Promise<Video[]> {
    try {
      const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const response = await axios.get(url, { timeout: 8000 });
      const xml = response.data;

      // Extract entries using regex (simpler than adding an XML parser)
      const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
      
      return entryMatches.map((entry: string) => {
        const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || "";
        const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || "Untitled Video";
        const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || "";
        const description = entry.match(/<media:description>(.*?)<\/media:description>/)?.[1] || "";
        const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        return {
          id: videoId,
          title: title.replace(/<!\[CDATA\[(.*?)\]\]>/, "$1"),
          description: description.slice(0, 150) + "...",
          thumbnail,
          channel: channelName,
          publishedAt: published,
          duration: "RSS Mode",
          score: 100, // RSS from trusted channel is always good
          trustedChannel: true,
          isFallbackRSS: true,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
        };
      });
    } catch (error) {
      console.error(`RSS Fetch Error for ${channelName}:`, error);
      return [];
    }
  }
};
