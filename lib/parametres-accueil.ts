/**
 * Clés `Parametre` consommées par `app/(public)/page.tsx` (accueil).
 * À garder aligné avec les champs du back-office Paramètres.
 */
export const PARAMETRES_HERO_KEYS = ['hero_image', 'hero_image_mobile'] as const

/** Compteurs animés + sous-titre « Plus de X ans d'expertise… » */
export const PARAMETRES_CHIFFRES_CLES_KEYS = [
  'chiffre_clients',
  'chiffre_satisfaction',
  'chiffre_annees',
  'chiffre_transactions',
  'chiffre_annees_texte',
] as const

export function getAccueilParametreCleList(): string[] {
  return [...PARAMETRES_HERO_KEYS, ...PARAMETRES_CHIFFRES_CLES_KEYS]
}
