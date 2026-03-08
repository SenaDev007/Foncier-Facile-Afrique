import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    select: { titre: true, resume: true, imageUrl: true },
  })
  if (!post) return { title: 'Article introuvable' }
  return {
    title: `${post.titre} — Blog Foncier Facile Afrique`,
    description: post.resume ?? undefined,
    openGraph: { images: post.imageUrl ? [post.imageUrl] : [] },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, statut: 'PUBLIE' },
    include: { auteur: { select: { name: true } } },
  })

  if (!post) notFound()

  return (
    <div className="bg-[#F9F9F6] min-h-screen">
      <div className="container-site py-10 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-grey text-sm hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour au blog
        </Link>

        <article>
          {post.imageUrl && (
            <div className="relative h-72 rounded-2xl overflow-hidden mb-8">
              <Image src={post.imageUrl} alt={post.imageAlt ?? post.titre} fill className="object-cover" sizes="(max-width:768px) 100vw, 768px" priority />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2.5 py-1 rounded-full font-medium">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-heading text-3xl font-bold text-dark mb-4">{post.titre}</h1>

            <div className="flex flex-wrap gap-4 text-grey text-sm mb-8 pb-6 border-b border-gray-100">
              {post.auteur?.name && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" aria-hidden="true" />
                  {post.auteur.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                  {formatDate(post.publishedAt.toISOString())}
                </span>
              )}
            </div>

            <div
              className="prose prose-green max-w-none"
              dangerouslySetInnerHTML={{ __html: post.contenu }}
            />
          </div>
        </article>

        <div className="mt-10 bg-primary rounded-2xl p-8 text-center">
          <h2 className="font-heading text-xl font-bold text-white mb-2">Intéressé par un bien immobilier ?</h2>
          <p className="text-gray-200 text-sm mb-5">Contactez nos experts pour un accompagnement personnalisé.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-gold text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-yellow-600 transition-colors text-sm">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  )
}
