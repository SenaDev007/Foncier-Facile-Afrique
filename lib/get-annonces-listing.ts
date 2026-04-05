import { prisma } from '@/lib/prisma'

export type AnnoncesListingSearchParams = {
  type?: string
  localisation?: string
  prixMax?: string
  surfaceMin?: string
  sort?: string
  page?: string
  documents?: string
}

const ITEMS_PER_PAGE = 12

export async function getAnnoncesListing(params: AnnoncesListingSearchParams) {
  const page = Math.max(1, parseInt(params.page ?? '1'))
  const skip = (page - 1) * ITEMS_PER_PAGE

  type OrderKey = 'createdAt' | 'prix' | 'surface'
  const sortMap: Record<string, { [K in OrderKey]?: 'asc' | 'desc' }> = {
    createdAt_desc: { createdAt: 'desc' },
    prix_asc: { prix: 'asc' },
    prix_desc: { prix: 'desc' },
    surface_desc: { surface: 'desc' },
  }
  const orderBy = sortMap[params.sort ?? 'createdAt_desc'] ?? { createdAt: 'desc' }

  const docList = params.documents ? params.documents.split(',').filter(Boolean) : []

  const where = {
    statut: 'EN_LIGNE' as const,
    ...(params.type && params.type !== 'ALL'
      ? {
          type: params.type as
            | 'TERRAIN'
            | 'APPARTEMENT'
            | 'MAISON'
            | 'VILLA'
            | 'BUREAU'
            | 'COMMERCE',
        }
      : {}),
    ...(params.localisation
      ? { localisation: { contains: params.localisation, mode: 'insensitive' as const } }
      : {}),
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
