'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Marquee } from '@/components/ui/3d-testimonails'
import { formatDate, truncate } from '@/lib/utils'
import type { BlogPostWithAuthor } from '@/types'

type Props = {
  posts: BlogPostWithAuthor[]
}

function BlogMiniCard({ post }: { post: BlogPostWithAuthor }) {
  const imageSrc = post.imageUne ?? '/images/blog/investissement.jpg'
  const author = post.auteur?.name ?? 'FFA'
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className="w-[250px] border-[#3A3A3C] bg-[#2C2C2E] text-[#EFEFEF] hover:border-[#D4A843]/45 transition-colors">
        <CardContent className="p-3">
          <div className="relative h-28 w-full overflow-hidden rounded-lg border border-[#3A3A3C] bg-[#1C1C1E]">
            <Image src={imageSrc} alt={post.titre} fill className="object-cover" sizes="250px" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-7 w-7 border border-[#D4A843]/30">
                <AvatarFallback className="bg-[#1C1C1E] text-[#D4A843] text-xs">
                  {author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-[#8E8E93] truncate">{author}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#8E8E93] shrink-0">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              {formatDate((post.publishedAt ?? post.createdAt).toString())}
            </span>
          </div>
          <h3 className="mt-2 text-sm font-semibold leading-snug line-clamp-2">{post.titre}</h3>
          <p className="mt-1 text-xs text-[#8E8E93] line-clamp-2">{truncate(post.resume ?? '', 72)}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export function LandingBlog3DSection({ posts }: Props) {
  const list = posts.length ? posts : []
  if (!list.length) return null
  return (
    <div className="relative mx-auto flex h-[26rem] w-full max-w-[980px] items-center justify-center overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#1C1C1E] [perspective:320px]">
      <div
        className="flex flex-row items-center gap-3 md:gap-4"
        style={{
          transform:
            'translateX(-78px) translateY(0px) translateZ(-70px) rotateX(18deg) rotateY(-11deg) rotateZ(14deg)',
        }}
      >
        <Marquee vertical pauseOnHover repeat={2} className="[--duration:34s]">
          {list.map((post) => (
            <BlogMiniCard key={`b1-${post.id}`} post={post} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={2} className="[--duration:36s] hidden sm:flex">
          {list.map((post) => (
            <BlogMiniCard key={`b2-${post.id}`} post={post} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover repeat={2} className="[--duration:32s] hidden md:flex">
          {list.map((post) => (
            <BlogMiniCard key={`b3-${post.id}`} post={post} />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#1C1C1E]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#1C1C1E]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[#1C1C1E]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-[#1C1C1E]" />

      <div className="pointer-events-none absolute bottom-4 right-4 hidden md:flex items-center gap-1 text-[11px] text-[#8E8E93]">
        Pause au survol pour lire
      </div>
      <Link
        href="/blog"
        className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-[#D4A843] text-sm font-medium hover:text-[#B8912E]"
      >
        Voir tous les articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}
