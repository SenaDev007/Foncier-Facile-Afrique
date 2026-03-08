'use client'

import { useState, useMemo } from 'react'
import { Calculator, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/utils'

export default function Simulateur() {
  const [budget, setBudget] = useState('')
  const [apport, setApport] = useState('')
  const [duree, setDuree] = useState('20')
  const [taux, setTaux] = useState('8')

  const result = useMemo(() => {
    const b = Number(budget)
    const a = Number(apport)
    const d = Number(duree)
    const t = Number(taux) / 100 / 12

    if (!b || b <= 0) return null

    const emprunt = b - a
    if (emprunt <= 0) return { mensualite: 0, coutTotal: b, interets: 0, emprunt: 0 }

    const n = d * 12
    const mensualite = t > 0 ? (emprunt * t * Math.pow(1 + t, n)) / (Math.pow(1 + t, n) - 1) : emprunt / n
    const coutTotal = mensualite * n + a
    const interets = coutTotal - b

    return { mensualite, coutTotal, interets, emprunt }
  }, [budget, apport, duree, taux])

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary-light rounded-lg">
          <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <h2 className="font-heading font-bold text-dark text-xl">Simulateur de budget</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label htmlFor="sim-budget">Prix du bien (FCFA)</Label>
            <Input
              id="sim-budget"
              type="number"
              placeholder="Ex: 15 000 000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="0"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="sim-apport">Apport personnel (FCFA)</Label>
            <Input
              id="sim-apport"
              type="number"
              placeholder="Ex: 3 000 000"
              value={apport}
              onChange={(e) => setApport(e.target.value)}
              min="0"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="sim-duree">Durée du prêt (années)</Label>
            <Input
              id="sim-duree"
              type="number"
              value={duree}
              onChange={(e) => setDuree(e.target.value)}
              min="1"
              max="30"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="sim-taux">Taux d&apos;intérêt annuel (%)</Label>
            <Input
              id="sim-taux"
              type="number"
              value={taux}
              onChange={(e) => setTaux(e.target.value)}
              min="0"
              max="30"
              step="0.1"
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          {result ? (
            <div className="bg-primary-light rounded-xl p-6 h-full flex flex-col justify-center space-y-4">
              <h3 className="font-heading font-semibold text-primary text-base">Résultats de la simulation</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-primary/10">
                  <span className="text-grey text-sm">Montant à emprunter</span>
                  <span className="font-semibold text-dark">{formatPrice(result.emprunt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-primary/10">
                  <span className="text-grey text-sm">Mensualité estimée</span>
                  <span className="font-bold text-primary text-lg">{formatPrice(result.mensualite)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-primary/10">
                  <span className="text-grey text-sm">Coût total des intérêts</span>
                  <span className="font-semibold text-dark">{formatPrice(result.interets)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-grey text-sm font-medium">Coût total du crédit</span>
                  <span className="font-bold text-dark text-base">{formatPrice(result.coutTotal)}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-white/60 rounded-lg p-3 mt-2">
                <Info className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-grey leading-relaxed">
                  Simulation indicative. Contactez-nous pour une étude personnalisée de votre financement.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 h-full flex items-center justify-center">
              <p className="text-grey text-center text-sm">Renseignez le prix du bien pour obtenir votre simulation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
