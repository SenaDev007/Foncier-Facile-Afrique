import type { Metadata } from 'next'
import { getEbooksPublic } from '@/lib/ebooks'
import EbookGrid from '@/components/ebooks/EbookGrid'
import EbookCategoryFilter from '@/components/ebooks/EbookCategoryFilter'

export const metadata: Metadata = {
  title: 'Boutique Ebooks',
  description:
    'Guides pratiques et ebooks pour sécuriser votre patrimoine foncier au Bénin. Produits digitaux Foncier Facile Afrique.',
}

export default async function EbooksPage() {
  const ebooks = await getEbooksPublic()
  const categories = ['Tous', ...Array.from(new Set(ebooks.map((e) => e.categorie)))]

  return (
    <main className="min-h-screen bg-[#1C1C1E] pt-24 pb-20">
      <div className="container-site px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-medium tracking-widest uppercase bg-[rgba(212,168,67,0.12)] text-[#D4A843] border border-[rgba(212,168,67,0.25)] mb-4">
            Produits digitaux
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#EFEFEF] mb-4 font-heading">
            Boutique <span className="text-[#D4A843]">Ebooks</span>
          </h1>
          <p className="text-[#8E8E93] text-lg max-w-xl mx-auto">
            Guides pratiques pour sécuriser votre patrimoine foncier au Bénin
          </p>
        </div>

        <EbookCategoryFilter categories={categories} ebooks={ebooks} />
      </div>
    </main>
  )
}
