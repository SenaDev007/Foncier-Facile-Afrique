'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { StatutDossier, TypeInteractionDossier } from '@prisma/client'
import { Loader2, Save, MessageSquarePlus } from 'lucide-react'
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
import { formatDate } from '@/lib/utils'

const STATUTS: { value: StatutDossier; label: string }[] = [
  { value: 'DIAGNOSTIC', label: 'Diagnostic' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'ATTENTE_ADMIN', label: 'Attente administration' },
  { value: 'TERMINE', label: 'Terminé' },
  { value: 'SUSPENDU', label: 'Suspendu' },
]

const INTERACTION_TYPES: { value: TypeInteractionDossier; label: string }[] = [
  { value: 'NOTE', label: 'Note' },
  { value: 'APPEL', label: 'Appel' },
  { value: 'EMAIL', label: 'E-mail' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'DOCUMENT', label: 'Document' },
  { value: 'ETAPE', label: 'Étape' },
]

const inputClass = 'bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]'

interface AgentOption {
  id: string
  name: string | null
}

export interface DossierInteractionItem {
  id: string
  type: TypeInteractionDossier
  contenu: string
  createdAt: string
  authorName: string | null
}

interface DossierDetailAdminProps {
  dossierId: string
  initialStatut: StatutDossier
  initialEtapeActuelle: number
  initialEtapeMax: number
  initialNotesInternes: string | null
  initialDelaiEstime: string | null
  initialMontantDevis: number | null
  canAssign: boolean
  agents: AgentOption[]
  currentUserId: string | null
  interactions: DossierInteractionItem[]
}

export function DossierDetailAdmin({
  dossierId,
  initialStatut,
  initialEtapeActuelle,
  initialEtapeMax,
  initialNotesInternes,
  initialDelaiEstime,
  initialMontantDevis,
  canAssign,
  agents,
  currentUserId,
  interactions,
}: DossierDetailAdminProps) {
  const router = useRouter()
  const [statut, setStatut] = useState<StatutDossier>(initialStatut)
  const [etapeActuelle, setEtapeActuelle] = useState(String(initialEtapeActuelle))
  const [etapeMax, setEtapeMax] = useState(String(initialEtapeMax))
  const [notesInternes, setNotesInternes] = useState(initialNotesInternes ?? '')
  const [delaiEstime, setDelaiEstime] = useState(initialDelaiEstime ?? '')
  const [montantDevis, setMontantDevis] = useState(
    initialMontantDevis != null ? String(initialMontantDevis) : ''
  )
  const [userId, setUserId] = useState<string>(currentUserId ?? '')
  const [saving, setSaving] = useState(false)
  const [intType, setIntType] = useState<TypeInteractionDossier>('NOTE')
  const [intContenu, setIntContenu] = useState('')
  const [savingInt, setSavingInt] = useState(false)

  useEffect(() => {
    setStatut(initialStatut)
    setEtapeActuelle(String(initialEtapeActuelle))
    setEtapeMax(String(initialEtapeMax))
    setNotesInternes(initialNotesInternes ?? '')
    setDelaiEstime(initialDelaiEstime ?? '')
    setMontantDevis(initialMontantDevis != null ? String(initialMontantDevis) : '')
    setUserId(currentUserId ?? '')
  }, [
    initialStatut,
    initialEtapeActuelle,
    initialEtapeMax,
    initialNotesInternes,
    initialDelaiEstime,
    initialMontantDevis,
    currentUserId,
  ])

  const patchDossier = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/dossiers/${dossierId}`, {
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

  const handleSaveSuivi = async () => {
    setSaving(true)
    try {
      const ea = parseInt(etapeActuelle, 10)
      const em = parseInt(etapeMax, 10)
      const montantRaw =
        montantDevis.trim() === '' ? null : parseFloat(montantDevis.replace(/\s/g, ''))
      const montantParsed =
        montantRaw === null || Number.isFinite(montantRaw) ? montantRaw : null

      const body: Record<string, unknown> = {
        statut,
        etapeActuelle: Number.isFinite(ea) && ea >= 1 ? ea : undefined,
        etapeMax: Number.isFinite(em) && em >= 1 ? em : undefined,
        notesInternes: notesInternes.trim() === '' ? null : notesInternes.trim(),
        delaiEstime: delaiEstime.trim() === '' ? null : delaiEstime.trim(),
        montantDevis: montantParsed,
      }
      if (canAssign) {
        body.userId = userId.trim() === '' ? null : userId
      }
      await patchDossier(body)
      toast.success('Dossier mis à jour.')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleAddInteraction = async () => {
    const c = intContenu.trim()
    if (!c) {
      toast.error('Saisissez un contenu.')
      return
    }
    setSavingInt(true)
    try {
      const res = await fetch(`/api/admin/dossiers/${dossierId}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: intType, contenu: c }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data?.error === 'string' ? data.error : 'Erreur')
      }
      toast.success('Interaction enregistrée.')
      setIntContenu('')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSavingInt(false)
    }
  }

  const interactionLabel = (t: TypeInteractionDossier) =>
    INTERACTION_TYPES.find((x) => x.value === t)?.label ?? t

  return (
    <div className="space-y-8">
      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Suivi du dossier</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Statut</Label>
            <Select value={statut} onValueChange={(v) => setStatut(v as StatutDossier)}>
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
          {canAssign && (
            <div className="space-y-2">
              <Label className="text-[#8E8E93]">Agent assigné</Label>
              <Select value={userId || '__none'} onValueChange={(v) => setUserId(v === '__none' ? '' : v)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Non assigné" />
                </SelectTrigger>
                <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
                  <SelectItem value="__none">Non assigné</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name ?? a.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Étape actuelle</Label>
            <Input className={inputClass} type="number" min={1} value={etapeActuelle} onChange={(e) => setEtapeActuelle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#8E8E93]">Nombre d&apos;étapes (max)</Label>
            <Input className={inputClass} type="number" min={1} value={etapeMax} onChange={(e) => setEtapeMax(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Délai estimé</Label>
          <Input className={inputClass} value={delaiEstime} onChange={(e) => setDelaiEstime(e.target.value)} placeholder="ex. 6 semaines" />
        </div>

        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Montant devis (FCFA)</Label>
          <Input className={inputClass} value={montantDevis} onChange={(e) => setMontantDevis(e.target.value)} placeholder="Optionnel" />
        </div>

        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Notes internes</Label>
          <Textarea
            className={inputClass}
            rows={5}
            value={notesInternes}
            onChange={(e) => setNotesInternes(e.target.value)}
          />
        </div>

        <Button
          type="button"
          disabled={saving}
          onClick={handleSaveSuivi}
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
              Enregistrer le suivi
            </>
          )}
        </Button>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Historique & interactions</h2>

        <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {interactions.length === 0 && (
            <li className="text-sm text-[#8E8E93]">Aucune interaction pour l&apos;instant.</li>
          )}
          {interactions.map((i) => (
            <li key={i.id} className="text-sm border border-[#3A3A3C] rounded-lg p-3 bg-[#1C1C1E]/60">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8E8E93] mb-1">
                <span className="text-[#D4A843] font-medium">{interactionLabel(i.type)}</span>
                <span>·</span>
                <span>{formatDate(i.createdAt)}</span>
                {i.authorName && (
                  <>
                    <span>·</span>
                    <span>{i.authorName}</span>
                  </>
                )}
              </div>
              <p className="text-[#EFEFEF] whitespace-pre-wrap">{i.contenu}</p>
            </li>
          ))}
        </ul>

        <div className="space-y-3 pt-2 border-t border-[#3A3A3C]">
          <Label className="text-[#8E8E93]">Nouvelle interaction</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={intType} onValueChange={(v) => setIntType(v as TypeInteractionDossier)}>
              <SelectTrigger className={`${inputClass} sm:w-44`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
                {INTERACTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            className={inputClass}
            rows={4}
            value={intContenu}
            onChange={(e) => setIntContenu(e.target.value)}
            placeholder="Compte-rendu d&apos;appel, lien document, mise à jour d&apos;étape…"
          />
          <Button
            type="button"
            disabled={savingInt}
            variant="outline"
            className="border-[#D4A843]/50 text-[#D4A843] hover:bg-[#D4A843]/10"
            onClick={handleAddInteraction}
          >
            {savingInt ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <>
                <MessageSquarePlus className="h-4 w-4 mr-2" aria-hidden="true" />
                Ajouter
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
