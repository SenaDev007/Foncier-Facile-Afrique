'use client'

import EbookCard from './EbookCard'
import type { Ebook } from '@prisma/client'

interface EbookGridProps {
  ebooks: Ebook[]
}

export default function EbookGrid({ ebooks }: EbookGridProps) {
  if (ebooks.length === 0) {
    return (
      <div className="text-center py-16 text-[#8E8E93]">
        <p>Aucun ebook disponible pour le moment.</p>
      </div>
    )
  }
  return (
    <div className="grid justify-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),320px))]">
      {ebooks.map((ebook) => (
        <EbookCard key={ebook.id} ebook={ebook} />
      ))}
    </div>
  )
}
