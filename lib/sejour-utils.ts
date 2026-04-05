import type { StatutLogement } from '@prisma/client'

/** Ordre d’affichage sur /sejour : disponibles d’abord. */
export const ORDRE_STATUT_LOGEMENT: Record<StatutLogement, number> = {
  DISPONIBLE: 0,
  OCCUPE: 1,
  ARCHIVE: 2,
}

export function libelleStatutLogementPublic(statut: StatutLogement): string {
  switch (statut) {
    case 'DISPONIBLE':
      return 'Disponible'
    case 'OCCUPE':
      return 'Non disponible'
    case 'ARCHIVE':
      return 'Archivé'
  }
}

export function messageIndisponibiliteLogement(statut: StatutLogement): string {
  switch (statut) {
    case 'DISPONIBLE':
      return ''
    case 'OCCUPE':
      return 'Ce logement n’est pas disponible à la réservation pour le moment.'
    case 'ARCHIVE':
      return 'Ce logement n’est plus proposé à la location.'
  }
}
