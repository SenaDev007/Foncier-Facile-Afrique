'use client'

import GlassmorphismTrustHero from '@/components/ui/glassmorphism-trust-hero'

type Props = {
  heroImageUrl?: string
  heroBadge?: string
  heroSousTitre?: string
  heroTitre?: string
  heroTexte?: string
  heroCtaAnnonces?: { texte: string; url: string }
  heroCtaContact?: { texte: string; url: string }
}

export function LandingHeroGlass({
  heroImageUrl,
  heroBadge,
  heroSousTitre,
  heroTitre,
  heroTexte,
  heroCtaAnnonces,
  heroCtaContact,
}: Props) {
  const title = heroTitre?.trim() || 'Achetez un terrain'
  return (
    <GlassmorphismTrustHero
      badge={heroBadge ?? 'Immobilier sécurisé'}
      subtitle={heroSousTitre ?? "Bénin · Afrique de l'Ouest"}
      title={title}
      highlighted="au Bénin en confiance"
      description={
        heroTexte ??
        "Foncier Facile Afrique vous accompagne dans l'acquisition de terrains et biens immobiliers avec titre foncier vérifié."
      }
      ctaPrimary={{ label: heroCtaAnnonces?.texte ?? 'Voir les annonces', href: heroCtaAnnonces?.url ?? '/annonces' }}
      ctaSecondary={{ label: heroCtaContact?.texte ?? 'Nous contacter', href: heroCtaContact?.url ?? '/contact' }}
      statMain={{ value: '200+', label: 'Clients accompagnés' }}
      statProgress={{ label: 'Satisfaction client', value: 98 }}
      statMini={[
        { value: '5+', label: 'Années' },
        { value: '24/7', label: 'Assistance' },
        { value: '100%', label: 'Vérifié' },
      ]}
      clients={[{ name: 'Diaspora Béninoise' }, { name: 'Investisseurs privés' }, { name: 'PME locales' }, { name: 'Familles' }]}
      backgroundImage={heroImageUrl ?? '/images/hero/hero-bg.jpg'}
    />
  )
}
