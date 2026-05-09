import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Ebook } from "@/types/insight"

export function useEbooks(keyword: string) {
  return useQuery<Ebook[]>({
    queryKey: ["ebooks", keyword],
    queryFn: async () => {
      const response = await axios.get("/api/insight/ebooks", {
        params: { keyword }
      })
      return response.data
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
