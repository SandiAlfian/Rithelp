import { Calculator, LayoutDashboard, LineChart, Newspaper, BookOpen } from "lucide-react"

export const navItems = [
  {
    title: "Dashboard",
    shortTitle: "Home",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Analisis Chart",
    shortTitle: "Analisis",
    href: "/chart",
    icon: LineChart,
  },
  {
    title: "Kalkulator Saham",
    shortTitle: "Kalkulator",
    href: "/kalkulator",
    icon: Calculator,
  },
  {
    title: "Insight Saham",
    shortTitle: "Insight",
    href: "/insight",
    icon: BookOpen,
  },
  {
    title: "Berita Informasi",
    shortTitle: "Berita",
    href: "/berita",
    icon: Newspaper,
  },
]
