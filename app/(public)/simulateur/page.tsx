import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import SimulateurFoncier from '@/components/public/SimulateurFoncier'

export const metadata: Metadata = publicPageMetadata({
  title: 'Simulateur de budget foncier — Frais et surfaces',
  description:
    'Estimez votre capacité d\'achat immobilier au Bénin : calcul des frais de notaire, d\'enregistrement et de la surface possible selon votre budget.',
  pathname: '/simulateur',
  keywords: ['simulateur immobilier Bénin', 'frais notaire Bénin', 'budget terrain Cotonou'],
})

export default function SimulateurPage() {
  return (
    <div className="bg-[#1C1C1E] min-h-screen py-14 md:py-20">
      <div className="container-site">
        <div className="max-w-3xl mb-12">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Outil d'aide à la décision
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF]">
            Simulateur de budget
          </h1>
          <p className="mt-4 text-[#8E8E93] text-lg">
            Combien pouvez-vous réellement acheter avec votre budget ? Calculez en un clic vos frais 
            d'acquisition et la surface nette estimée.
          </p>
        </div>

        <SimulateurFoncier />
      </div>
    </div>
  )
}
