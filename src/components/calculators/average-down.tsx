"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AverageDownCalculator() {
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
    <Card>
      <CardHeader>
        <CardTitle>Average Down/Up</CardTitle>
        <CardDescription>Hitung harga rata-rata baru setelah pembelian tambahan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="initialPrice">Harga Awal</Label>
            <Input
              id="initialPrice"
              type="text"
              inputMode="numeric"
              placeholder="Misal: 1.000"
              value={initialPrice ? parseInt(initialPrice, 10).toLocaleString("id-ID") : ""}
              onChange={(e) => setInitialPrice(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialLot">Lot Awal</Label>
            <Input
              id="initialLot"
              type="number"
              placeholder="Misal: 100"
              value={initialLot}
              onChange={(e) => setInitialLot(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="newLot">Lot Beli Baru</Label>
            <Input
              id="newLot"
              type="number"
              placeholder="Misal: 200"
              value={newLot}
              onChange={(e) => setNewLot(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Harga Rata-rata Baru</p>
              <p className="text-2xl font-bold text-primary">
                Rp {averagePrice.toLocaleString("id-ID", { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Lot Keseluruhan</p>
              <p className="text-2xl font-bold">{totalLot.toLocaleString("id-ID")}</p>
            </div>
            <div className="col-span-2 border-t pt-2 mt-2">
              <p className="text-muted-foreground">Tambahan Modal Disiapkan</p>
              <p className="text-lg font-bold">Rp {newValue.toLocaleString("id-ID")}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Total Nilai Portofolio</p>
              <p className="text-lg font-bold">Rp {totalValue.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
