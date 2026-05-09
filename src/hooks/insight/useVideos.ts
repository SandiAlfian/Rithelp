import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Video } from "@/types/insight"

export interface VideoData {
  videos: Video[]
  isFallbackRSS: boolean
}

export function useVideos() {
  return useQuery<VideoData>({
    queryKey: ["videos"],
    queryFn: async () => {
      const response = await axios.get("/api/insight/videos")
      return {
        videos: response.data?.data?.videos || [],
        isFallbackRSS: response.data?.data?.isFallbackRSS || false
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (sync with server cache)
  })
}
