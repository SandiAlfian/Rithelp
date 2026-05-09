"use client"

import { useCallback } from "react"

export function useHaptic() {
  const trigger = useCallback((style: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      switch (style) {
        case "light":
          navigator.vibrate(10)
          break
        case "medium":
          navigator.vibrate(20)
          break
        case "heavy":
          navigator.vibrate(50)
          break
        case "success":
          navigator.vibrate([10, 30, 10])
          break
        case "warning":
          navigator.vibrate([20, 50, 20])
          break
        case "error":
          navigator.vibrate([50, 100, 50, 100, 50])
          break
        default:
          navigator.vibrate(10)
      }
    }
  }, [])

  return trigger
}
