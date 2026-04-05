import type { StatutLead } from '@prisma/client'

export const LEAD_STATUTS: StatutLead[] = [
  'NOUVEAU',
  'CONTACTE',
  'EN_NEGOCIATION',
  'GAGNE',
  'PERDU',
]

export const LEAD_STATUT_LABELS: Record<StatutLead, string> = {
  NOUVEAU: 'Nouveau',
  CONTACTE: 'Contacté',
  EN_NEGOCIATION: 'En négociation',
  GAGNE: 'Gagné',
  PERDU: 'Perdu',
}

export const INTERACTION_TYPES = [
  'APPEL',
  'EMAIL',
  'WHATSAPP',
  'VISITE',
  'PROPOSITION',
  'AUTRE',
] as const

export type InteractionType = (typeof INTERACTION_TYPES)[number]

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  APPEL: 'Appel',
  EMAIL: 'E-mail',
  WHATSAPP: 'WhatsApp',
  VISITE: 'Visite',
  PROPOSITION: 'Proposition',
  AUTRE: 'Autre',
}
