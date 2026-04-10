import { adminPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { LeadsKanban } from '@/components/admin/LeadsKanban'

export const metadata = adminPageMetadata({
  title: 'Leads — Admin FFA',
  pathname: '/admin/leads',
  description: 'Pipeline commercial : prospects, statuts et relances.',
})

interface PageProps {
  searchParams: { page?: string; statut?: string; vue?: string }
}

const ITEMS_PER_PAGE = 20
const KANBAN_MAX = 200
const STATUTS = ['NOUVEAU', 'CONTACTE', 'EN_NEGOCIATION', 'GAGNE', 'PERDU'] as const

function buildLeadsHref(
  current: { statut?: string; vue?: string },
  updates: Partial<{ vue: 'kanban' | null; statut: string | null; page: string | null }>
) {
  const p = new URLSearchParams()
  const vue = updates.vue !== undefined ? updates.vue : current.vue === 'kanban' ? 'kanban' : null
  if (vue === 'kanban') p.set('vue', 'kanban')
  const st =
    updates.statut !== undefined ? updates.statut : current.statut && current.statut.length > 0 ? current.statut : null
  if (st) p.set('statut', st)
  const pg = updates.page !== undefined ? updates.page : null
  if (pg && pg !== '1') p.set('page', pg)
  const qs = p.toString()
  return qs ? `/admin/leads?${qs}` : '/admin/leads'
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const isKanban = searchParams.vue === 'kanban'
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const skip = (page - 1) * ITEMS_PER_PAGE

  const where = {
    ...(searchParams.statut
      ? { statut: searchParams.statut as (typeof STATUTS)[number] }
      : {}),
  }

  const currentQ = { statut: searchParams.statut, vue: searchParams.vue }

  const [leads, total] = await Promise.all([
    isKanban
      ? prisma.lead.findMany({
          where,
          include: { annonce: { select: { titre: true, reference: true } } },
          orderBy: { createdAt: 'desc' },
          take: KANBAN_MAX,
        })
      : prisma.lead.findMany({
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
    NOUVEAU: 'bg-blue-500/20 text-blue-300',
    CONTACTE: 'bg-[rgba(212,168,67,0.2)] text-[#D4A843]',
    EN_NEGOCIATION: 'bg-purple-500/20 text-purple-300',
    GAGNE: 'bg-emerald-500/20 text-emerald-300',
    PERDU: 'bg-red-500/20 text-red-300',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Leads</h1>
        <p className="text-[#8E8E93] text-sm mt-1">{total} lead{total > 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-[#3A3A3C] overflow-hidden p-0.5 bg-[#1C1C1E]">
          <Link
            href={buildLeadsHref(currentQ, { vue: null, page: null })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${!isKanban ? 'bg-[#D4A843] text-[#1C1C1E]' : 'text-[#8E8E93] hover:text-[#EFEFEF]'}`}
          >
            Liste
          </Link>
          <Link
            href={buildLeadsHref(currentQ, { vue: 'kanban', page: null })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isKanban ? 'bg-[#D4A843] text-[#1C1C1E]' : 'text-[#8E8E93] hover:text-[#EFEFEF]'}`}
          >
            Kanban
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildLeadsHref(currentQ, { statut: null, page: null })}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!searchParams.statut ? 'bg-[#D4A843] text-[#1C1C1E]' : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[rgba(212,168,67,0.12)] hover:text-[#D4A843]'}`}
        >
          Tous
        </Link>
        {STATUTS.map((s) => (
          <Link
            key={s}
            href={buildLeadsHref(currentQ, { statut: s, page: null })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${searchParams.statut === s ? 'bg-[#D4A843] text-[#1C1C1E]' : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[rgba(212,168,67,0.12)] hover:text-[#D4A843]'}`}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {isKanban && total > KANBAN_MAX && (
        <p className="text-xs text-amber-400/90">
          Affichage des {KANBAN_MAX} leads les plus récents sur {total} au total. Filtrez par statut ou utilisez la vue
          liste pour parcourir tout le CRM.
        </p>
      )}

      {isKanban ? (
        <LeadsKanban
          leads={leads.map((l) => ({
            ...l,
            createdAt: l.createdAt,
          }))}
        />
      ) : (
      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3A3C]">
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium">Contact</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden md:table-cell">Annonce</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium">Statut</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden md:table-cell">Budget</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden lg:table-cell">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-[#8E8E93]">Aucun lead.</td></tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[#3A3A3C] hover:bg-[#3A3A3C] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#EFEFEF]">
                    {lead.prenom} {lead.nom}
                  </p>
                  <p className="text-xs text-[#8E8E93]">{lead.email}</p>
                  {lead.telephone && <p className="text-xs text-[#8E8E93]">{lead.telephone}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {lead.annonce ? (
                    <div>
                      <p className="text-[#EFEFEF] truncate max-w-[180px]">{lead.annonce.titre}</p>
                      <p className="text-xs text-[#8E8E93]">{lead.annonce.reference}</p>
                    </div>
                  ) : <span className="text-[#8E8E93]">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutColors[lead.statut] ?? ''}`}>
                    {lead.statut.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#8E8E93] hidden md:table-cell">
                  {lead.budget ?? '—'}
                </td>
                <td className="px-4 py-3 text-[#8E8E93] hidden lg:table-cell">{formatDate(lead.createdAt.toISOString())}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="text-xs text-[#D4A843] font-medium hover:underline">Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {!isKanban && totalPages > 1 && (
        <nav className="flex justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildLeadsHref(currentQ, { page: String(p) })}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-[#D4A843] text-[#1C1C1E]' : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[#3A3A3C]'}`}
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
