"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function DividendCalculator() {
  const [dps, setDps] = useState<string>("")
  const [avgPrice, setAvgPrice] = useState<string>("")
  const [lot, setLot] = useState<string>("")
  const [tax, setTax] = useState<boolean>(true) // default potong pajak 10%

  const dividendPerShare = parseFloat(dps) || 0
  const price = parseFloat(avgPrice) || 0
  const totalShares = (parseFloat(lot) || 0) * 100

  const grossDividend = dividendPerShare * totalShares
  const taxAmount = tax ? grossDividend * 0.1 : 0
  const netDividend = grossDividend - taxAmount

  const yieldPercentage = price > 0 ? (dividendPerShare / price) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dividen & Yield</CardTitle>
        <CardDescription>Hitung proyeksi pendapatan dividen dan Dividend Yield.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dps">DPS (Dividen per Share)</Label>
            <Input
              id="dps"
              type="text"
              inputMode="numeric"
              placeholder="Misal: 150"
              value={dps ? parseInt(dps, 10).toLocaleString("id-ID") : ""}
              onChange={(e) => setDps(e.target.value.replace(/\D/g, ""))}
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

        <div className="space-y-2">
          <Label htmlFor="lot">Jumlah Lot</Label>
          <Input
            id="lot"
            type="number"
            placeholder="Misal: 100"
            value={lot}
            onChange={(e) => setLot(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="tax-mode"
            checked={tax}
            onCheckedChange={setTax}
          />
          <Label htmlFor="tax-mode">Potong Pajak 10%</Label>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Dividen (Bersih)</p>
              <p className="text-xl font-bold text-primary">
                Rp {netDividend.toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dividend Yield</p>
              <p className="text-xl font-bold text-primary">
                {yieldPercentage.toLocaleString("id-ID", { maximumFractionDigits: 2 })}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
