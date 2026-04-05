import type { Metadata } from 'next'
import { Suspense } from 'react'
import DashboardStats from '@/components/admin/DashboardStats'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { MessageSquare, User, ExternalLink } from 'lucide-react'

export const metadata: Metadata = { title: 'Tableau de bord — Admin FFA' }

async function getRecentActivity() {
  try {
    const [leads, messages] = await Promise.all([
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { annonce: { select: { titre: true, reference: true } } },
      }),
      prisma.message.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])
    return { leads, messages }
  } catch (err) {
    console.error('[Admin Dashboard] getRecentActivity:', err)
    return { leads: [], messages: [] }
  }
}

export default async function DashboardPage() {
  const { leads, messages } = await getRecentActivity()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Tableau de bord</h1>
        <p className="text-[#8E8E93] text-sm mt-1">Vue d&apos;ensemble de l&apos;activité</p>
      </div>

      <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-[#EFEFEF] text-sm">Derniers leads</h2>
            <Link href="/admin/leads" className="text-xs text-[#D4A843] hover:underline flex items-center gap-1">
              Voir tout <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-3">
            {leads.length === 0 && <p className="text-[#8E8E93] text-sm">Aucun lead.</p>}
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#3A3A3C]">
                <div className="p-1.5 rounded-lg bg-[rgba(212,168,67,0.12)] flex-shrink-0">
                  <User className="h-4 w-4 text-[#D4A843]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#EFEFEF] truncate">{lead.nom}</p>
                  {lead.annonce && <p className="text-xs text-[#8E8E93] truncate">{lead.annonce.titre}</p>}
                  <p className="text-xs text-[#8E8E93]">{formatDate(lead.createdAt.toISOString())}</p>
                </div>
                <span className={`ml-auto flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${lead.statut === 'NOUVEAU' ? 'bg-blue-500/20 text-blue-300' : lead.statut === 'CONTACTE' ? 'bg-[rgba(212,168,67,0.2)] text-[#D4A843]' : 'bg-emerald-500/20 text-emerald-300'}`}>
                  {lead.statut}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-[#EFEFEF] text-sm">Derniers messages</h2>
            <Link href="/admin/messages" className="text-xs text-[#D4A843] hover:underline flex items-center gap-1">
              Voir tout <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-3">
            {messages.length === 0 && <p className="text-[#8E8E93] text-sm">Aucun message.</p>}
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#3A3A3C]">
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${msg.lu ? 'bg-[#3A3A3C]' : 'bg-[rgba(212,168,67,0.12)]'}`}>
                  <MessageSquare className={`h-4 w-4 ${msg.lu ? 'text-[#8E8E93]' : 'text-[#D4A843]'}`} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#EFEFEF] truncate">{msg.nom}</p>
                  <p className="text-xs text-[#8E8E93] truncate">{msg.sujet ?? msg.contenu.slice(0, 50)}</p>
                  <p className="text-xs text-[#8E8E93]">{formatDate(msg.createdAt.toISOString())}</p>
                </div>
                {!msg.lu && <span className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-[#D4A843] mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
