import type { Metadata } from 'next'
import { adminPageMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { TemoignageForm } from '@/components/admin/TemoignageForm'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await prisma.temoignage.findUnique({
    where: { id: params.id },
    select: { nom: true },
  })
  const title = t ? `Modifier témoignage : ${t.nom} — Admin FFA` : 'Modifier témoignage — Admin FFA'
  return adminPageMetadata({
    title,
    pathname: `/admin/temoignages/${params.id}/edit`,
    description: t ? `Éditer l’avis de ${t.nom}.` : 'Modifier un témoignage client.',
  })
}

export default async function EditTemoignagePage({ params }: PageProps) {
  const t = await prisma.temoignage.findUnique({
    where: { id: params.id },
  })

  if (!t) notFound()

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/temoignages" className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux témoignages
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Modifier le témoignage</h1>
        <p className="text-[#8E8E93] text-sm mt-1">{t.nom}</p>
      </div>
      <TemoignageForm
        initialData={{
          id: t.id,
          nom: t.nom,
          photo: t.photo,
          texte: t.texte,
          note: t.note,
          actif: t.actif,
          ordre: t.ordre,
        }}
      />
    </div>
  )
}
