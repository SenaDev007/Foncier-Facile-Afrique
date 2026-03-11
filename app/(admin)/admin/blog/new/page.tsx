import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { BlogForm } from '@/components/admin/BlogForm'

export const metadata: Metadata = { title: 'Nouvel article — Admin FFA' }

export default function NewBlogPostPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux articles
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Nouvel article</h1>
      </div>
      <BlogForm />
    </div>
  )
}
