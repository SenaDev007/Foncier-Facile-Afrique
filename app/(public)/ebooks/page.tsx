import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import { getEbooksPublic } from '@/lib/ebooks'
import EbookCategoryFilter from '@/components/ebooks/EbookCategoryFilter'
import Image from 'next/image'

export const metadata: Metadata = publicPageMetadata({
  title: 'Boutique ebooks',
  description:
    'Guides pratiques et ebooks pour sécuriser votre patrimoine foncier au Bénin. Produits digitaux Foncier Facile Afrique.',
  pathname: '/ebooks',
  keywords: ['ebook foncier Bénin', 'guide titre foncier PDF'],
})
export default async function EbooksPage() {
  const rawEbooks = await getEbooksPublic()
  const ebooks = JSON.parse(JSON.stringify(rawEbooks))
  const categories = ['Tous', ...Array.from(new Set(ebooks.map((e: {categorie: string}) => e.categorie)))]

  return (
    <main className="min-h-screen bg-ffa-ink">
      {/* Hero avec image */}
      <section className="relative overflow-hidden border-b border-ffa-divider" style={{ minHeight: '420px' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-ebooks.jpg"
            alt="Boutique Ebooks Foncier Facile Afrique"
            fill
            className="object-cover object-center"
            style={{ animation: 'slowZoom 28s ease-in-out infinite alternate' }}
            priority
            sizes="100vw"
          />
          {/* Overlays */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(22,22,24,0.95) 0%, rgba(22,22,24,0.80) 55%, rgba(22,22,24,0.40) 100%)',
            }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,30,1) 0%, transparent 60%)' }} />
        </div>
        <style>{`@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.15); } }`}</style>
        <div className="container-site relative z-10 text-center py-16 md:py-24 px-6">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-medium tracking-widest uppercase bg-ffa-gold/12 text-ffa-gold border border-ffa-gold/25 mb-4">
            Produits digitaux
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-ffa-fg mb-4 font-heading leading-tight">
            Boutique <span className="text-ffa-gold">Ebooks</span>
          </h1>
          <p className="text-ffa-fg-muted text-lg max-w-xl mx-auto leading-relaxed">
            Guides pratiques pour sécuriser votre patrimoine foncier au Bénin
          </p>
        </div>
      </section>

      <div className="container-site px-6 py-12">

        <EbookCategoryFilter categories={categories} ebooks={ebooks} />
      </div>
    </main>
  )
}
