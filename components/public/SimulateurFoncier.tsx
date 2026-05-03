'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calculator, Info, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { getWhatsAppUrl } from '@/lib/utils'

const NOTAIRE_RATE = 0.08
const ENREGISTREMENT_RATE = 0.02

const ZONES = {
  COTONOU: {
    label: 'Cotonou (Centre)',
    arpentage: 300000,
    priceRange: [50000, 150000],
  },
  PERIPHERIE: {
    label: 'Périphérie (Calavi, Sèmè, Porto-Novo)',
    arpentage: 150000,
    priceRange: [10000, 45000],
  },
  AUTRE: {
    label: 'Autre ville / Zone rurale',
    arpentage: 100000,
    priceRange: [2000, 15000],
  },
}

export default function SimulateurFoncier() {
  const [budget, setBudget] = useState<string>('5000000')
  const [type, setType] = useState<string>('TERRAIN')
  const [zone, setZone] = useState<keyof typeof ZONES>('PERIPHERIE')
  
  const [results, setResults] = useState({
    notaire: 0,
    enregistrement: 0,
    arpentage: 0,
    fraisTotaux: 0,
    budgetNet: 0,
    surfaceMin: 0,
    surfaceMax: 0,
  })

  useEffect(() => {
    const b = parseFloat(budget) || 0
    const arpentage = ZONES[zone].arpentage
    const notaire = b * NOTAIRE_RATE
    const enregistrement = b * ENREGISTREMENT_RATE
    const fraisTotaux = notaire + enregistrement + arpentage
    const budgetNet = Math.max(0, b - fraisTotaux)
    
    const [pMin, pMax] = ZONES[zone].priceRange
    const surfaceMin = Math.floor(budgetNet / pMax)
    const surfaceMax = Math.floor(budgetNet / pMin)

    setResults({
      notaire,
      enregistrement,
      arpentage,
      fraisTotaux,
      budgetNet,
      surfaceMin,
      surfaceMax,
    })
  }, [budget, zone])

  const formatFCFA = (val: number) => 
    new Intl.NumberFormat('fr-BJ', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val)

  const whatsappMsg = `Bonjour FFA, j'ai utilisé votre simulateur. 
Mon budget : ${formatFCFA(parseFloat(budget))}
Type : ${type}
Zone : ${ZONES[zone].label}
Résultat estimé : ${results.surfaceMin} à ${results.surfaceMax} m² net.
Pouvez-vous m'aider à trouver un bien ?`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-6 shadow-xl">
          <h2 className="font-heading text-xl font-bold text-[#EFEFEF] mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[#D4A843]" />
            Mes critères
          </h2>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-zinc-400">Budget total (FCFA)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] focus:ring-[#D4A843]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Type de bien</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C] text-[#EFEFEF]">
                  <SelectItem value="TERRAIN">Terrain nu</SelectItem>
                  <SelectItem value="MAISON">Maison / Villa</SelectItem>
                  <SelectItem value="APPARTEMENT">Appartement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Zone géographique</Label>
              <Select value={zone} onValueChange={(v) => setZone(v as keyof typeof ZONES)}>
                <SelectTrigger className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C] text-[#EFEFEF]">
                  {Object.entries(ZONES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Les calculs incluent les frais de notaire (8%), l'enregistrement (2%) et les frais d'arpentage forfaitaires.
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="bg-[#2C2C2E] border border-[#D4A843]/30 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A843]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <h2 className="font-heading text-xl font-bold text-[#EFEFEF] mb-8">Estimation de votre capacité</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-1">
              <p className="text-zinc-400 text-xs uppercase tracking-wider">Budget net disponible</p>
              <p className="text-3xl font-bold text-[#D4A843]">{formatFCFA(results.budgetNet)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-400 text-xs uppercase tracking-wider">Surface estimée</p>
              <p className="text-3xl font-bold text-white">
                {results.surfaceMin} à {results.surfaceMax} m²
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-[#3A3A3C] pt-6">
            <h3 className="text-sm font-semibold text-[#EFEFEF] mb-4">Détail des frais (estimés)</h3>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Frais de notaire (8%)</span>
              <span className="text-[#EFEFEF]">{formatFCFA(results.notaire)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Droits d'enregistrement (2%)</span>
              <span className="text-[#EFEFEF]">{formatFCFA(results.enregistrement)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Frais d'arpentage & bornage</span>
              <span className="text-[#EFEFEF]">{formatFCFA(results.arpentage)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-[#3A3A3C]">
              <span className="text-[#D4A843]">Total des frais</span>
              <span className="text-[#D4A843]">{formatFCFA(results.fraisTotaux)}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="flex-1 bg-[#D4A843] hover:bg-[#B8912E] text-zinc-950 font-bold h-12 rounded-xl"
            >
              <a href={getWhatsAppUrl('22996901204', whatsappMsg)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                Parler à un conseiller
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-[#3A3A3C] text-white hover:bg-white/5 h-12 rounded-xl"
            >
              <Link href="/catalogue">
                Voir les annonces
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <Card className="bg-[#161618] border-[#3A3A3C] border-dashed">
          <CardContent className="p-6">
            <p className="text-xs text-[#8E8E93] italic leading-relaxed text-center">
              * Cette simulation est donnée à titre indicatif. Les frais réels peuvent varier selon la nature exacte du titre foncier (TF, ACD, PH) et les tarifs spécifiques du cabinet notarial.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
