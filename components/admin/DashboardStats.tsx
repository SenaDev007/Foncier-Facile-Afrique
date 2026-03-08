import { TrendingUp, Home, Users, MessageSquare } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function getStats() {
  const [annonces, leads, messages, temoignages] = await Promise.all([
    prisma.annonce.count({ where: { statut: 'EN_LIGNE' } }),
    prisma.lead.count(),
    prisma.message.count({ where: { lu: false } }),
    prisma.temoignage.count({ where: { actif: true } }),
  ])
  const leadsThisMonth = await prisma.lead.count({
    where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
  })
  return { annonces, leads, messages, temoignages, leadsThisMonth }
}

export default async function DashboardStats() {
  const stats = await getStats()

  const cards = [
    {
      title: 'Annonces en ligne',
      value: stats.annonces,
      icon: Home,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      title: 'Total leads',
      value: stats.leads,
      icon: Users,
      color: 'bg-green-50 text-green-600',
      border: 'border-green-100',
      sub: `+${stats.leadsThisMonth} ce mois`,
    },
    {
      title: 'Messages non lus',
      value: stats.messages,
      icon: MessageSquare,
      color: 'bg-orange-50 text-orange-600',
      border: 'border-orange-100',
    },
    {
      title: 'Témoignages approuvés',
      value: stats.temoignages,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div key={card.title} className={`bg-white rounded-xl border ${card.border} p-5 flex items-center gap-4`}>
          <div className={`p-3 rounded-xl ${card.color}`}>
            <card.icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-grey text-sm">{card.title}</p>
            <p className="font-heading font-bold text-dark text-2xl mt-0.5">{card.value}</p>
            {card.sub && <p className="text-xs text-green-600 mt-0.5">{card.sub}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
