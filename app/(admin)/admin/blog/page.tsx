import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export const metadata: Metadata = { title: 'Blog — Admin FFA' }

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

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { auteur: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.blogPost.count({ where }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">Blog</h1>
          <p className="text-grey text-sm mt-1">{total} article{total > 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors">
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouvel article
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {[undefined, 'BROUILLON', 'PUBLIE', 'ARCHIVE'].map((s) => (
          <Link
            key={s ?? 'all'}
            href={s ? `/admin/blog?statut=${s}` : '/admin/blog'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${(searchParams.statut ?? undefined) === s ? 'bg-primary text-white' : 'bg-white text-grey hover:bg-primary-light hover:text-primary'}`}
          >
            {s ?? 'Tous'}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-grey font-medium">Titre</th>
              <th className="text-left px-4 py-3 text-grey font-medium hidden md:table-cell">Auteur</th>
              <th className="text-left px-4 py-3 text-grey font-medium">Statut</th>
              <th className="text-left px-4 py-3 text-grey font-medium hidden lg:table-cell">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-grey">Aucun article.</td></tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-dark truncate max-w-[250px]">{post.titre}</p>
                  <p className="text-xs text-grey">{post.slug}</p>
                </td>
                <td className="px-4 py-3 text-grey hidden md:table-cell">{post.auteur?.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.statut === 'PUBLIE' ? 'bg-green-100 text-green-700' : post.statut === 'BROUILLON' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-grey'}`}>
                    {post.statut}
                  </span>
                </td>
                <td className="px-4 py-3 text-grey hidden lg:table-cell">
                  {post.publishedAt ? formatDate(post.publishedAt.toISOString()) : formatDate(post.createdAt.toISOString())}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${post.id}`} className="text-xs text-primary font-medium hover:underline">Modifier</Link>
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
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'bg-white text-grey hover:bg-primary-light'}`}
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
