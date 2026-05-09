import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Video } from "@/types/insight"

export interface PodcastData {
  videos: Video[]
  isFallbackRSS: boolean
}

export function usePodcasts() {
  return useQuery<PodcastData>({
    queryKey: ["podcasts"],
    queryFn: async () => {
      const response = await axios.get("/api/insight/podcasts")
      return {
        videos: response.data?.data?.videos || [],
        isFallbackRSS: response.data?.data?.isFallbackRSS || false
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}
