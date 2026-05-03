'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Wifi, Car, Users, BedDouble, Bath, Star, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react'

type Photo = { url: string; alt?: string | null }

type Logement = {
  id: string
  nom: string
  ville: string
  quartier?: string | null
  type: string
  statut: string
  prixNuit: number
  capacite: number
  minNuits: number
  equipements: string[]
  services: string[]
  note?: number | null
  nbAvis?: number | null
  photos: Photo[]
}

const TYPE_LABELS: Record<string, string> = {
  GUEST_HOUSE: 'Guest House',
  HOTEL: 'Hôtel',
  VILLA_VAC: 'Villa',
  APPARTEMENT: 'Appartement',
}

const STATUT_BADGE: Record<string, { label: string; class: string }> = {
  DISPONIBLE: { label: 'Disponible', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  OCCUPE: { label: 'Complet', class: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  ARCHIVE: { label: 'Archivé', class: 'bg-[#3A3A3C] text-[#636366] border-[#3A3A3C]' },
}

function LogementCard({ l }: { l: Logement }) {
  const dispo = l.statut === 'DISPONIBLE'
  const badge = STATUT_BADGE[l.statut]
  const mainPhoto = l.photos[0]
  const keyEquipements = l.equipements.slice(0, 3)

  return (
    <Link
      href={`/sejour/${l.id}`}
      className={`group flex flex-col rounded-2xl border bg-[#2C2C2E] overflow-hidden transition-all duration-300 ${
        dispo
          ? 'border-[#3A3A3C] hover:border-[#D4A843]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4A843]/10'
          : 'border-[#3A3A3C] opacity-80 cursor-default pointer-events-none'
      }`}
    >
      {/* Photo */}
      <div className="relative h-52 bg-[#1C1C1E] overflow-hidden flex-shrink-0">
        {mainPhoto ? (
          <Image
            src={mainPhoto.url}
            alt={mainPhoto.alt ?? l.nom}
            fill
            className={`object-cover transition-transform duration-500 ${dispo ? 'group-hover:scale-105' : 'grayscale-[40%]'}`}
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#D4A843]/40 font-heading text-2xl">FFA</div>
        )}
        {/* Type badge */}
        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1C1C1E]/80 text-[#EFEFEF] backdrop-blur-sm border border-[#3A3A3C]">
          {TYPE_LABELS[l.type] ?? l.type}
        </span>
        {/* Statut badge */}
        {!dispo && (
          <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${badge.class}`}>
            {badge.label}
          </span>
        )}
        {dispo && l.note && l.note > 0 && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1C1C1E]/80 text-[#D4A843] backdrop-blur-sm border border-[#D4A843]/30">
            <Star className="h-3 w-3 fill-[#D4A843]" aria-hidden />
            {l.note.toFixed(1)} ({l.nbAvis})
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className={`font-heading font-semibold text-lg leading-tight transition-colors ${dispo ? 'text-[#EFEFEF] group-hover:text-[#D4A843]' : 'text-[#EFEFEF]/80'}`}>
            {l.nom}
          </h3>
          <p className="text-xs text-[#8E8E93] mt-1">{l.ville}{l.quartier ? ` · ${l.quartier}` : ''}</p>
        </div>

        {/* Caractéristiques */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8E8E93]">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-[#D4A843]" aria-hidden />
            {l.capacite} pers.
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5 text-[#D4A843]" aria-hidden />
            min. {l.minNuits} nuit{l.minNuits > 1 ? 's' : ''}
          </span>
        </div>

        {/* Équipements clés */}
        {keyEquipements.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keyEquipements.map((eq) => (
              <span key={eq} className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/20">
                {eq}
              </span>
            ))}
            {l.equipements.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3A3A3C] text-[#8E8E93]">
                +{l.equipements.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Prix */}
        <div className="mt-auto pt-3 border-t border-[#3A3A3C] flex items-center justify-between">
          <p className={`font-heading font-bold text-xl ${dispo ? 'text-[#D4A843]' : 'text-[#8E8E93]'}`}>
            {new Intl.NumberFormat('fr-FR').format(l.prixNuit)} <span className="text-xs font-normal text-[#8E8E93]">FCFA / nuit</span>
          </p>
          {dispo && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              Réservable
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

type FilterType = 'TOUS' | 'GUEST_HOUSE' | 'HOTEL' | 'VILLA_VAC' | 'APPARTEMENT'

interface SejourListClientProps {
  logements: Logement[]
}

export function SejourListClient({ logements }: SejourListClientProps) {
  const [filter, setFilter] = useState<FilterType>('TOUS')
  const [sortBy, setSortBy] = useState<'prix_asc' | 'prix_desc' | 'capacite'>('prix_asc')

  const availableTypes = useMemo(() => {
    const types = new Set(logements.map((l) => l.type))
    return Array.from(types)
  }, [logements])

  const filtered = useMemo(() => {
    let list = [...logements]
    if (filter !== 'TOUS') list = list.filter((l) => l.type === filter)
    if (sortBy === 'prix_asc') list.sort((a, b) => a.prixNuit - b.prixNuit)
    else if (sortBy === 'prix_desc') list.sort((a, b) => b.prixNuit - a.prixNuit)
    else if (sortBy === 'capacite') list.sort((a, b) => b.capacite - a.capacite)
    // Always keep DISPONIBLE first within sorted order
    return list.sort((a, b) => {
      if (a.statut === 'DISPONIBLE' && b.statut !== 'DISPONIBLE') return -1
      if (a.statut !== 'DISPONIBLE' && b.statut === 'DISPONIBLE') return 1
      return 0
    })
  }, [logements, filter, sortBy])

  if (logements.length === 0) return null

  const disponibles = logements.filter((l) => l.statut === 'DISPONIBLE').length

  return (
    <div className="space-y-8">
      {/* Barre de filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
        {/* Filtre type */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('TOUS')}
            className={`text-xs px-4 py-2 rounded-full border transition-all ${filter === 'TOUS' ? 'bg-[#D4A843] text-[#1C1C1E] border-[#D4A843] font-semibold' : 'border-[#3A3A3C] text-[#8E8E93] hover:border-[#D4A843]/50 hover:text-[#EFEFEF]'}`}
          >
            Tous ({logements.length})
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as FilterType)}
              className={`text-xs px-4 py-2 rounded-full border transition-all ${filter === type ? 'bg-[#D4A843] text-[#1C1C1E] border-[#D4A843] font-semibold' : 'border-[#3A3A3C] text-[#8E8E93] hover:border-[#D4A843]/50 hover:text-[#EFEFEF]'}`}
            >
              {TYPE_LABELS[type] ?? type}
            </button>
          ))}
        </div>

        {/* Tri */}
        <div className="sm:ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs px-3 py-2 rounded-lg border border-[#3A3A3C] bg-[#2C2C2E] text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#D4A843]/40"
          >
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="capacite">Capacité</option>
          </select>
        </div>
      </div>


      {/* Grille */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((l) => (
          <LogementCard key={l.id} l={l} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E]">
          <p className="text-[#8E8E93]">Aucun logement de ce type pour le moment.</p>
          <button onClick={() => setFilter('TOUS')} className="mt-4 text-sm text-[#D4A843] hover:underline">
            Voir tous les logements
          </button>
        </div>
      )}
    </div>
  )
}

interface PhotoGalleryProps {
  photos: Photo[]
  nom: string
}

export function PhotoGallery({ photos, nom }: PhotoGalleryProps) {
  const [current, setCurrent] = useState(0)

  if (photos.length === 0) {
    return (
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#2C2C2E] border border-[#3A3A3C] flex items-center justify-center">
        <span className="text-[#D4A843]/40 font-heading text-xl">FFA Séjour</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Image principale */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#2C2C2E] border border-[#3A3A3C]">
        <Image
          src={photos[current].url}
          alt={photos[current].alt ?? `${nom} — photo ${current + 1}`}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 66vw"
          priority={current === 0}
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((c) => (c - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1C1C1E]/70 hover:bg-[#1C1C1E] text-[#EFEFEF] flex items-center justify-center transition-colors backdrop-blur-sm"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1C1C1E]/70 hover:bg-[#1C1C1E] text-[#EFEFEF] flex items-center justify-center transition-colors backdrop-blur-sm"
              aria-label="Photo suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="absolute bottom-3 right-3 text-xs px-2.5 py-1 rounded-full bg-[#1C1C1E]/70 text-[#EFEFEF] backdrop-blur-sm">
              {current + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      {/* Miniatures */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((ph, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? 'border-[#D4A843]' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              <Image
                src={ph.url}
                alt={ph.alt ?? `miniature ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
