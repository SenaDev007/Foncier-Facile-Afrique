import type { Metadata } from 'next'
import { ImmobilierSimulateurs } from '@/components/public/ImmobilierSimulateurs'

export const metadata: Metadata = {
  title: 'Simulateurs immobiliers — Frais, rentabilité, valeur terrain',
  description:
    'Estimez frais de notaire, rendement locatif et fourchette de valeur de terrain au Bénin. Outils indicatifs Foncier Facile Afrique.',
  openGraph: { title: 'Simulateurs immobiliers — FFA' },
}

export default function SimulateursPage() {
  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="bg-[#161618] border-b border-[#2C2C2E] py-12 md:py-16">
        <div className="container-site max-w-3xl">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">Outils</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF]">Simulateurs immobiliers</h1>
          <p className="mt-3 text-[#8E8E93] text-lg">
            Calculs indicatifs conformes à la feuille de route plateforme (notaire, rentabilité, valeur terrain).
            Pour un financement détaillé, utilisez aussi le{' '}
            <a href="/simulateur" className="text-[#D4A843] hover:underline">
              simulateur de budget
            </a>
            .
          </p>
        </div>
      </section>
      <div className="container-site py-10 md:py-14 max-w-4xl">
        <ImmobilierSimulateurs />
      </div>
    </div>
  )
}
