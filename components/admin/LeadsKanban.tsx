'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

type StatutLead = 'NOUVEAU' | 'CONTACTE' | 'EN_NEGOCIATION' | 'GAGNE' | 'PERDU'

interface Lead {
  id: string
  nom: string
  prenom: string
  telephone: string
  email?: string | null
  budget?: string | null
  statut: StatutLead
  createdAt: Date
  annonce?: { titre: string } | null
}

interface LeadsKanbanProps {
  leads: Lead[]
}

const COLONNES: { statut: StatutLead; label: string; color: string; bg: string }[] = [
  { statut: 'NOUVEAU', label: 'Nouveaux', color: 'text-blue-700', bg: 'bg-blue-50' },
  { statut: 'CONTACTE', label: 'Contactés', color: 'text-yellow-700', bg: 'bg-yellow-50' },
  { statut: 'EN_NEGOCIATION', label: 'Négociation', color: 'text-purple-700', bg: 'bg-purple-50' },
  { statut: 'GAGNE', label: 'Gagnés', color: 'text-green-700', bg: 'bg-green-50' },
  { statut: 'PERDU', label: 'Perdus', color: 'text-red-700', bg: 'bg-red-50' },
]

export function LeadsKanban({ leads: initialLeads }: LeadsKanbanProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [updating, setUpdating] = useState<string | null>(null)

  const moveLeadToStatut = async (leadId: string, newStatut: StatutLead) => {
    setUpdating(leadId)
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatut }),
      })
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, statut: newStatut } : l))
        )
        toast.success('Statut mis à jour.')
      } else {
        toast.error('Erreur lors de la mise à jour.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4">
        {COLONNES.map(({ statut, label, color, bg }) => {
          const colLeads = leads.filter((l) => l.statut === statut)
          return (
            <div key={statut} className="w-64 flex flex-col gap-2">
              <div className={`${bg} rounded-lg px-3 py-2 flex items-center justify-between`}>
                <span className={`text-xs font-semibold ${color}`}>{label}</span>
                <span className={`text-xs font-bold ${color}`}>{colLeads.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-3 ${updating === lead.id ? 'opacity-60' : ''}`}
                  >
                    <p className="font-semibold text-[#EFEFEF] text-sm truncate">
                      {lead.prenom} {lead.nom}
                    </p>
                    <p className="text-xs text-[#8E8E93]">{lead.telephone}</p>
                    {lead.annonce && (
                      <p className="text-xs text-[#D4A843] truncate mt-1">{lead.annonce.titre}</p>
                    )}
                    {lead.budget && (
                      <p className="text-xs text-[#8E8E93] mt-0.5">{lead.budget}</p>
                    )}
                    <p className="text-xs text-[#8E8E93] mt-1">
                      {formatDate(new Date(lead.createdAt).toISOString())}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {COLONNES.filter((c) => c.statut !== statut).map((c) => (
                        <button
                          key={c.statut}
                          type="button"
                          disabled={updating === lead.id}
                          onClick={() => moveLeadToStatut(lead.id, c.statut)}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${c.bg} ${c.color} hover:opacity-80 transition-opacity disabled:cursor-not-allowed`}
                        >
                          → {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <div className="text-center py-6 text-[#8E8E93] text-xs border-2 border-dashed border-[#3A3A3C] rounded-xl">
                    Aucun lead
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
