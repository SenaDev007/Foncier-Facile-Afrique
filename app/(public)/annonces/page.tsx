import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAnnoncesListing } from '@/lib/get-annonces-listing'
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

export default async function AnnoncesPage({ searchParams }: PageProps) {
  const { annonces, total, page, totalPages } = await getAnnoncesListing(searchParams)

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
