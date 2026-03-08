import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/public/HeroSection'
import AnnonceCard from '@/components/public/AnnonceCard'
import BlogCard from '@/components/public/BlogCard'
import TestimonialsCarousel from '@/components/public/TestimonialsCarousel'
import LeadMagnetBanner from '@/components/public/LeadMagnetBanner'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight, Shield, MapPin, FileCheck, Users } from 'lucide-react'

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
  const [annonces, temoignages, blogPosts] = await Promise.all([
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
  ])
  return { annonces, temoignages, blogPosts }
}

const services = [
  { icon: Shield, title: 'Conseil foncier', description: 'Accompagnement expert pour sécuriser vos acquisitions avec titre foncier officiel.' },
  { icon: FileCheck, title: 'Vérification documentaire', description: 'Contrôle rigoureux de tous les documents légaux avant toute transaction.' },
  { icon: MapPin, title: 'Courtage immobilier', description: 'Accès aux meilleures propriétés grâce à notre réseau sur tout le territoire.' },
  { icon: Users, title: 'Accompagnement diaspora', description: 'Service dédié aux acheteurs de la diaspora africaine pour investir en toute confiance.' },
]

export default async function AccueilPage() {
  const { annonces, temoignages, blogPosts } = await getHomeData()

  return (
    <>
      <HeroSection />

      <section className="section-padding bg-white" aria-labelledby="services-title">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 id="services-title" className="section-title">Nos services</h2>
            <p className="section-subtitle mx-auto mt-3">
              Une gamme complète de services pour sécuriser votre patrimoine immobilier.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.title} className="bg-primary-light rounded-xl p-6 hover:shadow-card transition-shadow">
                <div className="p-3 rounded-xl bg-white w-fit mb-4">
                  <service.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-semibold text-dark text-base mb-2">{service.title}</h3>
                <p className="text-grey text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline text-sm">
              Découvrir tous nos services <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {annonces.length > 0 && (
        <section className="section-padding bg-[#F9F9F6]" aria-labelledby="annonces-title">
          <div className="container-site">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 id="annonces-title" className="section-title">Dernières annonces</h2>
                <p className="text-grey text-sm mt-1">Terrains et biens immobiliers sécurisés disponibles</p>
              </div>
              <Link href="/annonces" className="hidden sm:flex items-center gap-1.5 text-primary font-medium text-sm hover:underline">
                Voir tout <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-72 rounded-xl"/>)}</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annonces.map((annonce) => (
                  <AnnonceCard key={annonce.id} annonce={annonce as Parameters<typeof AnnonceCard>[0]['annonce']} />
                ))}
              </div>
            </Suspense>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/annonces" className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:underline">
                Voir toutes les annonces <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {temoignages.length > 0 && (
        <TestimonialsCarousel temoignages={temoignages as Parameters<typeof TestimonialsCarousel>[0]['temoignages']} />
      )}

      <LeadMagnetBanner />

      {blogPosts.length > 0 && (
        <section className="section-padding bg-white" aria-labelledby="blog-title">
          <div className="container-site">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 id="blog-title" className="section-title">Blog & Conseils</h2>
                <p className="text-grey text-sm mt-1">Expertise foncière et immobilière en Afrique</p>
              </div>
              <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-primary font-medium text-sm hover:underline">
                Voir tout <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post as Parameters<typeof BlogCard>[0]['post']} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
