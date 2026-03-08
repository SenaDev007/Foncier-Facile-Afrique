import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Phone, Mail, Calendar, MessageSquare } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Détail lead — Admin FFA' }

interface PageProps {
  params: { id: string }
}

const statutColors: Record<string, string> = {
  NOUVEAU: 'bg-blue-100 text-blue-700',
  CONTACTE: 'bg-yellow-100 text-yellow-700',
  EN_NEGOCIATION: 'bg-purple-100 text-purple-700',
  GAGNE: 'bg-green-100 text-green-700',
  PERDU: 'bg-red-100 text-red-700',
}

export default async function LeadDetailPage({ params }: PageProps) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      annonce: { select: { id: true, titre: true, reference: true, slug: true } },
      agent: { select: { id: true, name: true } },
      interactions: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!lead) notFound()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm text-grey hover:text-primary transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux leads
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl font-bold text-dark">{lead.prenom} {lead.nom}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutColors[lead.statut] ?? ''}`}>
            {lead.statut.replace('_', ' ')}
          </span>
        </div>
        <p className="text-grey text-sm mt-1">Lead créé le {formatDate(lead.createdAt.toISOString())}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-heading font-semibold text-dark">Coordonnées</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-grey">
            <Phone className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
            <a href={`tel:${lead.telephone}`} className="hover:text-primary transition-colors">{lead.telephone}</a>
          </div>
          {lead.email && (
            <div className="flex items-center gap-2 text-sm text-grey">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
              <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">{lead.email}</a>
            </div>
          )}
          {lead.prochainRappel && (
            <div className="flex items-center gap-2 text-sm text-grey">
              <Calendar className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
              Prochain rappel : {formatDate(lead.prochainRappel.toISOString())}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
        <h2 className="font-heading font-semibold text-dark">Informations</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-grey">Canal</dt>
            <dd className="font-medium text-dark">{lead.canal}</dd>
          </div>
          <div>
            <dt className="text-grey">Budget</dt>
            <dd className="font-medium text-dark">{lead.budget ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-grey">Agent</dt>
            <dd className="font-medium text-dark">{lead.agent?.name ?? '—'}</dd>
          </div>
          {lead.annonce && (
            <div>
              <dt className="text-grey">Annonce</dt>
              <dd className="font-medium text-dark">
                <Link href={`/admin/annonces/${lead.annonce.id}/edit`} className="text-primary hover:underline">
                  {lead.annonce.reference}
                </Link>
              </dd>
            </div>
          )}
        </dl>
        {lead.notes && (
          <div>
            <p className="text-grey text-sm mb-1">Notes</p>
            <p className="text-sm text-dark bg-gray-50 rounded-lg p-3">{lead.notes}</p>
          </div>
        )}
      </div>

      {lead.interactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          <h2 className="font-heading font-semibold text-dark flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" aria-hidden="true" />
            Interactions ({lead.interactions.length})
          </h2>
          <div className="space-y-3">
            {lead.interactions.map((interaction) => (
              <div key={interaction.id} className="border-l-2 border-primary-light pl-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">{interaction.type}</span>
                  <span className="text-xs text-grey">{formatDate(interaction.createdAt.toISOString())}</span>
                </div>
                <p className="text-sm text-dark mt-1">{interaction.contenu}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
