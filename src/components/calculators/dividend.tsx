"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { Landmark, Wallet, Percent } from "lucide-react"

export function DividendCalculator() {
  const [dpsInput, setDpsInput] = useState<string>("")
  const [avgPrice, setAvgPrice] = useState<string>("")
  const [lot, setLot] = useState<string>("")
  const [yieldInput, setYieldInput] = useState<string>("")
  const [netDivInput, setNetDivInput] = useState<string>("")
  const [tax, setTax] = useState<boolean>(true)
  const [lastEdited, setLastEdited] = useState<'dps' | 'yield' | 'net'>('dps')

  const price = parseFloat(avgPrice.replace(/\D/g, "")) || 0
  const totalShares = (parseFloat(lot.replace(/\D/g, "")) || 0) * 100

  let computedDps = 0
  let computedYield = 0
  let computedNet = 0

  const hasBaseInputs = avgPrice !== "" && lot !== ""

  if (lastEdited === 'dps') {
    computedDps = parseFloat(dpsInput.replace(/\D/g, "")) || 0
    if (hasBaseInputs && dpsInput !== "") {
      computedYield = price > 0 ? (computedDps / price) * 100 : 0
      computedNet = computedDps * totalShares * (tax ? 0.9 : 1.0)
    }
  } else if (lastEdited === 'yield') {
    computedYield = parseFloat(yieldInput.replace(/[^\d.]/g, "")) || 0
    if (hasBaseInputs && yieldInput !== "") {
      computedDps = (computedYield / 100) * price
      computedNet = computedDps * totalShares * (tax ? 0.9 : 1.0)
    }
  } else if (lastEdited === 'net') {
    computedNet = parseFloat(netDivInput.replace(/\D/g, "")) || 0
    if (hasBaseInputs && netDivInput !== "") {
      computedDps = totalShares > 0 ? (computedNet / (tax ? 0.9 : 1.0)) / totalShares : 0
      computedYield = price > 0 ? (computedDps / price) * 100 : 0
    }
  }

  const grossDividend = hasBaseInputs ? (computedDps * totalShares) : 0
  const taxAmount = tax ? grossDividend * 0.1 : 0

  return (
    <Card className="border-foreground/5 bg-card/40 shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-foreground/5 bg-foreground/[0.02]">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Landmark className="w-5 h-5" />
           </div>
           <CardTitle>Dividen & Yield</CardTitle>
        </div>
        <CardDescription>
          Estimasi pendapatan pasif dari dividen emiten dan hitung tingkat imbal hasil (yield).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dps">DPS (Dividen per Share)</Label>
                <Input
                  id="dps"
                  type="text"
                  inputMode="numeric"
                  placeholder="Misal: 150"
                  value={lastEdited === 'dps' ? dpsInput : (computedDps > 0 ? Math.round(computedDps).toLocaleString("id-ID") : "")}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setDpsInput(val ? parseInt(val, 10).toLocaleString("id-ID") : "");
                    setLastEdited('dps');
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgPrice">Harga Beli (Average)</Label>
                <Input
                  id="avgPrice"
                  type="text"
                  inputMode="numeric"
                  placeholder="Misal: 1.500"
                  value={avgPrice ? parseInt(avgPrice, 10).toLocaleString("id-ID") : ""}
                  onChange={(e) => setAvgPrice(e.target.value.replace(/\D/g, ""))}
                />
              </div>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lot">Jumlah Lot Dimiliki</Label>
                <Input
                  id="lot"
                  type="number"
                  placeholder="Misal: 100"
                  value={lot}
                  onChange={(e) => setLot(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card/40 border border-foreground/5 h-[72px]">
                <div className="space-y-0.5">
                   <Label htmlFor="tax-mode" className="text-foreground/90">Potong Pajak 10%</Label>
                   <p className="text-[10px] text-muted-foreground font-bold tracking-tight opacity-70">PPh Final Dividen</p>
                </div>
                <Switch
                  id="tax-mode"
                  checked={tax}
                  onCheckedChange={setTax}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
           </div>
        </div>

        {/* Results Area */}
        <motion.div 
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl glass-premium p-8 border border-primary/20 shadow-primary/10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Wallet className="w-3 h-3 text-primary" /> Estimasi Dividen Bersih
              </p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black text-foreground tracking-tighter text-glow">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className="bg-transparent border-none outline-none text-4xl font-black text-foreground tracking-tighter text-glow w-full p-0"
                  value={lastEdited === 'net' ? netDivInput : (computedNet > 0 ? Math.round(computedNet).toLocaleString("id-ID") : "0")}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setNetDivInput(val ? parseInt(val, 10).toLocaleString("id-ID") : "");
                    setLastEdited('net');
                  }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Percent className="w-3 h-3 text-primary" /> Dividend Yield
              </p>
              <div className="flex items-center gap-0">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  style={{ width: `${(lastEdited === 'yield' ? yieldInput : (computedYield > 0 ? computedYield.toLocaleString("id-ID", { maximumFractionDigits: 2 }) : "0")).length * 0.6 || 1}ch` }}
                  className="bg-transparent border-none outline-none text-4xl font-black text-foreground tracking-tighter p-0 min-w-[1ch]"
                  value={lastEdited === 'yield' ? yieldInput : (computedYield > 0 ? computedYield.toLocaleString("id-ID", { maximumFractionDigits: 2 }) : "0")}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d.,]/g, "").replace(",", ".");
                    setYieldInput(val);
                    setLastEdited('yield');
                  }}
                />
                <span className="text-4xl font-black text-foreground tracking-tighter">%</span>
              </div>
            </div>
            
            <div className="col-span-full grid grid-cols-2 gap-4 pt-6 border-t border-foreground/5">
               <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Dividen Kotor</p>
                  <p className="text-lg font-black text-foreground/80">Rp {grossDividend.toLocaleString("id-ID")}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Potongan Pajak</p>
                  <p className="text-lg font-black text-destructive/80 opacity-80">Rp {taxAmount.toLocaleString("id-ID")}</p>
               </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
