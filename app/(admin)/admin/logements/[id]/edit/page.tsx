import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { LogementForm } from '@/components/admin/LogementForm'

export const metadata: Metadata = { title: 'Modifier logement — Admin FFA' }

interface PageProps {
  params: { id: string }
}

export default async function EditLogementPage({ params }: PageProps) {
  const logement = await prisma.logement.findFirst({
    where: { id: params.id, deletedAt: null },
    include: { photos: { orderBy: { ordre: 'asc' } } },
  })

  if (!logement) notFound()

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/logements"
          className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux logements
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Modifier le logement</h1>
        <p className="text-[#8E8E93] text-sm mt-1">{logement.nom}</p>
        <a
          href={`/sejour/${logement.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#D4A843] hover:underline mt-2"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Fiche publique
        </a>
      </div>
      <LogementForm
        mode="edit"
        logementId={logement.id}
        initial={{
          reference: logement.reference,
          nom: logement.nom,
          type: logement.type,
          ville: logement.ville,
          quartier: logement.quartier,
          description: logement.description,
          prixNuit: logement.prixNuit,
          capacite: logement.capacite,
          minNuits: logement.minNuits,
          equipements: logement.equipements,
          services: logement.services,
          statut: logement.statut,
          latitude: logement.latitude,
          longitude: logement.longitude,
          photos: logement.photos.map((p) => ({ url: p.url, alt: p.alt })),
        }}
      />
    </div>
  )
}
