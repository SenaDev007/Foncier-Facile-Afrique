import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { adminPageMetadata } from '@/lib/seo'
import EbookForm from '@/components/ebooks/admin/EbookForm'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ebook = await prisma.ebook.findUnique({ where: { id: params.id } })
  const title = ebook ? `Modifier : ${ebook.titre} — Admin FFA` : 'Modifier ebook — Admin FFA'
  return adminPageMetadata({
    title,
    pathname: `/admin/ebooks/${params.id}/modifier`,
    description: ebook ? `Modifier l’ebook « ${ebook.titre} ».` : 'Modifier un ebook.',
  })
}

export default async function AdminEbookModifierPage({ params }: PageProps) {
  const ebook = await prisma.ebook.findUnique({ where: { id: params.id } })
  if (!ebook) notFound()
  return <EbookForm initialData={ebook} />
}
