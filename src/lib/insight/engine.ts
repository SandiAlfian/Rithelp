import { Video } from "@/types/insight";

export function deduplicateContent<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function isPodcast(video: Video): boolean {
  const podcastKeywords = ["podcast", "episode", "ngobrol", "bincang", "diskusi", "talkshow"];
  const text = `${video.title} ${video.description}`.toLowerCase();
  return podcastKeywords.some(keyword => text.includes(keyword));
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}