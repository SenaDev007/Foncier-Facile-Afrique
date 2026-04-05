import Link from 'next/link'
import { TrendingUp, Home, Users, MessageSquare, CalendarClock, FolderOpen } from 'lucide-react'
import type { DashboardStatsData } from '@/lib/admin-dashboard'

type Props = {
  stats: DashboardStatsData
}

export default function DashboardStats({ stats }: Props) {
  const cards: {
    title: string
    value: number
    icon: typeof Home
    color: string
    border: string
    sub?: string
    href?: string
    linkLabel?: string
  }[] = [
    {
      title: 'Annonces en ligne',
      value: stats.annonces,
      icon: Home,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      href: '/admin/annonces',
      linkLabel: 'Gérer les annonces',
    },
    {
      title: 'Réservations à confirmer',
      value: stats.reservationsEnAttente,
      icon: CalendarClock,
      color: 'bg-violet-50 text-violet-700',
      border: 'border-violet-200',
      href: '/admin/reservations',
      linkLabel: 'Voir les réservations',
    },
    {
      title: 'Dossiers fonciers ouverts',
      value: stats.dossiersOuverts,
      icon: FolderOpen,
      color: 'bg-amber-50 text-amber-800',
      border: 'border-amber-200',
      href: '/admin/dossiers',
      linkLabel: 'Voir les dossiers',
    },
    {
      title: 'Total leads',
      value: stats.leads,
      icon: Users,
      color: 'bg-green-50 text-green-600',
      border: 'border-green-100',
      sub: `+${stats.leadsThisMonth} ce mois`,
      href: '/admin/leads',
      linkLabel: 'CRM leads',
    },
    {
      title: 'Messages non lus',
      value: stats.messages,
      icon: MessageSquare,
      color: 'bg-orange-50 text-orange-600',
      border: 'border-orange-100',
      href: '/admin/messages',
      linkLabel: 'Boîte de réception',
    },
    {
      title: 'Témoignages approuvés',
      value: stats.temoignages,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
      href: '/admin/temoignages',
      linkLabel: 'Modération',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {cards.map((card) => (
        <div key={card.title} className={`bg-[#2C2C2E] border ${card.border} rounded-xl p-5 flex items-center gap-4`}>
          <div className={`p-3 rounded-xl ${card.color}`}>
            <card.icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[#8E8E93] text-sm">{card.title}</p>
            <p className="font-heading font-bold text-[#EFEFEF] text-2xl mt-0.5">{card.value}</p>
            {card.sub && <p className="text-xs text-green-600 mt-0.5">{card.sub}</p>}
            {card.href && (
              <Link href={card.href} className="text-xs text-[#D4A843] hover:underline mt-1 inline-block">
                {card.linkLabel ?? 'Ouvrir'}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
