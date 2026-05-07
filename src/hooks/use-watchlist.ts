"use client"

import { useState, useEffect } from "react"

export interface WatchlistItem {
  symbol: string
  price: number
  change: number
  changePercent: number
}

// Data dummy untuk harga saat ini karena tidak ada API real-time
const mockPrices: Record<string, { price: number, change: number, changePercent: number }> = {
  BBCA: { price: 10000, change: 50, changePercent: 0.5 },
  BBRI: { price: 5000, change: -25, changePercent: -0.5 },
  GOTO: { price: 70, change: 1, changePercent: 1.45 },
  BMRI: { price: 6500, change: 100, changePercent: 1.56 },
  TLKM: { price: 3000, change: -50, changePercent: -1.64 },
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("rithelp_watchlist")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[]
        // Update with mock prices
        const enriched = parsed.map(symbol => ({
          symbol,
          ...(mockPrices[symbol] || { price: 0, change: 0, changePercent: 0 })
        }))
        setWatchlist(enriched)
      } catch {
        console.error("Failed to parse watchlist from local storage")
      }
    } else {
      // Set default
      const defaultList = ["BBCA", "BBRI", "GOTO"]
      localStorage.setItem("rithelp_watchlist", JSON.stringify(defaultList))
      setWatchlist(defaultList.map(symbol => ({
        symbol,
        ...(mockPrices[symbol] || { price: 0, change: 0, changePercent: 0 })
      })))
    }
  }, [])

  const addSymbol = (symbol: string) => {
    const upper = symbol.toUpperCase()
    if (!watchlist.find(item => item.symbol === upper)) {
      const newList = [...watchlist.map(i => i.symbol), upper]
      localStorage.setItem("rithelp_watchlist", JSON.stringify(newList))
      
      setWatchlist([...watchlist, {
        symbol: upper,
        ...(mockPrices[upper] || { price: 0, change: 0, changePercent: 0 })
      }])
    }
  }

  const removeSymbol = (symbol: string) => {
    const filtered = watchlist.filter(item => item.symbol !== symbol)
    localStorage.setItem("rithelp_watchlist", JSON.stringify(filtered.map(i => i.symbol)))
    setWatchlist(filtered)
  }

  return { watchlist, addSymbol, removeSymbol }
}
