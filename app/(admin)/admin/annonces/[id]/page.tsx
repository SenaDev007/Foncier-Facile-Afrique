import { redirect } from 'next/navigation'

interface PageProps {
  params: { id: string }
}

/** Redirige /admin/annonces/[id] vers /admin/annonces/[id]/edit */
export default function AdminAnnonceIdPage({ params }: PageProps) {
  redirect(`/admin/annonces/${params.id}/edit`)
}
