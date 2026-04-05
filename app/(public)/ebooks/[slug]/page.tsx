import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getEbookBySlug } from '@/lib/ebooks'
import { publicPageMetadata, truncateMetaDescription } from '@/lib/seo'
import EbookDetailClient from '@/components/ebooks/EbookDetailClient'
import EbookCoverImage from '@/components/ebooks/EbookCoverImage'
import ShareButtons from '@/components/public/ShareButtons'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ebook = await prisma.ebook.findUnique({
    where: { slug: params.slug },
    select: {
      titre: true,
      description: true,
      publie: true,
      couverture: true,
      slug: true,
      categorie: true,
    },
  })
  const pathname = `/ebooks/${params.slug}`
  if (!ebook) {
    return publicPageMetadata({
      title: 'Ebook introuvable',
      description: 'Ce guide numérique n’existe pas ou n’est plus proposé à la vente.',
      pathname,
      noindex: true,
    })
  }
  return publicPageMetadata({
    title: ebook.titre,
    description: truncateMetaDescription(ebook.description),
    pathname: `/ebooks/${ebook.slug}`,
    ogImage: ebook.couverture,
    noindex: !ebook.publie,
    keywords: [ebook.categorie, 'ebook foncier'],
  })
}

export default async function EbookSlugPage({ params }: PageProps) {
  const ebook = await getEbookBySlug(params.slug)
  if (!ebook) notFound()

  const prixAffiche = ebook.prixPromo ?? ebook.prixCFA
  const aPromo = !!ebook.prixPromo && ebook.prixPromo < ebook.prixCFA

  return (
    <main className="min-h-screen bg-ffa-ink pt-24 pb-20">
      <div className="container-site px-6">
        <Link
          href="/ebooks"
          className="inline-flex items-center gap-1 text-sm text-ffa-fg-muted hover:text-ffa-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la boutique
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="relative aspect-[3/4] max-h-[500px] bg-ffa-elevated rounded-2xl overflow-hidden border border-ffa-divider">
            <EbookCoverImage
              src={ebook.couverture}
              alt={ebook.titre}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div>
            <span className="text-xs text-ffa-gold font-medium tracking-wider uppercase">
              {ebook.categorie}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-ffa-fg mt-2 mb-4">
              {ebook.titre}
            </h1>
            <p className="text-ffa-fg-muted text-sm mb-6">{ebook.auteur}</p>
            <div className="prose prose-invert max-w-none text-ffa-fg/90 text-base leading-relaxed mb-8">
              <p className="whitespace-pre-line">{ebook.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div>
                <span className="text-ffa-gold font-bold text-2xl">
                  {prixAffiche.toLocaleString('fr-FR')} FCFA
                </span>
                {aPromo && (
                  <span className="ml-2 text-ffa-fg-subtle text-base line-through">
                    {ebook.prixCFA.toLocaleString('fr-FR')} FCFA
                  </span>
                )}
              </div>
              {ebook.pages != null && (
                <span className="text-ffa-fg-muted text-sm">{ebook.pages} pages</span>
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
