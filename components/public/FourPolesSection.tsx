import Link from 'next/link'
import { Building2, Home, Palmtree, Scale } from 'lucide-react'

const POLES = [
  {
    href: '/catalogue',
    label: 'Acheter / Vendre',
    description: 'Catalogue de biens sécurisés, recherche et mandat.',
    icon: Building2,
    className: 'border-[#0D2137]/40 bg-[#0D2137]/20 hover:border-[#D4A843]/50',
    accent: 'text-[#8EC5FF]',
  },
  {
    href: '/confier',
    label: 'Confier mon bien',
    description: 'Dépôt d’annonce, estimation et publication accompagnées.',
    icon: Home,
    className: 'border-[#D4A843]/30 bg-[rgba(212,168,67,0.08)] hover:border-[#D4A843]/60',
    accent: 'text-[#D4A843]',
  },
  {
    href: '/sejour',
    label: 'Séjour & tourisme',
    description: 'Réservation de logements avant votre arrivée (bientôt).',
    icon: Palmtree,
    className: 'border-[#5B2C6F]/50 bg-[#5B2C6F]/15 hover:border-[#5B2C6F]/70',
    accent: 'text-[#C9A0DC]',
  },
  {
    href: '/regularisation',
    label: 'Régularisation foncière',
    description: 'Diagnostic, PH → TF, mutations et accompagnement juridique.',
    icon: Scale,
    className: 'border-[#7A3500]/45 bg-[#7A3500]/12 hover:border-[#D4A843]/40',
    accent: 'text-[#E8A87C]',
  },
] as const

export function FourPolesSection() {
  return (
    <section className="py-14 md:py-16 bg-[#161618] border-y border-[#2C2C2E]" aria-labelledby="poles-title">
      <div className="container-site">
        <p className="text-center text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
          Plateforme — 4 pôles
        </p>
        <h2
          id="poles-title"
          className="text-center font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3"
        >
          Une même porte d’entrée pour tout votre projet
        </h2>
        <p className="text-center text-[#8E8E93] text-lg max-w-2xl mx-auto mb-10 md:mb-12">
          Aligné sur la vision Foncier Facile Afrique : immobilier, dépôt de biens, séjour et sécurisation
          foncière.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {POLES.map((pole) => (
            <Link
              key={pole.href}
              href={pole.href}
              className={`group rounded-2xl border p-6 md:p-7 transition-colors ${pole.className}`}
            >
              <pole.icon className={`h-9 w-9 mb-4 ${pole.accent}`} aria-hidden="true" />
              <h3 className="font-heading text-xl font-semibold text-[#EFEFEF] mb-2 group-hover:text-[#D4A843] transition-colors">
                {pole.label}
              </h3>
              <p className="text-sm text-[#8E8E93] leading-relaxed">{pole.description}</p>
              <span className="inline-block mt-4 text-sm font-medium text-[#D4A843] opacity-90 group-hover:opacity-100">
                Découvrir →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
