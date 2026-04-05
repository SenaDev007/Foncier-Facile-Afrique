import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.foncierfacileafrique.fr').replace(/\/$/, '')
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/ebooks/merci', '/sejour/paiement/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
