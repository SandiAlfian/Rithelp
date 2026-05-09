import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analisis Chart",
  description: "Gunakan AI untuk mendeteksi pola harga dan mendapatkan panduan teknikal yang lebih cerdas.",
}

export default function ChartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
