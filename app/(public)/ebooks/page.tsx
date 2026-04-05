import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import { getEbooksPublic } from '@/lib/ebooks'
import EbookGrid from '@/components/ebooks/EbookGrid'
import EbookCategoryFilter from '@/components/ebooks/EbookCategoryFilter'

export const metadata: Metadata = publicPageMetadata({
  title: 'Boutique ebooks',
  description:
    'Guides pratiques et ebooks pour sécuriser votre patrimoine foncier au Bénin. Produits digitaux Foncier Facile Afrique.',
  pathname: '/ebooks',
  keywords: ['ebook foncier Bénin', 'guide titre foncier PDF'],
})

export default async function EbooksPage() {
  const ebooks = await getEbooksPublic()
  const categories = ['Tous', ...Array.from(new Set(ebooks.map((e) => e.categorie)))]

  return (
    <main className="min-h-screen bg-ffa-ink pt-24 pb-20">
      <div className="container-site px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-medium tracking-widest uppercase bg-ffa-gold/12 text-ffa-gold border border-ffa-gold/25 mb-4">
            Produits digitaux
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-ffa-fg mb-4 font-heading">
            Boutique <span className="text-ffa-gold">Ebooks</span>
          </h1>
          <p className="text-ffa-fg-muted text-lg max-w-xl mx-auto">
            Guides pratiques pour sécuriser votre patrimoine foncier au Bénin
          </p>
        </div>

        <EbookCategoryFilter categories={categories} ebooks={ebooks} />
      </div>
    </main>
  )
}
