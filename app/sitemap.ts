import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { FFA_SEO_CITIES } from '@/lib/ffa-cities'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.foncierfacileafrique.fr').replace(/\/$/, '')
  const now = new Date()

  const staticPaths = [
    '',
    '/catalogue',
    '/confier',
    '/sejour',
    '/regularisation',
    '/services',
    '/annonces',
    '/blog',
    '/ebooks',
    '/contact',
    '/politique-confidentialite',
    '/mentions-legales',
  ]

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: path === '' ? `${base}/` : `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  const [annonces, posts, logements, ebooks] = await Promise.all([
    prisma.annonce.findMany({
      where: { statut: 'EN_LIGNE' },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { statut: 'PUBLIE' },
      select: { slug: true, updatedAt: true },
    }),
    prisma.logement.findMany({
      where: { deletedAt: null, statut: 'DISPONIBLE' },
      select: { id: true, updatedAt: true },
    }),
    prisma.ebook.findMany({
      where: { publie: true },
      select: { slug: true, updatedAt: true },
    }),
  ])

  for (const a of annonces) {
    entries.push({
      url: `${base}/annonces/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  }
  for (const p of posts) {
    entries.push({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.65,
    })
  }
  for (const l of logements) {
    entries.push({
      url: `${base}/sejour/${l.id}`,
      lastModified: l.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }
  for (const e of ebooks) {
    entries.push({
      url: `${base}/ebooks/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.65,
    })
  }
  for (const ville of FFA_SEO_CITIES) {
    entries.push({
      url: `${base}/${ville}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    })
  }

  return entries
}
