import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, FileCheck, MapPin, Users, TrendingUp, Scale, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nos services — Foncier Facile Afrique',
  description: 'Conseil foncier, vérification documentaire, courtage immobilier et accompagnement diaspora au Bénin et en Afrique de l\'Ouest.',
  openGraph: { title: 'Nos services — Foncier Facile Afrique' },
}

const services = [
  {
    id: 'conseil',
    icon: Shield,
    title: 'Conseil en achat foncier',
    description: 'Accompagnement expert de A à Z pour l\'acquisition sécurisée de terrains avec titre foncier officiel.',
    points: ['Évaluation juridique du bien', 'Vérification des titres fonciers', 'Négociation du prix', 'Suivi des formalités notariales'],
  },
  {
    id: 'verification',
    icon: FileCheck,
    title: 'Vérification documentaire',
    description: 'Contrôle rigoureux et complet de tous les documents légaux avant toute transaction immobilière.',
    points: ['Contrôle d\'authenticité', 'Vérification cadastrale', 'Recherche des hypothèques', 'Rapport d\'audit documentaire'],
  },
  {
    id: 'courtage',
    icon: MapPin,
    title: 'Courtage immobilier',
    description: 'Accès à un portefeuille exclusif de biens immobiliers vérifiés partout au Bénin.',
    points: ['Terrains constructibles', 'Appartements & villas', 'Locaux commerciaux', 'Biens locatifs'],
  },
  {
    id: 'investissement',
    icon: TrendingUp,
    title: 'Investissement locatif',
    description: 'Stratégies d\'investissement pour maximiser le rendement de votre patrimoine immobilier.',
    points: ['Analyse de rentabilité', 'Sélection des emplacements', 'Gestion locative', 'Optimisation fiscale'],
  },
  {
    id: 'diaspora',
    icon: Users,
    title: 'Service diaspora',
    description: 'Accompagnement spécialisé pour les Africains de la diaspora qui souhaitent investir au pays.',
    points: ['Gestion à distance', 'Représentation légale', 'Reporting régulier', 'Rapatriement de fonds sécurisé'],
  },
  {
    id: 'juridique',
    icon: Scale,
    title: 'Accompagnement juridique',
    description: 'Assistance complète pour toutes les démarches légales liées à votre investissement foncier.',
    points: ['Rédaction de contrats', 'Suivi notarial', 'Règlement de litiges', 'Conseils en droit foncier'],
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-[#F9F9F6] min-h-screen">
      <section className="bg-primary py-16 relative overflow-hidden">
        <div className="container-site relative z-10 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Nos services</h1>
          <p className="mt-4 text-gray-200 text-lg max-w-2xl mx-auto">
            Des solutions complètes pour sécuriser et développer votre patrimoine immobilier en Afrique de l&apos;Ouest.
          </p>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 bg-gold text-white font-semibold px-6 py-3 rounded-xl hover:bg-yellow-600 transition-colors">
            Prendre rendez-vous <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} id={service.id} className="bg-white rounded-2xl p-7 shadow-card flex flex-col">
              <div className="p-3 rounded-xl bg-primary-light w-fit mb-5">
                <service.icon className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
              <h2 className="font-heading font-bold text-dark text-lg mb-3">{service.title}</h2>
              <p className="text-grey text-sm leading-relaxed mb-5">{service.description}</p>
              <ul className="space-y-2 mt-auto">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-grey">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-light py-14">
        <div className="container-site text-center max-w-2xl mx-auto">
          <h2 className="section-title">Prêt à investir en toute sécurité ?</h2>
          <p className="section-subtitle mt-3 mx-auto">Contactez nos experts pour une consultation gratuite et sans engagement.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors">
              Nous contacter <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/simulateur" className="inline-flex items-center gap-2 border border-primary text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-colors">
              Simuler mon budget
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
