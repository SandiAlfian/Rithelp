import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kalkulator Saham",
  description: "Hitung rata-rata harga, simulasi right issue, dan estimasi dividen dengan akurasi tinggi.",
}

export default function KalkulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
