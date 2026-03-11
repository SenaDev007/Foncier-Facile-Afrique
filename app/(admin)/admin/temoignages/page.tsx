import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Star } from 'lucide-react'
import { TemoignageToggle } from '@/components/admin/TemoignageToggle'

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
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Témoignages</h1>
        <p className="text-[#8E8E93] text-sm mt-1">{total} témoignage{total > 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statutLinks.map(({ label, value }) => (
          <Link
            key={label}
            href={value ? `/admin/temoignages?statut=${value}` : '/admin/temoignages'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${(searchParams.statut ?? undefined) === value ? 'bg-[#D4A843] text-[#1C1C1E]' : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[rgba(212,168,67,0.12)] hover:text-[#D4A843]'}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {temoignages.length === 0 && (
          <div className="col-span-2 bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-12 text-center text-[#8E8E93]">Aucun témoignage.</div>
        )}
        {temoignages.map((t) => (
          <div key={t.id} className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="font-semibold text-[#EFEFEF] text-sm">{t.nom}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/temoignages/${t.id}/edit`} className="text-xs text-[#D4A843] font-medium hover:underline">Modifier</Link>
                <TemoignageToggle id={t.id} actif={t.actif} />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.actif ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#3A3A3C] text-[#8E8E93]'}`}>
                  {t.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2" aria-label={`Note : ${t.note}/5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < t.note ? 'fill-[#D4A843] text-[#D4A843]' : 'text-[#3A3A3C]'}`} aria-hidden="true" />
              ))}
            </div>
            <p className="text-sm text-[#8E8E93] italic">&ldquo;{t.texte}&rdquo;</p>
            <p className="text-xs text-[#636366] mt-3">{formatDate(t.createdAt.toISOString())}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
