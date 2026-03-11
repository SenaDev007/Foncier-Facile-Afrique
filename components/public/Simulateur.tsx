'use client'

import { useMemo, useState } from 'react'
import { Calculator, Info, MapPin, Home } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPrice, getWhatsAppUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type TypeBienSimu = 'TERRAIN' | 'MAISON' | 'APPARTEMENT'
type ZoneSimu = 'COTONOU_CENTRE' | 'PERIPHERIE' | 'AUTRE_VILLE'

export default function Simulateur() {
  const [budget, setBudget] = useState('')
  const [typeBien, setTypeBien] = useState<TypeBienSimu>('TERRAIN')
  const [zone, setZone] = useState<ZoneSimu>('COTONOU_CENTRE')

  const result = useMemo(() => {
    const b = Number(budget)
    if (!b || b <= 0) return null

    const fraisNotaire = b * 0.08
    const fraisEnregistrement = b * 0.02

    let fraisArpentageMin = 100_000
    let fraisArpentageMax = 300_000

    if (zone === 'COTONOU_CENTRE') {
      fraisArpentageMin = 200_000
      fraisArpentageMax = 300_000
    } else if (zone === 'PERIPHERIE') {
      fraisArpentageMin = 120_000
      fraisArpentageMax = 250_000
    }

    const fraisArpentageMoyen = (fraisArpentageMin + fraisArpentageMax) / 2
    const totalFrais = fraisNotaire + fraisEnregistrement + fraisArpentageMoyen
    const budgetNet = Math.max(b - totalFrais, 0)

    let surfaceMin = 0
    let surfaceMax = 0

    if (typeBien === 'TERRAIN') {
      if (zone === 'COTONOU_CENTRE') {
        surfaceMin = Math.round(budgetNet / 200_000)
        surfaceMax = Math.round(budgetNet / 150_000)
      } else if (zone === 'PERIPHERIE') {
        surfaceMin = Math.round(budgetNet / 120_000)
        surfaceMax = Math.round(budgetNet / 80_000)
      } else {
        surfaceMin = Math.round(budgetNet / 80_000)
        surfaceMax = Math.round(budgetNet / 50_000)
      }
    } else {
      if (zone === 'COTONOU_CENTRE') {
        surfaceMin = Math.round(budgetNet / 600_000) * 10
        surfaceMax = Math.round(budgetNet / 450_000) * 10
      } else if (zone === 'PERIPHERIE') {
        surfaceMin = Math.round(budgetNet / 400_000) * 10
        surfaceMax = Math.round(budgetNet / 300_000) * 10
      } else {
        surfaceMin = Math.round(budgetNet / 300_000) * 10
        surfaceMax = Math.round(budgetNet / 220_000) * 10
      }
    }

    return {
      fraisNotaire,
      fraisEnregistrement,
      fraisArpentageMin,
      fraisArpentageMax,
      totalFrais,
      budgetNet,
      surfaceMin: Math.max(surfaceMin, 0),
      surfaceMax: Math.max(surfaceMax, 0),
    }
  }, [budget, typeBien, zone])

  const whatsappUrl = useMemo(() => {
    if (!result) return getWhatsAppUrl('22996901204')
    const message = `Bonjour, je souhaite étudier un projet immobilier.

Budget total: ${formatPrice(Number(budget))}
Type de bien: ${
      typeBien === 'TERRAIN'
        ? 'Terrain'
        : typeBien === 'MAISON'
        ? 'Maison'
        : 'Appartement'
    }
Zone: ${
      zone === 'COTONOU_CENTRE'
        ? 'Cotonou centre'
        : zone === 'PERIPHERIE'
        ? 'Périphérie de Cotonou / Abomey-Calavi'
        : 'Autre ville'
    }

Frais notaire estimés: ${formatPrice(result.fraisNotaire)}
Frais d'enregistrement estimés: ${formatPrice(result.fraisEnregistrement)}
Frais d'arpentage estimés: ~${formatPrice(result.fraisArpentageMin)} à ${formatPrice(
      result.fraisArpentageMax,
    )}
Budget net disponible: ${formatPrice(result.budgetNet)}
Surface estimée possible: ${
      result.surfaceMin && result.surfaceMax
        ? `${result.surfaceMin} à ${result.surfaceMax} m²`
        : 'à affiner'
    }

Pouvez-vous me conseiller sur les meilleures options avec ces paramètres ?`
    return getWhatsAppUrl('22996901204', message)
  }, [budget, result, typeBien, zone])

  return (
    <div className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-2xl p-6 md:p-8 shadow-card">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[rgba(212,168,67,0.16)] rounded-lg">
            <Calculator className="h-5 w-5 text-[#D4A843]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-[#EFEFEF] text-xl">
              Simulateur de budget immobilier
            </h2>
            <p className="text-xs text-[#8E8E93]">
              Estimez vos frais et la surface accessible avant de prendre rendez-vous.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label htmlFor="sim-budget">Budget total disponible (FCFA)</Label>
            <Input
              id="sim-budget"
              type="number"
              placeholder="Ex : 20 000 000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="0"
              className="mt-1.5 bg-[#2C2C2E] border-[#3A3A3C] text-[#EFEFEF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Type de bien</Label>
              <div className="mt-1.5 inline-flex rounded-full bg-[#2C2C2E] p-1 text-xs">
                {(
                  [
                    { value: 'TERRAIN', label: 'Terrain' },
                    { value: 'MAISON', label: 'Maison' },
                    { value: 'APPARTEMENT', label: 'Appartement' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTypeBien(option.value)}
                    className={`flex-1 px-3 py-1.5 rounded-full flex items-center justify-center gap-1 transition-colors ${
                      typeBien === option.value
                        ? 'bg-[#D4A843] text-[#1C1C1E] font-semibold'
                        : 'text-[#EFEFEF] hover:bg-[#3A3A3C]'
                    }`}
                  >
                    <Home className="h-3 w-3" aria-hidden="true" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Zone</Label>
              <div className="mt-1.5 space-y-2">
                {(
                  [
                    { value: 'COTONOU_CENTRE', label: 'Cotonou centre' },
                    { value: 'PERIPHERIE', label: 'Périphérie / Calavi' },
                    { value: 'AUTRE_VILLE', label: 'Autre ville' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setZone(option.value)}
                    className={`w-full inline-flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition-colors ${
                      zone === option.value
                        ? 'border-[#D4A843] bg-[rgba(212,168,67,0.12)] text-[#EFEFEF]'
                        : 'border-[#3A3A3C] text-[#8E8E93] hover:border-[#D4A843]/60 hover:bg-[#2C2C2E]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          {result ? (
            <div className="bg-[rgba(34,34,36,0.9)] rounded-xl p-6 h-full flex flex-col justify-between border border-[rgba(212,168,67,0.2)]">
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-[#D4A843] text-sm">
                  Résumé de votre capacité d’achat
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#3A3A3C]">
                    <span className="text-[#8E8E93]">Frais de notaire estimés (8 %)</span>
                    <span className="font-semibold text-[#EFEFEF]">
                      {formatPrice(result.fraisNotaire)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#3A3A3C]">
                    <span className="text-[#8E8E93]">Frais d’enregistrement (2 %)</span>
                    <span className="font-semibold text-[#EFEFEF]">
                      {formatPrice(result.fraisEnregistrement)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#3A3A3C]">
                    <span className="text-[#8E8E93]">Frais d’arpentage estimés</span>
                    <span className="font-semibold text-[#EFEFEF]">
                      ~{formatPrice(result.fraisArpentageMin)} à{' '}
                      {formatPrice(result.fraisArpentageMax)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#3A3A3C]">
                    <span className="text-[#8E8E93] font-medium">Total frais estimés</span>
                    <span className="font-bold text-[#EFEFEF]">
                      {formatPrice(result.totalFrais)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#8E8E93] font-medium">
                      Budget net disponible pour le bien
                    </span>
                    <span className="font-heading text-base font-bold text-[#D4A843]">
                      {formatPrice(result.budgetNet)}
                    </span>
                  </div>
                  {result.surfaceMin > 0 && result.surfaceMax > 0 && (
                    <div className="flex justify-between items-center py-2 bg-[rgba(212,168,67,0.08)] rounded-lg px-3">
                      <span className="text-[#EFEFEF] text-xs font-medium">
                        Fourchette de surface estimée
                      </span>
                      <span className="font-heading text-sm font-semibold text-[#D4A843]">
                        {result.surfaceMin} à {result.surfaceMax} m²
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2 bg-[#2C2C2E] rounded-lg p-3">
                  <Info
                    className="h-4 w-4 text-[#D4A843] flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-[11px] text-[#8E8E93] leading-relaxed">
                    Ces montants sont indicatifs et peuvent varier selon le notaire, la nature
                    du terrain et la commune. Un conseiller FFA affinera ces chiffres avec vous.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#3A3A3C] flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Parler à un conseiller sur WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-[#2C2C2E] rounded-xl p-6 h-full flex items-center justify-center border border-[#3A3A3C]">
              <p className="text-[#8E8E93] text-center text-sm">
                Renseignez votre budget total pour obtenir une estimation des frais et de la
                surface accessible.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
