'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { StatutLead } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  LEAD_STATUTS,
  LEAD_STATUT_LABELS,
  INTERACTION_TYPES,
  INTERACTION_TYPE_LABELS,
  type InteractionType,
} from '@/lib/lead-constants'
import { formatDate } from '@/lib/utils'

function isoToDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return t.toISOString().slice(0, 16)
}

interface AgentOption {
  id: string
  name: string | null
}

export interface LeadInteractionItem {
  id: string
  type: string
  contenu: string
  createdAt: string
}

interface LeadDetailCRMProps {
  leadId: string
  statut: StatutLead
  notes: string | null
  prochainRappelIso: string | null
  canAssignAgent: boolean
  agents: AgentOption[]
  currentAgentId: string | null
  interactions: LeadInteractionItem[]
}

function interactionLabel(type: string): string {
  return type in INTERACTION_TYPE_LABELS
    ? INTERACTION_TYPE_LABELS[type as InteractionType]
    : type
}

export function LeadDetailCRM({
  leadId,
  statut: initialStatut,
  notes: initialNotes,
  prochainRappelIso,
  canAssignAgent,
  agents,
  currentAgentId,
  interactions,
}: LeadDetailCRMProps) {
  const router = useRouter()
  const [statut, setStatut] = useState<StatutLead>(initialStatut)
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [rappel, setRappel] = useState(isoToDatetimeLocal(prochainRappelIso))
  const [agentId, setAgentId] = useState<string>(currentAgentId ?? '')
  const [savingStatut, setSavingStatut] = useState(false)
  const [savingInfos, setSavingInfos] = useState(false)
  const [interactionType, setInteractionType] = useState<string>(INTERACTION_TYPES[0])
  const [interactionContenu, setInteractionContenu] = useState('')
  const [savingInteraction, setSavingInteraction] = useState(false)

  useEffect(() => {
    setStatut(initialStatut)
    setNotes(initialNotes ?? '')
    setRappel(isoToDatetimeLocal(prochainRappelIso))
    setAgentId(currentAgentId ?? '')
  }, [initialStatut, initialNotes, prochainRappelIso, currentAgentId])

  const patchLead = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(typeof data?.error === 'string' ? data.error : 'Erreur serveur')
    }
    return data
  }

  const handleStatutChange = async (next: StatutLead) => {
    const prev = statut
    setStatut(next)
    setSavingStatut(true)
    try {
      await patchLead({ statut: next })
      toast.success('Statut mis à jour.')
      router.refresh()
    } catch (e) {
      setStatut(prev)
      toast.error(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSavingStatut(false)
    }
  }

  const handleSaveInfos = async () => {
    setSavingInfos(true)
    try {
      await patchLead({
        notes: notes.trim() === '' ? null : notes,
        prochainRappel: rappel.trim() === '' ? null : rappel,
        ...(canAssignAgent
          ? { agentId: agentId === '' ? null : agentId }
          : {}),
      })
      toast.success('Informations enregistrées.')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSavingInfos(false)
    }
  }

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!interactionContenu.trim()) {
      toast.error('Saisissez un contenu pour l’interaction.')
      return
    }
    setSavingInteraction(true)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: interactionType, contenu: interactionContenu.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data?.error === 'string' ? data.error : 'Erreur serveur')
      }
      setInteractionContenu('')
      toast.success('Interaction ajoutée.')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSavingInteraction(false)
    }
  }

  const selectClass =
    'w-full rounded-lg border border-[#3A3A3C] bg-[#1C1C1E] text-[#EFEFEF] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/40'

  return (
    <div className="space-y-8">
      <section className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-3">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Pipeline</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Label htmlFor="lead-statut" className="text-[#8E8E93] text-sm sr-only">
            Statut
          </Label>
          <select
            id="lead-statut"
            className={selectClass + ' max-w-xs'}
            value={statut}
            disabled={savingStatut}
            onChange={(e) => handleStatutChange(e.target.value as StatutLead)}
          >
            {LEAD_STATUTS.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUT_LABELS[s]}
              </option>
            ))}
          </select>
          {savingStatut && <Loader2 className="h-4 w-4 animate-spin text-[#D4A843]" aria-hidden="true" />}
        </div>
      </section>

      <section className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Notes &amp; suivi</h2>
        <div className="space-y-2">
          <Label htmlFor="lead-notes" className="text-[#8E8E93] text-sm">
            Notes internes
          </Label>
          <Textarea
            id="lead-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] resize-y"
            placeholder="Contexte, objections, prochaine action…"
          />
        </div>
        <div className="space-y-2 max-w-md">
          <Label htmlFor="lead-rappel" className="text-[#8E8E93] text-sm">
            Prochain rappel
          </Label>
          <input
            id="lead-rappel"
            type="datetime-local"
            className={selectClass}
            value={rappel}
            onChange={(e) => setRappel(e.target.value)}
          />
        </div>
        {canAssignAgent && (
          <div className="space-y-2 max-w-md">
            <Label htmlFor="lead-agent" className="text-[#8E8E93] text-sm">
              Agent assigné
            </Label>
            <select
              id="lead-agent"
              className={selectClass}
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            >
              <option value="">— Non assigné —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name ?? a.id}
                </option>
              ))}
            </select>
          </div>
        )}
        <Button
          type="button"
          onClick={handleSaveInfos}
          disabled={savingInfos}
          className="bg-[#D4A843] text-[#1C1C1E] hover:bg-[#B8912E]"
        >
          {savingInfos ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
              Enregistrement…
            </>
          ) : (
            'Enregistrer les infos'
          )}
        </Button>
      </section>

      <section className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold text-[#EFEFEF] flex items-center gap-2">
          Interactions
          <span className="text-xs font-normal text-[#8E8E93]">({interactions.length})</span>
        </h2>
        {interactions.length > 0 && (
          <div className="space-y-3 pb-2 border-b border-[#3A3A3C]">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="border-l-2 border-[#D4A843]/50 pl-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#D4A843]">
                    {interactionLabel(interaction.type)}
                  </span>
                  <span className="text-xs text-[#8E8E93] shrink-0">
                    {formatDate(interaction.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-[#EFEFEF] mt-1 whitespace-pre-wrap">{interaction.contenu}</p>
              </div>
            ))}
          </div>
        )}
        <h3 className="text-sm font-medium text-[#8E8E93]">Nouvelle interaction</h3>
        <form onSubmit={handleAddInteraction} className="space-y-4">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="interaction-type" className="text-[#8E8E93] text-sm">
              Type
            </Label>
            <select
              id="interaction-type"
              className={selectClass}
              value={interactionType}
              onChange={(e) => setInteractionType(e.target.value)}
            >
              {INTERACTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {INTERACTION_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interaction-contenu" className="text-[#8E8E93] text-sm">
              Détail
            </Label>
            <Textarea
              id="interaction-contenu"
              value={interactionContenu}
              onChange={(e) => setInteractionContenu(e.target.value)}
              rows={4}
              className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
              placeholder="Compte rendu d’appel, échange WhatsApp, compte rendu de visite…"
            />
          </div>
          <Button
            type="submit"
            disabled={savingInteraction}
            variant="outline"
            className="border-[#D4A843] text-[#D4A843] hover:bg-[#D4A843]/10"
          >
            {savingInteraction ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                Envoi…
              </>
            ) : (
              'Ajouter l’interaction'
            )}
          </Button>
        </form>
      </section>
    </div>
  )
}
