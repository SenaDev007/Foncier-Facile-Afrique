import { adminPageMetadata } from '@/lib/seo'
import type { Prisma } from '@prisma/client'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export const metadata = adminPageMetadata({
  title: 'Blog — Admin FFA',
  pathname: '/admin/blog',
  description: 'Articles du blog public : brouillons, planification et publication.',
})

interface PageProps {
  searchParams: { page?: string; statut?: string }
}

const ITEMS_PER_PAGE = 15

export default async function AdminBlogPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const skip = (page - 1) * ITEMS_PER_PAGE

  const where = {
    ...(searchParams.statut ? { statut: searchParams.statut as 'BROUILLON' | 'PUBLIE' | 'ARCHIVE' } : {}),
  }

  type BlogRow = Prisma.BlogPostGetPayload<{ include: { auteur: { select: { name: true } } } }>
  let posts: BlogRow[] = []
  let total = 0
  let dbUnavailable = false
  try {
    ;[posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { auteur: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.blogPost.count({ where }),
    ])
  } catch (e) {
    dbUnavailable = true
    console.error('[AdminBlogPage] Prisma (ex. P1001 Neon injoignable) :', e)
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      {dbUnavailable && (
        <p
          role="alert"
          className="rounded-xl border border-amber-500/35 bg-amber-500/10 text-amber-100 text-sm px-4 py-3"
        >
          Base de données injoignable (souvent Neon suspendu, réseau ou <code className="text-amber-200/90">DATABASE_URL</code>{' '}
          incorrecte). Réactivez le projet dans la console Neon ou vérifiez votre connexion, puis rechargez la page.
        </p>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Blog</h1>
          <p className="text-[#8E8E93] text-sm mt-1">{total} article{total !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#B8912E] transition-colors">
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouvel article
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {[undefined, 'BROUILLON', 'PUBLIE', 'ARCHIVE'].map((s) => (
          <Link
            key={s ?? 'all'}
            href={s ? `/admin/blog?statut=${s}` : '/admin/blog'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${(searchParams.statut ?? undefined) === s ? 'bg-[#D4A843] text-[#1C1C1E]' : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[rgba(212,168,67,0.12)] hover:text-[#D4A843]'}`}
          >
            {s ?? 'Tous'}
          </Link>
        ))}
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3A3C]">
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium">Titre</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden md:table-cell">Auteur</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium">Statut</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden lg:table-cell">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-[#8E8E93]">Aucun article.</td></tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-[#3A3A3C] hover:bg-[#3A3A3C] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#EFEFEF] truncate max-w-[250px]">{post.titre}</p>
                  <p className="text-xs text-[#8E8E93]">{post.slug}</p>
                </td>
                <td className="px-4 py-3 text-[#8E8E93] hidden md:table-cell">{post.auteur?.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.statut === 'PUBLIE' ? 'bg-emerald-500/20 text-emerald-300' : post.statut === 'BROUILLON' ? 'bg-[rgba(212,168,67,0.2)] text-[#D4A843]' : 'bg-[#3A3A3C] text-[#8E8E93]'}`}>
                    {post.statut}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#8E8E93] hidden lg:table-cell">
                  {post.publishedAt ? formatDate(post.publishedAt.toISOString()) : formatDate(post.createdAt.toISOString())}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${post.id}/edit`} className="text-xs text-[#D4A843] font-medium hover:underline">Modifier</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/blog?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-[#D4A843] text-[#1C1C1E]' : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[#3A3A3C]'}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
