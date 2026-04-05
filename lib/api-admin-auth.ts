import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

/** Aligné sur le middleware : paramètres globaux, services, utilisateurs. */
export const ROLES_MANAGERS = ['SUPER_ADMIN', 'ADMIN'] as const

/** Blog, pages CMS, ebooks (contenu éditorial). */
export const ROLES_CONTENT = ['SUPER_ADMIN', 'ADMIN', 'EDITEUR'] as const

/** Aligné sur POST /api/annonces. */
export const ROLES_ANNONCES = ['SUPER_ADMIN', 'ADMIN'] as const

/** Leads et messages (CRM). */
export const ROLES_CRM = ['SUPER_ADMIN', 'ADMIN', 'AGENT'] as const

/** Logements séjour & réservations (terrain commercial / admin). */
export const ROLES_SEJOUR = ['SUPER_ADMIN', 'ADMIN', 'AGENT'] as const

/** Dossiers de régularisation foncière (équipe terrain + direction). */
export const ROLES_DOSSIERS = ['SUPER_ADMIN', 'ADMIN', 'AGENT'] as const

/** Témoignages : toute l’équipe éditoriale / terrain. */
export const ROLES_TEMOIGNAGES = ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'EDITEUR'] as const

/** Tout compte pouvant se connecter au backoffice (évite d’exclure un rôle sur des écrans non filtrés par le middleware). */
export const ROLES_STAFF = ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'EDITEUR'] as const

export async function requireAdmin(allowedRoles: readonly string[]) {
  const session = await auth()
  if (!session?.user) {
    return { ok: false as const, response: NextResponse.json({ error: 'Non autorisé' }, { status: 401 }) }
  }
  if (!allowedRoles.includes(session.user.role)) {
    return { ok: false as const, response: NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 }) }
  }
  return { ok: true as const, session }
}
