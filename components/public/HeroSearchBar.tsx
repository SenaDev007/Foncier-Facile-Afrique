'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function HeroSearchBar() {
  const router = useRouter()
  const [quickType, setQuickType] = useState('ALL')
  const [quickLocalisation, setQuickLocalisation] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (quickType !== 'ALL') params.set('type', quickType)
    if (quickLocalisation.trim()) params.set('localisation', quickLocalisation.trim())
    router.push(`/catalogue${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl max-w-2xl">
      <p className="text-zinc-400 text-xs font-medium mb-3 uppercase tracking-wider">Recherche rapide</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={quickType}
          onChange={(e) => setQuickType(e.target.value)}
          className="h-12 px-4 rounded-xl bg-zinc-900/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/50 transition-all"
          aria-label="Type de bien"
        >
          <option value="ALL">Tous les types</option>
          <option value="TERRAIN">Terrain</option>
          <option value="MAISON">Maison</option>
          <option value="APPARTEMENT">Appartement</option>
          <option value="VILLA">Villa</option>
          <option value="BUREAU">Bureau</option>
          <option value="COMMERCE">Commerce</option>
        </select>
        <div className="relative flex-1">
          <input
            type="text"
            value={quickLocalisation}
            onChange={(e) => setQuickLocalisation(e.target.value)}
            placeholder="Ville ou quartier (ex: Cotonou, Parakou...)"
            className="w-full h-12 px-4 rounded-xl bg-zinc-900/50 border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D4A843]/50 transition-all"
            aria-label="Localisation"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#D4A843] text-zinc-950 font-bold text-sm hover:bg-[#B8912E] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#D4A843]/20"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Rechercher
        </button>
      </div>
    </div>
  )
}
