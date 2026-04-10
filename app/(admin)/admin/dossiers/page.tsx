import { adminPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata = adminPageMetadata({
  title: 'Dossiers fonciers — Admin FFA',
  pathname: '/admin/dossiers',
  description: 'Suivi des dossiers de régularisation foncière et missions clients.',
})

const statutClass: Record<string, string> = {
  DIAGNOSTIC: 'bg-blue-500/20 text-blue-300',
  EN_COURS: 'bg-amber-500/20 text-amber-300',
  ATTENTE_ADMIN: 'bg-purple-500/20 text-purple-300',
  TERMINE: 'bg-emerald-500/20 text-emerald-300',
  SUSPENDU: 'bg-red-500/20 text-red-300',
}

const statutLabel: Record<string, string> = {
  DIAGNOSTIC: 'Diagnostic',
  EN_COURS: 'En cours',
  ATTENTE_ADMIN: 'Attente admin',
  TERMINE: 'Terminé',
  SUSPENDU: 'Suspendu',
}

export default async function AdminDossiersPage() {
  const dossiers = await prisma.dossierFoncier.findMany({
    where: { deletedAt: null },
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 200,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Dossiers fonciers</h1>
          <p className="text-[#8E8E93] text-sm mt-1">{dossiers.length} dossier{dossiers.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/dossiers/nouveau"
          className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#B8912E] transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau dossier
        </Link>
      </div>

      <div className="rounded-xl border border-[#3A3A3C] overflow-hidden bg-[#2C2C2E]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3A3A3C] text-left text-[#8E8E93]">
                <th className="p-3 font-medium">Référence</th>
                <th className="p-3 font-medium">Client</th>
                <th className="p-3 font-medium">Ville</th>
                <th className="p-3 font-medium">Étape</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium">Agent</th>
                <th className="p-3 font-medium">MàJ</th>
                <th className="p-3 font-medium w-24"></th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((d) => (
                <tr key={d.id} className="border-b border-[#3A3A3C]/80 hover:bg-[#1C1C1E]/40">
                  <td className="p-3 font-mono text-xs text-[#D4A843]">{d.reference}</td>
                  <td className="p-3">
                    <div className="text-[#EFEFEF] font-medium">{d.nomClient}</div>
                    <div className="text-xs text-[#8E8E93]">{d.emailClient}</div>
                  </td>
                  <td className="p-3 text-[#8E8E93]">{d.ville}</td>
                  <td className="p-3 text-[#8E8E93]">
                    {d.etapeActuelle} / {d.etapeMax}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutClass[d.statut] ?? 'bg-[#3A3A3C]'}`}
                    >
                      {statutLabel[d.statut] ?? d.statut}
                    </span>
                  </td>
                  <td className="p-3 text-[#8E8E93] text-xs">{d.user?.name ?? '—'}</td>
                  <td className="p-3 text-[#636366] text-xs whitespace-nowrap">{formatDate(d.updatedAt.toISOString())}</td>
                  <td className="p-3">
                    <Link href={`/admin/dossiers/${d.id}`} className="text-xs text-[#D4A843] hover:underline font-medium">
                      Détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dossiers.length === 0 && (
          <p className="p-8 text-center text-[#8E8E93] text-sm">
            Aucun dossier. Utilisez « Nouveau dossier » pour en créer un.
          </p>
        )}
      </div>
    </div>
  )
}
