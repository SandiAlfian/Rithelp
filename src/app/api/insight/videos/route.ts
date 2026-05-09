import { NextResponse } from "next/server";
import { youtubeService } from "@/services/youtubeService";

export async function GET() {
  try {
    const videos = await youtubeService.searchVideos(false);
    const isFallbackRSS = videos.some(v => v.isFallbackRSS);

    return NextResponse.json({
      success: true,
      data: {
        videos,
        total: videos.length,
        mode: "video",
        timestamp: new Date().toISOString(),
        isFallbackRSS
      }
    });
  } catch (error: unknown) {
    console.error("❌ [API] Error fetching videos:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}