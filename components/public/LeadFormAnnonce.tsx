'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface LeadFormAnnonceProps {
  annonceId: string
  annonceReference: string
  annonceTitre: string
}

export default function LeadFormAnnonce({
  annonceId,
  annonceReference,
  annonceTitre,
}: LeadFormAnnonceProps) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    message: `Je suis intéressé(e) par l'annonce "${annonceTitre}" (Réf. ${annonceReference}). Merci de me recontacter.`,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          telephone: form.telephone,
          email: form.email || undefined,
          annonceId,
          canal: 'FORMULAIRE',
          notes: form.message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        setForm((prev) => ({ ...prev, nom: '', prenom: '', telephone: '', email: '', message: '' }))
        toast.success('Demande envoyée. Un conseiller vous contactera sous 24h.')
      } else {
        toast.error(data.error ?? 'Erreur lors de l\'envoi')
      }
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-xl p-4 text-center">
        <p className="text-ffa-fg font-medium">Demande envoyée avec succès.</p>
        <p className="text-ffa-fg-muted text-sm mt-1">Nous vous recontacterons rapidement.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="lf-prenom" className="text-xs">Prénom *</Label>
          <Input
            id="lf-prenom"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            required
            className="mt-0.5 h-9 bg-ffa-ink border-ffa-divider text-ffa-fg text-sm"
          />
        </div>
        <div>
          <Label htmlFor="lf-nom" className="text-xs">Nom *</Label>
          <Input
            id="lf-nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            className="mt-0.5 h-9 bg-ffa-ink border-ffa-divider text-ffa-fg text-sm"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="lf-tel" className="text-xs">Téléphone *</Label>
        <Input
          id="lf-tel"
          name="telephone"
          type="tel"
          value={form.telephone}
          onChange={handleChange}
          required
          className="mt-0.5 h-9 bg-ffa-ink border-ffa-divider text-ffa-fg text-sm"
        />
      </div>
      <div>
        <Label htmlFor="lf-email" className="text-xs">Email</Label>
        <Input
          id="lf-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="mt-0.5 h-9 bg-ffa-ink border-ffa-divider text-ffa-fg text-sm"
        />
      </div>
      <div>
        <Label htmlFor="lf-message" className="text-xs">Message *</Label>
        <Textarea
          id="lf-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={3}
          className="mt-0.5 bg-ffa-ink border-ffa-divider text-ffa-fg text-sm"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-9 bg-ffa-gold hover:bg-ffa-gold-light text-ffa-navy text-sm font-semibold"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <>
            <Send className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
            Envoyer ma demande
          </>
        )}
      </Button>
    </form>
  )
}
