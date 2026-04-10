import { adminPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export const metadata = adminPageMetadata({
  title: 'Commandes ebooks — Admin FFA',
  pathname: '/admin/ebooks/commandes',
  description: 'Historique des commandes et statuts de paiement ebooks.',
})

const statutColors: Record<string, string> = {
  EN_ATTENTE: 'bg-[#3A3A3C] text-[#8E8E93]',
  PAYEE: 'bg-[rgba(52,199,89,0.15)] text-[#34C759]',
  EXPIREE: 'bg-[#3A3A3C] text-[#636366]',
  REMBOURSEE: 'bg-[rgba(255,69,58,0.15)] text-[#FF453A]',
}

export default async function AdminEbooksCommandesPage() {
  const commandes = await prisma.commandeEbook.findMany({
    include: { ebook: { select: { titre: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/ebooks"
          className="p-2 text-[#8E8E93] hover:text-[#D4A843] rounded-lg transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Commandes ebooks</h1>
          <p className="text-[#8E8E93] text-sm mt-1">{commandes.length} commande(s)</p>
        </div>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3A3C]">
              <th className="text-left px-5 py-4 text-xs font-semibold text-[#D4A843] uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-[#D4A843] uppercase tracking-wider">
                Ebook
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-[#D4A843] uppercase tracking-wider">
                Acheteur
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-[#D4A843] uppercase tracking-wider">
                Montant
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-[#D4A843] uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[#3A3A3C] hover:bg-[#3A3A3C]/50 transition-colors"
              >
                <td className="px-5 py-4 text-[#8E8E93]">{formatDate(c.createdAt.toISOString())}</td>
                <td className="px-5 py-4">
                  <p className="text-[#EFEFEF] font-medium text-sm">{c.ebook.titre}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-[#EFEFEF] text-sm">{c.acheteurNom}</p>
                  <p className="text-[#8E8E93] text-xs">{c.acheteurEmail}</p>
                </td>
                <td className="px-5 py-4 text-[#D4A843] font-semibold">
                  {c.montantPaye.toLocaleString('fr-FR')} FCFA
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statutColors[c.statut] ?? 'bg-[#3A3A3C] text-[#8E8E93]'
                    }`}
                  >
                    {c.statut.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {commandes.length === 0 && (
          <div className="text-center py-16 text-[#636366]">Aucune commande.</div>
        )}
      </div>
    </div>
  )
}
