import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { LogementForm } from '@/components/admin/LogementForm'

export const metadata: Metadata = { title: 'Nouveau logement — Admin FFA' }

export default function NouveauLogementPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/logements"
          className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux logements
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Nouveau logement</h1>
        <p className="text-[#8E8E93] text-sm mt-1">Création d&apos;une fiche séjour (catalogue public).</p>
      </div>
      <LogementForm mode="create" />
    </div>
  )
}
