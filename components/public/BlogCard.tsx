import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User } from 'lucide-react'
import { formatDate, truncate } from '@/lib/utils'
import type { BlogPostWithAuthor } from '@/types'

interface BlogCardProps {
  post: BlogPostWithAuthor
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group flex flex-col">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 bg-primary-light overflow-hidden">
          {post.imageUne ? (
            <Image
              src={post.imageUne}
              alt={post.titre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-primary font-heading text-xl font-semibold opacity-30">FFA</span>
            </div>
          )}
          {post.tags.length > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-white/90 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                {post.tags[0]}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-grey text-xs mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            {post.auteur.name}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-heading font-bold text-dark text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {post.titre}
          </h3>
        </Link>

        {post.resume && (
          <p className="mt-2 text-grey text-sm line-clamp-3 flex-1">
            {truncate(post.resume, 130)}
          </p>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
        >
          Lire la suite →
        </Link>
      </div>
    </article>
  )
}
