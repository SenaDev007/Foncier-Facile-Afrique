import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import BlogCard from '@/components/public/BlogCard'
import type { BlogPostWithAuthor } from '@/types'

export const metadata: Metadata = publicPageMetadata({
  title: 'Blog & Conseils',
  description:
    "Conseils experts en immobilier et foncier en Afrique de l'Ouest. Guides d'achat, actualités, tendances du marché immobilier béninois.",
  pathname: '/blog',
  keywords: ['blog foncier Bénin', 'conseil immobilier Afrique de l’Ouest'],
})

interface PageProps {
  searchParams: { page?: string; tag?: string }
}

const ITEMS_PER_PAGE = 9

async function getBlogPosts(params: PageProps['searchParams']) {
  const page = Math.max(1, parseInt(params.page ?? '1'))
  const skip = (page - 1) * ITEMS_PER_PAGE

  const where = {
    statut: 'PUBLIE' as const,
    ...(params.tag ? { tags: { has: params.tag } } : {}),
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { auteur: { select: { id: true, name: true } } },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.blogPost.count({ where }),
  ])

  return { posts, total, page, totalPages: Math.ceil(total / ITEMS_PER_PAGE) }
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { posts: rawPosts, total, page, totalPages } = await getBlogPosts(searchParams)
  const posts = JSON.parse(JSON.stringify(rawPosts))

  return (
    <div className="bg-ffa-ink min-h-screen">
      {/* Hero avec image */}
      <section className="relative overflow-hidden border-b border-ffa-divider" style={{ minHeight: '380px' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-blog.jpg"
            alt="Conseils experts en immobilier"
            fill
            className="object-cover object-center"
            style={{ animation: 'slowZoom 25s ease-in-out infinite alternate' }}
            priority
            sizes="100vw"
          />
          {/* Overlays */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(22,22,24,0.95) 0%, rgba(22,22,24,0.80) 55%, rgba(22,22,24,0.45) 100%)',
            }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,30,1) 0%, transparent 60%)' }} />
        </div>
        <style>{`@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.15); } }`}</style>
        <div className="container-site relative z-10 text-center py-16 md:py-24">
          <p className="text-ffa-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Ressources
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ffa-fg leading-tight">Blog & Conseils</h1>
          <p className="mt-4 text-ffa-fg-muted text-lg max-w-xl mx-auto leading-relaxed">
            Expertise foncière, guides d&apos;achat et actualités immobilières en Afrique de l&apos;Ouest.
          </p>
        </div>
      </section>

      <div className="container-site py-12">
        <p className="text-ffa-fg-muted text-sm mb-8">{total} article{total > 1 ? 's' : ''}</p>

        {posts.length > 0 ? (
          <>
            <div className="grid justify-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),320px))]">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post as BlogPostWithAuthor} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="flex justify-center items-center gap-2 mt-10" aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`/blog?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-ffa-gold text-ffa-navy' : 'bg-ffa-elevated text-ffa-fg-muted hover:bg-ffa-panel hover:text-ffa-fg border border-ffa-divider'}`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </a>
                ))}
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-ffa-elevated border border-ffa-divider rounded-2xl">
            <p className="text-ffa-fg-muted text-lg">Aucun article publié pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
