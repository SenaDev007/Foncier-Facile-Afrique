import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Star } from 'lucide-react'

export const metadata: Metadata = { title: 'Témoignages — Admin FFA' }

interface PageProps {
  searchParams: { statut?: string }
}

export default async function AdminTemoignagesPage({ searchParams }: PageProps) {

  const whereActif = searchParams.statut === 'actif' ? { actif: true } : searchParams.statut === 'inactif' ? { actif: false } : {}

  const [temoignages, total, totalActifs] = await Promise.all([
    prisma.temoignage.findMany({
      where: whereActif,
      orderBy: { ordre: 'asc' },
    }),
    prisma.temoignage.count(),
    prisma.temoignage.count({ where: { actif: true } }),
  ])

  const statutLinks = [
    { label: `Tous (${total})`, value: undefined },
    { label: `Actifs (${totalActifs})`, value: 'actif' },
    { label: `Inactifs (${total - totalActifs})`, value: 'inactif' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-dark">Témoignages</h1>
        <p className="text-grey text-sm mt-1">{total} témoignage{total > 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statutLinks.map(({ label, value }) => (
          <a
            key={label}
            href={value ? `/admin/temoignages?statut=${value}` : '/admin/temoignages'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${(searchParams.statut ?? undefined) === value ? 'bg-primary text-white' : 'bg-white text-grey hover:bg-primary-light hover:text-primary'}`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {temoignages.length === 0 && (
          <div className="col-span-2 bg-white rounded-xl p-12 text-center text-grey">Aucun témoignage.</div>
        )}
        {temoignages.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="font-semibold text-dark text-sm">{t.nom}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${t.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-grey'}`}>
                {t.actif ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <div className="flex gap-0.5 mb-2" aria-label={`Note : ${t.note}/5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < t.note ? 'fill-gold text-gold' : 'text-gray-300'}`} aria-hidden="true" />
              ))}
            </div>
            <p className="text-sm text-grey italic">&ldquo;{t.texte}&rdquo;</p>
            <p className="text-xs text-grey mt-3">{formatDate(t.createdAt.toISOString())}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
