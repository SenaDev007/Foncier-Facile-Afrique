import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAnnoncesListing } from '@/lib/get-annonces-listing'
import AnnoncesView from '@/components/public/AnnoncesView'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnnonceCard as AnnonceCardType } from '@/types'

export const metadata: Metadata = {
  title: 'Catalogue des biens — Acheter / Vendre',
  description:
    'Catalogue des terrains et biens immobiliers sécurisés au Bénin. Filtres par type, ville, prix et surface.',
  openGraph: {
    title: 'Catalogue des biens — Foncier Facile Afrique',
    description: 'Acheter ou investir sur des biens avec dossier vérifié.',
  },
}

interface PageProps {
  searchParams: {
    type?: string
    localisation?: string
    prixMax?: string
    surfaceMin?: string
    sort?: string
    page?: string
    documents?: string
  }
}

export default async function CataloguePage({ searchParams }: PageProps) {
  const { annonces, total, page, totalPages } = await getAnnoncesListing(searchParams)

  return (
    <Suspense fallback={<Skeleton className="h-24 rounded-2xl w-full max-w-4xl" />}>
      <AnnoncesView
        variant="catalogue"
        annonces={annonces as AnnonceCardType[]}
        total={total}
        page={page}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </Suspense>
  )
}
