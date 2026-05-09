import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Topbar } from "@/components/layout/topbar"
import { PWARegistration } from "@/components/pwa-registration"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

import { QueryProvider } from "@/components/providers/query-provider"

export const metadata: Metadata = {
  title: "Rithelp - Asisten Analisis Saham Personal Anda",
  description: "Aplikasi analisis saham IHSG profesional dengan kalkulator saham, berita, dan chart.",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#0B1120",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans min-h-screen bg-background antialiased selection:bg-primary/30 text-foreground overflow-hidden`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PWARegistration />
            <div className="flex h-screen w-full overflow-hidden bg-background relative">
              {/* Ambient Background Effects - Soft Mint & Teal Glow */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[20%] w-[50%] h-[40%] bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[5%] right-[5%] w-[40%] h-[50%] bg-secondary/5 blur-[100px]" />
                <div className="absolute top-[30%] left-[-10%] w-[30%] h-[30%] bg-accent/5 blur-[80px]" />
              </div>

              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden relative">
                <Topbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-24 md:pb-8 px-4 md:px-0">
                  <div className="animate-fade-in">
                    {children}
                  </div>
                </main>
                <BottomNav />
              </div>
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
