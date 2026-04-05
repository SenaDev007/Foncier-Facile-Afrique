'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

const inputClass = 'bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]'

interface SejourBookingFormProps {
  logementId: string
  logementNom: string
  prixNuit: number
  minNuits: number
  capacite: number
  fraisService?: number
}

export function SejourBookingForm({
  logementId,
  logementNom,
  prixNuit,
  minNuits,
  capacite,
  fraisService = 10_000,
}: SejourBookingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [dispo, setDispo] = useState<boolean | null>(null)

  const [dateArrivee, setDateArrivee] = useState('')
  const [dateDepart, setDateDepart] = useState('')
  const [nbVoyageurs, setNbVoyageurs] = useState('2')
  const [nomVoyageur, setNomVoyageur] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [pays, setPays] = useState('Bénin')
  const [demandeSpeciale, setDemandeSpeciale] = useState('')
  const [transfertAero, setTransfertAero] = useState(false)

  const nbNuits = useMemo(() => {
    if (!dateArrivee || !dateDepart) return 0
    const a = new Date(dateArrivee)
    const d = new Date(dateDepart)
    if (Number.isNaN(a.getTime()) || Number.isNaN(d.getTime()) || d <= a) return 0
    return Math.max(1, Math.ceil((d.getTime() - a.getTime()) / 86_400_000))
  }, [dateArrivee, dateDepart])

  const total = useMemo(() => {
    if (nbNuits < 1) return 0
    return prixNuit * nbNuits + fraisService
  }, [nbNuits, prixNuit, fraisService])

  const checkDispo = useCallback(async () => {
    if (!dateArrivee || !dateDepart) {
      setDispo(null)
      return
    }
    const a = new Date(dateArrivee)
    const d = new Date(dateDepart)
    if (Number.isNaN(a.getTime()) || Number.isNaN(d.getTime()) || d <= a) {
      setDispo(null)
      return
    }
    setChecking(true)
    try {
      const qs = new URLSearchParams({ dateArrivee, dateDepart })
      const res = await fetch(`/api/logements/${logementId}/disponibilite?${qs}`)
      const json = await res.json()
      if (!res.ok) {
        setDispo(null)
        return
      }
      setDispo(!!json.data?.disponible)
    } catch {
      setDispo(null)
    } finally {
      setChecking(false)
    }
  }, [logementId, dateArrivee, dateDepart])

  useEffect(() => {
    const t = setTimeout(() => {
      void checkDispo()
    }, 450)
    return () => clearTimeout(t)
  }, [checkDispo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (nbNuits < minNuits) {
      toast.error(`Durée minimum : ${minNuits} nuit(s).`)
      return
    }
    if (dispo === false) {
      toast.error('Ces dates ne sont pas disponibles.')
      return
    }
    const nv = parseInt(nbVoyageurs, 10)
    if (!Number.isFinite(nv) || nv < 1 || nv > capacite) {
      toast.error(`Nombre de voyageurs entre 1 et ${capacite}.`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logementId,
          nomVoyageur: nomVoyageur.trim(),
          email: email.trim(),
          telephone: telephone.trim(),
          pays: pays.trim(),
          nbVoyageurs: nv,
          dateArrivee: new Date(dateArrivee).toISOString(),
          dateDepart: new Date(dateDepart).toISOString(),
          demandeSpeciale: demandeSpeciale.trim() || undefined,
          transfertAero,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof json.error === 'string' ? json.error : 'Erreur')
      }
      toast.success(json.message ?? 'Réservation enregistrée.')
      const pay = typeof json.paiementUrl === 'string' ? json.paiementUrl : null
      if (pay) {
        router.push(pay)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-medium text-[#D4A843] flex items-center gap-2">
        <Calendar className="h-4 w-4" aria-hidden="true" />
        Réserver « {logementNom} »
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-[#8E8E93]">Arrivée</Label>
          <Input
            type="date"
            required
            className={inputClass}
            value={dateArrivee}
            onChange={(e) => setDateArrivee(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-[#8E8E93]">Départ</Label>
          <Input
            type="date"
            required
            className={inputClass}
            value={dateDepart}
            onChange={(e) => setDateDepart(e.target.value)}
          />
        </div>
      </div>

      {checking && <p className="text-xs text-[#8E8E93]">Vérification des disponibilités…</p>}
      {!checking && dispo === true && nbNuits > 0 && (
        <p className="text-xs text-[#D4A843]">Dates disponibles.</p>
      )}
      {!checking && dispo === false && (
        <p className="text-xs text-amber-400">Ces dates se chevauchent avec une réservation. Modifiez le séjour.</p>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs text-[#8E8E93]">Voyageurs (max {capacite})</Label>
        <Input
          type="number"
          min={1}
          max={capacite}
          required
          className={inputClass}
          value={nbVoyageurs}
          onChange={(e) => setNbVoyageurs(e.target.value)}
        />
      </div>

      {nbNuits > 0 && (
        <div className="rounded-xl bg-[#1C1C1E] border border-[#3A3A3C] p-3 text-sm space-y-1">
          <p className="text-[#8E8E93]">
            {nbNuits} nuit{nbNuits > 1 ? 's' : ''} × {new Intl.NumberFormat('fr-FR').format(prixNuit)} FCFA
          </p>
          <p className="text-[#8E8E93]">Frais de service : {new Intl.NumberFormat('fr-FR').format(fraisService)} FCFA</p>
          <p className="text-[#D4A843] font-heading font-bold text-lg">
            Total estimé : {new Intl.NumberFormat('fr-FR').format(total)} FCFA
          </p>
          {nbNuits < minNuits && (
            <p className="text-xs text-amber-400">Minimum {minNuits} nuit(s) pour ce logement.</p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs text-[#8E8E93]">Nom complet</Label>
        <Input className={inputClass} required value={nomVoyageur} onChange={(e) => setNomVoyageur(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-[#8E8E93]">E-mail</Label>
        <Input className={inputClass} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-[#8E8E93]">Téléphone / WhatsApp</Label>
        <Input className={inputClass} required value={telephone} onChange={(e) => setTelephone(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-[#8E8E93]">Pays</Label>
        <Input className={inputClass} required value={pays} onChange={(e) => setPays(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-[#8E8E93]">Demande spéciale (optionnel)</Label>
        <Textarea className={inputClass} rows={2} value={demandeSpeciale} onChange={(e) => setDemandeSpeciale(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="transfert" checked={transfertAero} onCheckedChange={(c) => setTransfertAero(c === true)} />
        <Label htmlFor="transfert" className="text-sm text-[#8E8E93] cursor-pointer">
          Transfert aéroport
        </Label>
      </div>

      <Button type="submit" disabled={loading || dispo === false} className="w-full bg-[#D4A843] text-[#1C1C1E] hover:bg-[#E8B84B] font-semibold">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
            Envoi…
          </>
        ) : (
          'Envoyer la demande et accéder au paiement'
        )}
      </Button>
      <p className="text-[10px] text-[#636366] leading-relaxed">
        Après envoi, vous êtes redirigé vers la page sécurisée de paiement (FedaPay). Vous pouvez aussi payer plus tard via le lien reçu par e-mail.
      </p>
    </form>
  )
}
