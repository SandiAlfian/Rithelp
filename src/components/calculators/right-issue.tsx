"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TrendingDown, Briefcase, CheckCircle2, XCircle, AlertTriangle, ArrowRightLeft, DollarSign, Megaphone, Wallet } from "lucide-react"

export function RightIssueCalculator() {
  const [ratioOld, setRatioOld] = useState<string>("")
  const [ratioNew, setRatioNew] = useState<string>("")
  const [cumPrice, setCumPrice] = useState<string>("")
  const [exercisePrice, setExercisePrice] = useState<string>("")
  const [ownedLot, setOwnedLot] = useState<string>("")
  const [avgOwned, setAvgOwned] = useState<string>("")
  const [hmetdMarketPrice, setHmetdMarketPrice] = useState<string>("")

  const rOld = parseFloat(ratioOld) || 0
  const rNew = parseFloat(ratioNew) || 0
  const cum = parseFloat(cumPrice) || 0
  const exercise = parseFloat(exercisePrice) || 0
  const owned = parseFloat(ownedLot) || 0
  const avg = parseFloat(avgOwned) || 0

  // 1. Harga Teoretis Ex-Date
  let theoreticalPrice = 0
  if (rOld + rNew > 0) {
    theoreticalPrice = ((rOld * cum) + (rNew * exercise)) / (rOld + rNew)
  }

  // 2. Perubahan Harga Teoretis (Dilusi/Apresiasi)
  const theoreticalChangePercent = cum > 0 ? ((theoreticalPrice - cum) / cum) * 100 : 0

  // 3. Hak yang Diterima (HMETD)
  const ownedShares = owned * 100
  const hmetdShares = rOld > 0 ? Math.floor((ownedShares / rOld) * rNew) : 0
  const hmetdLot = Math.floor(hmetdShares / 100)
  
  // 4. Modal Awal (Portfolio Awal)
  const initialInvestment = avg > 0 ? avg * ownedShares : cum * ownedShares

  // --- Skenario 1: Menebus Hak ---
  const exerciseCost = hmetdShares * exercise
  const totalInvestmentExercise = initialInvestment + exerciseCost
  const totalSharesExercise = ownedShares + hmetdShares
  const newAvgPriceExercise = totalSharesExercise > 0 ? totalInvestmentExercise / totalSharesExercise : 0
  const avgChangePercent = avg > 0 ? ((newAvgPriceExercise - avg) / avg) * 100 : 0
  const portfolioValueExercise = totalSharesExercise * theoreticalPrice
  const plExercise = portfolioValueExercise - totalInvestmentExercise
  const plExercisePercent = totalInvestmentExercise > 0 ? (plExercise / totalInvestmentExercise) * 100 : 0

  // --- Skenario 2: Menjual Hak ---
  const theoreticalHmetdPrice = Math.max(0, theoreticalPrice - exercise)
  const hmetdSellPrice = parseFloat(hmetdMarketPrice) || theoreticalHmetdPrice
  const hmetdSaleProceeds = hmetdShares * hmetdSellPrice
  const portfolioValueAfterExDate = ownedShares * theoreticalPrice
  const totalPortfolioValueSellHmetd = portfolioValueAfterExDate + hmetdSaleProceeds
  const plSellHmetd = totalPortfolioValueSellHmetd - initialInvestment
  const plSellHmetdPercent = initialInvestment > 0 ? (plSellHmetd / initialInvestment) * 100 : 0

  // --- Skenario 3: Tidak Melakukan Apa-apa ---
  const portfolioValueIgnore = ownedShares * theoreticalPrice
  const plIgnore = portfolioValueIgnore - initialInvestment
  const plIgnorePercent = initialInvestment > 0 ? (plIgnore / initialInvestment) * 100 : 0
  const lossFromIgnore = hmetdShares * theoreticalHmetdPrice // Nilai hak yang hangus

  const hasResult = rOld > 0 && rNew > 0 && cum > 0 && exercise > 0

  return (
    <div className="space-y-8 pb-12">
      <Card className="border-foreground/5 bg-card/40 shadow-2xl">
        <CardHeader className="border-b border-foreground/5 bg-foreground/[0.02]">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Briefcase className="w-5 h-5" />
             </div>
             <CardTitle>Kalkulator Right Issue (HMETD)</CardTitle>
          </div>
          <CardDescription className="font-bold">
            Simulasi teoretis dan analisis skenario aksi korporasi penambahan modal secara presisi.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Input Data Right Issue */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                <Megaphone className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Data Pengumuman</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Rasio Saham Lama</Label>
                  <Input type="number" placeholder="10" value={ratioOld} onChange={(e) => setRatioOld(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Rasio Saham Baru</Label>
                  <Input type="number" placeholder="3" value={ratioNew} onChange={(e) => setRatioNew(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Harga Cum-Date</Label>
                  <Input 
                    type="text" 
                    inputMode="numeric" 
                    placeholder="1.500" 
                    value={cumPrice ? parseInt(cumPrice).toLocaleString("id-ID") : ""} 
                    onChange={(e) => setCumPrice(e.target.value.replace(/\D/g, ""))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Harga Pelaksanaan</Label>
                  <Input 
                    type="text" 
                    inputMode="numeric" 
                    placeholder="500" 
                    value={exercisePrice ? parseInt(exercisePrice).toLocaleString("id-ID") : ""} 
                    onChange={(e) => setExercisePrice(e.target.value.replace(/\D/g, ""))} 
                  />
                </div>
              </div>
            </div>

            {/* Input Data Kepemilikan */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-l-4 border-secondary pl-4">
                <Wallet className="w-5 h-5 text-secondary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Data Portofolio</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Jumlah Lot Dimiliki</Label>
                  <Input type="number" placeholder="100" value={ownedLot} onChange={(e) => setOwnedLot(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Harga Rata-rata (Avg)</Label>
                  <Input 
                    type="text" 
                    inputMode="numeric" 
                    placeholder="1.200" 
                    value={avgOwned ? parseInt(avgOwned).toLocaleString("id-ID") : ""} 
                    onChange={(e) => setAvgOwned(e.target.value.replace(/\D/g, ""))} 
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Estimasi Harga Jual HMETD (Bursa)</Label>
                  <Input 
                    type="text" 
                    inputMode="numeric" 
                    placeholder={`Teoretis: Rp ${theoreticalHmetdPrice.toFixed(0)}`}
                    value={hmetdMarketPrice ? parseInt(hmetdMarketPrice).toLocaleString("id-ID") : ""} 
                    onChange={(e) => setHmetdMarketPrice(e.target.value.replace(/\D/g, ""))} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Result Highlight */}
          {hasResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mt-16 p-10 rounded-2xl glass-premium border border-primary/20 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <DollarSign className="w-3 h-3 text-primary" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Harga Teoretis Ex-Date</p>
                  </div>
                  <p className="text-3xl md:text-5xl font-black text-foreground tracking-tighter break-all">Rp {theoreticalPrice.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <TrendingDown className={cn("w-3 h-3", theoreticalChangePercent >= 0 ? "text-primary" : "text-destructive")} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dilusi / Apresiasi</p>
                  </div>
                  <p className={cn("text-3xl md:text-5xl font-black tracking-tighter break-all", theoreticalChangePercent >= 0 ? "text-primary" : "text-destructive")}>
                    {theoreticalChangePercent >= 0 ? "+" : ""}{theoreticalChangePercent.toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hak (HMETD) Didapat</p>
                  </div>
                  <p className="text-2xl md:text-4xl font-black text-primary tracking-tighter break-all">{hmetdLot.toLocaleString("id-ID")} Lot</p>
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase mt-1 tracking-widest">{hmetdShares.toLocaleString("id-ID")} Lembar Baru</p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Action Scenarios Breakdown */}
      {hasResult && owned > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skenario 1: TEBUS */}
          <Card className="bg-primary/5 border-primary/20 rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col">
            <CardHeader className="bg-primary/10 border-b border-primary/10 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                  <CheckCircle2 className="w-4 h-4" /> Opsi 01: Tebus Hak
                </div>
                <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Growth</div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8 flex-1">
              <div className="text-center py-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Average Harga Baru</p>
                <p className="text-2xl md:text-4xl font-black text-primary tracking-tighter break-all">Rp {newAvgPriceExercise.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full text-[10px] font-black uppercase tracking-tighter", avgChangePercent >= 0 ? "bg-primary/20 text-primary" : "bg-destructive/10 text-destructive")}>
                  {avgChangePercent >= 0 ? "+" : ""}{avgChangePercent.toFixed(2)}% dari Avg Lama
                </div>
              </div>
              
              <div className="space-y-6 pt-6 border-t border-primary/10">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] block">Dana Penebusan</span>
                  <span className="text-lg font-black text-foreground block">Rp {exerciseCost.toLocaleString("id-ID")}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] block">Total Modal Investasi</span>
                  <span className="text-lg font-black text-foreground block">Rp {totalInvestmentExercise.toLocaleString("id-ID")}</span>
                </div>
                <div className="space-y-1 pb-4">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] block">Nilai Portofolio (Ex)</span>
                  <span className="text-lg font-black text-foreground block">Rp {portfolioValueExercise.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </CardContent>
            <div className="p-8 pt-0 mt-auto">
               <div className="p-5 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] block opacity-80 mb-2">Estimasi P/L Akhir</span>
                  <div className="space-y-1">
                    <p className="text-xl md:text-2xl font-black leading-none break-all">Rp {plExercise.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs font-bold opacity-90">{plExercisePercent.toFixed(2)}%</p>
                  </div>
               </div>
            </div>
          </Card>

          {/* Skenario 2: JUAL HMETD */}
          <Card className="bg-secondary/5 border-secondary/20 rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col">
            <CardHeader className="bg-secondary/10 border-b border-secondary/10 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-secondary font-black uppercase tracking-[0.2em] text-[10px]">
                  <ArrowRightLeft className="w-4 h-4" /> Opsi 02: Jual Hak
                </div>
                <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[9px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20">Liquid</div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8 flex-1">
              <div className="text-center py-4 bg-secondary/5 rounded-xl border border-secondary/10">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Total Dana Penjualan</p>
                <p className="text-2xl md:text-4xl font-black text-secondary tracking-tighter break-all">Rp {hmetdSaleProceeds.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-secondary/20 text-secondary text-[10px] font-black uppercase tracking-tighter">
                   @Rp {hmetdSellPrice.toLocaleString("id-ID", { maximumFractionDigits: 0 })} / Hak
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-secondary/10">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] block">Modal Investasi Awal</span>
                  <span className="text-sm md:text-lg font-black text-foreground block break-all">Rp {initialInvestment.toLocaleString("id-ID")}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] block">Nilai Aset Inti (Ex)</span>
                  <span className="text-lg font-black text-foreground block">Rp {portfolioValueAfterExDate.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="space-y-1 pb-4">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] block">Total Dana Akhir</span>
                  <span className="text-lg font-black text-foreground block">Rp {totalPortfolioValueSellHmetd.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </CardContent>
            <div className="p-8 pt-0 mt-auto">
               <div className="p-5 rounded-2xl bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] block opacity-80 mb-2">Estimasi P/L Akhir</span>
                  <div className="space-y-1">
                    <p className="text-xl md:text-2xl font-black leading-none break-all">Rp {plSellHmetd.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs font-bold opacity-90">{plSellHmetdPercent.toFixed(2)}%</p>
                  </div>
               </div>
            </div>
          </Card>

          {/* Skenario 3: ABAIKAN */}
          <Card className="bg-error/5 border-error/20 rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col">
            <CardHeader className="bg-error/10 border-b border-error/10 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-error font-black uppercase tracking-[0.2em] text-[10px]">
                  <XCircle className="w-4 h-4" /> Opsi 03: Abaikan Hak
                </div>
                <div className="px-3 py-1 rounded-full bg-error text-error-foreground text-[9px] font-black uppercase tracking-widest shadow-lg shadow-error/20">Risk</div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8 flex-1">
              <div className="text-center py-4 bg-error/5 rounded-xl border border-error/10">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Nilai Aset Terbuang</p>
                <p className="text-2xl md:text-4xl font-black text-error tracking-tighter break-all">Rp {lossFromIgnore.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-error/20 text-error text-[10px] font-black uppercase tracking-tighter">
                   <AlertTriangle className="w-3 h-3" /> Dilusi Maksimal
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-error/10">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] block">Modal Investasi Awal</span>
                  <span className="text-sm md:text-lg font-black text-foreground block break-all">Rp {initialInvestment.toLocaleString("id-ID")}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] block">Nilai Portofolio (Sisa)</span>
                  <span className="text-lg font-black text-foreground block">Rp {portfolioValueIgnore.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="space-y-1 pb-4">
                  <span className="text-[9px] text-error font-black uppercase tracking-[0.1em] block">Persentase Dilusi Aset</span>
                  <span className="text-lg font-black text-error block">{theoreticalChangePercent >= 0 ? "+" : ""}{theoreticalChangePercent.toFixed(2)}%</span>
                </div>
              </div>
            </CardContent>
            <div className="p-8 pt-0 mt-auto">
               <div className="p-5 rounded-2xl bg-error text-error-foreground shadow-lg shadow-error/20">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] block opacity-80 mb-2">Estimasi P/L Akhir</span>
                  <div className="space-y-1">
                    <p className="text-xl md:text-2xl font-black leading-none break-all">Rp {plIgnore.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs font-bold opacity-90">{plIgnorePercent.toFixed(2)}%</p>
                  </div>
               </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
