import type { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import AnnoncesView from '@/components/public/AnnoncesView'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnnonceCard as AnnonceCardType } from '@/types'

export const metadata: Metadata = {
  title: 'Annonces immobilières — Foncier Facile Afrique',
  description: 'Découvrez notre sélection de terrains et biens immobiliers sécurisés au Bénin et en Afrique de l\'Ouest.',
  openGraph: { title: 'Annonces immobilières — Foncier Facile Afrique', description: 'Terrains et biens immobiliers avec titre foncier vérifié.' },
}

interface PageProps {
  searchParams: { type?: string; localisation?: string; prixMax?: string; surfaceMin?: string; sort?: string; page?: string; documents?: string }
}

const ITEMS_PER_PAGE = 12

async function getAnnonces(params: PageProps['searchParams']) {
  const page = Math.max(1, parseInt(params.page ?? '1'))
  const skip = (page - 1) * ITEMS_PER_PAGE

  type OrderKey = 'createdAt' | 'prix' | 'surface'
  const sortMap: Record<string, { [K in OrderKey]?: 'asc' | 'desc' }> = {
    'createdAt_desc': { createdAt: 'desc' },
    'prix_asc': { prix: 'asc' },
    'prix_desc': { prix: 'desc' },
    'surface_desc': { surface: 'desc' },
  }
  const orderBy = sortMap[params.sort ?? 'createdAt_desc'] ?? { createdAt: 'desc' }

  const docList = params.documents ? params.documents.split(',').filter(Boolean) : []

  const where = {
    statut: 'EN_LIGNE' as const,
    ...(params.type && params.type !== 'ALL' ? { type: params.type as 'TERRAIN' | 'APPARTEMENT' | 'MAISON' | 'VILLA' | 'BUREAU' | 'COMMERCE' } : {}),
    ...(params.localisation ? { localisation: { contains: params.localisation, mode: 'insensitive' as const } } : {}),
    ...(params.prixMax ? { prix: { lte: parseInt(params.prixMax) } } : {}),
    ...(params.surfaceMin ? { surface: { gte: parseInt(params.surfaceMin) } } : {}),
    ...(docList.length > 0 ? { documents: { hasEvery: docList } } : {}),
  }

  const [annonces, total] = await Promise.all([
    prisma.annonce.findMany({
      where,
      include: { photos: true },
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.annonce.count({ where }),
  ])

  return { annonces, total, page, totalPages: Math.ceil(total / ITEMS_PER_PAGE) }
}

export default async function AnnoncesPage({ searchParams }: PageProps) {
  const { annonces, total, page, totalPages } = await getAnnonces(searchParams)

  return (
    <Suspense fallback={<Skeleton className="h-24 rounded-2xl w-full max-w-4xl" />}>
      <AnnoncesView
        annonces={annonces as AnnonceCardType[]}
        total={total}
        page={page}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </Suspense>
  )
}
