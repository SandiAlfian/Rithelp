"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calculator, CheckSquare, Sparkles, Loader2, AlertTriangle, Eye, EyeOff, Copy, Check, ImagePlus, X, BookOpen, Info } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const TIMEFRAMES = [
  "1m", "3m", "5m", "10m", "15m", "30m", "1H", "2H", "4H", "Daily", "Weekly", "Monthly"
]

export function TradingSystemDashboard() {
  const [activeTab, setActiveTab] = useState<"ai" | "calculator" | "checklist">("ai")
  const [isAnimating, setIsAnimating] = useState(false)

  const [image, setImage] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<string>("5m")
  const [price, setPrice] = useState<string>("")
  const [capital, setCapital] = useState<string>("10000000")
  const [targetProfit, setTargetProfit] = useState<string>("50000")
  const [targetGainCustom, setTargetGainCustom] = useState<string>("2.5")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isExtractingPrice, setIsExtractingPrice] = useState(false)
  const [priceFromChart, setPriceFromChart] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
      setAiResult(null)
      setPriceFromChart(false)
    }
    reader.readAsDataURL(file)
  }, [])

  // Paste dari clipboard (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile()
          if (file) processImageFile(file)
          break
        }
      }
    }
    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [processImageFile])

  // Checklist state
  const MUTLAK_ITEMS = [
    "Harga saat ini BERADA DI ATAS garis VWAP secara jelas.",
    "Indikator EMA20 sedang MENANJAK (Upward slope), tidak datar.",
    "Candle Breakout didominasi Body (bukan ekor atas panjang).",
    "Ada bukti Volume Ekspansi (volume hijau besar) menyertai pergerakan.",
  ]
  const TAMBAH_ITEMS = [
    "Indikator ROC bernilai positif (> 0) dan tidak menukik tajam ke bawah.",
    "Candle koreksi/pullback (jika ada) ditahan kuat oleh VWAP atau EMA20.",
    "Jarak harga saat ini ke area Resisten/Supply selanjutnya masih lebar (> 2%).",
    "Terdapat konfirmasi 'Follow-through' setelah candle penembusan.",
  ]
  const [mutlakChecked, setMutlakChecked] = useState<boolean[]>(Array(4).fill(false))
  const [tambahChecked, setTambahChecked] = useState<boolean[]>(Array(4).fill(false))
  const [isAutoChecking, setIsAutoChecking] = useState(false)
  const [autoChecked, setAutoChecked] = useState(false)

  const mutlakScore = mutlakChecked.filter(Boolean).length
  const tambahScore = tambahChecked.filter(Boolean).length
  const totalScore = mutlakScore + tambahScore
  const allMutlakPassed = mutlakScore === MUTLAK_ITEMS.length

  const verdict = allMutlakPassed && tambahScore >= 2
    ? "LAYAK ENTRY"
    : mutlakScore >= 3
    ? "PERTIMBANGKAN ULANG"
    : "JANGAN TRADING"

  const verdictColor = verdict === "LAYAK ENTRY"
    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
    : verdict === "PERTIMBANGKAN ULANG"
    ? "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300"
    : "bg-destructive/10 border-destructive/40 text-destructive"

  const resetChecklist = () => {
    setMutlakChecked(Array(4).fill(false))
    setTambahChecked(Array(4).fill(false))
    setAutoChecked(false)
  }

  const autoCheckFromChart = async () => {
    if (!image) return
    setIsAutoChecking(true)
    try {
      const prompt = `Anda adalah sistem validasi teknikal untuk saham IDX. Analisis gambar chart ini dan tentukan apakah setiap kondisi berikut TERPENUHI atau TIDAK berdasarkan visual chart.

Jawab HANYA dalam format JSON array of boolean, 8 nilai (true/false), dalam urutan persis berikut:
1. Harga saat ini berada di atas garis VWAP secara jelas.
2. Indikator EMA20 sedang menanjak (Upward slope), tidak datar.
3. Candle Breakout didominasi Body (bukan ekor atas panjang).
4. Ada bukti Volume Ekspansi (volume hijau besar) menyertai pergerakan.
5. Indikator ROC bernilai positif (> 0) dan tidak menukik tajam ke bawah.
6. Candle koreksi/pullback (jika ada) ditahan kuat oleh VWAP atau EMA20.
7. Jarak harga saat ini ke area Resisten/Supply selanjutnya masih lebar (> 2%).
8. Terdapat konfirmasi Follow-through setelah candle penembusan.

Jika indikator tertentu tidak terlihat di chart, anggap false.
Contoh format jawaban yang benar: [true,false,true,true,false,false,true,false]
JAWAB HANYA JSON ARRAY, tidak ada teks lain.`

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, prompt })
      })
      const data = await res.json()
      if (res.ok && data.result) {
        const match = data.result.match(/\[.*?\]/s)
        if (match) {
          const parsed: boolean[] = JSON.parse(match[0])
          if (Array.isArray(parsed) && parsed.length === 8) {
            setMutlakChecked(parsed.slice(0, 4))
            setTambahChecked(parsed.slice(4, 8))
            setAutoChecked(true)
          }
        }
      }
    } catch {
      // Gagal, biarkan manual
    } finally {
      setIsAutoChecking(false)
    }
  }

  const handleTabClick = (tab: "ai" | "calculator" | "checklist") => {
    if (tab === activeTab) return
    setIsAnimating(true)
    setTimeout(() => {
      setActiveTab(tab)
      setIsAnimating(false)
    }, 150)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImageFile(file)
  }

  const generatePrompt = () => {
    let timeframeStrategy = ""
    if (["1m", "3m", "5m", "10m", "15m", "30m"].includes(timeframe)) {
      timeframeStrategy = "Fokus pada Scalping dan eksekusi Intraday cepat. Rejeksi sekecil apapun di area VWAP sangat krusial. Momentum (ROC) harus sangat kuat untuk menghindari false breakout."
    } else if (["1H", "2H", "4H"].includes(timeframe)) {
      timeframeStrategy = "Fokus pada Short Swing / Day Trade berdurasi panjang. Validasi struktur harga (Higher High / Higher Low), abaikan noise kecil, dan perhatikan pantulan kuat di EMA20."
    } else {
      timeframeStrategy = "Fokus pada Swing Trade (menahan posisi beberapa hari/minggu). Identifikasi major trend, Support/Resistance psikologis yang kuat, dan jejak volume akumulasi institusi."
    }

    return `Anda adalah Asisten Trader Profesional di Bursa Efek Indonesia (IDX).
Tolong analisa gambar chart saham ini berdasarkan [SISTEM TRADING HYBRID SWING] saya.

**[ATURAN SISTEM SAYA]**
1. **Indikator Utama:** VWAP (Intraday Fair Value), EMA20 (Short-term trend), Parabolic SAR (Step 0.02, Max 0.2 - untuk Exit/Trailing Stop), dan ROC (7 periode - Momentum).
2. **Validitas Breakout:** Candle HARUS tutup di atas resisten dengan body dominan (bukan ekor panjang), volume ekspansi/besar, ada follow-through, dan harga berada di ATAS VWAP.
3. **Kondisi Invalid (Jangan Trading):** Ada Bull Trap (ekor atas panjang), volume spike hanya 1 kali lalu sepi, EMA20 datar/menurun, ROC mulai turun (divergence).
4. **Supply & Demand:** Perhatikan area Demand (rejeksi kuat ke atas) dan Supply (rejeksi ekor panjang ke bawah).

**[DATA TRADING SAYA SAAT INI]**
- Timeframe Chart: **${timeframe}**
- Strategi Khusus Timeframe ini: ${timeframeStrategy}
- Tipe Entry Target: Type B (Pullback Entry di dekat VWAP/EMA20 dengan volume kecil) atau Type A (Break & Hold jika kuat).

**[TUGAS ANDA]**
Melihat gambar chart ini, tolong berikan analisis objektif:
1. **Tren & Struktur Harga:** Apa tren utamanya pada timeframe ${timeframe}?
2. **Kondisi Indikator:** Di manakah posisi harga relatif terhadap VWAP dan EMA20? Apakah ROC menunjukkan divergensi?
3. **S&D Zone:** Sebutkan angka pasti area Support (Demand) dan Resistance (Supply) terdekat.
4. **Validasi:** Apakah ini momen Breakout valid, Pullback sehat, atau malah Bull Trap/False Breakout?
5. **Trading Plan Eksekusi:** Jika layak entry, berikan Saran Entry, Target SELL 1 (+1.5%), Target SELL 2 (+2.5%), dan Stop Loss mutlak (misal tutup di bawah VWAP).

Jawab dengan menggunakan format Markdown yang rapi tanpa basa-basi.`
  }

  const extractPriceFromChart = async () => {
    if (!image) return
    setIsExtractingPrice(true)
    setPriceFromChart(false)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          prompt: `Look at this stock chart image carefully.
Your ONLY task: find the LAST/CURRENT price of the stock (the price shown on the right axis for the most recent candle, or the "Last" / "Close" price label if visible).

RULES:
- Reply with ONLY a single integer number. No text, no currency symbol, no comma, no dot, no space.
- The price is in Indonesian Rupiah, typically between 50 and 50000.
- Strip any thousand separator. Example: if price shows as "1.540" or "1,540" reply with 1540
- If the price is shown as a decimal like "1540.00", reply with 1540
- If you cannot find the price at all, reply with the single word: NOTFOUND

Example correct replies: 1540
Example correct replies: 875
Example correct replies: 12050
Example WRONG replies: "Rp 1.540", "The price is 1540", "1,540.00"`
        })
      })
      const data = await res.json()
      if (res.ok && data.result) {
        const raw: string = data.result.trim()
        // Jika AI menjawab NOTFOUND, jangan set harga
        if (raw.toUpperCase().includes("NOTFOUND")) return
        // Ambil angka pertama yang ditemukan dalam respon (ignore teks lain)
        const numericMatch = raw.match(/\d[\d.,]*/)?.[0]
        if (!numericMatch) return
        // Bersihkan: hapus titik/koma ribuan (bukan desimal)
        // Strategi: jika ada titik diikuti tepat 3 digit di akhir → separator ribuan
        const cleaned = numericMatch
          .replace(/[.,](\d{3})(?!\d)/g, "$1") // hapus thousand separator
          .replace(/[.,]\d+$/, "")              // hapus sisa desimal
          .replace(/\D/g, "")                   // hapus semua non-digit tersisa
        const parsed = parseInt(cleaned, 10)
        if (!isNaN(parsed) && parsed >= 50 && parsed <= 100000) {
          setPrice(String(parsed))
          setPriceFromChart(true)
        }
      }
    } catch {
      // Gagal ekstrak harga, biarkan user input manual
    } finally {
      setIsExtractingPrice(false)
    }
  }

  const analyzeImage = async () => {
    if (!image) return
    setIsAnalyzing(true)
    setAiError(null)
    setAiResult(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          prompt: generatePrompt()
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Gagal menghubungi AI")
      }

      setAiResult(data.result)
    } catch (error) {
      const err = error as Error;
      setAiError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const calculatePosition = () => {
    const p = parseFloat(price)
    const cap = parseFloat(capital)
    const tgt = parseFloat(targetProfit)
    const customGain = parseFloat(targetGainCustom)

    if (!p || p <= 0 || !cap || cap <= 0 || !tgt || tgt <= 0) return null

    // Gunakan custom gain jika valid, fallback ke tiered system
    let targetGainPercent = 0
    if (customGain > 0) {
      targetGainPercent = customGain
    } else if (p >= 51 && p <= 300) {
      targetGainPercent = 2.5
    } else if (p > 300 && p <= 3000) {
      targetGainPercent = 2.0
    } else if (p > 3000 && p <= 10000) {
      targetGainPercent = 1.5
    } else {
      return { msg: "Harga di luar kriteria dan target % tidak diset." }
    }

    const buyFee = 0.0015
    const sellFee = 0.0025

    const targetPrice = p * (1 + targetGainPercent/100)
    const profitPerLembar = (targetPrice * (1 - sellFee)) - (p * (1 + buyFee))
    if (profitPerLembar <= 0) return { msg: "Target profit terlalu kecil untuk menutup biaya transaksi." }

    const lembarRequired = Math.ceil(tgt / profitPerLembar)
    const lotRequired = Math.ceil(lembarRequired / 100)
    
    const capitalNeeded = lotRequired * 100 * p
    const percentOfCapital = ((capitalNeeded / cap) * 100).toFixed(1)

    const maxLotWithCapital = Math.floor(cap / (p * 100))

    if (lotRequired > maxLotWithCapital) {
      return {
        msg: `Modal tidak cukup. Butuh Rp ${capitalNeeded.toLocaleString("id-ID")} untuk mencapai target Rp ${tgt.toLocaleString("id-ID")} pada harga Rp ${p}.`
      }
    }

    return {
      targetGainPercent,
      targetPrice: targetPrice.toFixed(0),
      exactLot: lotRequired,
      capitalNeeded: capitalNeeded.toLocaleString("id-ID"),
      percentOfCapital
    }
  }

  const calcResult = calculatePosition()

  return (
    <div className="flex flex-col space-y-8 w-full">
      {/* Modern Interactive Menu - Standardized Style */}
      <div className="relative flex flex-wrap justify-center gap-2 p-2 bg-card/30 backdrop-blur-xl rounded-3xl border border-foreground/5 shadow-2xl w-full max-w-4xl mx-auto">
        <button
          onClick={() => handleTabClick("ai")}
          className={cn(
            "relative flex-1 min-w-[120px] md:min-w-[140px] flex items-center justify-center gap-3 py-4 md:py-3 px-4 md:px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 outline-none whitespace-nowrap z-10",
            activeTab === "ai" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeTab === "ai" && (
            <motion.div
              layoutId="chart-active-tab"
              className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Sparkles className={cn("w-4 h-4 shrink-0 transition-transform duration-500", activeTab === "ai" ? "scale-110" : "")} />
          <span>AI Analyst</span>
        </button>

        <button
          onClick={() => handleTabClick("calculator")}
          className={cn(
            "relative flex-1 min-w-[120px] md:min-w-[140px] flex items-center justify-center gap-3 py-4 md:py-3 px-4 md:px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 outline-none whitespace-nowrap z-10",
            activeTab === "calculator" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeTab === "calculator" && (
            <motion.div
              layoutId="chart-active-tab"
              className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Calculator className={cn("w-4 h-4 shrink-0 transition-transform duration-500", activeTab === "calculator" ? "scale-110" : "")} />
          <span>Kalkulator</span>
        </button>

        <button
          onClick={() => handleTabClick("checklist")}
          className={cn(
            "relative flex-1 min-w-[120px] md:min-w-[140px] flex items-center justify-center gap-3 py-4 md:py-3 px-4 md:px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 outline-none whitespace-nowrap z-10",
            activeTab === "checklist" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeTab === "checklist" && (
            <motion.div
              layoutId="chart-active-tab"
              className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <CheckSquare className={cn("w-4 h-4 shrink-0 transition-transform duration-500", activeTab === "checklist" ? "scale-110" : "")} />
          <span>Checklist</span>
        </button>
      </div>

      {/* Content Area with Crossfade */}
      <div className="relative min-h-[400px]">
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            isAnimating ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
          }`}
        >
          {/* TAB 1: AI ASSISTANT */}
          {activeTab === "ai" && (
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" /> Analis Chart AI (Eksekusi Langsung)
                </CardTitle>
                <CardDescription>
                  AI akan membaca chart Anda dan memberikan <strong>Saran Entry, TP, dan SL</strong> berdasarkan timeframe yang dipilih.
                </CardDescription>
                {/* DISCLAIMER */}
                <div className="mt-3 my-4 flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    <strong>Disclaimer:</strong> Hasil analisis yang ditampilkan merupakan interpretasi AI berdasarkan <strong>Sistem Hybrid Swing</strong> — suatu kerangka metodologis yang mengkombinasikan indikator teknikal (VWAP, EMA20, SAR, ROC) dan prinsip Supply-Demand. Analisis ini bersifat <strong>edukatif dan eksploratif</strong>, bukan sinyal beli/jual yang pasti. Akurasi sangat bergantung pada kualitas gambar chart, kondisi pasar yang dinamis, dan penilaian personal trader. <strong>Selalu lakukan riset mandiri dan pertimbangkan manajemen risiko Anda sebelum mengambil keputusan investasi.</strong>
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">

                {/* === PANDUAN INDIKATOR CHART (COLLAPSIBLE) === */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
                  {/* Header Tombol Toggle */}
                  <button
                    onClick={() => setShowGuide(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-500/10 transition-colors group"
                    aria-expanded={showGuide}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Panduan Indikator Chart</span>
                      <span className="hidden sm:inline text-xs text-emerald-500/80 font-normal">— Pastikan chart Anda tampil dengan indikator berikut sebelum analisis</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                      {showGuide ? (
                        <><EyeOff className="w-3.5 h-3.5" /><span>Sembunyikan</span></>
                      ) : (
                        <><Eye className="w-3.5 h-3.5" /><span>Lihat Panduan</span></>
                      )}
                    </div>
                  </button>

                  {/* Konten Panduan */}
                  {showGuide && (
                    <div className="px-4 pb-5 pt-1 border-t border-emerald-500/20 animate-in slide-in-from-top-2 fade-in duration-300">
                      <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mb-4 leading-relaxed">
                        Agar AI dapat menganalisis chart dengan akurat menggunakan metode <strong>Hybrid Swing</strong>,
                        pastikan tampilan chart Anda memuat <strong>semua indikator berikut</strong> sebelum screenshot/upload.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* VWAP */}
                        <div className="flex gap-3 p-3 rounded-lg bg-background border border-emerald-500/20">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                            <span className="text-xs font-black text-emerald-500">V</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">VWAP</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">Volume Weighted Average Price — garis referensi harga wajar intraday. Wajib terlihat di chart sebagai <strong>1 garis</strong> (biasanya biru/ungu).</p>
                          </div>
                        </div>

                        {/* EMA 20 */}
                        <div className="flex gap-3 p-3 rounded-lg bg-background border border-amber-500/20">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center">
                            <span className="text-xs font-black text-amber-500">E</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">EMA 20</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">Exponential Moving Average 20 periode — menentukan tren jangka pendek. Tampilkan sebagai <strong>1 garis</strong> (biasanya oranye/kuning).</p>
                          </div>
                        </div>

                        {/* Parabolic SAR */}
                        <div className="flex gap-3 p-3 rounded-lg bg-background border border-rose-500/20">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center">
                            <span className="text-xs font-black text-rose-500">P</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">Parabolic SAR</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">Step <strong>0.02</strong>, Max <strong>0.2</strong> — sinyal exit dan trailing stop. Tampilkan sebagai <strong>titik-titik</strong> di atas/bawah candle.</p>
                          </div>
                        </div>

                        {/* ROC */}
                        <div className="flex gap-3 p-3 rounded-lg bg-background border border-emerald-500/20">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                            <span className="text-xs font-black text-emerald-500">R</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">ROC (7 periode)</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">Rate of Change 7 periode — mengukur momentum. Tampilkan sebagai <strong>panel/subgraph terpisah</strong> di bawah candle utama.</p>
                          </div>
                        </div>

                        {/* Volume */}
                        <div className="flex gap-3 p-3 rounded-lg bg-background border border-purple-500/20 sm:col-span-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center">
                            <span className="text-xs font-black text-purple-500">Vol</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">Volume Bar</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">Histogram volume (hijau/merah) di bawah chart utama. AI memerlukan ini untuk mendeteksi <strong>Volume Ekspansi</strong> saat breakout. Pastikan volume terlihat jelas dan berwarna.</p>
                          </div>
                        </div>

                      </div>

                      {/* Tips tambahan */}
                      <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <Info className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed space-y-1">
                          <p><strong>Tips Screenshot Chart:</strong></p>
                          <ul className="list-disc list-inside space-y-0.5 text-emerald-600/90 dark:text-emerald-400/90">
                            <li>Gunakan TradingView / Chart View pada Aplikasi Trading yang digunakan — aktifkan semua indikator di atas sebelum screenshot.</li>
                            <li>Pastikan candle terakhir (kanan) dan <strong>skala harga (kanan)</strong> terlihat jelas.</li>
                            <li>Tampilkan minimal <strong>50–100 candle</strong> agar AI bisa membaca konteks tren.</li>
                            <li>ROC dan Volume harus ada di panel bawah dan tidak terpotong.</li>
                            <li>Jangan crop/potong chart — sertakan seluruh area indikator.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* === END PANDUAN === */}

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-primary">1. Pilih Timeframe Chart Anda</Label>
                  <div className="flex flex-wrap gap-2">
                    {TIMEFRAMES.map(t => (
                      <button 
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${timeframe === t ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background' : 'bg-muted hover:bg-muted-foreground/20 text-muted-foreground'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-primary">2. Unggah Gambar Chart</Label>

                  {/* Drop Zone */}
                  <div
                    ref={dropZoneRef}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      const file = e.dataTransfer.files[0]
                      if (file) processImageFile(file)
                    }}
                    className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                      isDragging
                        ? "border-primary bg-primary/10 scale-[1.01]"
                        : "border-border hover:border-primary/50 hover:bg-muted/30 bg-muted/10"
                    }`}
                    onClick={() => document.getElementById("chart-file-input")?.click()}
                  >
                    <ImagePlus className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-center">
                      <p className="text-sm font-semibold">
                        {isDragging ? "Lepaskan untuk Unggah" : "Klik, Drag & Drop, atau Tempel"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tekan <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs font-mono">Ctrl+V</kbd> di mana saja untuk paste screenshot chart langsung
                      </p>
                    </div>
                    <input
                      id="chart-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {image && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-border relative group bg-muted/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Uploaded Chart" className="w-full object-contain max-h-[400px]" />
                    {/* Tombol hapus gambar */}
                    <button
                      onClick={() => { setImage(null); setAiResult(null); setPriceFromChart(false) }}
                      className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border border-border rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                      title="Hapus Gambar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {/* Badge harga terdeteksi */}
                    {priceFromChart && price && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Harga Rp {parseInt(price).toLocaleString("id-ID")} terdeteksi
                      </div>
                    )}
                  </div>
                )}

                {image && (
                  <div className="pt-4 border-t border-dashed space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        onClick={analyzeImage} 
                        disabled={isAnalyzing} 
                        className="flex-1 md:flex-none text-base py-5 shadow-lg shadow-primary/20"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            AI Sedang Menganalisa...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Analisa Chart Ini
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={extractPriceFromChart}
                        disabled={isExtractingPrice}
                        className="flex-1 md:flex-none py-5 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        {isExtractingPrice ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Membaca Harga...</>
                        ) : priceFromChart ? (
                          <><Check className="mr-2 h-4 w-4 text-emerald-500" />Harga Terbaca ✓</>
                        ) : (
                          <><Calculator className="mr-2 h-4 w-4" />Baca Harga ke Kalkulator</>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setShowPrompt(v => !v)}
                        className="flex-1 md:flex-none py-5"
                      >
                        {showPrompt ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {showPrompt ? "Sembunyikan Prompt" : "Preview Prompt"}
                      </Button>
                    </div>

                    {showPrompt && (
                      <div className="rounded-xl border bg-muted/30 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300">
                        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prompt yang Dikirim ke AI</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generatePrompt())
                              setIsCopied(true)
                              setTimeout(() => setIsCopied(false), 2000)
                            }}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-background border hover:bg-muted transition-colors"
                          >
                            {isCopied ? (
                              <><Check className="w-3.5 h-3.5 text-emerald-500" /> Tersalin!</>
                            ) : (
                              <><Copy className="w-3.5 h-3.5" /> Salin Prompt</>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed text-muted-foreground max-h-64 overflow-y-auto">
                          {generatePrompt()}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {aiError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-600">
                    <p className="font-bold mb-1">Terjadi Kesalahan:</p>
                    <p className="text-sm">{aiError}</p>
                    {aiError.includes("GEMINI_API_KEY") && (
                      <p className="text-sm mt-2 font-medium">Mohon periksa konfigurasi .env.local Anda.</p>
                    )}
                  </div>
                )}

                {aiResult && (
                  <div className="mt-6 animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-4">
                    <Label className="text-sm font-bold text-primary flex items-center mb-4">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Hasil Analisis AI
                    </Label>
                    <div className="p-6 bg-card border border-border rounded-xl prose prose-sm md:prose-base dark:prose-invert max-w-none shadow-lg">
                      <ReactMarkdown>{aiResult}</ReactMarkdown>
                    </div>
                    {/* Post-result Disclaimer */}
                    <div className="my-4 flex items-start gap-2.5 p-3 rounded-lg bg-muted/50 border border-border">
                      <AlertTriangle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Analisis di atas dihasilkan secara otomatis oleh model AI berdasarkan sistem aturan yang telah diprogram. Ini <strong>bukan rekomendasi investasi resmi</strong>. Pasar modal mengandung risiko yang tidak dapat sepenuhnya diprediksi oleh sistem apapun. Gunakan hasil ini sebagai <strong>salah satu masukan</strong> dalam proses pengambilan keputusan Anda, bukan sebagai satu-satunya acuan. Selalu terapkan <em>position sizing</em> yang disiplin dan pasang Stop Loss.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* TAB 2: CALCULATOR */}
          {activeTab === "calculator" && (
            <Card>
              <CardHeader>
                <CardTitle>Sizing Eksekusi Cepat</CardTitle>
                <CardDescription>
                  Masukkan modal, target pendapatan bersih harian, dan harga saham saat ini untuk mendapatkan porsi Lot ideal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>1. Modal Tersedia (Rp)</Label>
                    <Input 
                      type="text" 
                      inputMode="numeric"
                      placeholder="Contoh: 10.000.000" 
                      value={capital ? parseInt(capital, 10).toLocaleString("id-ID") : ""}
                      onChange={(e) => setCapital(e.target.value.replace(/\D/g, ""))}
                      className="font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>2. Target Profit Bersih (Rp)</Label>
                    <Input 
                      type="text" 
                      inputMode="numeric"
                      placeholder="Contoh: 50.000" 
                      value={targetProfit ? parseInt(targetProfit, 10).toLocaleString("id-ID") : ""}
                      onChange={(e) => setTargetProfit(e.target.value.replace(/\D/g, ""))}
                      className="font-bold text-emerald-600"
                    />
                  </div>
                </div>

                {/* Target % + Harga Entry */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>3. Target Kenaikan (%)</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="35"
                        placeholder="2.5"
                        value={targetGainCustom}
                        onChange={(e) => setTargetGainCustom(e.target.value)}
                        className="font-bold text-amber-600 max-w-[100px]"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {["1.5", "2", "2.5", "3", "5"].map(v => (
                          <button
                            key={v}
                            onClick={() => setTargetGainCustom(v)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-all ${
                              targetGainCustom === v
                                ? "bg-amber-500 text-white border-amber-500 shadow"
                                : "bg-muted hover:bg-amber-500/10 border-border text-muted-foreground hover:text-amber-600 hover:border-amber-500/50"
                            }`}
                          >
                            {v}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>4. Harga Entry (Rp)</Label>
                      {priceFromChart && price && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" /> Dari Chart
                        </span>
                      )}
                    </div>
                    <Input 
                      type="text" 
                      inputMode="numeric"
                      placeholder="Contoh: 1.500" 
                      value={price ? parseInt(price, 10).toLocaleString("id-ID") : ""}
                      onChange={(e) => { setPrice(e.target.value.replace(/\D/g, "")); setPriceFromChart(false) }}
                      className={`font-bold text-primary ${priceFromChart ? "ring-2 ring-emerald-500/50 border-emerald-500/50" : ""}`}
                    />
                    {!image && (
                      <p className="text-xs text-muted-foreground">Upload chart di tab AI untuk deteksi harga otomatis.</p>
                    )}
                  </div>
                </div>

                {calcResult && (
                  <div className="mt-6 p-6 bg-muted/50 rounded-xl border border-border space-y-4">
                    {'msg' in calcResult ? (
                      <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-700">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="font-semibold">{calcResult.msg}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Lot Wajib untuk Capai Rp{parseFloat(targetProfit).toLocaleString("id-ID")}</p>
                          <p className="text-3xl font-black text-emerald-500">{calcResult.exactLot} Lot</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Target Harga Jual (SELL 1)</p>
                          <p className="text-2xl font-bold text-amber-500">Rp {calcResult.targetPrice} <span className="text-base text-muted-foreground">(+{calcResult.targetGainPercent}%)</span></p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-sm text-muted-foreground">Alokasi Modal yang Dibutuhkan</p>
                          <p className="text-xl font-bold">
                            Rp {calcResult.capitalNeeded} 
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              ({calcResult.percentOfCapital}% dari total Modal)
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* TAB 3: CHECKLIST */}
          {activeTab === "checklist" && (
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <CardTitle>Jurnal & Checklist Validasi</CardTitle>
                    <CardDescription className="mt-1">SYSTEM &gt; EMOTION. Centang setiap kondisi yang terpenuhi pada chart saat ini.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {image && (
                      <button
                        onClick={autoCheckFromChart}
                        disabled={isAutoChecking}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary transition-colors disabled:opacity-50"
                      >
                        {isAutoChecking ? (
                          <><Loader2 className="w-3 h-3 animate-spin" />Membaca Chart...</>
                        ) : autoChecked ? (
                          <><Check className="w-3 h-3" />Terbaca oleh AI</>
                        ) : (
                          <><Sparkles className="w-3 h-3" />Auto-Check dari Chart</>
                        )}
                      </button>
                    )}
                    <button
                      onClick={resetChecklist}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md border bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {!image && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border rounded-lg px-3 py-2">
                    <ImagePlus className="w-3.5 h-3.5 flex-shrink-0" />
                    Upload chart di tab <strong>AI Chart Analyst</strong> untuk mengaktifkan Auto-Check otomatis.
                  </div>
                )}

                {autoChecked && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                    Checklist diisi otomatis oleh AI berdasarkan chart yang diupload. Anda bisa koreksi manual jika diperlukan.
                  </div>
                )}

                {/* Live Score & Probabilitas */}
                <div className={`mt-4 my-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border-2 ${verdictColor}`}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Probabilitas Saat Ini</p>
                    <p className="text-2xl font-black">{verdict}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-black text-xl">{mutlakScore}/{MUTLAK_ITEMS.length}</p>
                      <p className="text-xs opacity-70">Syarat Mutlak</p>
                    </div>
                    <div className="text-center">
                      <p className="font-black text-xl">{tambahScore}/{TAMBAH_ITEMS.length}</p>
                      <p className="text-xs opacity-70">Konfirmasi</p>
                    </div>
                    <div className="text-center">
                      <p className="font-black text-xl">{totalScore}/{MUTLAK_ITEMS.length + TAMBAH_ITEMS.length}</p>
                      <p className="text-xs opacity-70">Total Skor</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-8">

                  {/* Syarat Mutlak */}
                  <div className="space-y-3">
                    <h3 className="font-bold flex items-center text-primary border-b pb-2">
                      <CheckSquare className="w-4 h-4 mr-2" /> Syarat Mutlak Entry — Wajib semua terpenuhi
                    </h3>
                    {MUTLAK_ITEMS.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          const next = [...mutlakChecked]
                          next[i] = !next[i]
                          setMutlakChecked(next)
                        }}
                        className={`flex items-start space-x-3 p-3 rounded-lg transition-all cursor-pointer border ${
                          mutlakChecked[i]
                            ? "bg-primary/10 border-primary/40 shadow-sm"
                            : "bg-muted/20 hover:bg-muted/50 border-border/50"
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                          mutlakChecked[i] ? "bg-primary border-primary" : "border-muted-foreground/40"
                        }`}>
                          {mutlakChecked[i] && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span className={`text-sm font-medium leading-relaxed select-none ${
                          mutlakChecked[i] ? "line-through text-muted-foreground" : ""
                        }`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Konfirmasi Tambahan */}
                  <div className="space-y-3">
                    <h3 className="font-bold flex items-center text-emerald-600 border-b pb-2">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Konfirmasi Tambahan — Min. 2 dari 4 terpenuhi
                    </h3>
                    {TAMBAH_ITEMS.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          const next = [...tambahChecked]
                          next[i] = !next[i]
                          setTambahChecked(next)
                        }}
                        className={`flex items-start space-x-3 p-3 rounded-lg transition-all cursor-pointer border ${
                          tambahChecked[i]
                            ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
                            : "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20"
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                          tambahChecked[i] ? "bg-emerald-500 border-emerald-500" : "border-emerald-500/40"
                        }`}>
                          {tambahChecked[i] && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm font-medium leading-relaxed select-none text-emerald-900 dark:text-emerald-100 ${
                          tambahChecked[i] ? "line-through opacity-60" : ""
                        }`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </CardContent>

              <CardFooter className="bg-destructive/10 border-t flex flex-col items-start gap-3 rounded-b-xl p-6">
                <h3 className="font-bold flex items-center text-destructive">
                  <AlertTriangle className="w-5 h-5 mr-2" /> ZONA MERAH — Batalkan Entry Jika Berlaku
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full text-sm font-medium text-destructive/90">
                  <li className="flex items-center gap-2 p-2 bg-destructive/5 rounded-md border border-destructive/20"><span className="text-lg leading-none">&times;</span> Harga sudah meroket &gt;7–10% hari ini.</li>
                  <li className="flex items-center gap-2 p-2 bg-destructive/5 rounded-md border border-destructive/20"><span className="text-lg leading-none">&times;</span> Banyak ekor atas panjang (Supply dominan).</li>
                  <li className="flex items-center gap-2 p-2 bg-destructive/5 rounded-md border border-destructive/20"><span className="text-lg leading-none">&times;</span> ROC Divergence (Harga naik tapi ROC turun).</li>
                  <li className="flex items-center gap-2 p-2 bg-destructive/5 rounded-md border border-destructive/20"><span className="text-lg leading-none">&times;</span> Resisten tebal persis di atas harga entry.</li>
                </ul>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
