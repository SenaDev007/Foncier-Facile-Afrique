import type { Metadata } from 'next'

/** URL canonique du site (sans slash final). */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.foncierfacileafrique.fr').replace(/\/$/, '')
}

export function absUrl(pathname: string): string {
  const base = getSiteUrl()
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${base}${p}`
}

export function truncateMetaDescription(text: string, max = 160): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
}

/** Mots-clés transverses (complétés par page si besoin). */
export const coreKeywords = [
  'immobilier Bénin',
  'terrain Parakou',
  'foncier Afrique',
  'titre foncier',
  'Foncier Facile Afrique',
  'achat terrain Bénin',
  'investissement immobilier Afrique de l’Ouest',
]

/**
 * Métadonnées cohérentes : canonical, Open Graph, Twitter, robots.
 * Le layout racine applique le template `%s | Foncier Facile Afrique` sur `title` (sauf si vous passez `absoluteTitle`).
 */
export function publicPageMetadata(opts: {
  title: string
  description: string
  pathname: string
  keywords?: string[]
  /** URL absolue ou chemin commençant par / */
  ogImage?: string | null
  ogType?: 'website' | 'article'
  noindex?: boolean
  /** Titre complet sans template (ex. page d’accueil). */
  absoluteTitle?: string
  /** Open Graph article */
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[] }
}): Metadata {
  const desc = truncateMetaDescription(opts.description)
  const canonical = absUrl(opts.pathname)
  const ogImageUrl = resolveOgImageUrl(opts.ogImage)

  const titleMeta: Metadata['title'] = opts.absoluteTitle
    ? { absolute: opts.absoluteTitle }
    : opts.title

  const openGraph = {
    title: opts.absoluteTitle ?? opts.title,
    description: desc,
    url: canonical,
    siteName: 'Foncier Facile Afrique',
    locale: 'fr_FR',
    type: opts.ogType ?? 'website',
    images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    ...(opts.ogType === 'article' && opts.article
      ? {
          publishedTime: opts.article.publishedTime,
          modifiedTime: opts.article.modifiedTime,
          ...(opts.article.authors?.length ? { authors: opts.article.authors } : {}),
        }
      : {}),
  } as Metadata['openGraph']

  const keywords =
    opts.keywords?.length && opts.keywords.length > 0
      ? Array.from(new Set([...coreKeywords, ...opts.keywords]))
      : coreKeywords

  return {
    title: titleMeta,
    description: desc,
    keywords,
    alternates: { canonical },
    robots: opts.noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: opts.absoluteTitle ?? opts.title,
      description: desc,
      images: [ogImageUrl],
    },
  }
}

function resolveOgImageUrl(ogImage?: string | null): string {
  if (!ogImage) return absUrl('/images/og-default.jpg')
  if (ogImage.startsWith('http://') || ogImage.startsWith('https://')) return ogImage
  return absUrl(ogImage.startsWith('/') ? ogImage : `/${ogImage}`)
}

const ADMIN_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
}

/**
 * Métadonnées pages back-office : canonical, OG/Twitter (cohérence), toujours noindex.
 */
export function adminPageMetadata(opts: {
  title: string
  pathname: string
  description?: string
}): Metadata {
  const desc =
    opts.description ??
    'Espace réservé à l’équipe Foncier Facile Afrique — gestion du site, des annonces et des demandes clients.'
  const d = truncateMetaDescription(desc)
  const canonical = absUrl(opts.pathname)
  const og = absUrl('/images/og-default.jpg')
  return {
    title: opts.title,
    description: d,
    alternates: { canonical },
    robots: ADMIN_ROBOTS,
    openGraph: {
      title: opts.title,
      description: d,
      url: canonical,
      siteName: 'Foncier Facile Afrique',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: d,
      images: [og],
    },
  }
}

/** Métadonnées par défaut pour tout le segment (admin) : noindex + description de secours. */
export function adminSegmentDefaultMetadata(): Metadata {
  return {
    description: truncateMetaDescription(
      'Espace d’administration Foncier Facile Afrique — connexion sécurisée pour la gestion du site public.',
    ),
    robots: ADMIN_ROBOTS,
  }
}
