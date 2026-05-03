import { prisma } from '@/lib/prisma'
import type { Lead, Message } from '@prisma/client'

export type DashboardStatsData = {
  annonces: number
  leads: number
  messages: number
  temoignages: number
  leadsThisMonth: number
  reservationsEnAttente: number
  dossiersOuverts: number
  chartLeads: Array<{ date: string; count: number }>
}

type LeadRecent = Lead & { annonce: { titre: string; reference: string } | null }

const emptyStats: DashboardStatsData = {
  annonces: 0,
  leads: 0,
  messages: 0,
  temoignages: 0,
  leadsThisMonth: 0,
  reservationsEnAttente: 0,
  dossiersOuverts: 0,
  chartLeads: [],
}

/**
 * Données tableau de bord : une seule vague de requêtes Prisma (compteurs + derniers leads/messages).
 */
export async function getDashboardPageData(): Promise<{
  stats: DashboardStatsData
  leads: LeadRecent[]
  messages: Message[]
  statsError: string | null
}> {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const [
      annonces,
      leads,
      messagesNonLus,
      temoignages,
      dossiersOuverts,
      leadsThisMonth,
      leadsRecent,
      messagesRecent,
      reservationsResult,
      leadsLastWeek,
    ] = await Promise.all([
      prisma.annonce.count({ where: { statut: 'EN_LIGNE' } }),
      prisma.lead.count(),
      prisma.message.count({ where: { lu: false } }),
      prisma.temoignage.count({ where: { actif: true } }),
      prisma.dossierFoncier.count({
        where: { deletedAt: null, statut: { not: 'TERMINE' } },
      }),
      prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { annonce: { select: { titre: true, reference: true } } },
      }),
      prisma.message.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.reservation.count({ where: { statut: 'EN_ATTENTE' } }).catch((e) => {
        console.error('[Dashboard] réservations :', e)
        return 0
      }),
      prisma.lead.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        select: { createdAt: true },
      }),
    ])

    // Group leads by date
    const chartDataMap = new Map<string, number>()
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      chartDataMap.set(d.toISOString().split('T')[0], 0)
    }
    leadsLastWeek.forEach((l) => {
      const key = l.createdAt.toISOString().split('T')[0]
      if (chartDataMap.has(key)) {
        chartDataMap.set(key, (chartDataMap.get(key) || 0) + 1)
      }
    })
    const chartLeads = Array.from(chartDataMap.entries()).map(([date, count]) => ({
      date: date.split('-').slice(1).reverse().join('/'),
      count,
    }))

    return {
      stats: {
        annonces,
        leads,
        messages: messagesNonLus,
        temoignages,
        leadsThisMonth,
        reservationsEnAttente: reservationsResult,
        dossiersOuverts,
        chartLeads,
      },
      leads: leadsRecent,
      messages: messagesRecent,
      statsError: null,
    }
  } catch (e) {
    console.error('[Dashboard] getDashboardPageData:', e)
    return {
      stats: emptyStats,
      leads: [],
      messages: [],
      statsError: 'Impossible de charger les statistiques (base injoignable ou erreur Prisma). Les compteurs affichés sont à zéro.',
    }
  }
}

export function formatLeadDisplayName(lead: Pick<Lead, 'prenom' | 'nom'>): string {
  const parts = [lead.prenom?.trim(), lead.nom?.trim()].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Sans nom'
}
