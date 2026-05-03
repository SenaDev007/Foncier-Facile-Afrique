'use client'

import Link from 'next/link'
import { Building2, Home, Palmtree, Scale } from 'lucide-react'
import { motion } from 'framer-motion'

const CARD =
  'border-[#3A3A3C] bg-[#2C2C2E]/90 hover:border-[#D4A843]/45 hover:bg-[#2C2C2E] shadow-sm hover:shadow-[0_0_20px_rgba(212,168,67,0.05)]'

const POLES = [
  {
    href: '/catalogue',
    label: 'Acheter / Vendre',
    description: 'Catalogue de biens sécurisés, recherche et mandat.',
    icon: Building2,
    className: CARD,
    accent: 'text-[#D4A843]',
  },
  {
    href: '/confier',
    label: 'Confier mon bien',
    description: 'Dépôt d’annonce, estimation et publication accompagnées.',
    icon: Home,
    className: CARD,
    accent: 'text-[#D4A843]',
  },
  {
    href: '/sejour',
    label: 'Séjour & tourisme',
    description: 'Réservation de logements avant votre arrivée (bientôt).',
    icon: Palmtree,
    className: CARD,
    accent: 'text-[#D4A843]',
  },
  {
    href: '/regularisation',
    label: 'Régularisation foncière',
    description: 'Diagnostic, PH → TF, mutations et accompagnement juridique.',
    icon: Scale,
    className: CARD,
    accent: 'text-[#D4A843]',
  },
] as const

export function FourPolesSection() {
  return (
    <section className="py-14 md:py-16 bg-[#161618] border-y border-[#2C2C2E]" aria-labelledby="poles-title">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {POLES.map((pole, idx) => (
            <motion.div
              key={pole.href}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={pole.href}
                className={`group block h-full rounded-2xl border p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 ${pole.className}`}
              >
                <pole.icon className={`h-9 w-9 mb-4 transition-transform duration-500 group-hover:scale-110 ${pole.accent}`} aria-hidden="true" />
                <h3 className="font-heading text-xl font-semibold text-[#EFEFEF] mb-2 group-hover:text-[#D4A843] transition-colors">
                  {pole.label}
                </h3>
                <p className="text-sm text-[#8E8E93] leading-relaxed">{pole.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#D4A843] opacity-80 group-hover:opacity-100 transition-opacity">
                  Découvrir <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
