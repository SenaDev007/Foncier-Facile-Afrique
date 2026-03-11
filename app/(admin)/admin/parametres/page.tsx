'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Parametre {
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
}

export default function AdminParametresPage() {
  const [params, setParams] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/parametres')
      .then((r) => r.json())
      .then((data: Parametre[]) => {
        const map: Record<string, string> = {}
        data.forEach((p) => { map[p.cle] = p.valeur })
        setParams(map)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/parametres', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (res.ok) {
        toast.success('Paramètres sauvegardés.')
      } else {
        toast.error('Erreur lors de la sauvegarde.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setSaving(false)
    }
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
          <p className="text-[#8E8E93] text-sm mt-1">Configuration générale du site</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E]">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          Enregistrer
        </Button>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-5">
        {Object.entries(PARAM_LABELS).map(([cle, { label, type }]) => (
          <div key={cle}>
            <Label htmlFor={cle} className="text-[#EFEFEF]">{label}</Label>
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
        ))}
      </div>
    </div>
  )
}
