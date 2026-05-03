import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import { Suspense } from 'react'
import Image from 'next/image'
import { getAnnoncesListing } from '@/lib/get-annonces-listing'
import AnnoncesView from '@/components/public/AnnoncesView'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnnonceCard as AnnonceCardType } from '@/types'

export const metadata: Metadata = publicPageMetadata({
  title: 'Catalogue des biens — Acheter / Vendre',
  description:
    'Catalogue des terrains et biens immobiliers sécurisés au Bénin. Filtres par type, ville, prix et surface.',
  pathname: '/catalogue',
  keywords: ['catalogue terrain Bénin', 'acheter bien immobilier Parakou'],
})

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
  const { annonces: rawAnnonces, total, page, totalPages } = await getAnnoncesListing(searchParams)
  const annonces = JSON.parse(JSON.stringify(rawAnnonces))

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#D4A843]/20" style={{ minHeight: '360px' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-catalogue.jpg"
            alt="Terrain immobilier sécurisé au Bénin"
            fill
            className="object-cover object-center"
            style={{ animation: 'slowZoom 25s ease-in-out infinite alternate' }}
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(22,22,24,0.95) 0%, rgba(22,22,24,0.75) 55%, rgba(22,22,24,0.45) 100%)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,30,1) 0%, transparent 55%)' }} />
        </div>
        <style>{`@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.12); } }`}</style>
        <div className="relative container-site py-14 md:py-20">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Pôle achat · Vente
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF] max-w-2xl leading-tight">
            Catalogue des biens
          </h1>
          <p className="mt-4 text-[#8E8E93] text-lg max-w-xl leading-relaxed">
            Terrains et biens immobiliers sécurisés au Bénin — titre foncier vérifié, transactions transparentes.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4A843]/15 border border-[#D4A843]/30 text-[#D4A843] font-medium">
              {total} bien{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Listings */}
      <Suspense fallback={<Skeleton className="h-24 rounded-2xl w-full max-w-4xl" />}>
        <AnnoncesView
          variant="catalogue"
          annonces={annonces as AnnonceCardType[]}
          total={total}
          page={page}
          totalPages={totalPages}
          searchParams={searchParams}
          hideHeader={true}
        />
      </Suspense>
    </div>
  )
}

