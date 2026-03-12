import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ServicePageCard from '@/components/public/ServicePageCard'
import { getPageSections } from '@/lib/pages'

export const metadata: Metadata = {
  title: 'Nos services — Foncier Facile Afrique',
  description: 'Conseil foncier, vérification documentaire, courtage immobilier et accompagnement diaspora au Bénin et en Afrique de l\'Ouest.',
  openGraph: { title: 'Nos services — Foncier Facile Afrique' },
}

const services = [
  {
    id: 'conseil',
    title: 'Conseil en achat foncier',
    description: 'Accompagnement expert de A à Z pour l\'acquisition sécurisée de terrains avec titre foncier officiel.',
    points: ['Évaluation juridique du bien', 'Vérification des titres fonciers', 'Négociation du prix', 'Suivi des formalités notariales'],
  },
  {
    id: 'verification',
    title: 'Vérification documentaire',
    description: 'Contrôle rigoureux et complet de tous les documents légaux avant toute transaction immobilière.',
    points: ['Contrôle d\'authenticité', 'Vérification cadastrale', 'Recherche des hypothèques', 'Rapport d\'audit documentaire'],
  },
  {
    id: 'courtage',
    title: 'Courtage immobilier',
    description: 'Accès à un portefeuille exclusif de biens immobiliers vérifiés partout au Bénin.',
    points: ['Terrains constructibles', 'Appartements & villas', 'Locaux commerciaux', 'Biens locatifs'],
  },
  {
    id: 'investissement',
    title: 'Investissement locatif',
    description: 'Stratégies d\'investissement pour maximiser le rendement de votre patrimoine immobilier.',
    points: ['Analyse de rentabilité', 'Sélection des emplacements', 'Gestion locative', 'Optimisation fiscale'],
  },
  {
    id: 'diaspora',
    title: 'Service diaspora',
    description: 'Accompagnement spécialisé pour les Africains de la diaspora qui souhaitent investir au pays.',
    points: ['Gestion à distance', 'Représentation légale', 'Reporting régulier', 'Rapatriement de fonds sécurisé'],
  },
  {
    id: 'juridique',
    title: 'Accompagnement juridique',
    description: 'Assistance complète pour toutes les démarches légales liées à votre investissement foncier.',
    points: ['Rédaction de contrats', 'Suivi notarial', 'Règlement de litiges', 'Conseils en droit foncier'],
  },
]

export default async function ServicesPage() {
  const sections = await getPageSections('services')
  const hero = sections.hero
  const ctaBas = sections.cta_bas

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-[#2C2C2E] bg-[#161618]">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1C1C1E] via-[#161618] to-[#1C1C1E]" />
        <div className="container-site relative z-10 text-center">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            {hero?.sousTitre ?? 'Nos expertises'}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF]">{hero?.titre ?? 'Nos services'}</h1>
          <p className="mt-4 text-[#8E8E93] text-lg max-w-2xl mx-auto">
            {hero?.bodyHtml ?? 'Des solutions complètes pour sécuriser et développer votre patrimoine immobilier en Afrique de l\'Ouest.'}
          </p>
          <Link href={hero?.boutonUrl ?? '/contact'} className="mt-8 inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-6 py-3 rounded-xl hover:bg-[#B8912E] transition-colors shadow-lg shadow-[#D4A843]/20">
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
              points={service.points}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="bg-[#2C2C2E] py-16 md:py-20 border-t border-[#3A3A3C]">
        <div className="container-site text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#EFEFEF] mb-3">{ctaBas?.titre ?? 'Prêt à investir en toute sécurité ?'}</h2>
          <p className="text-[#8E8E93] text-lg mt-3">{ctaBas?.sousTitre ?? 'Contactez nos experts pour une consultation gratuite et sans engagement.'}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href={ctaBas?.boutonUrl ?? '/contact'} className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-6 py-3 rounded-xl hover:bg-[#B8912E] transition-colors">
              {ctaBas?.boutonTexte ?? 'Nous contacter'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/simulateur" className="inline-flex items-center gap-2 border border-[#D4A843] text-[#D4A843] font-semibold px-6 py-3 rounded-xl hover:bg-[#D4A843] hover:text-[#1C1C1E] transition-colors">
              Simuler mon budget
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
