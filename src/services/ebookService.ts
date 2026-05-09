import axios from "axios"
import { Ebook } from "@/types/insight"
import { deduplicateContent } from "@/lib/insight/engine"

export const ebookService = {
  async fetchGoogleBooks(query: string): Promise<Ebook[]> {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
        params: {
          q: `${query} stock market investment`,
          maxResults: 20,
          orderBy: "newest",
          printType: "books"
        }
      })

      return (response.data.items || []).map((item: any) => {
        const info = item.volumeInfo
        return {
          id: item.id,
          title: info.title,
          author: info.authors?.[0] || "Unknown Author",
          cover: info.imageLinks?.thumbnail?.replace("http:", "https:"),
          year: info.publishedDate?.split("-")[0] || "N/A",
          description: info.description?.slice(0, 150) + "...",
          link: info.previewLink || info.infoLink,
          source: "Google Books",
          score: info.averageRating * 20 || 70,
          category: "Ebook"
        }
      })
    } catch (error) {
      console.error("Google Books API Error:", error)
      return []
    }
  },

  async searchOpenLibrary(query: string): Promise<Ebook[]> {
    try {
      const response = await axios.get(`https://openlibrary.org/search.json`, {
        params: { q: query, limit: 15 }
      })

      return response.data.docs.map((book: any) => ({
        id: book.key,
        title: book.title,
        author: book.author_name?.[0] || "Unknown Author",
        cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : undefined,
        year: book.first_publish_year?.toString(),
        description: book.subject?.slice(0, 3).join(", "),
        link: `https://openlibrary.org${book.key}`,
        source: 'OpenLibrary',
        score: book.ratings_average * 20 || 60,
        category: "Archive"
      }))
    } catch (error) {
      return []
    }
  },

  async getAllEbooks(query: string = "investasi saham"): Promise<Ebook[]> {
    const currentYear = new Date().getFullYear()
    const minYear = currentYear - 10

    // Multi-Category Search Queries for Real Data
    const categories = [query, "stock market investing", "technical analysis", "fundamental analysis"]
    
    try {
      const requests = categories.map(cat => this.fetchGoogleBooks(cat))
      const results = await Promise.all([
        ...requests,
        this.searchOpenLibrary(query)
      ])
      
      const allBooks = results.flat()
      
      // Filter by last 10 years and ensure uniqueness
      const filtered = allBooks.filter(book => {
        const year = parseInt(book.year || "0")
        return year >= minYear || book.year === "N/A"
      })

      return deduplicateContent(filtered).sort((a, b) => {
        const yearA = parseInt(a.year || "0")
        const yearB = parseInt(b.year || "0")
        return yearB - yearA || b.score - a.score
      })
    } catch (e) {
      console.error("Ebook Aggregator Error:", e)
      return []
    }
  }
}
