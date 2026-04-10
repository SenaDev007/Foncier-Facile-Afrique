import { adminPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil } from 'lucide-react'

export const metadata = adminPageMetadata({
  title: 'Logements séjour — Admin FFA',
  pathname: '/admin/logements',
  description: 'Gestion des hébergements courte durée (fiches, photos, disponibilité).',
})

const statutClass: Record<string, string> = {
  DISPONIBLE: 'bg-emerald-500/20 text-emerald-300',
  OCCUPE: 'bg-amber-500/20 text-amber-300',
  ARCHIVE: 'bg-[#3A3A3C] text-[#8E8E93]',
}

const typeLabel: Record<string, string> = {
  GUEST_HOUSE: 'Guest house',
  HOTEL: 'Hôtel',
  VILLA_VAC: 'Villa',
  APPARTEMENT: 'Appartement',
}

export default async function AdminLogementsPage() {
  const logements = await prisma.logement.findMany({
    where: { deletedAt: null },
    include: { photos: { orderBy: { ordre: 'asc' }, take: 1 } },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Logements séjour</h1>
          <p className="text-[#8E8E93] text-sm mt-1">{logements.length} logement{logements.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/logements/nouveau"
          className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#B8912E] transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau logement
        </Link>
      </div>

      <div className="rounded-xl border border-[#3A3A3C] overflow-hidden bg-[#2C2C2E]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3A3A3C] text-left text-[#8E8E93]">
                <th className="p-3 font-medium w-20">Visuel</th>
                <th className="p-3 font-medium">Référence</th>
                <th className="p-3 font-medium">Nom</th>
                <th className="p-3 font-medium">Ville</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Prix / nuit</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logements.map((l) => {
                const thumb = l.photos[0]
                return (
                  <tr key={l.id} className="border-b border-[#3A3A3C]/80 hover:bg-[#1C1C1E]/40">
                    <td className="p-2">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#1C1C1E] flex items-center justify-center">
                        {thumb?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb.url} alt={thumb.alt ?? l.nom} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-[#636366]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs text-[#D4A843]">{l.reference}</td>
                    <td className="p-3 text-[#EFEFEF] font-medium">{l.nom}</td>
                    <td className="p-3 text-[#8E8E93]">{l.ville}</td>
                    <td className="p-3 text-[#8E8E93]">{typeLabel[l.type] ?? l.type}</td>
                    <td className="p-3 text-[#EFEFEF]">{formatPrice(l.prixNuit)}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutClass[l.statut] ?? 'bg-[#3A3A3C] text-[#8E8E93]'}`}
                      >
                        {l.statut}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/sejour/${l.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#8E8E93] hover:text-[#D4A843]"
                        >
                          Voir fiche
                        </Link>
                        <Link
                          href={`/admin/logements/${l.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs text-[#D4A843] hover:underline"
                        >
                          <Pencil className="h-3 w-3" aria-hidden="true" /> Modifier
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {logements.length === 0 && (
          <p className="p-8 text-center text-[#8E8E93] text-sm">Aucun logement. Créez-en un pour alimenter le séjour.</p>
        )}
      </div>
    </div>
  )
}
