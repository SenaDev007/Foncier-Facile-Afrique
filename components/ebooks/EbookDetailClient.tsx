'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import EbookAchatModal from './EbookAchatModal'
import type { Ebook } from '@prisma/client'

interface EbookDetailClientProps {
  ebook: Ebook
}

export default function EbookDetailClient({ ebook }: EbookDetailClientProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-bold text-base px-8 py-4 rounded-xl hover:bg-[#B8912E] transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        Acheter cet ebook
      </button>
      {modalOpen && <EbookAchatModal ebook={ebook} onClose={() => setModalOpen(false)} />}
    </>
  )
}
