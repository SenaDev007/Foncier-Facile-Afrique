import { getSiteUrl, absUrl } from '@/lib/seo'

/**
 * Données structurées Schema.org (Organization + WebSite) pour le référencement.
 */
export default function SiteJsonLd() {
  const site = getSiteUrl()
  const logo = absUrl('/images/logo/logo FFA 1.png')

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Foncier Facile Afrique',
    url: site,
    logo: { '@type': 'ImageObject', url: logo },
    description:
      'Accompagnement pour l’acquisition de terrains et biens immobiliers juridiquement sécurisés au Bénin et en Afrique de l’Ouest.',
    areaServed: { '@type': 'Country', name: 'Bénin' },
    sameAs: [] as string[],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Foncier Facile Afrique',
    url: site,
    publisher: { '@type': 'Organization', name: 'Foncier Facile Afrique', url: site },
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site}/catalogue?localisation={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  )
}
