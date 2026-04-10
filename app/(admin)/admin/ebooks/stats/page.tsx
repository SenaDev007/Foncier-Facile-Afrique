import { adminPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TrendingUp, ShoppingBag, Download, Tag, ArrowLeft } from 'lucide-react'

export const metadata = adminPageMetadata({
  title: 'Statistiques ebooks — Admin FFA',
  pathname: '/admin/ebooks/stats',
  description: 'Ventes, téléchargements et performance des ebooks.',
})

export default async function EbookStatsPage() {
  const [commandes, ebooks] = await Promise.all([
    prisma.commandeEbook.findMany({
      include: { ebook: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.ebook.findMany({
      include: { _count: { select: { commandes: true } } },
    }),
  ])

  const payees = commandes.filter((c) => c.statut === 'PAYEE')
  const revenuTotal = payees.reduce((sum, c) => sum + c.montantPaye, 0)
  const dlTotal = payees.reduce((sum, c) => sum + c.downloadCount, 0)
  const tauxConversion =
    commandes.length > 0 ? Math.round((payees.length / commandes.length) * 100) : 0

  const stats = [
    {
      label: 'Revenus totaux',
      value: `${revenuTotal.toLocaleString('fr-FR')} FCFA`,
      icon: TrendingUp,
      color: '#D4A843',
    },
    {
      label: 'Ventes confirmées',
      value: payees.length,
      icon: ShoppingBag,
      color: '#34C759',
    },
    {
      label: 'Téléchargements',
      value: dlTotal,
      icon: Download,
      color: '#D4A843',
    },
    {
      label: 'Taux de conversion',
      value: `${tauxConversion}%`,
      icon: Tag,
      color: '#34C759',
    },
  ]

  const topEbooks = [...ebooks]
    .sort((a, b) => b._count.commandes - a._count.commandes)
    .slice(0, 5)

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/ebooks"
          className="p-2 text-[#8E8E93] hover:text-[#D4A843] rounded-lg transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Statistiques ebooks</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#8E8E93] text-xs font-medium uppercase tracking-wider">
                {s.label}
              </span>
              <div
                className="p-2 rounded-lg"
                style={{ background: `${s.color}20` }}
              >
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-[#EFEFEF] text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-6">
        <h2 className="text-[#EFEFEF] font-semibold mb-4">Top ebooks par ventes</h2>
        <div className="space-y-3">
          {topEbooks.map((e, i) => (
            <div
              key={e.id}
              className="flex items-center justify-between py-2 border-b border-[#3A3A3C] last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#D4A843] font-bold text-sm w-5">#{i + 1}</span>
                <span className="text-[#EFEFEF] text-sm">{e.titre}</span>
              </div>
              <span className="text-[#8E8E93] text-sm">{e._count.commandes} vente(s)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
