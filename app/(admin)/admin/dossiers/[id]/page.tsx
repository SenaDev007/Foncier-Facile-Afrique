import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Mail, Phone } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { DossierDetailAdmin } from '@/components/admin/DossierDetailAdmin'

export const metadata: Metadata = { title: 'Détail dossier — Admin FFA' }

interface PageProps {
  params: { id: string }
}

const typeRegulLabel: Record<string, string> = {
  PH_TO_TF: 'PH → TF',
  PREMIER_TF: 'Premier TF',
  MUTATION: 'Mutation',
  LITIGE: 'Litige',
  MORCELLEMENT: 'Morcellement',
  AUDIT: 'Audit',
}

export default async function AdminDossierDetailPage({ params }: PageProps) {
  const [session, dossier, agents] = await Promise.all([
    auth(),
    prisma.dossierFoncier.findFirst({
      where: { id: params.id, deletedAt: null },
      include: {
        user: { select: { id: true, name: true } },
        interactions: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: { in: ['AGENT', 'ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  if (!dossier) notFound()

  const canAssign = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  const interactions = dossier.interactions.map((i) => ({
    id: i.id,
    type: i.type,
    contenu: i.contenu,
    createdAt: i.createdAt.toISOString(),
    authorName: i.user.name,
  }))

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/dossiers"
          className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux dossiers
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Dossier {dossier.reference}</h1>
        <p className="text-[#8E8E93] text-sm mt-1">Mis à jour le {formatDate(dossier.updatedAt.toISOString())}</p>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-3">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Client</h2>
        <p className="text-[#EFEFEF] font-medium">{dossier.nomClient}</p>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-[#D4A843] flex-shrink-0" aria-hidden="true" />
          <a href={`mailto:${dossier.emailClient}`} className="text-[#8E8E93] hover:text-[#D4A843]">
            {dossier.emailClient}
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-[#D4A843] flex-shrink-0" aria-hidden="true" />
          <a href={`tel:${dossier.telephoneClient}`} className="text-[#8E8E93] hover:text-[#D4A843]">
            {dossier.telephoneClient}
          </a>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2">
          <div>
            <dt className="text-[#8E8E93]">Pays</dt>
            <dd className="text-[#EFEFEF]">{dossier.pays}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Type de dossier</dt>
            <dd className="text-[#EFEFEF]">{typeRegulLabel[dossier.typeRegul] ?? dossier.typeRegul}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[#8E8E93]">Localisation</dt>
            <dd className="text-[#EFEFEF]">
              {dossier.ville}
              {dossier.quartier ? ` · ${dossier.quartier}` : ''}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-2">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Situation initiale</h2>
        <p className="text-sm text-[#EFEFEF] whitespace-pre-wrap">{dossier.situationInit}</p>
      </div>

      <DossierDetailAdmin
        dossierId={dossier.id}
        initialStatut={dossier.statut}
        initialEtapeActuelle={dossier.etapeActuelle}
        initialEtapeMax={dossier.etapeMax}
        initialNotesInternes={dossier.notesInternes}
        initialDelaiEstime={dossier.delaiEstime}
        initialMontantDevis={dossier.montantDevis}
        canAssign={canAssign}
        agents={agents}
        currentUserId={dossier.userId}
        interactions={interactions}
      />
    </div>
  )
}
