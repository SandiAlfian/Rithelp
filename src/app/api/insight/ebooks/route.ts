import { NextResponse } from "next/server"
import { ebookService } from "@/services/ebookService"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get("keyword") || "investasi saham"

  try {
    const ebooks = await ebookService.getAllEbooks(keyword)
    return NextResponse.json(ebooks)
  } catch (error) {
    console.error("API Route Ebook Error:", error)
    return NextResponse.json({ error: "Failed to fetch ebooks" }, { status: 500 })
  }
}
