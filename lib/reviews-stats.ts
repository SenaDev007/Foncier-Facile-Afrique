import type { PrismaClient } from '@prisma/client'

export type ReviewAggregate = {
  /** Moyenne sur tous les témoignages actifs */
  average: number
  total: number
  /** Nombre d’avis par note, ordre [5★, 4★, 3★, 2★, 1★] */
  distributionDesc: [number, number, number, number, number]
}

export async function getReviewAggregate(prisma: PrismaClient): Promise<ReviewAggregate> {
  let agg: { _avg: { note: number | null }; _count: { id: number } }
  let groups: Array<{ note: number; _count: { id: number } }>
  try {
    ;[agg, groups] = await Promise.all([
      prisma.temoignage.aggregate({
        where: { actif: true },
        _avg: { note: true },
        _count: { id: true },
      }),
      prisma.temoignage.groupBy({
        by: ['note'],
        where: { actif: true },
        _count: { id: true },
      }),
    ])
  } catch (error) {
    console.error('[getReviewAggregate] Prisma indisponible', error)
    return { average: 5, total: 0, distributionDesc: [0, 0, 0, 0, 0] }
  }

  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const g of groups) {
    if (g.note >= 1 && g.note <= 5) dist[g.note] = g._count.id
  }
  const distributionDesc: [number, number, number, number, number] = [
    dist[5],
    dist[4],
    dist[3],
    dist[2],
    dist[1],
  ]

  const total = agg._count.id
  const rawAvg = agg._avg.note
  const average =
    total === 0 ? 0 : rawAvg != null ? Math.round(rawAvg * 10) / 10 : 5

  return {
    average,
    total,
    distributionDesc,
  }
}

/** Libellé type plateforme d’avis (sans reprendre une marque tierce). */
export function reviewQualityLabel(avg: number): string {
  if (avg >= 4.5) return 'Excellent'
  if (avg >= 4) return 'Très bien'
  if (avg >= 3.5) return 'Bien'
  if (avg >= 3) return 'Correct'
  return 'À améliorer'
}
