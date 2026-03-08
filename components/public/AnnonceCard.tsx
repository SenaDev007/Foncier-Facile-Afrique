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
  EN_LIGNE: 'bg-status-online',
  RESERVE: 'bg-status-reserved',
  VENDU: 'bg-status-sold',
  BROUILLON: 'bg-text-muted',
  ARCHIVE: 'bg-text-muted',
}

const typeLabels: Record<string, string> = {
  TERRAIN: 'Terrain',
  APPARTEMENT: 'Appartement',
  MAISON: 'Maison',
  VILLA: 'Villa',
  BUREAU: 'Bureau',
  COMMERCE: 'Commerce',
}

const AnnonceCard = React.memo(function AnnonceCard({ annonce }: AnnonceCardProps) {
  const mainPhoto = annonce.photos.sort((a, b) => a.ordre - b.ordre)[0]

  return (
    <Link href={`/annonces/${annonce.slug}`} className="group block">
      <article className="bg-bg-surface border border-bg-border rounded-xl shadow-card hover:shadow-elevated hover:border-gold/40 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative h-52 overflow-hidden bg-bg-surface-alt">
          {mainPhoto ? (
            <Image
              src={mainPhoto.url}
              alt={mainPhoto.alt ?? annonce.titre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gold-light">
              <span className="text-gold font-heading text-lg font-semibold">FFA</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={cn('text-text-inverse text-xs font-semibold px-2.5 py-1 rounded-full', statutColors[annonce.statut] ?? 'bg-status-reserved')}>
              {getStatutLabel(annonce.statut)}
            </span>
            <span className="bg-gold/90 text-text-inverse text-xs font-medium px-2.5 py-1 rounded-full">
              {typeLabels[annonce.type] ?? annonce.type}
            </span>
          </div>
          {annonce.documents.includes('TF') && (
            <div className="absolute top-3 right-3">
              <span className="bg-gold text-text-inverse text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <FileText className="h-3 w-3" aria-hidden="true" />
                TF
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-text-primary text-lg leading-tight line-clamp-2">{annonce.titre}</h3>
              <p className="text-text-secondary text-sm mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {annonce.localisation}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="font-bold text-gold text-xl">{formatPrice(annonce.prix)}</p>
              <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                <Maximize2 className="h-3 w-3" aria-hidden="true" />
                {annonce.surface} m²
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-text-muted bg-gold-light border border-gold-border px-2 py-1 rounded-full">
                {typeLabels[annonce.type]}
              </span>
              <span className="text-xs text-text-muted">
                {annonce.reference}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
})

export default AnnonceCard
