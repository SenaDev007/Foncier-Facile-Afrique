'use client'

import Link from 'next/link'
import { NewsCards, type NewsCard } from '@/components/ui/news-cards'
import { formatPrice } from '@/lib/utils'
import type { AnnonceCard } from '@/types'

function toRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const diffMs = Date.now() - d.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'Publié récemment'
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `Il y a ${days}j`
  const months = Math.floor(days / 30)
  return `Il y a ${months} mois`
}

export function LandingAnnoncesNewsSection({ annonces }: { annonces: AnnonceCard[] }) {
  if (!annonces.length) return null

  const cards: NewsCard[] = annonces.map((a) => {
    const mainPhoto = a.photos?.length ? [...a.photos].sort((x, y) => x.ordre - y.ordre)[0] : null
    return {
      id: a.id,
      title: a.titre,
      category: a.type,
      subcategory: formatPrice(a.prix),
      timeAgo: toRelativeTime(a.createdAt),
      location: a.localisation,
      image: mainPhoto?.url ?? '/images/annonces/terrain.jpg',
      content: [
        `Référence: ${a.reference}`,
        `Surface: ${a.surface ? `${a.surface} m²` : 'N/A'}`,
        `Localisation: ${a.localisation}`,
      ],
    }
  })

  return (
    <div className="space-y-6">
      <NewsCards newsCards={cards} title="Dernières annonces" subtitle="Sélection de biens publiés depuis le back-office" />
      <div className="text-center">
        <Link
          href="/annonces"
          className="inline-flex items-center gap-2 rounded-full border border-[#D4A843]/35 bg-[#D4A843]/10 px-5 py-2 text-sm text-[#D4A843] hover:bg-[#D4A843]/20"
        >
          Voir toutes les annonces
        </Link>
      </div>
    </div>
  )
}
