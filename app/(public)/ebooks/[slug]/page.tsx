import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEbookBySlug } from '@/lib/ebooks'
import EbookDetailClient from '@/components/ebooks/EbookDetailClient'
import EbookCoverImage from '@/components/ebooks/EbookCoverImage'
import ShareButtons from '@/components/public/ShareButtons'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ebook = await getEbookBySlug(params.slug)
  if (!ebook) return { title: 'Ebook' }
  return {
    title: ebook.titre,
    description: ebook.description.slice(0, 160),
  }
}

export default async function EbookSlugPage({ params }: PageProps) {
  const ebook = await getEbookBySlug(params.slug)
  if (!ebook) notFound()

  const prixAffiche = ebook.prixPromo ?? ebook.prixCFA
  const aPromo = !!ebook.prixPromo && ebook.prixPromo < ebook.prixCFA

  return (
    <main className="min-h-screen bg-[#1C1C1E] pt-24 pb-20">
      <div className="container-site px-6">
        <Link
          href="/ebooks"
          className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la boutique
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="relative aspect-[3/4] max-h-[500px] bg-[#2C2C2E] rounded-2xl overflow-hidden border border-[#3A3A3C]">
            <EbookCoverImage
              src={ebook.couverture}
              alt={ebook.titre}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div>
            <span className="text-xs text-[#D4A843] font-medium tracking-wider uppercase">
              {ebook.categorie}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mt-2 mb-4">
              {ebook.titre}
            </h1>
            <p className="text-[#8E8E93] text-sm mb-6">{ebook.auteur}</p>
            <div className="prose prose-invert max-w-none text-[#EFEFEF]/90 text-base leading-relaxed mb-8">
              <p className="whitespace-pre-line">{ebook.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div>
                <span className="text-[#D4A843] font-bold text-2xl">
                  {prixAffiche.toLocaleString('fr-FR')} FCFA
                </span>
                {aPromo && (
                  <span className="ml-2 text-[#636366] text-base line-through">
                    {ebook.prixCFA.toLocaleString('fr-FR')} FCFA
                  </span>
                )}
              </div>
              {ebook.pages != null && (
                <span className="text-[#8E8E93] text-sm">{ebook.pages} pages</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <ShareButtons
                url={`/ebooks/${ebook.slug}`}
                title={ebook.titre}
                description={ebook.description.slice(0, 160)}
              />
            </div>
            <EbookDetailClient ebook={ebook} />
          </div>
        </div>
      </div>
    </main>
  )
}
