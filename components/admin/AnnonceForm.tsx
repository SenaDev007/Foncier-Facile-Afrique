'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type TypeBien = 'TERRAIN' | 'APPARTEMENT' | 'MAISON' | 'VILLA' | 'BUREAU' | 'COMMERCE'
type StatutAnnonce = 'BROUILLON' | 'EN_LIGNE' | 'RESERVE' | 'VENDU' | 'ARCHIVE'

interface AnnonceFormData {
  id?: string
  titre: string
  description: string
  type: TypeBien
  statut: StatutAnnonce
  prix: string
  surface: string
  localisation: string
  departement: string
  commune: string
  quartier: string
  modalitesPrix: string
}

interface AnnonceFormProps {
  initialData?: Partial<AnnonceFormData>
}

const TYPES: TypeBien[] = ['TERRAIN', 'APPARTEMENT', 'MAISON', 'VILLA', 'BUREAU', 'COMMERCE']
const STATUTS: StatutAnnonce[] = ['BROUILLON', 'EN_LIGNE', 'RESERVE', 'VENDU', 'ARCHIVE']

export function AnnonceForm({ initialData }: AnnonceFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData?.id)

  const [form, setForm] = useState<AnnonceFormData>({
    titre: initialData?.titre ?? '',
    description: initialData?.description ?? '',
    type: initialData?.type ?? 'TERRAIN',
    statut: initialData?.statut ?? 'BROUILLON',
    prix: initialData?.prix ?? '',
    surface: initialData?.surface ?? '',
    localisation: initialData?.localisation ?? '',
    departement: initialData?.departement ?? '',
    commune: initialData?.commune ?? '',
    quartier: initialData?.quartier ?? '',
    modalitesPrix: initialData?.modalitesPrix ?? '',
  })
  const [saving, setSaving] = useState(false)

  const set = (field: keyof AnnonceFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titre || !form.description || !form.prix || !form.localisation) {
      toast.error('Remplissez tous les champs obligatoires.')
      return
    }

    setSaving(true)
    try {
      const url = isEdit ? `/api/annonces/${initialData!.id}` : '/api/annonces'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          prix: parseFloat(form.prix),
          surface: form.surface ? parseFloat(form.surface) : undefined,
        }),
      })
      if (res.ok) {
        toast.success(isEdit ? 'Annonce mise à jour.' : 'Annonce créée.')
        router.push('/admin/annonces')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Une erreur est survenue.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="font-heading font-semibold text-dark text-lg">Informations générales</h2>

        <div>
          <Label htmlFor="titre">Titre *</Label>
          <Input id="titre" value={form.titre} onChange={set('titre')} required className="mt-1.5" placeholder="Ex: Terrain 200 m² à Calavi" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type de bien *</Label>
            <select id="type" value={form.type} onChange={set('type')} className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="statut">Statut *</Label>
            <select id="statut" value={form.statut} onChange={set('statut')} className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              {STATUTS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" value={form.description} onChange={set('description')} required className="mt-1.5" rows={5} placeholder="Décrivez le bien en détail..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="prix">Prix (FCFA) *</Label>
            <Input id="prix" type="number" min="0" value={form.prix} onChange={set('prix')} required className="mt-1.5" placeholder="5000000" />
          </div>
          <div>
            <Label htmlFor="surface">Surface (m²)</Label>
            <Input id="surface" type="number" min="0" value={form.surface} onChange={set('surface')} className="mt-1.5" placeholder="100" />
          </div>
        </div>

        <div>
          <Label htmlFor="modalitesPrix">Modalités de prix</Label>
          <Input id="modalitesPrix" value={form.modalitesPrix} onChange={set('modalitesPrix')} className="mt-1.5" placeholder="Ex: Négociable, paiement échelonné possible" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="font-heading font-semibold text-dark text-lg">Localisation</h2>

        <div>
          <Label htmlFor="localisation">Adresse / Localisation *</Label>
          <Input id="localisation" value={form.localisation} onChange={set('localisation')} required className="mt-1.5" placeholder="Ex: Abomey-Calavi, Bénin" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="departement">Département</Label>
            <Input id="departement" value={form.departement} onChange={set('departement')} className="mt-1.5" placeholder="Atlantique" />
          </div>
          <div>
            <Label htmlFor="commune">Commune</Label>
            <Input id="commune" value={form.commune} onChange={set('commune')} className="mt-1.5" placeholder="Parakou" />
          </div>
          <div>
            <Label htmlFor="quartier">Quartier</Label>
            <Input id="quartier" value={form.quartier} onChange={set('quartier')} className="mt-1.5" placeholder="Fidjrossè" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {isEdit ? 'Mettre à jour' : 'Créer l\'annonce'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
