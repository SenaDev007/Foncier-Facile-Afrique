'use client'

import Link from 'next/link'
import { CircularGallery, type GalleryItem } from '@/components/ui/circular-gallery'
import { formatPrice } from '@/lib/utils'
import type { AnnonceCard } from '@/types'

export function LandingAnnoncesCircularSection({ annonces }: { annonces: AnnonceCard[] }) {
  if (!annonces.length) return null

  const items: GalleryItem[] = annonces.map((a) => {
    const mainPhoto = a.photos?.length ? [...a.photos].sort((x, y) => x.ordre - y.ordre)[0] : null
    return {
      common: a.titre,
      binomial: `${formatPrice(a.prix)} · ${a.localisation}`,
      photo: {
        url: mainPhoto?.url ?? '/images/annonces/terrain.jpg',
        text: a.titre,
        by: 'Foncier Facile Afrique',
      },
    }
  })

  return (
    <div className="w-full bg-[#161618] text-[#EFEFEF]">
      <div className="w-full h-[90vh] sticky top-0 flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full h-full">
          <CircularGallery items={items} radius={520} autoRotateSpeed={0.03} />
        </div>
      </div>
      <div className="container-site pb-6 flex items-center justify-center">
        <Link href="/annonces" className="inline-flex items-center gap-2 rounded-full border border-[#D4A843]/35 bg-[#D4A843]/10 px-5 py-2 text-sm text-[#D4A843] hover:bg-[#D4A843]/20">
          Voir toutes les annonces
        </Link>
      </div>
    </div>
  )
}
