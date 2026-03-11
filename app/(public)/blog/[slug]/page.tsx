import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import ShareButtons from '@/components/public/ShareButtons'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    select: { titre: true, resume: true, imageUne: true },
  })
  if (!post) return { title: 'Article introuvable' }
  return {
    title: `${post.titre} — Blog Foncier Facile Afrique`,
    description: post.resume ?? undefined,
    openGraph: { images: post.imageUne ? [post.imageUne] : [] },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, statut: 'PUBLIE' },
    include: { auteur: { select: { name: true } } },
  })

  if (!post) notFound()

  const safeContent = DOMPurify.sanitize(post.contenu)

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <div className="container-site py-10 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-[#8E8E93] text-sm hover:text-[#D4A843] transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour au blog
        </Link>

        <article>
          {post.imageUne && (
            <div className="relative h-72 rounded-2xl overflow-hidden mb-8 border border-[#3A3A3C]">
              <Image
                src={post.imageUne}
                alt={post.titre}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-[rgba(212,168,67,0.15)] text-[#D4A843] px-2.5 py-1 rounded-full font-medium border border-[rgba(212,168,67,0.25)]">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-heading text-3xl font-bold text-[#EFEFEF] mb-4">{post.titre}</h1>

            <div className="flex flex-wrap gap-4 text-[#8E8E93] text-sm mb-6 pb-6 border-b border-[#3A3A3C]">
              {post.auteur?.name && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-[#D4A843]" aria-hidden="true" />
                  {post.auteur.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#D4A843]" aria-hidden="true" />
                  {formatDate(post.publishedAt.toISOString())}
                </span>
              )}
            </div>

            <div className="mb-8">
              <ShareButtons
                url={`/blog/${post.slug}`}
                title={post.titre}
                description={post.resume ?? undefined}
              />
            </div>

            <div
              className="prose-ffa prose-ffa-dark max-w-none"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </div>
        </article>

        <div className="mt-10 bg-[#2C2C2E] border border-[#D4A843]/30 rounded-2xl p-8 text-center">
          <h2 className="font-heading text-xl font-bold text-[#EFEFEF] mb-2">Intéressé par un bien immobilier ?</h2>
          <p className="text-[#8E8E93] text-sm mb-5">Contactez nos experts pour un accompagnement personnalisé.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#B8912E] transition-colors text-sm">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  )
}
