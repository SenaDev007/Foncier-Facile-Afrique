import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Award, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Notre expertise — Foncier Facile Afrique',
  description: 'Découvrez l\'expertise de Foncier Facile Afrique en conseil foncier, vérification de titres et accompagnement immobilier au Bénin.',
  openGraph: { title: 'Notre expertise — Foncier Facile Afrique' },
}

const chiffres = [
  { value: '500+', label: 'Clients accompagnés' },
  { value: '98%', label: 'Taux de satisfaction' },
  { value: '10+', label: 'Années d\'expérience' },
  { value: '1000+', label: 'Transactions sécurisées' },
]

const valeurs = [
  { icon: Shield, title: 'Sécurité', description: 'Chaque transaction est vérifiée juridiquement pour protéger vos intérêts.' },
  { icon: Award, title: 'Excellence', description: 'Nos experts apportent un niveau de rigueur inégalé dans chaque dossier.' },
  { icon: Clock, title: 'Réactivité', description: 'Réponse garantie sous 24h, suivi personnalisé tout au long du processus.' },
  { icon: Users, title: 'Proximité', description: 'Une équipe locale à votre service, qui connaît le marché béninois en profondeur.' },
]

const etapes = [
  { num: '01', title: 'Consultation initiale', description: 'Analyse de votre projet et définition de vos besoins avec un conseiller dédié.' },
  { num: '02', title: 'Recherche & sélection', description: 'Identification des biens correspondant à vos critères dans notre réseau exclusif.' },
  { num: '03', title: 'Vérification juridique', description: 'Contrôle complet des titres fonciers, cadastre et documents légaux.' },
  { num: '04', title: 'Négociation', description: 'Négociation du prix en votre faveur pour optimiser votre investissement.' },
  { num: '05', title: 'Formalités notariales', description: 'Accompagnement jusqu\'à la signature finale et transfert de propriété sécurisé.' },
]

export default function ExpertisePage() {
  return (
    <div className="bg-[#F9F9F6] min-h-screen">
      <section className="bg-primary py-16 relative overflow-hidden">
        <div className="container-site relative z-10 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Notre expertise</h1>
          <p className="mt-4 text-gray-200 text-lg max-w-2xl mx-auto">
            Plus de 10 ans d&apos;expérience dans le foncier et l&apos;immobilier en Afrique de l&apos;Ouest,
            au service de votre patrimoine.
          </p>
        </div>
      </section>

      <section className="container-site py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {chiffres.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-6 text-center shadow-card">
              <p className="font-heading text-4xl font-bold text-primary">{c.value}</p>
              <p className="text-grey text-sm mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeurs.map((v) => (
              <div key={v.title} className="text-center p-6">
                <div className="p-3 rounded-xl bg-primary-light w-fit mx-auto mb-4">
                  <v.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-semibold text-dark text-base mb-2">{v.title}</h3>
                <p className="text-grey text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="section-title">Notre méthode</h2>
            <p className="section-subtitle mt-3 mx-auto">Un processus éprouvé pour sécuriser votre acquisition de A à Z.</p>
          </div>
          <div className="space-y-6">
            {etapes.map((e) => (
              <div key={e.num} className="bg-white rounded-xl p-6 shadow-sm flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-sm">{e.num}</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dark text-base mb-1">{e.title}</h3>
                  <p className="text-grey text-sm">{e.description}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-primary ml-auto flex-shrink-0 mt-0.5" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-light py-12">
        <div className="container-site text-center">
          <h2 className="section-title">Commencez votre projet dès aujourd&apos;hui</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link href="/annonces" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors">
              Voir les annonces <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-primary text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-colors">
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
