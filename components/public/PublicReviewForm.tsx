'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Star, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  /** Appelé après envoi réussi (ex. fermer le modal). */
  onSuccess?: () => void
}

export default function PublicReviewForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [nom, setNom] = useState('')
  const [texte, setTexte] = useState('')
  const [note, setNote] = useState(5)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/public/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, texte, note }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast.success('Merci ! Votre avis a été envoyé. Il sera publié après vérification par notre équipe.')
        setNom('')
        setTexte('')
        setNote(5)
        onSuccess?.()
      } else {
        toast.error(typeof data.error === 'string' ? data.error : 'Envoi impossible')
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-1">
        <div>
          <Label htmlFor="avis-nom" className="text-[#EFEFEF]">
            Votre nom (affiché tel quel)
          </Label>
          <Input
            id="avis-nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            maxLength={100}
            className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
            placeholder="Ex. Marie D. ou K. Agossou"
            autoComplete="name"
          />
        </div>
        <div>
          <span className="text-sm text-[#EFEFEF] block mb-2">Votre note</span>
          <div className="flex items-center gap-1" role="group" aria-label="Note sur 5">
            {Array.from({ length: 5 }).map((_, i) => {
              const v = i + 1
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setNote(v)}
                  className="p-1 rounded-lg hover:bg-[#3A3A3C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A843]"
                  aria-label={`${v} étoile${v > 1 ? 's' : ''}`}
                  aria-pressed={note === v}
                >
                  <Star
                    className={`h-8 w-8 ${
                      v <= note ? 'text-[#D4A843] fill-[#D4A843]' : 'text-[#3A3A3C]'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <Label htmlFor="avis-texte" className="text-[#EFEFEF]">
            Votre avis
          </Label>
          <Textarea
            id="avis-texte"
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            required
            minLength={30}
            maxLength={2000}
            rows={5}
            className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
            placeholder="Décrivez votre accompagnement, la clarté des démarches, ce qui vous a rassuré…"
          />
          <p className="text-xs text-[#636366] mt-1">{texte.length} / 2000 — minimum 30 caractères</p>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E] font-semibold"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          Envoyer mon avis
        </Button>
    </form>
  )
}
