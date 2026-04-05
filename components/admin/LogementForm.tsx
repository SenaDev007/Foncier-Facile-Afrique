'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import type { TypeLogement, StatutLogement } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TYPES: { value: TypeLogement; label: string }[] = [
  { value: 'GUEST_HOUSE', label: 'Guest house' },
  { value: 'HOTEL', label: 'Hôtel' },
  { value: 'VILLA_VAC', label: 'Villa vacances' },
  { value: 'APPARTEMENT', label: 'Appartement' },
]

const STATUTS: { value: StatutLogement; label: string }[] = [
  { value: 'DISPONIBLE', label: 'Disponible' },
  { value: 'OCCUPE', label: 'Occupé' },
  { value: 'ARCHIVE', label: 'Archivé' },
]

const inputClass = 'bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]'

type PhotoRow = { url: string; alt: string }

interface LogementFormProps {
  mode: 'create' | 'edit'
  logementId?: string
  initial?: {
    reference: string
    nom: string
    type: TypeLogement
    ville: string
    quartier: string | null
    description: string
    prixNuit: number
    capacite: number
    minNuits: number
    equipements: string[]
    services: string[]
    statut: StatutLogement
    latitude: number | null
    longitude: number | null
    photos?: { url: string; alt: string | null }[]
  }
}

export function LogementForm({ mode, logementId, initial }: LogementFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [reference, setReference] = useState(initial?.reference ?? '')
  const [nom, setNom] = useState(initial?.nom ?? '')
  const [type, setType] = useState<TypeLogement>(initial?.type ?? 'APPARTEMENT')
  const [ville, setVille] = useState(initial?.ville ?? '')
  const [quartier, setQuartier] = useState(initial?.quartier ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [prixNuit, setPrixNuit] = useState(initial != null ? String(initial.prixNuit) : '')
  const [capacite, setCapacite] = useState(initial != null ? String(initial.capacite) : '')
  const [minNuits, setMinNuits] = useState(initial != null ? String(initial.minNuits) : '1')
  const [equipements, setEquipements] = useState((initial?.equipements ?? []).join(', '))
  const [services, setServices] = useState((initial?.services ?? []).join(', '))
  const [statut, setStatut] = useState<StatutLogement>(initial?.statut ?? 'DISPONIBLE')
  const [latitude, setLatitude] = useState(initial?.latitude != null ? String(initial.latitude) : '')
  const [longitude, setLongitude] = useState(initial?.longitude != null ? String(initial.longitude) : '')
  const [photoRows, setPhotoRows] = useState<PhotoRow[]>(() => {
    if (initial?.photos?.length) {
      return initial.photos.map((p) => ({ url: p.url, alt: p.alt ?? '' }))
    }
    return [{ url: '', alt: '' }]
  })

  const parseList = (s: string) =>
    s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        reference: reference.trim(),
        nom: nom.trim(),
        type,
        ville: ville.trim(),
        quartier: quartier.trim() || undefined,
        description: description.trim(),
        prixNuit: parseFloat(prixNuit.replace(/\s/g, '')),
        capacite: parseInt(capacite, 10),
        minNuits: parseInt(minNuits, 10) || 1,
        equipements: parseList(equipements),
        services: parseList(services),
        statut,
        latitude: latitude.trim() === '' ? undefined : parseFloat(latitude),
        longitude: longitude.trim() === '' ? undefined : parseFloat(longitude),
        photos: photoRows.filter((p) => p.url.trim()).map((p, i) => ({
          url: p.url.trim(),
          alt: p.alt || undefined,
          ordre: i,
        })),
      }

      if (mode === 'create') {
        const res = await fetch('/api/admin/logements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(json.error ?? 'Erreur')
        }
        toast.success('Logement créé.')
        router.push('/admin/logements')
        router.refresh()
      } else if (logementId) {
        const { reference: _r, ...patchBody } = payload
        const res = await fetch(`/api/admin/logements/${logementId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(patchBody),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(json.error ?? 'Erreur')
        }
        toast.success('Logement mis à jour.')
        router.refresh()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Référence {mode === 'edit' && '(non modifiable ici)'}</Label>
          <Input
            className={inputClass}
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
            disabled={mode === 'edit'}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Nom commercial</Label>
          <Input className={inputClass} value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as TypeLogement)}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
              {TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Statut</Label>
          <Select value={statut} onValueChange={(v) => setStatut(v as StatutLogement)}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
              {STATUTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Ville</Label>
          <Input className={inputClass} value={ville} onChange={(e) => setVille(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Quartier</Label>
          <Input className={inputClass} value={quartier} onChange={(e) => setQuartier(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[#8E8E93]">Description</Label>
        <Textarea
          className={inputClass}
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Prix / nuit (FCFA)</Label>
          <Input className={inputClass} type="number" min={1} step={1} value={prixNuit} onChange={(e) => setPrixNuit(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Capacité (pers.)</Label>
          <Input className={inputClass} type="number" min={1} value={capacite} onChange={(e) => setCapacite(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Min. nuits</Label>
          <Input className={inputClass} type="number" min={1} value={minNuits} onChange={(e) => setMinNuits(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[#8E8E93]">Équipements (séparés par des virgules)</Label>
        <Input
          className={inputClass}
          value={equipements}
          onChange={(e) => setEquipements(e.target.value)}
          placeholder="Wifi, Climatisation, Piscine"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[#8E8E93]">Services (séparés par des virgules)</Label>
        <Input
          className={inputClass}
          value={services}
          onChange={(e) => setServices(e.target.value)}
          placeholder="Transfert aéroport, Check-in flexible"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Latitude</Label>
          <Input className={inputClass} value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Optionnel" />
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Longitude</Label>
          <Input className={inputClass} value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Optionnel" />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-[#8E8E93]">Photos (URL)</Label>
        <p className="text-xs text-[#636366]">
          {mode === 'edit'
            ? 'À l’enregistrement, la liste ci-dessous remplace toutes les photos existantes.'
            : 'Ajoutez au moins une URL (hébergement externe ou Cloudinary).'}
        </p>
        {photoRows.map((row, i) => (
          <div key={i} className="flex gap-2 flex-col sm:flex-row">
            <Input
              className={inputClass}
              placeholder="URL image"
              value={row.url}
              onChange={(e) => {
                const next = [...photoRows]
                next[i] = { ...next[i], url: e.target.value }
                setPhotoRows(next)
              }}
            />
            <Input
              className={inputClass}
              placeholder="Texte alternatif"
              value={row.alt}
              onChange={(e) => {
                const next = [...photoRows]
                next[i] = { ...next[i], alt: e.target.value }
                setPhotoRows(next)
              }}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="border-[#3A3A3C] text-[#8E8E93]"
          onClick={() => setPhotoRows([...photoRows, { url: '', alt: '' }])}
        >
          + Ajouter une photo
        </Button>
      </div>

      <Button type="submit" disabled={saving} className="bg-[#D4A843] text-[#1C1C1E] hover:bg-[#B8912E]">
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
            Enregistrement…
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
            {mode === 'create' ? 'Créer le logement' : 'Mettre à jour'}
          </>
        )}
      </Button>
    </form>
  )
}
