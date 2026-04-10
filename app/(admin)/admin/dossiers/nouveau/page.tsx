import { adminPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DossierCreateForm } from '@/components/admin/DossierCreateForm'

export const metadata = adminPageMetadata({
  title: 'Nouveau dossier — Admin FFA',
  pathname: '/admin/dossiers/nouveau',
  description: 'Créer un nouveau dossier de régularisation ou d’accompagnement foncier.',
})

export default async function NouveauDossierPage() {
  const session = await auth()
  const canAssign = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  const currentUserId = session?.user?.id ?? ''

  const agents = canAssign
    ? await prisma.user.findMany({
        where: { role: { in: ['AGENT', 'ADMIN', 'SUPER_ADMIN'] } },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      })
    : []

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/dossiers"
          className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux dossiers
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Nouveau dossier foncier</h1>
        <p className="text-[#8E8E93] text-sm mt-1">Création manuelle (équipe terrain ou administration).</p>
      </div>
      <DossierCreateForm canAssign={canAssign} agents={agents} currentUserId={currentUserId} />
    </div>
  )
}
