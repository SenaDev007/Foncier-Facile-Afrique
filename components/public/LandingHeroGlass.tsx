'use client'

import GlassmorphismTrustHero from '@/components/ui/glassmorphism-trust-hero'

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Retire la ligne type « 200+ clients satisfaits · … » (CMS / ancien contenu). */
function cleanHeroSubtitle(raw?: string): string {
  const t = raw?.trim() ?? ''
  if (!t) return ''
  if (/200\s*\+/i.test(t) && /clients?\s+satisfaits?/i.test(t)) return ''
  if (/documents?\s+vérifiés?/i.test(t) && /5\s*ans/i.test(t)) return ''
  return t
}

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
  const subtitleClean = cleanHeroSubtitle(heroSousTitre)
  const subtitle = subtitleClean || "Bénin · Afrique de l'Ouest"
  const defaultDesc =
    "Foncier Facile Afrique vous accompagne dans l'acquisition de terrains et biens immobiliers avec titre foncier vérifié, de Parakou à tout le Bénin."
  const description = heroTexte ? stripHtml(heroTexte) || defaultDesc : defaultDesc
  return (
    <GlassmorphismTrustHero
      badge={heroBadge ?? ''}
      subtitle={subtitle}
      title={title}
      highlighted="en confiance"
      description={description}
      ctaPrimary={{ label: heroCtaAnnonces?.texte ?? 'Voir les annonces', href: heroCtaAnnonces?.url ?? '/annonces' }}
      ctaSecondary={{ label: heroCtaContact?.texte ?? 'Nous contacter', href: heroCtaContact?.url ?? '/contact' }}
      statMain={{ value: '200+', label: 'Clients accompagnés' }}
      statProgress={{ label: 'Satisfaction client', value: 98 }}
      statMini={[
        { value: '5+', label: 'Années' },
        { value: '24/7', label: 'Assistance' },
        { value: '100%', label: 'vérifiés' },
      ]}
      clients={[{ name: 'Diaspora Béninoise' }, { name: 'Investisseurs privés' }, { name: 'PME locales' }, { name: 'Familles' }]}
      backgroundImage={heroImageUrl ?? '/images/hero/hero-bg.jpg'}
    />
  )
}
