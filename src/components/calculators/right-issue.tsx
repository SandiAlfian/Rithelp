"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, Info } from "lucide-react"

export function RightIssueCalculator() {
  const [ratioOld, setRatioOld] = useState<string>("")
  const [ratioNew, setRatioNew] = useState<string>("")
  const [cumPrice, setCumPrice] = useState<string>("")
  const [exercisePrice, setExercisePrice] = useState<string>("")
  const [ownedLot, setOwnedLot] = useState<string>("")
  const [avgOwned, setAvgOwned] = useState<string>("")

  const rOld = parseFloat(ratioOld) || 0
  const rNew = parseFloat(ratioNew) || 0
  const cum = parseFloat(cumPrice) || 0
  const exercise = parseFloat(exercisePrice) || 0
  const owned = parseFloat(ownedLot) || 0
  const avg = parseFloat(avgOwned) || 0

  // --- Harga Teoretis Ex-Date ---
  let theoreticalPrice = 0
  if (rOld + rNew > 0) {
    theoreticalPrice = ((rOld * cum) + (rNew * exercise)) / (rOld + rNew)
  }

  const dilutionPercent = cum > 0 ? ((cum - theoreticalPrice) / cum) * 100 : 0

  // --- Kalkulasi Berdasarkan Lot Dimiliki ---
  const ownedShares = owned * 100
  // Nilai investasi saat ini (dari average)
  const currentInvestValue = avg > 0 ? avg * ownedShares : 0
  const currentMarketValue = cum * ownedShares
  const currentPL = avg > 0 ? currentMarketValue - currentInvestValue : 0
  const currentPLPercent = currentInvestValue > 0 ? (currentPL / currentInvestValue) * 100 : 0

  // Berapa lembar HMETD (hak) yang diterima
  const hmetdShares = rOld > 0 ? Math.floor((ownedShares / rOld) * rNew) : 0
  const hmetdLot = Math.floor(hmetdShares / 100)

  // Biaya menebus
  const redemptionCost = hmetdShares * exercise

  // Nilai portofolio jika TEBUS — gunakan average jika ada, fallback ke harga cum
  const baseCost = avg > 0 ? avg * ownedShares : cum * ownedShares
  const portfolioValueIfRedeem = (ownedShares + hmetdShares) * theoreticalPrice
  const totalInvestedIfRedeem = baseCost + redemptionCost
  const plIfRedeem = portfolioValueIfRedeem - totalInvestedIfRedeem

  // Nilai portofolio jika TIDAK TEBUS
  const portfolioValueIfNotRedeem = ownedShares * theoreticalPrice
  const totalInvestedIfNotRedeem = baseCost
  const plIfNotRedeem = portfolioValueIfNotRedeem - totalInvestedIfNotRedeem

  const hasResult = rOld > 0 && rNew > 0 && cum > 0 && exercise > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Right Issue</CardTitle>
        <CardDescription>Hitung Harga Teoretis dan simulasi keputusan tebus atau tidak.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Baris 1: Rasio */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ratioOld">Rasio Lama (A)</Label>
            <Input
              id="ratioOld"
              type="number"
              placeholder="Misal: 10"
              value={ratioOld}
              onChange={(e) => setRatioOld(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Setiap pegang A saham...</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ratioNew">Rasio Baru (B)</Label>
            <Input
              id="ratioNew"
              type="number"
              placeholder="Misal: 3"
              value={ratioNew}
              onChange={(e) => setRatioNew(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">...dapat B hak (HMETD)</p>
          </div>
        </div>

        {/* Baris 2: Harga */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cumPrice">Harga Cum-Date (Rp)</Label>
            <Input
              id="cumPrice"
              type="text"
              inputMode="numeric"
              placeholder="Misal: 1.500"
              value={cumPrice ? parseInt(cumPrice, 10).toLocaleString("id-ID") : ""}
              onChange={(e) => setCumPrice(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exercisePrice">Harga Penebusan / Strike (Rp)</Label>
            <Input
              id="exercisePrice"
              type="text"
              inputMode="numeric"
              placeholder="Misal: 500"
              value={exercisePrice ? parseInt(exercisePrice, 10).toLocaleString("id-ID") : ""}
              onChange={(e) => setExercisePrice(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        {/* Baris 3: Data Portofolio Pribadi */}
        <div className="border-t pt-4 space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">Simulasi Personal (Opsional)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownedLot">Lot yang Dimiliki</Label>
              <Input
                id="ownedLot"
                type="number"
                placeholder="Misal: 100"
                value={ownedLot}
                onChange={(e) => setOwnedLot(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgOwned">Harga Average Saat Ini (Rp)</Label>
              <Input
                id="avgOwned"
                type="text"
                inputMode="numeric"
                placeholder="Misal: 1.200"
                value={avgOwned ? parseInt(avgOwned, 10).toLocaleString("id-ID") : ""}
                onChange={(e) => setAvgOwned(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div className="space-y-2">
              <Label>Nilai Investasi Saat Ini</Label>
              <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50 font-bold text-sm">
                {currentInvestValue > 0
                  ? `Rp ${currentInvestValue.toLocaleString("id-ID")}`
                  : <span className="text-muted-foreground font-normal">Otomatis dihitung</span>
                }
              </div>
            </div>
          </div>

          {/* Status Portofolio Saat Ini */}
          {owned > 0 && avg > 0 && cum > 0 && (
            <div className="mt-3 p-4 rounded-xl border bg-muted/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Nilai Pasar Saat Ini</p>
                <p className="font-bold">Rp {currentMarketValue.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Modal Diinvestasikan</p>
                <p className="font-bold">Rp {currentInvestValue.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Floating P/L</p>
                <p className={`font-bold ${currentPL >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                  {currentPL >= 0 ? "+" : ""}Rp {currentPL.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Return (%)</p>
                <p className={`font-bold ${currentPLPercent >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                  {currentPLPercent >= 0 ? "+" : ""}{currentPLPercent.toLocaleString("id-ID", { maximumFractionDigits: 2 })}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Hasil Utama */}
        {hasResult && (
          <div className="space-y-4">
            
            {/* Harga Teoretis */}
            <div className="rounded-xl bg-muted/50 border p-5 space-y-3">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Hasil Kalkulasi Umum</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Harga Teoretis (Ex-Date)</p>
                  <p className="text-2xl font-bold text-primary">
                    Rp {theoreticalPrice.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Potensi Dilusi Harga</p>
                  <p className="text-2xl font-bold text-destructive">
                    -{dilutionPercent.toLocaleString("id-ID", { maximumFractionDigits: 2 })}%
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Harga saham akan turun secara teoretis pada Ex-Date sebesar <strong>{dilutionPercent.toLocaleString("id-ID", { maximumFractionDigits: 2 })}%</strong> dari Harga Cum. Ini bukan kerugian nyata — ini penyesuaian wajar akibat penambahan saham baru.</span>
              </div>
            </div>

            {/* Simulasi Personal (jika lot diisi) */}
            {owned > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Simulasi Personal ({owned.toLocaleString("id-ID")} Lot Dimiliki)</h3>

                <div className="p-4 bg-muted/30 border rounded-xl text-sm">
                  <p>Anda berhak mendapat: <strong className="text-primary text-base">{hmetdShares.toLocaleString("id-ID")} lembar HMETD ({hmetdLot} Lot)</strong></p>
                  <p className="text-muted-foreground mt-1">Rasio {rOld}:{rNew} × {ownedShares.toLocaleString("id-ID")} lembar = {hmetdShares.toLocaleString("id-ID")} hak tebus</p>
                  <p className="mt-2">Biaya untuk menebus semua hak: <strong className="text-amber-500">Rp {redemptionCost.toLocaleString("id-ID")}</strong></p>
                </div>

                {/* Skenario 1: TEBUS */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Skenario A: TEBUS Semua HMETD</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nilai Portofolio Setelah Ex-Date</p>
                      <p className="font-bold text-lg">Rp {portfolioValueIfRedeem.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Modal Dikeluarkan</p>
                      <p className="font-bold text-lg">Rp {totalInvestedIfRedeem.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div className="col-span-2 border-t pt-3">
                      <p className="text-muted-foreground">Unrealized P/L Teoretis</p>
                      <p className={`font-black text-xl ${plIfRedeem >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                        {plIfRedeem >= 0 ? "+" : ""}Rp {plIfRedeem.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-lg">
                    ✅ <strong>Jika Tebus:</strong> Nilai saham Anda turun (dilusi), NAMUN Anda mendapat saham baru dengan harga penebusan yang lebih murah dari pasar. Secara nilai total, portofolio Anda <strong>terlindungi dari dilusi</strong> dan justru bisa untung jika harga saham kembali naik setelah rights offering selesai.
                  </div>
                </div>

                {/* Skenario 2: TIDAK TEBUS */}
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-destructive">
                    <XCircle className="w-5 h-5" />
                    <span>Skenario B: TIDAK Tebus HMETD</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nilai Portofolio Setelah Ex-Date</p>
                      <p className="font-bold text-lg">Rp {portfolioValueIfNotRedeem.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Modal Dikeluarkan</p>
                      <p className="font-bold text-lg">Rp {totalInvestedIfNotRedeem.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div className="col-span-2 border-t pt-3">
                      <p className="text-muted-foreground">Kerugian Nilai Akibat Dilusi</p>
                      <p className="font-black text-xl text-destructive">
                        Rp {Math.abs(plIfNotRedeem).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-destructive/80 bg-destructive/10 p-3 rounded-lg">
                    ⚠️ <strong>Jika Tidak Tebus:</strong> Harga saham Anda akan turun ke harga teoretis, sementara jumlah saham Anda tidak bertambah. Anda mengalami <strong>kerugian nilai (dilusi)</strong>. Pilihan terbaik jika tidak mau tebus adalah <strong>menjual HMETD di pasar</strong> (jika diperdagangkan) untuk mendapat kompensasi atas penurunan harga saham Anda.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
