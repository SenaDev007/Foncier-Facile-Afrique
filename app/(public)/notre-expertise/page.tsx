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
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-[#2C2C2E]">
        <div className="absolute inset-0 bg-[#161618]" />
        <div className="container-site relative z-10 text-center">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Qui sommes-nous
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF]">Notre expertise</h1>
          <p className="mt-4 text-[#8E8E93] text-lg max-w-2xl mx-auto">
            Plus de 10 ans d&apos;expérience dans le foncier et l&apos;immobilier en Afrique de l&apos;Ouest,
            au service de votre patrimoine.
          </p>
        </div>
      </section>

      <section className="container-site py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {chiffres.map((c) => (
            <div key={c.label} className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-6 text-center">
              <p className="font-heading text-4xl font-bold text-[#D4A843]">{c.value}</p>
              <p className="text-[#8E8E93] text-sm mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-site py-14 md:py-16">
        <div className="text-center mb-12">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Nos valeurs</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#EFEFEF]">Ce qui nous guide</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valeurs.map((v) => (
            <div key={v.title} className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl text-center p-6">
              <div className="p-3 rounded-xl bg-[rgba(212,168,67,0.12)] w-fit mx-auto mb-4">
                <v.icon className="h-7 w-7 text-[#D4A843]" aria-hidden="true" />
              </div>
              <h3 className="font-heading font-semibold text-[#EFEFEF] text-base mb-2">{v.title}</h3>
              <p className="text-[#8E8E93] text-sm">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 md:py-16 bg-[#161618] border-y border-[#2C2C2E]">
        <div className="container-site max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Notre méthode</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#EFEFEF] mb-3">Un processus éprouvé</h2>
            <p className="text-[#8E8E93] text-lg max-w-xl mx-auto">Sécuriser votre acquisition de A à Z.</p>
          </div>
          <div className="space-y-6">
            {etapes.map((e) => (
              <div key={e.num} className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#D4A843] flex items-center justify-center">
                  <span className="text-[#EFEFEF] font-heading font-bold text-sm">{e.num}</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-[#EFEFEF] text-base mb-1">{e.title}</h3>
                  <p className="text-[#8E8E93] text-sm">{e.description}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-[#D4A843] ml-auto flex-shrink-0 mt-0.5" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#2C2C2E] py-16 md:py-20 border-t border-[#3A3A3C]">
        <div className="container-site text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#EFEFEF] mb-3">Commencez votre projet dès aujourd&apos;hui</h2>
          <p className="text-[#8E8E93] text-lg max-w-xl mx-auto">Un conseiller vous accompagne gratuitement.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/annonces" className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-6 py-3 rounded-xl hover:bg-[#B8912E] transition-colors">
              Voir les annonces <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-[#D4A843] text-[#D4A843] font-semibold px-6 py-3 rounded-xl hover:bg-[#D4A843] hover:text-[#1C1C1E] transition-colors">
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
