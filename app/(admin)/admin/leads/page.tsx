import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Leads — Admin FFA' }

interface PageProps {
  searchParams: { page?: string; statut?: string }
}

const ITEMS_PER_PAGE = 20
const STATUTS = ['NOUVEAU', 'CONTACTE', 'EN_NEGOCIATION', 'GAGNE', 'PERDU']

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const skip = (page - 1) * ITEMS_PER_PAGE

  const where = {
    ...(searchParams.statut ? { statut: searchParams.statut as 'NOUVEAU' | 'CONTACTE' | 'EN_NEGOCIATION' | 'GAGNE' | 'PERDU' } : {}),
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { annonce: { select: { titre: true, reference: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.lead.count({ where }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const statutColors: Record<string, string> = {
    NOUVEAU: 'bg-blue-100 text-blue-700',
    CONTACTE: 'bg-yellow-100 text-yellow-700',
    EN_NEGOCIATION: 'bg-purple-100 text-purple-700',
    GAGNE: 'bg-green-100 text-green-700',
    PERDU: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-dark">Leads</h1>
        <p className="text-grey text-sm mt-1">{total} lead{total > 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/leads" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!searchParams.statut ? 'bg-primary text-white' : 'bg-white text-grey hover:bg-primary-light hover:text-primary'}`}>
          Tous
        </Link>
        {STATUTS.map((s) => (
          <Link
            key={s}
            href={`/admin/leads?statut=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${searchParams.statut === s ? 'bg-primary text-white' : 'bg-white text-grey hover:bg-primary-light hover:text-primary'}`}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-grey font-medium">Contact</th>
              <th className="text-left px-4 py-3 text-grey font-medium hidden md:table-cell">Annonce</th>
              <th className="text-left px-4 py-3 text-grey font-medium">Statut</th>
              <th className="text-left px-4 py-3 text-grey font-medium hidden md:table-cell">Budget</th>
              <th className="text-left px-4 py-3 text-grey font-medium hidden lg:table-cell">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-grey">Aucun lead.</td></tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-dark">{lead.nom}</p>
                  <p className="text-xs text-grey">{lead.email}</p>
                  {lead.telephone && <p className="text-xs text-grey">{lead.telephone}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {lead.annonce ? (
                    <div>
                      <p className="text-dark truncate max-w-[180px]">{lead.annonce.titre}</p>
                      <p className="text-xs text-grey">{lead.annonce.reference}</p>
                    </div>
                  ) : <span className="text-grey">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutColors[lead.statut] ?? ''}`}>
                    {lead.statut.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-grey hidden md:table-cell">
                  {lead.budget ?? '—'}
                </td>
                <td className="px-4 py-3 text-grey hidden lg:table-cell">{formatDate(lead.createdAt.toISOString())}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="text-xs text-primary font-medium hover:underline">Voir</Link>
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
              href={`/admin/leads?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'bg-white text-grey hover:bg-primary-light'}`}
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
