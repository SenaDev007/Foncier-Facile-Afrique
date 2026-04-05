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

const SITUATIONS = [
  { value: 'ph_vers_tf', label: 'Je possède une parcelle avec PH, je veux le TF' },
  { value: 'premier_tf', label: 'Première immatriculation / premier TF' },
  { value: 'mutation', label: 'Mutation / vente / succession' },
  { value: 'litige', label: 'Litige ou contestation' },
  { value: 'morcellement', label: 'Morcellement / division' },
  { value: 'audit', label: 'Audit / vérification de dossier' },
  { value: 'autre', label: 'Autre situation' },
] as const

const inputClass =
  'bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366]'

export function DiagnosticFoncierForm() {
  const [loading, setLoading] = useState(false)
  const [situation, setSituation] = useState<string>(SITUATIONS[0].value)
  const [ville, setVille] = useState('')
  const [description, setDescription] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/regularisation/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation,
          ville,
          description,
          nom,
          prenom,
          telephone,
          email,
        }),
      })
      const data = await res.json()
      if (data.success) {
        const msg =
          typeof data.dossierReference === 'string'
            ? `${data.message ?? 'Demande enregistrée.'} Réf. : ${data.dossierReference}.`
            : (data.message ?? 'Demande enregistrée.')
        toast.success(msg)
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
      <div className="space-y-2">
        <Label className="text-[#8E8E93]">Votre situation</Label>
        <Select value={situation} onValueChange={setSituation}>
          <SelectTrigger className={inputClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C] max-h-72">
            {SITUATIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="df-ville" className="text-[#8E8E93]">
          Ville / localisation du bien
        </Label>
        <Input
          id="df-ville"
          required
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="df-desc" className="text-[#8E8E93]">
          Décrivez votre besoin
        </Label>
        <Textarea
          id="df-desc"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="df-prenom" className="text-[#8E8E93]">
            Prénom
          </Label>
          <Input
            id="df-prenom"
            required
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="df-nom" className="text-[#8E8E93]">
            Nom
          </Label>
          <Input
            id="df-nom"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="df-tel" className="text-[#8E8E93]">
            WhatsApp / téléphone
          </Label>
          <Input
            id="df-tel"
            required
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="df-email" className="text-[#8E8E93]">
            E-mail
          </Label>
          <Input
            id="df-email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-ffa-brown to-[#D4A843] text-[#EFEFEF] hover:opacity-95"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
            Envoi…
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" aria-hidden="true" />
            Demander un diagnostic gratuit
          </>
        )}
      </Button>
    </form>
  )
}
