'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
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

const TYPES = [
  { value: 'TERRAIN', label: 'Terrain' },
  { value: 'APPARTEMENT', label: 'Appartement' },
  { value: 'MAISON', label: 'Maison' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'BUREAU', label: 'Bureau' },
  { value: 'COMMERCE', label: 'Commerce' },
] as const

const OBJECTIFS = [
  { value: 'VENDRE', label: 'Vendre' },
  { value: 'LOUER_LONG', label: 'Louer long terme' },
  { value: 'LOUER_COURT', label: 'Louer court terme / saisonnier' },
] as const

const inputClass =
  'bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366]'

export function ConfierBienForm() {
  const [loading, setLoading] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [typeBien, setTypeBien] = useState<string>(TYPES[0].value)
  const [objectif, setObjectif] = useState<string>(OBJECTIFS[0].value)
  const [ville, setVille] = useState('')
  const [quartier, setQuartier] = useState('')
  const [surface, setSurface] = useState('')
  const [prixSouhaite, setPrixSouhaite] = useState('')
  const [documentDisponible, setDocumentDisponible] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/confier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom,
          nom,
          telephone,
          email: email.trim() || undefined,
          typeBien,
          objectif,
          ville,
          quartier: quartier.trim() || undefined,
          surface: surface.trim() || undefined,
          prixSouhaite: prixSouhaite.trim() || undefined,
          documentDisponible: documentDisponible.trim() || undefined,
          description,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message ?? 'Demande envoyée.')
        setPrenom('')
        setNom('')
        setTelephone('')
        setEmail('')
        setVille('')
        setQuartier('')
        setSurface('')
        setPrixSouhaite('')
        setDocumentDisponible('')
        setDescription('')
      } else {
        toast.error(data.error ?? 'Erreur')
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cf-prenom" className="text-[#8E8E93]">
            Prénom
          </Label>
          <Input
            id="cf-prenom"
            required
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cf-nom" className="text-[#8E8E93]">
            Nom
          </Label>
          <Input
            id="cf-nom"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cf-tel" className="text-[#8E8E93]">
            Téléphone / WhatsApp
          </Label>
          <Input
            id="cf-tel"
            required
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cf-email" className="text-[#8E8E93]">
            E-mail (optionnel)
          </Label>
          <Input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Type de bien</Label>
          <Select value={typeBien} onValueChange={setTypeBien}>
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
          <Label className="text-[#8E8E93]">Objectif</Label>
          <Select value={objectif} onValueChange={setObjectif}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
              {OBJECTIFS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cf-ville" className="text-[#8E8E93]">
            Ville
          </Label>
          <Input
            id="cf-ville"
            required
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cf-quartier" className="text-[#8E8E93]">
            Quartier
          </Label>
          <Input
            id="cf-quartier"
            value={quartier}
            onChange={(e) => setQuartier(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cf-surface" className="text-[#8E8E93]">
            Surface (m²)
          </Label>
          <Input
            id="cf-surface"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cf-prix" className="text-[#8E8E93]">
            Prix souhaité (FCFA)
          </Label>
          <Input
            id="cf-prix"
            value={prixSouhaite}
            onChange={(e) => setPrixSouhaite(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-docs" className="text-[#8E8E93]">
          Documents disponibles (TF, ACD, etc.)
        </Label>
        <Input
          id="cf-docs"
          value={documentDisponible}
          onChange={(e) => setDocumentDisponible(e.target.value)}
          className={inputClass}
          placeholder="Ex. Titre foncier, attestation…"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-desc" className="text-[#8E8E93]">
          Description du bien
        </Label>
        <Textarea
          id="cf-desc"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Situation, accès, contraintes…"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-[#D4A843] text-[#1C1C1E] hover:bg-[#B8912E]"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
            Envoi…
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" aria-hidden="true" />
            Envoyer ma demande
          </>
        )}
      </Button>
    </form>
  )
}
