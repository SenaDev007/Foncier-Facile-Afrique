import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EbookForm from '@/components/ebooks/admin/EbookForm'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ebook = await prisma.ebook.findUnique({ where: { id: params.id } })
  return { title: ebook ? `Modifier : ${ebook.titre}` : 'Modifier ebook — Admin FFA' }
}

export default async function AdminEbookModifierPage({ params }: PageProps) {
  const ebook = await prisma.ebook.findUnique({ where: { id: params.id } })
  if (!ebook) notFound()
  return <EbookForm initialData={ebook} />
}
