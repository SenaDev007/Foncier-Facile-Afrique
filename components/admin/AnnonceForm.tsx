'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import ImageUploader from '@/components/admin/ImageUploader'
import { ANNONCE_DOCUMENT_OPTIONS } from '@/lib/annonce-constants'

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
  initialData?: Partial<AnnonceFormData> & {
    photos?: PhotoItem[]
    documents?: string[]
    latitude?: number | null
    longitude?: number | null
  }
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
  const [documents, setDocuments] = useState<string[]>(initialData?.documents ?? [])
  const [latitude, setLatitude] = useState(
    initialData?.latitude != null ? String(initialData.latitude) : ''
  )
  const [longitude, setLongitude] = useState(
    initialData?.longitude != null ? String(initialData.longitude) : ''
  )
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const toggleDocument = (value: string) => {
    setDocuments((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    )
  }

  const parseCoord = (raw: string): number | undefined => {
    const t = raw.trim().replace(',', '.')
    if (!t) return undefined
    const n = Number.parseFloat(t)
    return Number.isFinite(n) ? n : undefined
  }

  const set = (field: keyof AnnonceFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titre || !form.description || !form.prix || !form.localisation) {
      toast.error('Remplissez tous les champs obligatoires.')
      return
    }

    let lat: number | null | undefined
    let lng: number | null | undefined
    if (!latitude.trim()) {
      lat = isEdit ? null : undefined
    } else {
      lat = parseCoord(latitude)
      if (lat === undefined) {
        toast.error('Latitude invalide (nombre décimal attendu).')
        return
      }
    }
    if (!longitude.trim()) {
      lng = isEdit ? null : undefined
    } else {
      lng = parseCoord(longitude)
      if (lng === undefined) {
        toast.error('Longitude invalide (nombre décimal attendu).')
        return
      }
    }

    setSaving(true)
    try {
      const url = isEdit ? `/api/annonces/${initialData!.id}` : '/api/annonces'
      const method = isEdit ? 'PUT' : 'POST'
      const body = {
        titre: form.titre,
        description: form.description,
        type: form.type,
        statut: form.statut,
        prix: parseFloat(form.prix),
        surface: form.surface ? parseFloat(form.surface) : undefined,
        localisation: form.localisation,
        departement: form.departement || undefined,
        commune: form.commune || undefined,
        quartier: form.quartier || undefined,
        modalitesPrix: form.modalitesPrix || undefined,
        latitude: lat,
        longitude: lng,
        documents,
        photos: photos.map((p, i) => ({ url: p.url, alt: p.alt || form.titre, ordre: i })),
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const payload = await res.json().catch(() => ({}))
      if (res.ok && payload.success !== false) {
        toast.success(isEdit ? 'Annonce mise à jour.' : 'Annonce créée.')
        router.push('/admin/annonces')
        router.refresh()
      } else {
        toast.error(
          typeof payload.error === 'string' ? payload.error : 'Une erreur est survenue.'
        )
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isEdit || !initialData?.id) return
    if (!window.confirm('Supprimer définitivement cette annonce ?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/annonces/${initialData.id}`, { method: 'DELETE' })
      const payload = await res.json().catch(() => ({}))
      if (res.ok) {
        toast.success('Annonce supprimée.')
        router.push('/admin/annonces')
        router.refresh()
      } else {
        toast.error(typeof payload.error === 'string' ? payload.error : 'Suppression impossible.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setDeleting(false)
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude" className="text-[#EFEFEF]">Latitude (optionnel)</Label>
            <Input
              id="latitude"
              inputMode="decimal"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
              placeholder="ex. 6.3654"
            />
          </div>
          <div>
            <Label htmlFor="longitude" className="text-[#EFEFEF]">Longitude (optionnel)</Label>
            <Input
              id="longitude"
              inputMode="decimal"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
              placeholder="ex. 2.4183"
            />
          </div>
        </div>
        <p className="text-xs text-[#8E8E93]">
          Si renseignées, la fiche publique et la carte se centrent sur ce point ; sinon une position par défaut est utilisée.
        </p>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold text-[#EFEFEF] text-lg">Documents juridiques</h2>
        <p className="text-[#8E8E93] text-sm">
          Cochez les documents associés au bien : ils servent aux filtres sur la page publique des annonces.
        </p>
        <div className="flex flex-col gap-3">
          {ANNONCE_DOCUMENT_OPTIONS.map((d) => (
            <label key={d.value} className="flex items-center gap-3 cursor-pointer text-sm text-[#EFEFEF]">
              <Checkbox
                checked={documents.includes(d.value)}
                onCheckedChange={() => toggleDocument(d.value)}
                className="border-[#3A3A3C] data-[state=checked]:bg-[#D4A843] data-[state=checked]:border-[#D4A843]"
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saving || deleting} className="gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E]">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {isEdit ? 'Mettre à jour' : 'Créer l\'annonce'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#3A3A3C] text-[#EFEFEF] hover:bg-[#3A3A3C]">
          Annuler
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="outline"
            disabled={saving || deleting}
            onClick={handleDelete}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 ml-auto"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
            Supprimer
          </Button>
        )}
      </div>
    </form>
  )
}
