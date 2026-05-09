"use client"

import { useState } from "react"
import { useHaptic } from "@/hooks/use-haptic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { TrendingDown, Coins, Wallet, Briefcase } from "lucide-react"

export function AverageDownCalculator() {
  const haptic = useHaptic()
  const [initialPrice, setInitialPrice] = useState<string>("")
  const [initialLot, setInitialLot] = useState<string>("")
  const [newPrice, setNewPrice] = useState<string>("")
  const [newLot, setNewLot] = useState<string>("")

  const p1 = parseFloat(initialPrice) || 0
  const l1 = parseFloat(initialLot) || 0
  const p2 = parseFloat(newPrice) || 0
  const l2 = parseFloat(newLot) || 0

  const totalLot = l1 + l2
  const totalShares = totalLot * 100
  const initialValue = p1 * l1 * 100
  const newValue = p2 * l2 * 100
  const totalValue = initialValue + newValue
  
  const averagePrice = totalLot > 0 ? totalValue / totalShares : 0

  return (
    <Card className="border-foreground/5 bg-card/40 shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-foreground/5 bg-foreground/[0.02]">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <TrendingDown className="w-5 h-5" />
           </div>
           <CardTitle>Average Down/Up</CardTitle>
        </div>
        <CardDescription>
          Hitung estimasi harga rata-rata portofolio Anda setelah melakukan transaksi baru.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Posisi Saat Ini</h3>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialPrice">Harga Rata-rata</Label>
                <Input
                  id="initialPrice"
                  type="text"
                  inputMode="numeric"
                  placeholder="Misal: 1.000"
                  value={initialPrice ? parseInt(initialPrice, 10).toLocaleString("id-ID") : ""}
                  onFocus={() => haptic("light")}
                  onChange={(e) => setInitialPrice(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialLot">Jumlah Lot</Label>
                <Input
                  id="initialLot"
                  type="number"
                  placeholder="Misal: 100"
                  value={initialLot}
                  onChange={(e) => setInitialLot(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-secondary pl-4">
              <TrendingDown className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Rencana Transaksi</h3>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPrice">Harga Beli Baru</Label>
                <Input
                  id="newPrice"
                  type="text"
                  inputMode="numeric"
                  placeholder="Misal: 800"
                  value={newPrice ? parseInt(newPrice, 10).toLocaleString("id-ID") : ""}
                  onChange={(e) => setNewPrice(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newLot">Jumlah Lot Baru</Label>
                <Input
                  id="newLot"
                  type="number"
                  placeholder="Misal: 200"
                  value={newLot}
                  onChange={(e) => setNewLot(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <motion.div 
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl glass-premium p-8 border border-primary/20 shadow-primary/10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Coins className="w-3 h-3 text-primary" /> Harga Rata-rata Baru
              </p>
              <p className="text-4xl font-black text-foreground tracking-tighter text-glow">
                Rp {averagePrice.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className={`h-1.5 w-1.5 rounded-full ${averagePrice < p1 ? "bg-primary" : "bg-secondary"}`} />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                  {averagePrice < p1 ? "Average Down" : "Average Up"} Strategy
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Wallet className="w-3 h-3 text-primary" /> Modal Dibutuhkan
              </p>
              <p className="text-3xl font-black text-foreground/90 tracking-tighter">
                Rp {newValue.toLocaleString("id-ID")}
              </p>
            </div>
            
            <div className="col-span-full grid grid-cols-2 gap-4 pt-6 border-t border-foreground/5">
               <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Lot</p>
                  <p className="text-lg font-black text-foreground/80">{totalLot.toLocaleString("id-ID")}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Nilai</p>
                  <p className="text-lg font-black text-foreground/80">Rp {totalValue.toLocaleString("id-ID")}</p>
               </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
