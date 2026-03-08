import Link from 'next/link'
import { ArrowRight, Shield, Search, TrendingUp } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-bg to-[#111111] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" aria-hidden="true" />

      <div className="container-site relative z-10 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-gold-light border border-gold-border text-gold text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-gold" aria-hidden="true" />
            Votre partenaire immobilier sécurisé en Afrique de l&apos;Ouest
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
            Achetez un terrain{' '}
            <span className="text-gold">en toute sécurité</span>{' '}
            au Bénin
          </h1>

          <p className="mt-6 text-text-secondary text-lg sm:text-xl max-w-2xl leading-relaxed">
            Foncier Facile Afrique vous accompagne dans l&apos;acquisition de terrains
            et biens immobiliers avec titre foncier vérifié, de Parakou à tout le Bénin.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/annonces"
              className="inline-flex items-center gap-2 bg-gold text-text-inverse font-semibold px-6 py-4 rounded-xl hover:bg-gold-dark transition-all duration-200 shadow-lg hover:shadow-xl text-base"
            >
              Voir les annonces
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-bg-border text-text-primary font-semibold px-6 py-4 rounded-xl hover:bg-bg-surface transition-all duration-200 backdrop-blur-sm text-base"
            >
              Nous contacter
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Sécurité juridique', description: 'Vérification complète des titres fonciers' },
              { icon: Search, title: 'Sélection rigoureuse', description: 'Biens vérifiés et documentés' },
              { icon: TrendingUp, title: 'Investissement rentable', description: 'Meilleurs emplacements stratégiques' },
            ].map((item) => (
              <div className="bg-bg-surface backdrop-blur-sm rounded-xl p-4 border border-bg-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gold/20 flex-shrink-0">
                    <item.icon className="h-5 w-5 text-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{item.title}</h3>
                    <p className="text-text-secondary text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-surface to-transparent" aria-hidden="true" />
    </section>
  )
}
