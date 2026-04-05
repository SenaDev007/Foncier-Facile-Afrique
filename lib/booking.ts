import { randomBytes } from 'crypto'
import type { PrismaClient } from '@prisma/client'

type DbReservation = Pick<PrismaClient, 'reservation'>

/** Réservations qui bloquent le calendrier (chevauchement de dates). */
const STATUTS_BLOQUANTS = ['EN_ATTENTE', 'CONFIRMEE', 'EN_COURS'] as const

/** Nombre de nuits entre deux dates (min. 1). */
export function computeNights(dateArrivee: Date, dateDepart: Date): number {
  const ms = dateDepart.getTime() - dateArrivee.getTime()
  const n = Math.ceil(ms / 86_400_000)
  return Math.max(1, n)
}

export function generateReservationReference(): string {
  return `RESA-${Date.now().toString(36).toUpperCase()}`
}

export function generateReservationPaymentToken(): string {
  return randomBytes(24).toString('base64url')
}

/**
 * Vérifie l’absence de chevauchement avec d’autres réservations actives.
 * Intervalles [arrivée, départ) : le jour de départ libère le logement pour une nouvelle arrivée le même jour.
 */
export async function isLogementAvailable(
  db: DbReservation,
  logementId: string,
  dateArrivee: Date,
  dateDepart: Date,
  excludeReservationId?: string
): Promise<boolean> {
  const conflict = await db.reservation.findFirst({
    where: {
      logementId,
      statut: { in: [...STATUTS_BLOQUANTS] },
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
      dateArrivee: { lt: dateDepart },
      dateDepart: { gt: dateArrivee },
    },
    select: { id: true },
  })
  return !conflict
}
