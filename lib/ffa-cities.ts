/** Villes autorisées pour les pages SEO (spec PDF §4.3). */
export const FFA_SEO_CITIES = [
  'cotonou',
  'abomey-calavi',
  'porto-novo',
  'parakou',
] as const

export type FfaSeoCitySlug = (typeof FFA_SEO_CITIES)[number]

const CITY_SEARCH_TERMS: Record<FfaSeoCitySlug, string[]> = {
  cotonou: ['Cotonou'],
  'abomey-calavi': ['Abomey-Calavi', 'Calavi', 'Abomey'],
  'porto-novo': ['Porto-Novo', 'Porto Novo'],
  parakou: ['Parakou'],
}

export function isFfaSeoCitySlug(s: string): s is FfaSeoCitySlug {
  return (FFA_SEO_CITIES as readonly string[]).includes(s)
}

export function getCitySearchTerms(slug: FfaSeoCitySlug): string[] {
  return CITY_SEARCH_TERMS[slug]
}

export function citySlugToTitle(slug: FfaSeoCitySlug): string {
  switch (slug) {
    case 'cotonou':
      return 'Cotonou'
    case 'abomey-calavi':
      return 'Abomey-Calavi'
    case 'porto-novo':
      return 'Porto-Novo'
    case 'parakou':
      return 'Parakou'
    default:
      return slug
  }
}
