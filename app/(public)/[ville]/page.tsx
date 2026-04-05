import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import type { Prisma } from '@prisma/client'
import nextDynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  citySlugToTitle,
  getCitySearchTerms,
  isFfaSeoCitySlug,
  type FfaSeoCitySlug,
} from '@/lib/ffa-cities'

/** Chargement différé : réduit le bundle initial de la page ville. */
const AnnonceCard = nextDynamic(() => import('@/components/public/AnnonceCard'), {
  loading: () => (
    <div className="h-[min(420px,70vw)] w-full max-w-[320px] mx-auto rounded-xl bg-[#2C2C2E] animate-pulse border border-[#3A3A3C]" />
  ),
})
const BlogCard = nextDynamic(() => import('@/components/public/BlogCard'), {
  loading: () => (
    <div className="h-64 w-full rounded-xl bg-[#2C2C2E] animate-pulse border border-[#3A3A3C]" />
  ),
})

interface PageProps {
  params: { ville: string }
}

/** Pas de worker `generateStaticParams` : évite en dev les erreurs build-manifest / static-paths-worker quand .next est régénéré. */
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pathname = `/${params.ville}`
  if (!isFfaSeoCitySlug(params.ville)) {
    return publicPageMetadata({
      title: 'Page ville',
      description: 'Page informative Foncier Facile Afrique.',
      pathname,
      noindex: true,
    })
  }
  const label = citySlugToTitle(params.ville)
  return publicPageMetadata({
    title: `Immobilier & foncier à ${label}`,
    description: `Terrains et biens sélectionnés à ${label}, conseils fonciers et actualités pour investir en confiance au Bénin.`,
    pathname,
    keywords: [`immobilier ${label}`, 'foncier Bénin', label],
  })
}

export default async function VilleSeoPage({ params }: PageProps) {
  if (!isFfaSeoCitySlug(params.ville)) {
    notFound()
  }

  const slug = params.ville as FfaSeoCitySlug
  const label = citySlugToTitle(slug)
  const terms = getCitySearchTerms(slug)

  const orFilters = terms.flatMap((t) => [
    { localisation: { contains: t, mode: 'insensitive' as const } },
    { commune: { contains: t, mode: 'insensitive' as const } },
    { departement: { contains: t, mode: 'insensitive' as const } },
  ])

  type AnnonceVille = Prisma.AnnonceGetPayload<{ include: { photos: true } }>
  type ArticleVille = Prisma.BlogPostGetPayload<{ include: { auteur: { select: { id: true; name: true } } } }>
  let annonces: AnnonceVille[] = []
  let articles: ArticleVille[] = []
  try {
    ;[annonces, articles] = await Promise.all([
      prisma.annonce.findMany({
        where: {
          statut: 'EN_LIGNE',
          OR: orFilters,
        },
        include: { photos: true },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
      prisma.blogPost.findMany({
        where: {
          statut: 'PUBLIE',
          OR: terms.flatMap((t) => [
            { titre: { contains: t, mode: 'insensitive' as const } },
            { contenu: { contains: t, mode: 'insensitive' as const } },
          ]),
        },
        include: { auteur: { select: { id: true, name: true } } },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
    ])
  } catch (e) {
    console.error('[ville] Prisma:', e)
  }

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="bg-[#161618] border-b border-[#D4A843]/20 py-12 md:py-16">
        <div className="container-site">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">SEO local</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF]">
            Immobilier à {label}
          </h1>
          <p className="mt-4 text-[#8E8E93] text-lg max-w-2xl">
            Biens disponibles et ressources autour de {label}. Foncier Facile Afrique vous accompagne pour des
            acquisitions sécurisées au Bénin.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="inline-flex items-center bg-[#D4A843] text-[#1C1C1E] font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-[#E8B84B]"
            >
              Tout le catalogue
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border border-[#EFEFEF]/25 text-[#EFEFEF] font-medium px-4 py-2.5 rounded-xl text-sm hover:bg-white/5"
            >
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>

      <section className="container-site py-12 md:py-14">
        <h2 className="font-heading text-2xl font-bold text-[#EFEFEF] mb-6">
          Biens à {label} {annonces.length > 0 ? `(${annonces.length})` : ''}
        </h2>
        {annonces.length === 0 ? (
          <p className="text-[#8E8E93] text-sm mb-6">
            Aucune annonce ne correspond encore à cette zone dans notre catalogue en ligne.{' '}
            <Link href="/catalogue" className="text-[#D4A843] hover:underline">
              Parcourir tous les biens
            </Link>
          </p>
        ) : (
          <div className="grid justify-center gap-5 md:gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),320px))]">
            {annonces.map((a) => (
              <AnnonceCard key={a.id} annonce={a} />
            ))}
          </div>
        )}
      </section>

      {articles.length > 0 && (
        <section className="border-t border-[#2C2C2E] py-12 md:py-14 bg-[#161618]">
          <div className="container-site">
            <h2 className="font-heading text-2xl font-bold text-[#EFEFEF] mb-6">Articles liés</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {articles.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/blog" className="text-[#D4A843] text-sm font-medium hover:underline">
                Voir tout le blog
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
