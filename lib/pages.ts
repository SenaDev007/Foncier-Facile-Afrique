import { prisma } from '@/lib/prisma'

export type SectionMap = Record<string, { titre?: string | null; sousTitre?: string | null; bodyHtml?: string | null; imageUrl?: string | null; boutonTexte?: string | null; boutonUrl?: string | null; contenuJson?: string | null }>

/** Récupère les sections actives d'une page par slug, indexées par key */
export async function getPageSections(slug: string): Promise<SectionMap> {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { actif: true },
          orderBy: { ordre: 'asc' },
        },
      },
    })
    if (!page) return {} as SectionMap
    const map: SectionMap = {}
    for (const s of page.sections) {
      map[s.key] = {
        titre: s.titre,
        sousTitre: s.sousTitre,
        bodyHtml: s.bodyHtml,
        imageUrl: s.imageUrl,
        boutonTexte: s.boutonTexte,
        boutonUrl: s.boutonUrl,
        contenuJson: s.contenuJson,
      }
    }
    return map
  } catch (error) {
    console.error(`[getPageSections] Prisma indisponible (slug: ${slug})`, error)
    return {} as SectionMap
  }
}

/** Liste toutes les pages avec le nombre de sections (pour l'admin) */
export async function getAllPages() {
  return prisma.page.findMany({
    include: { _count: { select: { sections: true } } },
    orderBy: { slug: 'asc' },
  })
}

/** Récupère une page par slug avec toutes ses sections (pour l'admin) */
export async function getPageBySlugWithSections(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { ordre: 'asc' } } },
  })
}
