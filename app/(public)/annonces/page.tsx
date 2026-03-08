import type { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import AnnonceCard from '@/components/public/AnnonceCard'
import AnnonceFilters from '@/components/public/AnnonceFilters'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnnonceCard as AnnonceCardType } from '@/types'

export const metadata: Metadata = {
  title: 'Annonces immobilières — Foncier Facile Afrique',
  description: 'Découvrez notre sélection de terrains et biens immobiliers sécurisés au Bénin et en Afrique de l\'Ouest.',
  openGraph: { title: 'Annonces immobilières — Foncier Facile Afrique', description: 'Terrains et biens immobiliers avec titre foncier vérifié.' },
}

interface PageProps {
  searchParams: { type?: string; localisation?: string; prixMax?: string; surfaceMin?: string; sort?: string; page?: string }
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

  const where = {
    statut: 'EN_LIGNE' as const,
    ...(params.type && params.type !== 'ALL' ? { type: params.type as 'TERRAIN' | 'APPARTEMENT' | 'MAISON' | 'VILLA' | 'BUREAU' | 'COMMERCE' } : {}),
    ...(params.localisation ? { localisation: { contains: params.localisation, mode: 'insensitive' as const } } : {}),
    ...(params.prixMax ? { prix: { lte: parseInt(params.prixMax) } } : {}),
    ...(params.surfaceMin ? { surface: { gte: parseInt(params.surfaceMin) } } : {}),
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
    <div className="bg-bg min-h-screen">
      <div className="container-site py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary">Annonces immobilières</h1>
          <p className="text-text-secondary mt-1 text-sm">{total} bien{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}</p>
        </div>

        <Suspense fallback={<Skeleton className="h-24 rounded-2xl" />}>
          <AnnonceFilters />
        </Suspense>

        <div className="mt-8">
          {annonces.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annonces.map((annonce) => (
                  <AnnonceCard key={annonce.id} annonce={annonce as AnnonceCardType} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-2 mt-10" aria-label="Pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/annonces?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-gold text-text-inverse' : 'bg-bg-surface text-text-secondary hover:bg-gold-light hover:text-gold'}`}
                      aria-current={p === page ? 'page' : undefined}
                    >
                      {p}
                    </a>
                  ))}
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-bg-surface rounded-2xl border border-bg-border">
              <p className="text-text-secondary text-lg mb-4">Aucune annonce ne correspond à vos critères.</p>
              <Link href="/annonces" className="text-gold hover:text-gold-dark font-medium">
                Réinitialiser les filtres
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
