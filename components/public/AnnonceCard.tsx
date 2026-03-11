'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Maximize2, FileText } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
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

const imageParType: Record<string, string> = {
  TERRAIN: '/images/annonces/terrain.jpg',
  MAISON: '/images/annonces/maison.jpg',
  APPARTEMENT: '/images/annonces/appartement.jpg',
  VILLA: '/images/annonces/villa.jpg',
  BUREAU: '/images/annonces/bureau.jpg',
  COMMERCE: '/images/annonces/commerce.jpg',
}

const AnnonceCard = React.memo(function AnnonceCard({ annonce }: AnnonceCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring pour fluidité
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 300, damping: 30
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300, damping: 30
  })
  const glare = useSpring(useTransform(x, [-0.5, 0.5], [0, 0.15]), {
    stiffness: 300, damping: 30
  })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const mainPhoto = annonce.photos?.length
    ? [...annonce.photos].sort((a, b) => a.ordre - b.ordre)[0]
    : null
  const imageSrc = mainPhoto?.url ?? imageParType[annonce.type] ?? '/images/annonces/maison.jpg'

  return (
    <Link href={`/annonces/${annonce.slug}`} className="group block">
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          transformPerspective: 800,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#D4A843]/10
                   cursor-pointer relative h-full flex flex-col"
      >
        {/* Reflet glare dynamique */}
        <motion.div
          style={{ opacity: glare }}
          className="absolute inset-0 z-10 pointer-events-none rounded-xl
                     bg-gradient-to-br from-white via-transparent to-transparent"
        />

        <div className="relative h-56 overflow-hidden bg-[#3A3A3C]">
          <Image
            src={imageSrc}
            alt={mainPhoto?.alt ?? annonce.titre}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-600 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent pointer-events-none" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={cn('text-[#EFEFEF] text-xs font-semibold px-2.5 py-1 rounded-full', statutColors[annonce.statut] ?? 'bg-[#34C759]')}>
              {getStatutLabel(annonce.statut)}
            </span>
            <span className="bg-[rgba(212,168,67,0.9)] text-[#EFEFEF] text-xs font-medium px-2.5 py-1 rounded-full">
              {typeLabels[annonce.type] ?? annonce.type}
            </span>
          </div>
          {annonce.documents?.includes('TF') && (
            <div className="absolute top-3 right-3">
              <span className="bg-[#D4A843] text-[#EFEFEF] text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <FileText className="h-3 w-3" aria-hidden="true" />
                TF
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-[#EFEFEF] text-lg leading-tight line-clamp-2">{annonce.titre}</h3>
              <p className="text-[#8E8E93] text-sm mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {annonce.localisation}
              </p>
              {annonce.surface != null && (
                <p className="text-[#8E8E93] text-xs mt-0.5 flex items-center gap-1">
                  <Maximize2 className="h-3 w-3" aria-hidden="true" />
                  {annonce.surface} m²
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-[#8E8E93] bg-[rgba(212,168,67,0.15)] border border-[rgba(212,168,67,0.3)] px-2 py-1 rounded-full">
                {typeLabels[annonce.type]}
              </span>
              <span className="text-xs text-[#8E8E93]">
                {annonce.reference}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#3A3A3C]">
            <div className="flex flex-col">
              <span className="text-[#D4A843] font-heading font-bold text-xl">{formatPrice(annonce.prix)}</span>
              <span className="text-[#8E8E93] text-xs">Prix net</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
})

export default AnnonceCard
