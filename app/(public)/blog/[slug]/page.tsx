import type { Metadata } from 'next'
import { publicPageMetadata, truncateMetaDescription } from '@/lib/seo'
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
    select: {
      titre: true,
      resume: true,
      metaDesc: true,
      metaTitle: true,
      imageUne: true,
      statut: true,
      publishedAt: true,
      updatedAt: true,
      auteur: { select: { name: true } },
    },
  })
  const pathname = `/blog/${params.slug}`
  if (!post) {
    return publicPageMetadata({
      title: 'Article introuvable',
      description: 'Cet article de blog n’existe pas ou n’est plus en ligne.',
      pathname,
      noindex: true,
    })
  }
  const published = post.statut === 'PUBLIE'
  const title = post.metaTitle?.trim() || post.titre
  const descRaw = post.metaDesc?.trim() || post.resume?.trim() || post.titre
  return publicPageMetadata({
    title,
    description: truncateMetaDescription(descRaw),
    pathname,
    ogImage: post.imageUne,
    ogType: published ? 'article' : 'website',
    noindex: !published,
    article: published
      ? {
          publishedTime: post.publishedAt?.toISOString(),
          modifiedTime: post.updatedAt.toISOString(),
          authors: post.auteur?.name ? [post.auteur.name] : undefined,
        }
      : undefined,
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, statut: 'PUBLIE' },
    include: { auteur: { select: { name: true } } },
  })

  if (!post) notFound()

  const safeContent = DOMPurify.sanitize(post.contenu)

  return (
    <div className="bg-ffa-ink min-h-screen">
      <div className="container-site py-10 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-ffa-fg-muted text-sm hover:text-ffa-gold transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour au blog
        </Link>

        <article>
          {post.imageUne && (
            <div className="relative h-72 rounded-2xl overflow-hidden mb-8 border border-ffa-divider">
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

          <div className="bg-ffa-elevated border border-ffa-divider rounded-2xl p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-[rgba(212,168,67,0.15)] text-ffa-gold px-2.5 py-1 rounded-full font-medium border border-ffa-gold/25">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-heading text-3xl font-bold text-ffa-fg mb-4">{post.titre}</h1>

            <div className="flex flex-wrap gap-4 text-ffa-fg-muted text-sm mb-6 pb-6 border-b border-ffa-divider">
              {post.auteur?.name && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-ffa-gold" aria-hidden="true" />
                  {post.auteur.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-ffa-gold" aria-hidden="true" />
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

        <div className="mt-10 bg-ffa-elevated border border-ffa-gold/30 rounded-2xl p-8 text-center">
          <h2 className="font-heading text-xl font-bold text-ffa-fg mb-2">Intéressé par un bien immobilier ?</h2>
          <p className="text-ffa-fg-muted text-sm mb-5">Contactez nos experts pour un accompagnement personnalisé.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-ffa-gold text-ffa-navy font-semibold px-5 py-2.5 rounded-xl hover:bg-ffa-gold-light transition-colors text-sm">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  )
}
