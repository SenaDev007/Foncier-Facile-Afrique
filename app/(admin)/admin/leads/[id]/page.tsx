import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Phone, Mail, ExternalLink } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { LeadDetailCRM } from '@/components/admin/LeadDetailCRM'
import { LEAD_STATUT_LABELS } from '@/lib/lead-constants'

export const metadata: Metadata = { title: 'Détail lead — Admin FFA' }

interface PageProps {
  params: { id: string }
}

const statutColors: Record<string, string> = {
  NOUVEAU: 'bg-blue-500/20 text-blue-300',
  CONTACTE: 'bg-amber-500/20 text-amber-300',
  EN_NEGOCIATION: 'bg-purple-500/20 text-purple-300',
  GAGNE: 'bg-green-500/20 text-green-300',
  PERDU: 'bg-red-500/20 text-red-300',
}

export default async function LeadDetailPage({ params }: PageProps) {
  const [session, lead, agents] = await Promise.all([
    auth(),
    prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        annonce: { select: { id: true, titre: true, reference: true, slug: true } },
        agent: { select: { id: true, name: true } },
        interactions: { orderBy: { createdAt: 'desc' } },
      },
    }),
    prisma.user.findMany({
      where: { role: { in: ['AGENT', 'ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  if (!lead) notFound()

  const canAssignAgent =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  const interactions = lead.interactions.map((i) => ({
    id: i.id,
    type: i.type,
    contenu: i.contenu,
    createdAt: i.createdAt.toISOString(),
  }))

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux leads
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">
            {lead.prenom} {lead.nom}
          </h1>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutColors[lead.statut] ?? 'bg-[#3A3A3C] text-[#8E8E93]'}`}
          >
            {LEAD_STATUT_LABELS[lead.statut] ?? lead.statut.replace('_', ' ')}
          </span>
        </div>
        <p className="text-[#8E8E93] text-sm mt-1">
          Lead créé le {formatDate(lead.createdAt.toISOString())}
        </p>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Coordonnées</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#8E8E93]">
            <Phone className="h-4 w-4 text-[#D4A843] flex-shrink-0" aria-hidden="true" />
            <a href={`tel:${lead.telephone}`} className="text-[#EFEFEF] hover:text-[#D4A843] transition-colors">
              {lead.telephone}
            </a>
          </div>
          {lead.email && (
            <div className="flex items-center gap-2 text-sm text-[#8E8E93]">
              <Mail className="h-4 w-4 text-[#D4A843] flex-shrink-0" aria-hidden="true" />
              <a href={`mailto:${lead.email}`} className="text-[#EFEFEF] hover:text-[#D4A843] transition-colors">
                {lead.email}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-3">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Informations</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[#8E8E93]">Canal</dt>
            <dd className="font-medium text-[#EFEFEF]">{lead.canal}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Budget</dt>
            <dd className="font-medium text-[#EFEFEF]">{lead.budget ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Agent</dt>
            <dd className="font-medium text-[#EFEFEF]">{lead.agent?.name ?? '—'}</dd>
          </div>
          {lead.annonce && (
            <div>
              <dt className="text-[#8E8E93]">Annonce</dt>
              <dd className="font-medium text-[#EFEFEF] flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <Link href={`/admin/annonces/${lead.annonce.id}/edit`} className="text-[#D4A843] hover:underline">
                  {lead.annonce.reference}
                </Link>
                {lead.annonce.slug && (
                  <a
                    href={`/annonces/${lead.annonce.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#8E8E93] hover:text-[#D4A843]"
                  >
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    Voir sur le site
                  </a>
                )}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <LeadDetailCRM
        leadId={lead.id}
        statut={lead.statut}
        notes={lead.notes}
        prochainRappelIso={lead.prochainRappel?.toISOString() ?? null}
        canAssignAgent={canAssignAgent}
        agents={agents}
        currentAgentId={lead.agentId}
        interactions={interactions}
      />
    </div>
  )
}
