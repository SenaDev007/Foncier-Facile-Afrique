'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, User } from 'lucide-react'
import { formatDate, truncate } from '@/lib/utils'
import type { BlogPostWithAuthor } from '@/types'

interface BlogCardProps {
  post: BlogPostWithAuthor
  index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const imageParTag: Record<string, string> = {
    investissement: '/images/blog/investissement.jpg',
    'titre foncier': '/images/blog/titre-foncier.jpg',
    marché: '/images/blog/marche-immobilier.jpg',
  }
  const firstTag = post.tags?.[0]?.toLowerCase()
  const imageSrc = post.imageUne ?? imageParTag[firstTag ?? ''] ?? '/images/blog/investissement.jpg'

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="h-full flex flex-col"
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full flex flex-col">
        <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#D4A843]/10 hover:border-[#D4A843]/40 transition-all duration-300 h-full flex flex-col">
          <div className="relative h-52 bg-[#3A3A3C] overflow-hidden">
            <Image
              src={imageSrc}
              alt={post.titre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2E]/90 via-transparent to-transparent opacity-60" />
            {post.tags?.length > 0 && (
              <div className="absolute bottom-3 left-3">
                <span className="bg-[rgba(212,168,67,0.9)] text-[#1C1C1E] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {post.tags?.[0]}
                </span>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-3 text-[#8E8E93] text-xs mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                {post.auteur?.name ?? 'FFA'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[#EFEFEF] text-lg line-clamp-2 group-hover:text-[#D4A843] transition-colors">
              {post.titre}
            </h3>

            {post.resume && (
              <p className="mt-2 text-[#8E8E93] text-sm line-clamp-3 flex-1">
                {truncate(post.resume, 130)}
              </p>
            )}

            <span className="mt-4 text-[#D4A843] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Lire la suite →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
