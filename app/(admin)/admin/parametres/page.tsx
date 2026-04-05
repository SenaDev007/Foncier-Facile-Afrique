'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PARAMETRES_CHIFFRES_CLES_KEYS } from '@/lib/parametres-accueil'

interface ParametreRow {
  cle: string
  valeur: string
  description: string | null
}

const PARAM_LABELS: Record<string, { label: string; type: 'text' | 'textarea' | 'email' | 'url' | 'tel' }> = {
  nom_site: { label: 'Nom du site', type: 'text' },
  description_site: { label: 'Description du site', type: 'textarea' },
  email_contact: { label: 'Email de contact', type: 'email' },
  telephone: { label: 'Téléphone', type: 'tel' },
  adresse: { label: 'Adresse', type: 'textarea' },
  facebook_url: { label: 'URL Facebook', type: 'url' },
  linkedin_url: { label: 'URL LinkedIn', type: 'url' },
  whatsapp_numero: { label: 'Numéro WhatsApp', type: 'tel' },
  hero_image: { label: 'Image hero (accueil, desktop)', type: 'url' },
  hero_image_mobile: { label: 'Image hero mobile (accueil)', type: 'url' },
  chiffre_clients: { label: 'Clients accompagnés (nombre affiché avec +)', type: 'text' },
  chiffre_satisfaction: { label: 'Taux de satisfaction (nombre affiché avec %)', type: 'text' },
  chiffre_annees: { label: "Années d'expérience (nombre affiché avec +)", type: 'text' },
  chiffre_transactions: { label: 'Transactions sécurisées (nombre affiché avec +)', type: 'text' },
  chiffre_annees_texte: { label: "Années dans le sous-titre (« Plus de X ans d'expertise… »)", type: 'text' },
}

const SECTIONS: { title: string; description?: string; keys: string[] }[] = [
  {
    title: 'Identité & contact',
    keys: ['nom_site', 'description_site', 'email_contact', 'telephone', 'adresse'],
  },
  {
    title: 'Réseaux & WhatsApp',
    keys: ['whatsapp_numero', 'facebook_url', 'linkedin_url'],
  },
  {
    title: "Page d'accueil — images du hero",
    description: 'URLs des visuels du bandeau principal (desktop et mobile).',
    keys: ['hero_image', 'hero_image_mobile'],
  },
  {
    title: "Page d'accueil — chiffres clés",
    description:
      'Section « Chiffres clés » / « Notre impact en quelques chiffres » : les quatre compteurs animés et le nombre d’années dans le sous-titre utilisent exactement ces clés en base.',
    keys: [...PARAMETRES_CHIFFRES_CLES_KEYS],
  },
]

export default function AdminParametresPage() {
  const [params, setParams] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/parametres', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ParametreRow[]) => {
        const map: Record<string, string> = {}
        data.forEach((p) => {
          map[p.cle] = p.valeur
        })
        setParams(map)
      })
      .catch(() => toast.error('Impossible de charger les paramètres.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/parametres', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (res.ok) {
        toast.success('Paramètres enregistrés. Rechargez l’accueil public pour voir les chiffres à jour.')
      } else {
        const j = await res.json().catch(() => ({}))
        toast.error((j as { error?: string }).error ?? 'Erreur lors de la sauvegarde.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setSaving(false)
    }
  }

  const renderField = (cle: string) => {
    const meta = PARAM_LABELS[cle]
    if (!meta) return null
    const { label, type } = meta
    return (
      <div key={cle}>
        <Label htmlFor={cle} className="text-[#EFEFEF]">
          {label}
        </Label>
        {type === 'textarea' ? (
          <Textarea
            id={cle}
            value={params[cle] ?? ''}
            onChange={(e) => setParams((p) => ({ ...p, [cle]: e.target.value }))}
            className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
            rows={3}
          />
        ) : (
          <Input
            id={cle}
            type={type}
            value={params[cle] ?? ''}
            onChange={(e) => setParams((p) => ({ ...p, [cle]: e.target.value }))}
            className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
          />
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#D4A843]" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Paramètres</h1>
          <p className="text-[#8E8E93] text-sm mt-1">
            Données stockées en base (<span className="font-mono text-[#D4A843]/90">Parametre</span>) — le site public lit ces valeurs à chaque visite (accueil dynamique).
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E]">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          Enregistrer
        </Button>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#EFEFEF]">{section.title}</h2>
              {section.description && <p className="text-[#8E8E93] text-sm mt-1.5 leading-relaxed">{section.description}</p>}
            </div>
            <div className="space-y-5 pt-1">{section.keys.map((cle) => renderField(cle))}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
