'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { LayoutGrid, List, MapPin } from 'lucide-react'
import AnnonceCard from '@/components/public/AnnonceCard'
import AnnonceFilters from '@/components/public/AnnonceFilters'
import { formatPrice, getStatutLabel } from '@/lib/utils'
import type { AnnonceCard as AnnonceCardType } from '@/types'

const MapViewClient = dynamic(() => import('@/components/public/MapView'), { ssr: false })

type ViewMode = 'grid' | 'list' | 'map'

interface AnnoncesViewProps {
  variant?: 'annonces' | 'catalogue'
  annonces: AnnonceCardType[]
  total: number
  page: number
  totalPages: number
  searchParams: Record<string, string | undefined>
}

export default function AnnoncesView({
  variant = 'annonces',
  annonces,
  total,
  page,
  totalPages,
  searchParams,
}: AnnoncesViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const listingBase = variant === 'catalogue' ? '/catalogue' : '/annonces'
  const pageTitle =
    variant === 'catalogue' ? 'Catalogue des biens' : 'Annonces immobilières'

  const paginationParams = useMemo(() => {
    const p: Record<string, string> = {}
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && k !== 'page') p[k] = v
    })
    return p
  }, [searchParams])

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <div className="container-site py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#EFEFEF]">
              {pageTitle}
            </h1>
            <p className="text-[#8E8E93] mt-1 text-sm">
              {total} bien{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#2C2C2E] border border-[#3A3A3C]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#D4A843] text-[#1C1C1E]' : 'text-[#8E8E93] hover:text-[#EFEFEF]'}`}
              aria-label="Vue grille"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#D4A843] text-[#1C1C1E]' : 'text-[#8E8E93] hover:text-[#EFEFEF]'}`}
              aria-label="Vue liste"
              aria-pressed={viewMode === 'list'}
            >
              <List className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-[#D4A843] text-[#1C1C1E]' : 'text-[#8E8E93] hover:text-[#EFEFEF]'}`}
              aria-label="Vue carte"
              aria-pressed={viewMode === 'map'}
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <Suspense fallback={<div className="h-24 rounded-xl bg-[#2C2C2E] border border-[#3A3A3C] animate-pulse" />}>
          <AnnonceFilters />
        </Suspense>

        <div className="mt-8">
          {annonces.length > 0 ? (
            <>
              {viewMode === 'map' && (
                <div className="mb-8">
                  <MapViewClient annonces={annonces} />
                </div>
              )}

              {viewMode === 'grid' && (
                <div className="grid justify-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),320px))]">
                  {annonces.map((annonce) => (
                    <AnnonceCard key={annonce.id} annonce={annonce} />
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="space-y-4">
                  {annonces.map((annonce) => {
                    const mainPhoto = annonce.photos.sort((a, b) => a.ordre - b.ordre)[0]
                    return (
                      <Link
                        key={annonce.id}
                        href={`/annonces/${annonce.slug}`}
                        className="flex flex-col sm:flex-row gap-4 bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-4 hover:border-[#D4A843]/40 transition-colors"
                      >
                        <div className="relative w-full sm:w-56 h-40 sm:h-32 rounded-lg overflow-hidden bg-[#3A3A3C] flex-shrink-0">
                          {mainPhoto ? (
                            <Image
                              src={mainPhoto.url}
                              alt={mainPhoto.alt ?? annonce.titre}
                              fill
                              className="object-cover"
                              sizes="224px"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-[#D4A843] font-heading font-semibold">
                              FFA
                            </span>
                          )}
                          <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#D4A843] text-[#1C1C1E]">
                            {getStatutLabel(annonce.statut)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h2 className="font-heading font-semibold text-[#EFEFEF] text-lg line-clamp-2">
                            {annonce.titre}
                          </h2>
                          <p className="text-[#8E8E93] text-sm mt-0.5">{annonce.localisation}</p>
                          {annonce.surface && (
                            <p className="text-[#8E8E93] text-xs">{annonce.surface} m²</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end justify-center">
                          <span className="font-heading font-bold text-[#D4A843] text-xl">
                            {formatPrice(annonce.prix)}
                          </span>
                          <span className="text-[#8E8E93] text-xs">Réf. {annonce.reference}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}

              {viewMode !== 'map' && totalPages > 1 && (
                <nav
                  className="flex justify-center items-center gap-2 mt-10"
                  aria-label="Pagination"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const params = new URLSearchParams({ ...paginationParams, page: String(p) })
                    return (
                      <Link
                        key={p}
                        href={`${listingBase}?${params.toString()}`}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-[#D4A843] text-[#1C1C1E]'
                            : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-[#EFEFEF] border border-[#3A3A3C]'
                        }`}
                        aria-current={p === page ? 'page' : undefined}
                      >
                        {p}
                      </Link>
                    )
                  })}
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-[#2C2C2E] rounded-2xl border border-[#3A3A3C]">
              <p className="text-[#8E8E93] text-lg mb-4">
                Aucune annonce ne correspond à vos critères.
              </p>
              <Link
                href={listingBase}
                className="text-[#D4A843] hover:text-[#c2972e] font-medium transition-colors"
              >
                Réinitialiser les filtres
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
