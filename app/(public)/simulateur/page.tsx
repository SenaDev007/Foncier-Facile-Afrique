import type { Metadata } from 'next'
import Simulateur from '@/components/public/Simulateur'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Simulateur de budget — Foncier Facile Afrique',
  description: 'Estimez vos mensualités et le coût total de votre investissement immobilier au Bénin avec notre simulateur de budget.',
  openGraph: { title: 'Simulateur de budget — Foncier Facile Afrique' },
}

export default function SimulateurPage() {
  return (
    <div className="bg-[#F9F9F6] min-h-screen">
      <section className="bg-primary py-14">
        <div className="container-site text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Simulateur de budget</h1>
          <p className="mt-3 text-gray-200 text-lg max-w-xl mx-auto">
            Estimez vos mensualités et planifiez votre investissement immobilier.
          </p>
        </div>
      </section>

      <div className="container-site py-12 max-w-4xl">
        <Simulateur />

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-heading font-semibold text-dark text-lg mb-3">Prêt à concrétiser votre projet ?</h2>
          <p className="text-grey text-sm mb-5">
            Cette simulation est indicative. Pour une étude financière personnalisée et des conseils
            adaptés à votre situation, contactez l&apos;un de nos experts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm">
              Parler à un expert <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/annonces" className="inline-flex items-center gap-2 border border-primary text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-colors text-sm">
              Voir nos annonces
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
