'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ANNONCE_DOCUMENT_OPTIONS } from '@/lib/annonce-constants'

const TYPES = [
  { value: 'ALL', label: 'Tous les types' },
  { value: 'TERRAIN', label: 'Terrain' },
  { value: 'APPARTEMENT', label: 'Appartement' },
  { value: 'MAISON', label: 'Maison' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'BUREAU', label: 'Bureau' },
  { value: 'COMMERCE', label: 'Commerce' },
]

const PRIX_MAX = [
  { value: '', label: 'Prix max' },
  { value: '5000000', label: '5 000 000 FCFA' },
  { value: '10000000', label: '10 000 000 FCFA' },
  { value: '25000000', label: '25 000 000 FCFA' },
  { value: '50000000', label: '50 000 000 FCFA' },
  { value: '100000000', label: '100 000 000 FCFA' },
]

const SURFACE_MIN = [
  { value: '', label: 'Surface min' },
  { value: '100', label: '100 m²' },
  { value: '250', label: '250 m²' },
  { value: '500', label: '500 m²' },
  { value: '1000', label: '1 000 m²' },
  { value: '5000', label: '5 000 m²' },
]

const SORT = [
  { value: 'createdAt_desc', label: 'Plus récent' },
  { value: 'prix_asc', label: 'Prix croissant' },
  { value: 'prix_desc', label: 'Prix décroissant' },
  { value: 'surface_desc', label: 'Surface décroissante' },
]

function parseDocuments(param: string | null): string[] {
  if (!param) return []
  return param.split(',').filter(Boolean)
}

export default function AnnonceFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const listingBase = pathname.startsWith('/catalogue') ? '/catalogue' : '/annonces'

  const [localisation, setLocalisation] = useState(searchParams.get('localisation') ?? '')
  const [type, setType] = useState(searchParams.get('type') ?? 'ALL')
  const [prixMax, setPrixMax] = useState(searchParams.get('prixMax') ?? '')
  const [surfaceMin, setSurfaceMin] = useState(searchParams.get('surfaceMin') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'createdAt_desc')
  const documentsParam = searchParams.get('documents') ?? ''
  const [documents, setDocuments] = useState<string[]>(() => parseDocuments(documentsParam))

  const toggleDocument = useCallback((doc: string) => {
    setDocuments((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    )
  }, [])

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (localisation) params.set('localisation', localisation)
    if (type && type !== 'ALL') params.set('type', type)
    if (prixMax) params.set('prixMax', prixMax)
    if (surfaceMin) params.set('surfaceMin', surfaceMin)
    if (sort) params.set('sort', sort)
    if (documents.length > 0) params.set('documents', documents.join(','))
    params.set('page', '1')
    router.push(`${listingBase}?${params.toString()}`)
  }, [localisation, type, prixMax, surfaceMin, sort, documents, router, listingBase])

  const resetFilters = useCallback(() => {
    setLocalisation('')
    setType('ALL')
    setPrixMax('')
    setSurfaceMin('')
    setSort('createdAt_desc')
    setDocuments([])
    router.push(listingBase)
  }, [router, listingBase])

  const hasActiveFilters = localisation || type !== 'ALL' || prixMax || surfaceMin || documents.length > 0

  return (
    <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#EFEFEF] font-semibold text-sm">
          <SlidersHorizontal className="h-4 w-4 text-[#D4A843]" aria-hidden="true" />
          Filtres
        </div>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-[#8E8E93] hover:text-red-400 transition-colors">
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
          <Input
            placeholder="Localisation..."
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="pl-9 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
            aria-label="Filtrer par localisation"
          />
        </div>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger aria-label="Type de bien" className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93] [&>svg]:text-[#8E8E93]">
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={prixMax} onValueChange={setPrixMax}>
          <SelectTrigger aria-label="Prix maximum" className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93] [&>svg]:text-[#8E8E93]">
            <SelectValue placeholder="Prix max" />
          </SelectTrigger>
          <SelectContent>
            {PRIX_MAX.map((p) => (
              <SelectItem key={p.value || 'all'} value={p.value || 'all'}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={surfaceMin} onValueChange={setSurfaceMin}>
          <SelectTrigger aria-label="Surface minimum" className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93] [&>svg]:text-[#8E8E93]">
            <SelectValue placeholder="Surface min" />
          </SelectTrigger>
          <SelectContent>
            {SURFACE_MIN.map((s) => (
              <SelectItem key={s.value || 'all'} value={s.value || 'all'}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger aria-label="Tri" className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93] [&>svg]:text-[#8E8E93]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            {SORT.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <span className="text-xs text-[#8E8E93]">Documents :</span>
        {ANNONCE_DOCUMENT_OPTIONS.map((d) => (
          <label
            key={d.value}
            className="flex items-center gap-2 text-sm text-[#EFEFEF] cursor-pointer"
          >
            <Checkbox
              checked={documents.includes(d.value)}
              onCheckedChange={() => toggleDocument(d.value)}
              className="border-[#3A3A3C] data-[state=checked]:bg-[#D4A843] data-[state=checked]:border-[#D4A843]"
            />
            {d.label}
          </label>
        ))}
      </div>

      <Button onClick={applyFilters} className="mt-4 w-full sm:w-auto" aria-label="Appliquer les filtres">
        <Search className="h-4 w-4" aria-hidden="true" />
        Rechercher
      </Button>
    </div>
  )
}
