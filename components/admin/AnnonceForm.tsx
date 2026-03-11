'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUploader from '@/components/admin/ImageUploader'

type TypeBien = 'TERRAIN' | 'APPARTEMENT' | 'MAISON' | 'VILLA' | 'BUREAU' | 'COMMERCE'
type StatutAnnonce = 'BROUILLON' | 'EN_LIGNE' | 'RESERVE' | 'VENDU' | 'ARCHIVE'

interface PhotoItem {
  url: string
  alt: string
}

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
  initialData?: Partial<AnnonceFormData> & { photos?: PhotoItem[] }
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
  const [photos, setPhotos] = useState<PhotoItem[]>(
    initialData?.photos?.map((p) => ({ url: p.url, alt: p.alt ?? '' })) ?? []
  )
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
      const method = isEdit ? 'PUT' : 'POST'
      const body = {
        ...form,
        prix: parseFloat(form.prix),
        surface: form.surface ? parseFloat(form.surface) : undefined,
        photos: photos.map((p, i) => ({ url: p.url, alt: p.alt || form.titre, ordre: i })),
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[#EFEFEF] text-lg">Informations générales</h2>

        <div>
          <Label htmlFor="titre" className="text-[#EFEFEF]">Titre *</Label>
          <Input id="titre" value={form.titre} onChange={set('titre')} required className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="Ex: Terrain 200 m² à Calavi" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type" className="text-[#EFEFEF]">Type de bien *</Label>
            <select id="type" value={form.type} onChange={set('type')} className="mt-1.5 w-full rounded-lg border border-[#3A3A3C] bg-[#1C1C1E] px-3 py-2 text-sm text-[#EFEFEF] focus:outline-none focus:ring-2 focus:ring-[#D4A843]">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="statut" className="text-[#EFEFEF]">Statut *</Label>
            <select id="statut" value={form.statut} onChange={set('statut')} className="mt-1.5 w-full rounded-lg border border-[#3A3A3C] bg-[#1C1C1E] px-3 py-2 text-sm text-[#EFEFEF] focus:outline-none focus:ring-2 focus:ring-[#D4A843]">
              {STATUTS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-[#EFEFEF]">Description *</Label>
          <Textarea id="description" value={form.description} onChange={set('description')} required className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" rows={5} placeholder="Décrivez le bien en détail..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="prix" className="text-[#EFEFEF]">Prix (FCFA) *</Label>
            <Input id="prix" type="number" min="0" value={form.prix} onChange={set('prix')} required className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="5000000" />
          </div>
          <div>
            <Label htmlFor="surface" className="text-[#EFEFEF]">Surface (m²)</Label>
            <Input id="surface" type="number" min="0" value={form.surface} onChange={set('surface')} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="100" />
          </div>
          <div>
            <Label htmlFor="modalitesPrix" className="text-[#EFEFEF]">Modalités de prix</Label>
            <Input id="modalitesPrix" value={form.modalitesPrix} onChange={set('modalitesPrix')} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="Ex: Négociable, paiement échelonné possible" />
          </div>
        </div>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[#EFEFEF] text-lg">Photos du bien</h2>
        <p className="text-[#8E8E93] text-sm">Glissez-déposez ou cliquez pour uploader. La première image sera la principale.</p>
        <ImageUploader
          images={photos}
          onImagesChange={setPhotos}
          maxImages={10}
        />
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[#EFEFEF] text-lg">Localisation</h2>

        <div>
          <Label htmlFor="localisation" className="text-[#EFEFEF]">Adresse / Localisation *</Label>
          <Input id="localisation" value={form.localisation} onChange={set('localisation')} required className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="Ex: Abomey-Calavi, Bénin" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="departement" className="text-[#EFEFEF]">Département</Label>
            <Input id="departement" value={form.departement} onChange={set('departement')} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="Atlantique" />
          </div>
          <div>
            <Label htmlFor="commune" className="text-[#EFEFEF]">Commune</Label>
            <Input id="commune" value={form.commune} onChange={set('commune')} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="Parakou" />
          </div>
          <div>
            <Label htmlFor="quartier" className="text-[#EFEFEF]">Quartier</Label>
            <Input id="quartier" value={form.quartier} onChange={set('quartier')} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="Fidjrossè" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E]">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {isEdit ? 'Mettre à jour' : 'Créer l\'annonce'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#3A3A3C] text-[#EFEFEF] hover:bg-[#3A3A3C]">
          Annuler
        </Button>
      </div>
    </form>
  )
}
