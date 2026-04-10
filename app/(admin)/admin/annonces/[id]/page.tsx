import { redirect } from 'next/navigation'
import { adminPageMetadata } from '@/lib/seo'

interface PageProps {
  params: { id: string }
}

export const metadata = adminPageMetadata({
  title: 'Annonce — Admin FFA',
  pathname: '/admin/annonces',
  description: 'Redirection vers l’édition de l’annonce.',
})

/** Redirige /admin/annonces/[id] vers /admin/annonces/[id]/edit */
export default function AdminAnnonceIdPage({ params }: PageProps) {
  redirect(`/admin/annonces/${params.id}/edit`)
}
