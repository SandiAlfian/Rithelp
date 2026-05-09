import { NextResponse } from "next/server";
import { youtubeService } from "@/services/youtubeService";

export async function GET() {
  try {
    const videos = await youtubeService.searchVideos(true);
    const isFallbackRSS = videos.some(v => v.isFallbackRSS);

    return NextResponse.json({
      success: true,
      data: {
        videos,
        total: videos.length,
        mode: "podcast",
        timestamp: new Date().toISOString(),
        isFallbackRSS
      }
    });
  } catch (error: any) {
    console.error("❌ [API] Error fetching podcasts:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
