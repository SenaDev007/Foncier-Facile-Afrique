import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import ServicePageCard from '@/components/public/ServicePageCard'
import { getPageSections } from '@/lib/pages'
import { getPublicServiceCards, serviceCardPointsForPage } from '@/lib/public-services'

export const metadata: Metadata = publicPageMetadata({
  title: 'Nos services',
  description:
    "Conseil foncier, vérification documentaire, courtage immobilier et accompagnement diaspora au Bénin et en Afrique de l'Ouest.",
  pathname: '/services',
  keywords: ['courtage immobilier Bénin', 'vérification titre foncier'],
})

export default async function ServicesPage() {
  const [sections, services] = await Promise.all([getPageSections('services'), getPublicServiceCards()])
  const hero = sections.hero
  const ctaBas = sections.cta_bas

  return (
    <div className="bg-ffa-ink min-h-screen">
      {/* Hero avec image */}
      <section className="relative overflow-hidden border-b border-ffa-divider" style={{ minHeight: '380px' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-services.jpg"
            alt="Experts immobiliers Foncier Facile Afrique"
            fill
            className="object-cover object-center"
            style={{ animation: 'slowZoom 22s ease-in-out infinite alternate' }}
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(22,22,24,0.95) 0%, rgba(22,22,24,0.80) 60%, rgba(22,22,24,0.50) 100%)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,30,1) 0%, transparent 55%)' }} />
        </div>
        <style>{`@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.12); } }`}</style>
        <div className="container-site relative z-10 text-center py-16 md:py-24">
          <p className="text-ffa-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            {hero?.sousTitre ?? 'Nos expertises'}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ffa-fg">{hero?.titre ?? 'Nos services'}</h1>
          <p className="mt-4 text-ffa-fg-muted text-lg max-w-2xl mx-auto">
            {hero?.bodyHtml ?? 'Des solutions complètes pour sécuriser et développer votre patrimoine immobilier en Afrique de l\'Ouest.'}
          </p>
          <Link href={hero?.boutonUrl ?? '/contact'} className="mt-8 inline-flex items-center gap-2 bg-ffa-gold text-ffa-navy font-semibold px-6 py-3 rounded-xl hover:bg-ffa-gold-light transition-colors shadow-lg shadow-ffa-gold/20">
            {hero?.boutonTexte ?? 'Prendre rendez-vous'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="container-site py-14">
        <div className="grid justify-center gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),360px))]">
          {services.map((service, index) => (
            <ServicePageCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              points={serviceCardPointsForPage(service)}
              imageSrc={service.image}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="bg-ffa-elevated py-16 md:py-20 border-t border-ffa-divider">
        <div className="container-site text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ffa-fg mb-3">{ctaBas?.titre ?? 'Prêt à investir en toute sécurité ?'}</h2>
          <p className="text-ffa-fg-muted text-lg mt-3">{ctaBas?.sousTitre ?? 'Contactez nos experts pour une consultation gratuite et sans engagement.'}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href={ctaBas?.boutonUrl ?? '/contact'} className="inline-flex items-center gap-2 bg-ffa-gold text-ffa-navy font-semibold px-6 py-3 rounded-xl hover:bg-ffa-gold-light transition-colors">
              {ctaBas?.boutonTexte ?? 'Nous contacter'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
