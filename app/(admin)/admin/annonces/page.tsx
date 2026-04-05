import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, getStatutLabel, getStatutColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, ExternalLink } from 'lucide-react'

export const metadata: Metadata = { title: 'Annonces — Admin FFA' }

interface PageProps {
  searchParams: { page?: string; statut?: string; type?: string }
}

const ITEMS_PER_PAGE = 15

export default async function AdminAnnoncesPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const skip = (page - 1) * ITEMS_PER_PAGE

  const where = {
    ...(searchParams.statut ? { statut: searchParams.statut as 'BROUILLON' | 'EN_LIGNE' | 'RESERVE' | 'VENDU' | 'ARCHIVE' } : {}),
    ...(searchParams.type ? { type: searchParams.type as 'TERRAIN' | 'APPARTEMENT' | 'MAISON' | 'VILLA' | 'BUREAU' | 'COMMERCE' } : {}),
  }

  const [annonces, total] = await Promise.all([
    prisma.annonce.findMany({
      where,
      include: { photos: { take: 1 } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.annonce.count({ where }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Annonces</h1>
          <p className="text-[#8E8E93] text-sm mt-1">{total} annonce{total > 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/annonces/new" className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#B8912E] transition-colors">
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouvelle annonce
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {[undefined, 'BROUILLON', 'EN_LIGNE', 'RESERVE', 'VENDU', 'ARCHIVE'].map((s) => (
          <Link
            key={s ?? 'all'}
            href={s ? `/admin/annonces?statut=${s}` : '/admin/annonces'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${(searchParams.statut ?? undefined) === s ? 'bg-[#D4A843] text-[#1C1C1E]' : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[rgba(212,168,67,0.12)] hover:text-[#D4A843]'}`}
          >
            {s ?? 'Toutes'}
          </Link>
        ))}
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3A3C]">
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium">Titre</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden lg:table-cell">Prix</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium">Statut</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden lg:table-cell">Vues</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden md:table-cell">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {annonces.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-[#8E8E93]">Aucune annonce trouvée.</td></tr>
            )}
            {annonces.map((a) => (
              <tr key={a.id} className="border-b border-[#3A3A3C] hover:bg-[#3A3A3C] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#EFEFEF] truncate max-w-[200px]">{a.titre}</p>
                  <p className="text-xs text-[#8E8E93]">{a.reference}</p>
                </td>
                <td className="px-4 py-3 text-[#8E8E93] hidden md:table-cell">{a.type}</td>
                <td className="px-4 py-3 text-[#8E8E93] hidden lg:table-cell">{formatPrice(a.prix)}</td>
                <td className="px-4 py-3">
                  <Badge className={getStatutColor(a.statut)}>{getStatutLabel(a.statut)}</Badge>
                </td>
                <td className="px-4 py-3 text-[#8E8E93] hidden lg:table-cell">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden="true" />{a.vues}</span>
                </td>
                <td className="px-4 py-3 text-[#8E8E93] hidden md:table-cell">{formatDate(a.createdAt.toISOString())}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 items-start">
                    <Link href={`/admin/annonces/${a.id}/edit`} className="text-xs text-[#D4A843] font-medium hover:underline">Modifier</Link>
                    {a.statut === 'EN_LIGNE' && (
                      <a
                        href={`/annonces/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#8E8E93] hover:text-[#D4A843] inline-flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        Site public
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/annonces?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-[#D4A843] text-[#EFEFEF]' : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[rgba(212,168,67,0.12)]'}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
