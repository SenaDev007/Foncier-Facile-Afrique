import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/public/HeroSection'
import AnnonceCard from '@/components/public/AnnonceCard'
import BlogCard from '@/components/public/BlogCard'
import TestimonialsCarousel from '@/components/public/TestimonialsCarousel'
import LeadMagnetBanner from '@/components/public/LeadMagnetBanner'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight } from 'lucide-react'
import ServiceCard from '@/components/public/ServiceCard'

// Type pour les services
interface ServiceItem {
  id: string
  title: string
  description: string
  image: string
  icon: 'Shield' | 'FileCheck' | 'Search' | 'Users'
}

export const metadata: Metadata = {
  title: 'Foncier Facile Afrique — Achetez un terrain sécurisé au Bénin',
  description: 'Foncier Facile Afrique vous accompagne dans l\'acquisition de terrains et biens immobiliers avec titre foncier vérifié au Bénin et en Afrique de l\'Ouest.',
  openGraph: {
    title: 'Foncier Facile Afrique — Achetez un terrain sécurisé au Bénin',
    description: 'Votre partenaire de confiance pour l\'immobilier sécurisé en Afrique de l\'Ouest.',
    url: 'https://www.foncierfacileafrique.fr',
    siteName: 'Foncier Facile Afrique',
    type: 'website',
  },
}

async function getHomeData() {
  try {
    const [annonces, temoignages, blogPosts, params] = await Promise.all([
      prisma.annonce.findMany({
        where: { statut: 'EN_LIGNE' },
        include: { photos: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.temoignage.findMany({
        where: { actif: true },
        orderBy: { ordre: 'asc' },
        take: 6,
      }),
      prisma.blogPost.findMany({
        where: { statut: 'PUBLIE' },
        include: { auteur: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.parametre.findMany({
        where: {
          cle: {
            in: [
              'hero_image',
              'hero_image_mobile',
              'chiffre_clients',
              'chiffre_satisfaction',
              'chiffre_annees',
              'chiffre_transactions',
              'chiffre_annees_texte',
            ],
          },
        },
      }),
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
      blogPosts,
      heroImage: paramMap.hero_image,
      heroImageMobile: paramMap.hero_image_mobile,
      chiffreClients: getNum('chiffre_clients', 500),
      chiffreSatisfaction: getNum('chiffre_satisfaction', 98),
      chiffreAnnees: getNum('chiffre_annees', 10),
      chiffreTransactions: getNum('chiffre_transactions', 1000),
      chiffreAnneesTexte: getNum('chiffre_annees_texte', 5),
    }
  } catch (err) {
    console.error('[Accueil] Erreur chargement données:', err)
    return {
      annonces: [],
      temoignages: [],
      blogPosts: [],
      heroImage: undefined,
      heroImageMobile: undefined,
      chiffreClients: 500,
      chiffreSatisfaction: 98,
      chiffreAnnees: 10,
      chiffreTransactions: 1000,
      chiffreAnneesTexte: 5,
    }
  }
}

// Services : chargés depuis data/services.json (éditable dans le backoffice) ou valeurs par défaut
const DEFAULT_SERVICES: ServiceItem[] = [
  { id: 'conseil-foncier', title: 'Conseil foncier', description: 'Accompagnement expert pour sécuriser vos acquisitions avec titre foncier officiel.', image: '/images/services/conseil-foncier.jpg', icon: 'Shield' },
  { id: 'verification-docs', title: 'Vérification documentaire', description: 'Contrôle rigoureux de tous les documents légaux avant toute transaction.', image: '/images/services/verification-docs.jpg', icon: 'FileCheck' },
  { id: 'recherche-terrain', title: 'Recherche terrain', description: 'Identification des meilleurs terrains selon vos critères et budget.', image: '/images/services/recherche-terrain.jpg', icon: 'Search' },
  { id: 'diaspora', title: 'Accompagnement diaspora', description: 'Service dédié aux acheteurs de la diaspora africaine pour investir en toute confiance.', image: '/images/services/diaspora.jpg', icon: 'Users' },
]

const getServices = async (): Promise<ServiceItem[]> => {
  try {
    const path = join(process.cwd(), 'data', 'services.json')
    if (existsSync(path)) {
      const raw = await readFile(path, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as ServiceItem[]
    }
  } catch {
    // ignore
  }
  return DEFAULT_SERVICES
}

export default async function AccueilPage() {
  const {
    annonces,
    temoignages,
    blogPosts,
    heroImage,
    heroImageMobile,
    chiffreClients,
    chiffreSatisfaction,
    chiffreAnnees,
    chiffreTransactions,
    chiffreAnneesTexte,
  } = await getHomeData()
  const services = await getServices()

  return (
    <>
      <HeroSection heroImageUrl={heroImage} heroImageMobileUrl={heroImageMobile} />

      {/* Section Chiffres Clés avec compteurs animés */}
      <section className="bg-[#161618] py-14 md:py-16 border-y border-[#2C2C2E]">
        <div className="container-site">
          <AnimateOnScroll delay={0}>
            <p className="text-center text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Chiffres clés
            </p>
            <h2 className="text-center font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3">
              Notre impact en quelques chiffres
            </h2>
            <p className="text-center text-[#8E8E93] text-lg max-w-2xl mx-auto">
              Plus de {chiffreAnneesTexte} ans d&apos;expertise au service de votre patrimoine immobilier
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

      <section className="py-14 md:py-16 bg-[#1C1C1E]" aria-labelledby="services-title">
        <div className="container-site">
          <AnimateOnScroll delay={0}>
            <div className="text-center mb-10">
              <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                Ce que nous proposons
              </p>
              <h2 id="services-title" className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3">
                Nos services
              </h2>
              <p className="text-[#8E8E93] text-lg max-w-2xl mx-auto">
                Une gamme complète de services pour sécuriser votre patrimoine immobilier.
              </p>
            </div>
          </AnimateOnScroll>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {services.map((service: ServiceItem, index: number) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                description={service.description}
                image={service.image}
                index={index}
              />
            ))}
          </div>
          
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
                  À la une
                </p>
                <h2 id="annonces-title" className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3">
                  Dernières annonces
                </h2>
                <p className="text-[#8E8E93] text-lg max-w-2xl mx-auto">
                  Terrains et biens immobiliers sécurisés disponibles
                </p>
              </div>
            </AnimateOnScroll>
            
            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-72 rounded-xl"/>)}</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {annonces.map((annonce, index) => (
                  <AnimateOnScroll key={annonce.id} delay={index * 0.1} direction="up">
                    <AnnonceCard annonce={annonce as Parameters<typeof AnnonceCard>[0]['annonce']} />
                  </AnimateOnScroll>
                ))}
              </div>
            </Suspense>
            
            <AnimateOnScroll delay={0.6}>
              <div className="text-center mt-6 sm:hidden">
                <Link href="/annonces" className="inline-flex items-center gap-1.5 text-[#D4A843] font-medium text-sm hover:text-[#B8912E]">
                  Voir toutes les annonces <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* Espacement avant témoignages */}
      <div className="h-8 md:h-10" />

      {temoignages.length > 0 && (
        <TestimonialsCarousel temoignages={temoignages as Parameters<typeof TestimonialsCarousel>[0]['temoignages']} />
      )}

      <LeadMagnetBanner />

      {/* Espacement avant blog */}
      <div className="h-8 md:h-10" />

      {blogPosts.length > 0 && (
        <section className="py-14 md:py-16 bg-[#161618] border-t border-[#2C2C2E] blog-section" aria-labelledby="blog-title">
          <div className="container-site">
            <div className="text-center mb-10">
              <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                Ressources
              </p>
              <h2 id="blog-title" className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3">
                Blog & Conseils
              </h2>
              <p className="text-[#8E8E93] text-lg max-w-2xl mx-auto">
                Expertise foncière et immobilière en Afrique
              </p>
            </div>
            
            {/* Conteneur de défilement horizontal */}
            <div className="relative overflow-hidden">
              <div className="flex gap-6 animate-scroll">
                {/* Dupliquer les cartes pour un défilement infini */}
                {[...blogPosts, ...blogPosts].map((post, index) => (
                  <div key={`${post.id}-${index}`} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
                    <BlogCard post={post as Parameters<typeof BlogCard>[0]['post']} index={index} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-[#D4A843] font-medium text-sm hover:text-[#B8912E]">
                Voir tous les articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
