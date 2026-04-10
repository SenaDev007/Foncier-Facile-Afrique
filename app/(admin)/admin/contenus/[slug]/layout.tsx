import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { adminPageMetadata } from '@/lib/seo'

type Props = { children: ReactNode; params: { slug: string } }

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.slug
  return adminPageMetadata({
    title: `Contenu : ${slug} — Admin FFA`,
    pathname: `/admin/contenus/${slug}`,
    description: `Édition des sections de la page « ${slug} ».`,
  })
}

export default function AdminContenuSlugLayout({ children }: { children: ReactNode }) {
  return children
}
