/** Nombre de nuits entre deux dates (min. 1). */
export function computeNights(dateArrivee: Date, dateDepart: Date): number {
  const ms = dateDepart.getTime() - dateArrivee.getTime()
  const n = Math.ceil(ms / 86_400_000)
  return Math.max(1, n)
}

export function generateReservationReference(): string {
  return `RESA-${Date.now().toString(36).toUpperCase()}`
}
