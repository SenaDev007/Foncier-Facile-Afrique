'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Maximize2, FileText } from 'lucide-react'
import { formatPrice, getStatutLabel, cn } from '@/lib/utils'
import type { AnnonceCard as AnnonceCardType } from '@/types'

interface AnnonceCardProps {
  annonce: AnnonceCardType
}

const statutColors: Record<string, string> = {
  EN_LIGNE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  RESERVE: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  VENDU: 'bg-red-500/20 text-red-400 border-red-500/30',
  BROUILLON: 'bg-[#3A3A3C] text-[#636366] border-[#3A3A3C]',
  ARCHIVE: 'bg-[#3A3A3C] text-[#636366] border-[#3A3A3C]',
}

const typeLabels: Record<string, string> = {
  TERRAIN: 'Terrain',
  APPARTEMENT: 'Appartement',
  MAISON: 'Maison',
  VILLA: 'Villa',
  BUREAU: 'Bureau',
  COMMERCE: 'Commerce',
}

const imageParType: Record<string, string> = {
  TERRAIN: '/images/annonces/terrain.jpg',
  MAISON: '/images/annonces/maison.jpg',
  APPARTEMENT: '/images/annonces/appartement.jpg',
  VILLA: '/images/annonces/villa.jpg',
  BUREAU: '/images/annonces/bureau.jpg',
  COMMERCE: '/images/annonces/commerce.jpg',
}

const AnnonceCard = React.memo(function AnnonceCard({ annonce }: AnnonceCardProps) {
  const mainPhoto = annonce.photos?.length
    ? [...annonce.photos].sort((a, b) => a.ordre - b.ordre)[0]
    : null
  const imageSrc = mainPhoto?.url ?? imageParType[annonce.type] ?? '/images/annonces/maison.jpg'
  
  const dispo = annonce.statut === 'EN_LIGNE'

  return (
    <Link 
      href={`/annonces/${annonce.slug}`} 
      className={`group flex flex-col h-full rounded-2xl border bg-[#2C2C2E] overflow-hidden transition-all duration-300 min-h-[400px] ${
        dispo
          ? 'border-[#3A3A3C] hover:border-[#D4A843]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4A843]/10'
          : 'border-[#3A3A3C] opacity-80 cursor-default pointer-events-none'
      }`}
    >
        <div className="relative h-56 overflow-hidden bg-[#3A3A3C] flex-shrink-0">
          <Image
            src={imageSrc}
            alt={mainPhoto?.alt ?? annonce.titre}
            fill
            className={`object-cover transition-transform duration-500 ${dispo ? 'group-hover:scale-105' : 'grayscale-[40%]'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent pointer-events-none" />
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm', statutColors[annonce.statut] ?? 'bg-[#34C759] text-white border-transparent')}>
              {getStatutLabel(annonce.statut)}
            </span>
            <span className="bg-[#1C1C1E]/80 text-[#EFEFEF] backdrop-blur-sm border border-[#3A3A3C] text-xs font-medium px-2.5 py-1 rounded-full">
              {typeLabels[annonce.type] ?? annonce.type}
            </span>
          </div>
          
          {annonce.documents && annonce.documents.includes('TF') && (
            <div className="absolute top-3 right-3">
              <span className="bg-[#D4A843]/90 backdrop-blur-sm text-[#1C1C1E] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#D4A843]">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                TF
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1 gap-3 min-h-0">
          <div className="flex-1 min-w-0">
            <h3 className={`font-heading font-semibold text-lg leading-tight line-clamp-2 transition-colors ${dispo ? 'text-[#EFEFEF] group-hover:text-[#D4A843]' : 'text-[#EFEFEF]/80'}`}>
              {annonce.titre}
            </h3>
            <p className="text-[#8E8E93] text-sm mt-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{annonce.localisation}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#8E8E93]">
            {annonce.surface != null && (
              <span className="flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-[#D4A843]" aria-hidden="true" />
                {annonce.surface} m²
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-[#8E8E93]">Réf:</span> {annonce.reference}
            </span>
          </div>
          
          <div className="mt-auto pt-4 border-t border-[#3A3A3C] flex items-center justify-between">
            <p className={`font-heading font-bold text-xl ${dispo ? 'text-[#D4A843]' : 'text-[#8E8E93]'}`}>
              {new Intl.NumberFormat('fr-BJ').format(annonce.prix)} <span className="text-xs font-normal text-[#8E8E93]">FCFA</span>
            </p>
          </div>
        </div>
    </Link>
  )
})

export default AnnonceCard
