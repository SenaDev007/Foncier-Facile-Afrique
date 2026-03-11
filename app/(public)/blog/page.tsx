import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlogCard from '@/components/public/BlogCard'
import type { BlogPostWithAuthor } from '@/types'

export const metadata: Metadata = {
  title: 'Blog & Conseils — Foncier Facile Afrique',
  description: 'Conseils experts en immobilier et foncier en Afrique de l\'Ouest. Guides d\'achat, actualités, tendances du marché immobilier béninois.',
  openGraph: { title: 'Blog — Foncier Facile Afrique' },
}

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
  const { posts, total, page, totalPages } = await getBlogPosts(searchParams)

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-[#2C2C2E]">
        <div className="absolute inset-0 bg-[#161618]" />
        <div className="container-site relative z-10 text-center">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Ressources
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF]">Blog & Conseils</h1>
          <p className="mt-4 text-[#8E8E93] text-lg max-w-xl mx-auto">
            Expertise foncière, guides d&apos;achat et actualités immobilières en Afrique de l&apos;Ouest.
          </p>
        </div>
      </section>

      <div className="container-site py-12">
        <p className="text-[#8E8E93] text-sm mb-8">{total} article{total > 1 ? 's' : ''}</p>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-[#D4A843] text-[#1C1C1E]' : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-[#EFEFEF] border border-[#3A3A3C]'}`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </a>
                ))}
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl">
            <p className="text-[#8E8E93] text-lg">Aucun article publié pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
