import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AnnonceForm } from '@/components/admin/AnnonceForm'

export const metadata: Metadata = { title: 'Modifier annonce — Admin FFA' }

interface PageProps {
  params: { id: string }
}

export default async function EditAnnoncePage({ params }: PageProps) {
  const annonce = await prisma.annonce.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      titre: true,
      description: true,
      type: true,
      statut: true,
      prix: true,
      surface: true,
      localisation: true,
      departement: true,
      commune: true,
      quartier: true,
      modalitesPrix: true,
    },
  })

  if (!annonce) notFound()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/annonces" className="inline-flex items-center gap-1 text-sm text-grey hover:text-primary transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux annonces
        </Link>
        <h1 className="font-heading text-2xl font-bold text-dark">Modifier l&apos;annonce</h1>
        <p className="text-grey text-sm mt-1">{annonce.titre}</p>
      </div>
      <AnnonceForm
        initialData={{
          id: annonce.id,
          titre: annonce.titre,
          description: annonce.description,
          type: annonce.type,
          statut: annonce.statut,
          prix: String(annonce.prix),
          surface: annonce.surface ? String(annonce.surface) : '',
          localisation: annonce.localisation,
          departement: annonce.departement ?? '',
          commune: annonce.commune ?? '',
          quartier: annonce.quartier ?? '',
          modalitesPrix: annonce.modalitesPrix ?? '',
        }}
      />
    </div>
  )
}
