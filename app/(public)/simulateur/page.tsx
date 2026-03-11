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
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="bg-[#161618] border-b border-[#2C2C2E] py-14 md:py-20">
        <div className="container-site text-center">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Outils</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF]">Simulateur de budget</h1>
          <p className="mt-3 text-[#8E8E93] text-lg max-w-xl mx-auto">
            Estimez vos mensualités et planifiez votre investissement immobilier.
          </p>
        </div>
      </section>

      <div className="container-site py-12 max-w-4xl">
        <Simulateur />

        <div className="mt-8 bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-[#EFEFEF] text-lg mb-3">Prêt à concrétiser votre projet ?</h2>
          <p className="text-[#8E8E93] text-sm mb-5">
            Cette simulation est indicative. Pour une étude financière personnalisée et des conseils
            adaptés à votre situation, contactez l&apos;un de nos experts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#B8912E] transition-colors text-sm">
              Parler à un expert <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/annonces" className="inline-flex items-center gap-2 border border-[#D4A843] text-[#D4A843] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#D4A843] hover:text-[#EFEFEF] transition-colors text-sm">
              Voir nos annonces
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
