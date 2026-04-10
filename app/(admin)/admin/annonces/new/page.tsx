import { adminPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AnnonceForm } from '@/components/admin/AnnonceForm'

export const metadata = adminPageMetadata({
  title: 'Nouvelle annonce — Admin FFA',
  pathname: '/admin/annonces/new',
  description: 'Créer une nouvelle annonce immobilière pour le site public.',
})

export default function NewAnnoncePage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/annonces" className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux annonces
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Nouvelle annonce</h1>
      </div>
      <AnnonceForm />
    </div>
  )
}
