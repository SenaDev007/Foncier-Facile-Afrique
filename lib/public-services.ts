import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'

/** Clé `Parametre` : cartes services (accueil + page /services), JSON tableau */
export const SERVICES_CARDS_PARAM_KEY = 'services_cards_json'

export type PublicServiceCard = {
  id: string
  title: string
  description: string
  image: string
  icon: string
  /** Affiché sur /services ; si absent, dérivé de la description */
  points?: string[]
}

export const DEFAULT_PUBLIC_SERVICE_CARDS: PublicServiceCard[] = [
  {
    id: 'conseil-foncier',
    title: 'Conseil foncier',
    description:
      'Accompagnement expert pour sécuriser vos acquisitions avec titre foncier officiel.',
    image: '/images/services/conseil-foncier.jpg',
    icon: 'Shield',
  },
  {
    id: 'verification-docs',
    title: 'Vérification documentaire',
    description: 'Contrôle rigoureux de tous les documents légaux avant toute transaction.',
    image: '/images/services/verification-docs.jpg',
    icon: 'FileCheck',
  },
  {
    id: 'recherche-terrain',
    title: 'Recherche terrain',
    description: 'Identification des meilleurs terrains selon vos critères et budget.',
    image: '/images/services/recherche-terrain.jpg',
    icon: 'Search',
  },
  {
    id: 'diaspora',
    title: 'Accompagnement diaspora',
    description:
      'Service dédié aux acheteurs de la diaspora africaine pour investir en toute confiance.',
    image: '/images/services/diaspora.jpg',
    icon: 'Users',
  },
]

function parseCardsJson(raw: string | null | undefined): PublicServiceCard[] | null {
  if (!raw?.trim()) return null
  try {
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr) || arr.length === 0) return null
    const out: PublicServiceCard[] = []
    for (const x of arr) {
      if (!x || typeof x !== 'object') continue
      const o = x as Record<string, unknown>
      if (typeof o.id !== 'string' || typeof o.title !== 'string' || typeof o.description !== 'string') continue
      if (typeof o.image !== 'string' || typeof o.icon !== 'string') continue
      const points = Array.isArray(o.points) ? o.points.filter((p): p is string => typeof p === 'string') : undefined
      out.push({
        id: o.id,
        title: o.title,
        description: o.description,
        image: o.image,
        icon: o.icon,
        points: points?.length ? points : undefined,
      })
    }
    return out.length ? out : null
  } catch {
    return null
  }
}

async function loadLegacyFile(): Promise<PublicServiceCard[] | null> {
  try {
    const path = join(process.cwd(), 'data', 'services.json')
    if (!existsSync(path)) return null
    const raw = await readFile(path, 'utf-8')
    return parseCardsJson(raw)
  } catch {
    return null
  }
}

/**
 * Source de vérité : Parametre `services_cards_json`, puis fichier legacy `data/services.json`, puis défauts.
 */
export async function getPublicServiceCards(): Promise<PublicServiceCard[]> {
  try {
    const row = await prisma.parametre.findUnique({ where: { cle: SERVICES_CARDS_PARAM_KEY } })
    const fromDb = parseCardsJson(row?.valeur ?? undefined)
    if (fromDb) return fromDb
  } catch (e) {
    console.error('[getPublicServiceCards] Prisma :', e)
  }
  const fromFile = await loadLegacyFile()
  if (fromFile) return fromFile
  return DEFAULT_PUBLIC_SERVICE_CARDS
}

/** Puces pour la page /services */
export function serviceCardPointsForPage(card: PublicServiceCard): string[] {
  if (card.points?.length) return card.points
  const parts = card.description
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4)
  if (parts.length) return parts
  return [card.description]
}
