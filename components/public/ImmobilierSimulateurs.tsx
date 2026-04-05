'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getWhatsAppUrl } from '@/lib/utils'

const wa =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\D/g, '') ??
  '22996901204'

function formatFcfa(n: number) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' FCFA'
}

export function ImmobilierSimulateurs() {
  const [tab, setTab] = useState('notaire')

  // Frais notaire
  const [prixNotaire, setPrixNotaire] = useState('10000000')
  const [typeBienNotaire, setTypeBienNotaire] = useState<'avec_tf' | 'sans_tf'>('avec_tf')
  const fraisNotaire = useMemo(() => {
    const prix = Math.max(0, parseFloat(prixNotaire.replace(/\s/g, '')) || 0)
    const droits = prix * 0.02
    const honoraires = prix * 0.01
    const enreg = prix * 0.005
    const coef = typeBienNotaire === 'sans_tf' ? 1.05 : 1
    const total = (droits + honoraires + enreg) * coef
    return { prix, droits, honoraires, enreg, total }
  }, [prixNotaire, typeBienNotaire])

  // Rentabilité
  const [prixAchat, setPrixAchat] = useState('25000000')
  const [loyer, setLoyer] = useState('150000')
  const [charges, setCharges] = useState('20000')
  const renta = useMemo(() => {
    const p = Math.max(1, parseFloat(prixAchat.replace(/\s/g, '')) || 1)
    const l = Math.max(0, parseFloat(loyer.replace(/\s/g, '')) || 0)
    const c = Math.max(0, parseFloat(charges.replace(/\s/g, '')) || 0)
    const brut = (l * 12 * 100) / p
    const net = ((l - c) * 12 * 100) / p
    return { brut, net }
  }, [prixAchat, loyer, charges])

  // Terrain
  const [villeTerrain, setVilleTerrain] = useState('parakou')
  const [surfaceTerrain, setSurfaceTerrain] = useState('500')
  const [voirie, setVoirie] = useState(true)
  const [titreTerrain, setTitreTerrain] = useState<'tf' | 'ph' | 'aucun'>('ph')
  const fourchette = useMemo(() => {
    const s = Math.max(1, parseFloat(surfaceTerrain) || 1)
    const baseParM2: Record<string, number> = {
      cotonou: 45000,
      parakou: 12000,
      calavi: 28000,
      porto: 22000,
      autre: 15000,
    }
    const b = baseParM2[villeTerrain] ?? baseParM2.autre
    let low = s * b * 0.75
    let high = s * b * 1.35
    if (voirie) {
      low *= 1.08
      high *= 1.12
    }
    if (titreTerrain === 'tf') {
      low *= 1.15
      high *= 1.25
    } else if (titreTerrain === 'aucun') {
      low *= 0.65
      high *= 0.85
    }
    return { low, high }
  }, [villeTerrain, surfaceTerrain, voirie, titreTerrain])

  const waMessage = useMemo(() => {
    if (tab === 'notaire') {
      return `Bonjour, suite à ma simulation frais de notaire : prix ${fraisNotaire.prix} FCFA, total estimé ${Math.round(fraisNotaire.total)} FCFA.`
    }
    if (tab === 'renta') {
      return `Bonjour, simulation rentabilité : rendement brut ${renta.brut.toFixed(1)} %, net ${renta.net.toFixed(1)} %.`
    }
    return `Bonjour, estimation terrain : fourchette ${Math.round(fourchette.low)} – ${Math.round(fourchette.high)} FCFA.`
  }, [tab, fraisNotaire, renta, fourchette])

  const inputClass = 'bg-[#2C2C2E] border-[#3A3A3C] text-[#EFEFEF]'

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-[#2C2C2E] border border-[#3A3A3C] h-auto p-1 gap-1">
        <TabsTrigger
          value="notaire"
          className="text-xs sm:text-sm data-[state=active]:bg-[#D4A843] data-[state=active]:text-[#1C1C1E]"
        >
          Frais notaire
        </TabsTrigger>
        <TabsTrigger
          value="renta"
          className="text-xs sm:text-sm data-[state=active]:bg-[#D4A843] data-[state=active]:text-[#1C1C1E]"
        >
          Rentabilité
        </TabsTrigger>
        <TabsTrigger
          value="terrain"
          className="text-xs sm:text-sm data-[state=active]:bg-[#D4A843] data-[state=active]:text-[#1C1C1E]"
        >
          Valeur terrain
        </TabsTrigger>
      </TabsList>

      <TabsContent value="notaire" className="mt-6 space-y-4">
        <p className="text-sm text-[#8E8E93]">
          Estimation indicative (droits de mutation ~2 %, honoraires ~1 %, enregistrement ~0,5 % — à affiner avec votre notaire).
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Prix du bien (FCFA)</Label>
            <Input
              value={prixNotaire}
              onChange={(e) => setPrixNotaire(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Titre / situation</Label>
            <select
              className={`w-full rounded-md border px-3 py-2 text-sm ${inputClass}`}
              value={typeBienNotaire}
              onChange={(e) => setTypeBienNotaire(e.target.value as 'avec_tf' | 'sans_tf')}
            >
              <option value="avec_tf">Avec titre foncier (référence)</option>
              <option value="sans_tf">Sans TF / dossier à sécuriser (+5 % indicatif)</option>
            </select>
          </div>
        </div>
        <div className="rounded-xl border border-[#3A3A3C] bg-[#2C2C2E] p-4 space-y-2 text-sm">
          <p className="flex justify-between text-[#EFEFEF]">
            <span>Droits de mutation (2 %)</span>
            <span>{formatFcfa(fraisNotaire.droits)}</span>
          </p>
          <p className="flex justify-between text-[#EFEFEF]">
            <span>Honoraires notaire (1 %)</span>
            <span>{formatFcfa(fraisNotaire.honoraires)}</span>
          </p>
          <p className="flex justify-between text-[#EFEFEF]">
            <span>Frais enregistrement (0,5 %)</span>
            <span>{formatFcfa(fraisNotaire.enreg)}</span>
          </p>
          <p className="flex justify-between font-heading font-bold text-[#D4A843] pt-2 border-t border-[#3A3A3C]">
            <span>Total estimé</span>
            <span>{formatFcfa(fraisNotaire.total)}</span>
          </p>
        </div>
      </TabsContent>

      <TabsContent value="renta" className="mt-6 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Prix d&apos;achat</Label>
            <Input value={prixAchat} onChange={(e) => setPrixAchat(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Loyer mensuel</Label>
            <Input value={loyer} onChange={(e) => setLoyer(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Charges mensuelles</Label>
            <Input value={charges} onChange={(e) => setCharges(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="rounded-xl border border-[#3A3A3C] bg-[#2C2C2E] p-4 space-y-2">
          <p className="flex justify-between text-[#EFEFEF]">
            <span>Rendement brut annuel</span>
            <span className="font-semibold text-[#D4A843]">{renta.brut.toFixed(2)} %</span>
          </p>
          <p className="flex justify-between text-[#EFEFEF]">
            <span>Rendement net annuel (après charges)</span>
            <span className="font-semibold text-[#D4A843]">{renta.net.toFixed(2)} %</span>
          </p>
        </div>
      </TabsContent>

      <TabsContent value="terrain" className="mt-6 space-y-4">
        <p className="text-sm text-[#8E8E93]">
          Fourchette indicative selon la ville, la surface, la voirie et le type de titre (coefficients simplifiés).
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Ville</Label>
            <select
              className={`w-full rounded-md border px-3 py-2 text-sm ${inputClass}`}
              value={villeTerrain}
              onChange={(e) => setVilleTerrain(e.target.value)}
            >
              <option value="cotonou">Cotonou</option>
              <option value="calavi">Abomey-Calavi</option>
              <option value="porto">Porto-Novo</option>
              <option value="parakou">Parakou</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Surface (m²)</Label>
            <Input
              value={surfaceTerrain}
              onChange={(e) => setSurfaceTerrain(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2 flex items-center gap-2 pt-6">
            <input
              id="voirie"
              type="checkbox"
              checked={voirie}
              onChange={(e) => setVoirie(e.target.checked)}
              className="rounded border-[#3A3A3C]"
            />
            <Label htmlFor="voirie" className="text-[#8E8E93] cursor-pointer">
              Accès voirie / bitumé
            </Label>
          </div>
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Type de titre</Label>
            <select
              className={`w-full rounded-md border px-3 py-2 text-sm ${inputClass}`}
              value={titreTerrain}
              onChange={(e) => setTitreTerrain(e.target.value as 'tf' | 'ph' | 'aucun')}
            >
              <option value="tf">Titre foncier</option>
              <option value="ph">Permis d&apos;habiter / PH</option>
              <option value="aucun">Sans titre formalisé</option>
            </select>
          </div>
        </div>
        <div className="rounded-xl border border-[#3A3A3C] bg-[#2C2C2E] p-4">
          <p className="text-[#8E8E93] text-sm mb-1">Fourchette estimée</p>
          <p className="font-heading text-xl text-[#D4A843]">
            {formatFcfa(fourchette.low)} — {formatFcfa(fourchette.high)}
          </p>
        </div>
      </TabsContent>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={getWhatsAppUrl(wa, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Discuter sur WhatsApp
        </a>
        <Link
          href="/simulateur"
          className="inline-flex items-center gap-2 border border-[#D4A843] text-[#D4A843] font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-[#D4A843]/10"
        >
          Simulateur de budget (mensualités)
        </Link>
      </div>
    </Tabs>
  )
}
