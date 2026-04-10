import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getPageSections, type SectionMap } from '@/lib/pages'
import { DEFAULT_PUBLIC_SERVICE_CARDS, getPublicServiceCards } from '@/lib/public-services'
import { getAccueilParametreCleList } from '@/lib/parametres-accueil'
import { getReviewAggregate } from '@/lib/reviews-stats'
import { LandingHeroGlass } from '@/components/public/LandingHeroGlass'
import { LandingAnnoncesNewsSection } from '@/components/public/LandingAnnoncesNewsSection'
import type { AnnonceCard as AnnonceCardModel } from '@/types'
import { LandingBlog3DSection } from '@/components/public/LandingBlog3DSection'
import ReviewsVerifiedSection from '@/components/public/ReviewsVerifiedSection'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { ArrowRight } from 'lucide-react'
import { LandingServicesFeatureSection } from '@/components/public/LandingServicesFeatureSection'
import { FourPolesSection } from '@/components/public/FourPolesSection'

export const metadata: Metadata = publicPageMetadata({
  absoluteTitle: 'Foncier Facile Afrique — Achetez un terrain sécurisé au Bénin',
  title: 'Accueil',
  description:
    "Foncier Facile Afrique vous accompagne dans l'acquisition de terrains et biens immobiliers avec titre foncier vérifié au Bénin et en Afrique de l'Ouest.",
  pathname: '/',
  keywords: ['acheter terrain Bénin', 'immobilier sécurisé Afrique de l’Ouest'],
})

async function getHomeData() {
  try {
    const [annonces, temoignages, reviewStats, blogPosts, params, homeSections, services] = await Promise.all([
      prisma.annonce.findMany({
        where: { statut: 'EN_LIGNE' },
        include: { photos: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.temoignage.findMany({
        where: { actif: true },
        orderBy: [{ ordre: 'asc' }, { createdAt: 'desc' }],
        take: 24,
      }),
      getReviewAggregate(prisma),
      prisma.blogPost.findMany({
        where: { statut: 'PUBLIE' },
        include: { auteur: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.parametre.findMany({
        where: { cle: { in: getAccueilParametreCleList() } },
      }),
      getPageSections('home'),
      getPublicServiceCards(),
    ])
    const paramMap: Record<string, string> = {}
    params.forEach((p) => { paramMap[p.cle] = p.valeur })
    const getNum = (key: string, def: number) => {
      const v = paramMap[key]
      if (v === undefined || v === '') return def
      const n = parseInt(v, 10)
      return Number.isNaN(n) ? def : n
    }
    return {
      annonces,
      temoignages,
      reviewStats,
      blogPosts,
      heroImage: paramMap.hero_image,
      heroImageMobile: paramMap.hero_image_mobile,
      chiffreClients: getNum('chiffre_clients', 500),
      chiffreSatisfaction: getNum('chiffre_satisfaction', 98),
      chiffreAnnees: getNum('chiffre_annees', 10),
      chiffreTransactions: getNum('chiffre_transactions', 1000),
      chiffreAnneesTexte: getNum('chiffre_annees_texte', 5),
      homeSections: homeSections ?? {},
      services,
    }
  } catch (err) {
    console.error('[Accueil] Erreur chargement données:', err)
    return {
      annonces: [],
      temoignages: [],
      reviewStats: {
        average: 5,
        total: 0,
        distributionDesc: [0, 0, 0, 0, 0] as [number, number, number, number, number],
      },
      blogPosts: [],
      heroImage: undefined,
      heroImageMobile: undefined,
      chiffreClients: 500,
      chiffreSatisfaction: 98,
      chiffreAnnees: 10,
      chiffreTransactions: 1000,
      chiffreAnneesTexte: 5,
      homeSections: {},
      services: DEFAULT_PUBLIC_SERVICE_CARDS,
    }
  }
}

export default async function AccueilPage() {
  const {
    annonces,
    temoignages,
    reviewStats,
    blogPosts,
    heroImage,
    heroImageMobile,
    chiffreClients,
    chiffreSatisfaction,
    chiffreAnnees,
    chiffreTransactions,
    chiffreAnneesTexte,
    homeSections,
    services,
  } = await getHomeData()

  const s = (key: string) => (homeSections as SectionMap)[key]
  const hero = {
    badge: s('hero_badge')?.titre,
    sousTitre: s('hero_sous_titre')?.sousTitre,
    titre: s('hero_titre')?.titre,
    texte: s('hero_texte')?.bodyHtml,
    ctaAnnonces: s('hero_cta_annonces'),
    ctaContact: s('hero_cta_contact'),
  }
  const chiffresIntro = { titre: s('chiffres_intro')?.titre, sousTitre: s('chiffres_intro')?.sousTitre }
  const servicesIntro = { titre: s('services_intro')?.titre, sousTitre: s('services_intro')?.sousTitre, body: s('services_intro')?.bodyHtml }
  const annoncesIntro = { titre: s('annonces_intro')?.titre, sousTitre: s('annonces_intro')?.sousTitre, body: s('annonces_intro')?.bodyHtml }
  const blogIntro = { titre: s('blog_intro')?.titre, sousTitre: s('blog_intro')?.sousTitre, body: s('blog_intro')?.bodyHtml }
  const avisIntro = {
    titre: s('avis_clients')?.titre,
    sousTitre: s('avis_clients')?.sousTitre,
    bodyHtml: s('avis_clients')?.bodyHtml,
  }

  return (
    <>
      <LandingHeroGlass
        heroImageUrl={heroImage ?? undefined}
        heroBadge={hero.badge ?? undefined}
        heroSousTitre={hero.sousTitre ?? undefined}
        heroTitre={hero.titre ?? undefined}
        heroTexte={hero.texte ?? undefined}
        heroCtaAnnonces={hero.ctaAnnonces?.boutonTexte ? { texte: hero.ctaAnnonces.boutonTexte, url: hero.ctaAnnonces.boutonUrl ?? '/annonces' } : undefined}
        heroCtaContact={hero.ctaContact?.boutonTexte ? { texte: hero.ctaContact.boutonTexte, url: hero.ctaContact.boutonUrl ?? '/contact' } : undefined}
      />

      {/* Section Chiffres Clés avec compteurs animés */}
      <section className="bg-[#161618] py-14 md:py-16 border-y border-[#2C2C2E]">
        <div className="container-site">
          <AnimateOnScroll delay={0}>
            <p className="text-center text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Chiffres clés
            </p>
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3">
              {chiffresIntro.titre ?? 'Notre impact en quelques chiffres'}
            </h2>
            <p className="text-center text-[#8E8E93] text-lg max-w-2xl mx-auto">
              {chiffresIntro.sousTitre ?? `Plus de ${chiffreAnneesTexte} ans d'expertise au service de votre patrimoine immobilier`}
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-10 md:mt-12">
            <AnimatedCounter target={chiffreClients} suffix="+" label="Clients accompagnés" duration={2000} />
            <AnimatedCounter target={chiffreSatisfaction} suffix="%" label="Taux de satisfaction" duration={1800} />
            <AnimatedCounter target={chiffreAnnees} suffix="+" label="Années d'expérience" duration={1500} />
            <AnimatedCounter target={chiffreTransactions} suffix="+" label="Transactions sécurisées" duration={2200} />
          </div>
        </div>
      </section>

      <FourPolesSection />

      <section className="py-14 md:py-16 bg-[#1C1C1E]" aria-labelledby="services-title">
        <div className="container-site">
          <AnimateOnScroll delay={0}>
            <div className="text-center mb-10">
              <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                {servicesIntro.sousTitre ?? 'Ce que nous proposons'}
              </p>
              <h2 id="services-title" className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3">
                {servicesIntro.titre ?? 'Nos services'}
              </h2>
              <p className="text-[#8E8E93] text-lg max-w-2xl mx-auto">
                {servicesIntro.body ?? 'Une gamme complète de services pour sécuriser votre patrimoine immobilier.'}
              </p>
            </div>
          </AnimateOnScroll>
          
          <LandingServicesFeatureSection services={services} />
          
          <AnimateOnScroll delay={0.8}>
            <div className="text-center mt-6">
              <Link href="/services" className="inline-flex items-center gap-1.5 text-[#D4A843] font-medium hover:text-[#B8912E] text-sm">
                Découvrir tous nos services <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Espacement avant annonces */}
      <div className="h-8 md:h-10" />

      {annonces.length > 0 && (
        <section className="py-14 md:py-16 bg-[#161618] border-t border-[#2C2C2E]" aria-labelledby="annonces-title">
          <div className="container-site">
            <AnimateOnScroll delay={0}>
              <div className="text-center mb-10">
                <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                  {annoncesIntro.sousTitre ?? 'À la une'}
                </p>
                <h2 id="annonces-title" className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3">
                  {annoncesIntro.titre ?? 'Dernières annonces'}
                </h2>
                <p className="text-[#8E8E93] text-lg max-w-2xl mx-auto">
                  {annoncesIntro.body ?? 'Terrains et biens immobiliers sécurisés disponibles'}
                </p>
              </div>
            </AnimateOnScroll>
            
            <LandingAnnoncesNewsSection annonces={annonces as AnnonceCardModel[]} />
          </div>
        </section>
      )}

      {/* Espacement avant témoignages */}
      <div className="h-8 md:h-10" />

      <ReviewsVerifiedSection temoignages={temoignages} stats={reviewStats} intro={avisIntro} />

      {/* Espacement avant blog */}
      <div className="h-8 md:h-10" />

      {blogPosts.length > 0 && (
        <section className="py-14 md:py-16 bg-[#161618] border-t border-[#2C2C2E] blog-section" aria-labelledby="blog-title">
          <div className="container-site">
            <div className="text-center mb-10">
              <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                {blogIntro.sousTitre ?? 'Ressources'}
              </p>
              <h2 id="blog-title" className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3">
                {blogIntro.titre ?? 'Blog & Conseils'}
              </h2>
              <p className="text-[#8E8E93] text-lg max-w-2xl mx-auto">
                {blogIntro.body ?? 'Expertise foncière et immobilière en Afrique'}
              </p>
            </div>

            <LandingBlog3DSection posts={blogPosts as import('@/types').BlogPostWithAuthor[]} />
          </div>
        </section>
      )}
    </>
  )
}
