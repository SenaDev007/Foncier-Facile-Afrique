'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { StatutResa, StatutPayment } from '@prisma/client'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const STATUT_RESA: { value: StatutResa; label: string }[] = [
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'CONFIRMEE', label: 'Confirmée' },
  { value: 'EN_COURS', label: 'En cours (séjour)' },
  { value: 'TERMINEE', label: 'Terminée' },
  { value: 'ANNULEE', label: 'Annulée' },
]

const STATUT_PAY: { value: StatutPayment; label: string }[] = [
  { value: 'NON_PAYE', label: 'Non payé' },
  { value: 'ACOMPTE', label: 'Acompte' },
  { value: 'PAYE', label: 'Payé' },
]

const inputClass = 'bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]'

interface ReservationAdminActionsProps {
  reservationId: string
  initialStatut: StatutResa
  initialNotesAdmin: string | null
  initialPaymentStatut: StatutPayment
  initialPaymentRef: string | null
}

export function ReservationAdminActions({
  reservationId,
  initialStatut,
  initialNotesAdmin,
  initialPaymentStatut,
  initialPaymentRef,
}: ReservationAdminActionsProps) {
  const router = useRouter()
  const [statut, setStatut] = useState<StatutResa>(initialStatut)
  const [notesAdmin, setNotesAdmin] = useState(initialNotesAdmin ?? '')
  const [paymentStatut, setPaymentStatut] = useState<StatutPayment>(initialPaymentStatut)
  const [paymentRef, setPaymentRef] = useState(initialPaymentRef ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setStatut(initialStatut)
    setNotesAdmin(initialNotesAdmin ?? '')
    setPaymentStatut(initialPaymentStatut)
    setPaymentRef(initialPaymentRef ?? '')
  }, [initialStatut, initialNotesAdmin, initialPaymentStatut, initialPaymentRef])

  const patch = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(typeof data?.error === 'string' ? data.error : 'Erreur')
    }
    return data
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await patch({
        statut,
        notesAdmin: notesAdmin.trim() === '' ? null : notesAdmin.trim(),
        paymentStatut,
        paymentRef: paymentRef.trim() === '' ? null : paymentRef.trim(),
      })
      toast.success('Réservation mise à jour.')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const quick = async (next: StatutResa) => {
    const prev = statut
    setStatut(next)
    setSaving(true)
    try {
      await patch({ statut: next })
      toast.success('Statut mis à jour.')
      router.refresh()
    } catch (e) {
      setStatut(prev)
      toast.error(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6">
      <h2 className="font-heading font-semibold text-[#EFEFEF]">Gestion réservation</h2>

      <div className="flex flex-wrap gap-2">
        {statut === 'EN_ATTENTE' && (
          <Button
            type="button"
            disabled={saving}
            className="bg-emerald-700 text-white hover:bg-emerald-600"
            onClick={() => quick('CONFIRMEE')}
          >
            Confirmer
          </Button>
        )}
        {statut === 'CONFIRMEE' && (
          <Button
            type="button"
            disabled={saving}
            variant="secondary"
            className="bg-[#3A3A3C] text-[#EFEFEF]"
            onClick={() => quick('EN_COURS')}
          >
            Check-in (en cours)
          </Button>
        )}
        {statut !== 'ANNULEE' && statut !== 'TERMINEE' && (
          <Button
            type="button"
            disabled={saving}
            variant="outline"
            className="border-red-500/50 text-red-300 hover:bg-red-500/10"
            onClick={() => quick('ANNULEE')}
          >
            Annuler
          </Button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Statut</Label>
          <Select value={statut} onValueChange={(v) => setStatut(v as StatutResa)}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
              {STATUT_RESA.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Paiement</Label>
          <Select value={paymentStatut} onValueChange={(v) => setPaymentStatut(v as StatutPayment)}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
              {STATUT_PAY.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[#8E8E93]">Référence paiement (optionnel)</Label>
        <Input className={inputClass} value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="Mobile money, virement…" />
      </div>

      <div className="space-y-2">
        <Label className="text-[#8E8E93]">Notes internes</Label>
        <Textarea
          className={inputClass}
          rows={5}
          value={notesAdmin}
          onChange={(e) => setNotesAdmin(e.target.value)}
          placeholder="Visible uniquement dans le back-office"
        />
      </div>

      <Button
        type="button"
        disabled={saving}
        onClick={handleSaveAll}
        className="bg-[#D4A843] text-[#1C1C1E] hover:bg-[#B8912E]"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
            Enregistrement…
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
            Enregistrer les modifications
          </>
        )}
      </Button>
    </div>
  )
}
