import type { Metadata } from 'next'
import { adminPageMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AnnonceForm } from '@/components/admin/AnnonceForm'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const annonce = await prisma.annonce.findUnique({
    where: { id: params.id },
    select: { titre: true },
  })
  const title = annonce ? `Modifier : ${annonce.titre} — Admin FFA` : 'Modifier annonce — Admin FFA'
  return adminPageMetadata({
    title,
    pathname: `/admin/annonces/${params.id}/edit`,
    description: annonce
      ? `Modifier l’annonce « ${annonce.titre} ».`
      : 'Modifier une annonce existante (texte, photos, statut).',
  })
}

export default async function EditAnnoncePage({ params }: PageProps) {
  const annonce = await prisma.annonce.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { ordre: 'asc' } } },
  })

  if (!annonce) notFound()

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/annonces" className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux annonces
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Modifier l&apos;annonce</h1>
        <p className="text-[#8E8E93] text-sm mt-1">{annonce.titre}</p>
        {annonce.statut === 'EN_LIGNE' && (
          <a
            href={`/annonces/${annonce.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[#D4A843] hover:underline mt-2"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Voir sur le site public
          </a>
        )}
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
          documents: annonce.documents,
          latitude: annonce.latitude,
          longitude: annonce.longitude,
          photos: annonce.photos.map((p) => ({ url: p.url, alt: p.alt ?? '' })),
        }}
      />
    </div>
  )
}
