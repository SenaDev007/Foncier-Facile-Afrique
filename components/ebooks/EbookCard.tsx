'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Star } from 'lucide-react'

interface EbookCardProps {
  ebook: {
    id: string
    slug: string
    titre: string
    categorie: string
    prixCFA: number
    prixPromo: number | null
    couverture: string
    vedette: boolean
    pages: number | null
  }
}

export default function EbookCard({ ebook }: EbookCardProps) {
  const prixAffiche = ebook.prixPromo ?? ebook.prixCFA
  const aPromo = !!ebook.prixPromo && ebook.prixPromo < ebook.prixCFA
  const [coverError, setCoverError] = useState(false)
  const showCover = ebook.couverture && !coverError

  return (
    <Link href={`/ebooks/${ebook.slug}`}>
      <div className="group relative bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl overflow-hidden hover:border-[rgba(212,168,67,0.4)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer">
        <div className="relative h-64 bg-[#3A3A3C] overflow-hidden">
          {showCover ? (
            <Image
              src={ebook.couverture}
              alt={ebook.titre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 320px"
              onError={() => setCoverError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-[#D4A843] opacity-40" />
            </div>
          )}
          {ebook.vedette && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#D4A843] text-[#1C1C1E] text-xs font-bold px-3 py-1 rounded-full">
              <Star className="w-3 h-3" /> Vedette
            </div>
          )}
          {aPromo && (
            <div className="absolute top-3 right-3 bg-[#FF453A] text-white text-xs font-bold px-3 py-1 rounded-full">
              Promo
            </div>
          )}
        </div>
        <div className="p-5">
          <span className="text-xs text-[#D4A843] font-medium tracking-wider uppercase">
            {ebook.categorie}
          </span>
          <h3 className="text-[#EFEFEF] font-semibold text-base mt-1 mb-3 line-clamp-2 leading-snug">
            {ebook.titre}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#D4A843] font-bold text-xl">
                {prixAffiche.toLocaleString('fr-FR')} FCFA
              </span>
              {aPromo && (
                <span className="ml-2 text-[#636366] text-sm line-through">
                  {ebook.prixCFA.toLocaleString('fr-FR')} FCFA
                </span>
              )}
            </div>
            {ebook.pages != null && (
              <span className="text-[#636366] text-xs">{ebook.pages} pages</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
