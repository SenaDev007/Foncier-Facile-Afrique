import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { BlogForm } from '@/components/admin/BlogForm'

export const metadata: Metadata = { title: 'Modifier article — Admin FFA' }

interface PageProps {
  params: { id: string }
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      titre: true,
      resume: true,
      contenu: true,
      statut: true,
      metaTitle: true,
      metaDesc: true,
      tags: true,
      imageUne: true,
    },
  })

  if (!post) notFound()

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux articles
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Modifier l&apos;article</h1>
        <p className="text-[#8E8E93] text-sm mt-1">{post.titre}</p>
      </div>
      <BlogForm
        initialData={{
          id: post.id,
          titre: post.titre,
          resume: post.resume ?? '',
          contenu: post.contenu,
          statut: post.statut,
          metaTitle: post.metaTitle ?? '',
          metaDesc: post.metaDesc ?? '',
          tags: post.tags,
          imageUne: post.imageUne ?? '',
        }}
      />
    </div>
  )
}
