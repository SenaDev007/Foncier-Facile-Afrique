import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { ConfierBienForm } from '@/components/public/ConfierBienForm'

export const metadata: Metadata = {
  title: 'Confier mon bien — Dépôt et publication',
  description:
    'Confiez la vente ou la location de votre bien à Foncier Facile Afrique : estimation, sécurisation des documents et mise en ligne.',
  openGraph: { title: 'Confier mon bien — Foncier Facile Afrique' },
}

const ETAPES = [
  'Dépôt de votre dossier et des informations clés',
  'Analyse et estimation par nos experts',
  'Vérification juridique des pièces',
  'Publication et diffusion ciblée',
]

export default function ConfierPage() {
  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="bg-[#0D2137] border-b border-[#2C2C2E] py-14 md:py-20">
        <div className="container-site">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Pôle or — Propriétaires
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF] max-w-3xl">
            Confier mon bien
          </h1>
          <p className="mt-4 text-[#8E8E93] text-lg max-w-2xl">
            Déposez votre annonce : nous vous accompagnons pour la valorisation, la conformité et la mise en
            relation avec des acheteurs qualifiés.
          </p>
        </div>
      </section>

      <div className="container-site py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-xl font-semibold text-[#EFEFEF] mb-4">Notre processus en 4 étapes</h2>
              <ol className="space-y-3">
                {ETAPES.map((t, i) => (
                  <li key={t} className="flex gap-3 text-[#8E8E93] text-sm">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4A843]/20 text-[#D4A843] font-heading font-bold flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <span className="pt-1">{t}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-[#D4A843]/35 bg-[rgba(212,168,67,0.06)] p-6">
              <h3 className="font-heading text-lg font-semibold text-[#D4A843] mb-3">Tarification indicative</h3>
              <ul className="space-y-2 text-sm text-[#8E8E93]">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4A843] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  Étude de dossier et estimation : sur devis selon complexité
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4A843] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  Mise en ligne et diffusion : forfait communiqué après analyse
                </li>
              </ul>
              <p className="text-xs text-[#636366] mt-4">
                Les montants définitifs vous sont communiqués après lecture de votre dossier. Aucun engagement
                avant validation de votre part.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="inline-block text-sm text-[#D4A843] hover:underline font-medium"
            >
              ← Voir le catalogue des biens
            </Link>
          </div>
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6 md:p-8">
            <h2 className="font-heading text-xl font-semibold text-[#EFEFEF] mb-2">Formulaire de dépôt</h2>
            <p className="text-sm text-[#8E8E93] mb-6">
              Remplissez les champs ci-dessous. Un conseiller vous rappelle sous 24 à 48 h ouvrées.
            </p>
            <ConfierBienForm />
          </div>
        </div>
      </div>
    </div>
  )
}
