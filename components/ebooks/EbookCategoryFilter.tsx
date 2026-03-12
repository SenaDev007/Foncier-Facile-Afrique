'use client'

import { useState } from 'react'
import EbookGrid from './EbookGrid'
import type { Ebook } from '@prisma/client'

interface EbookCategoryFilterProps {
  categories: string[]
  ebooks: Ebook[]
}

export default function EbookCategoryFilter({ categories, ebooks }: EbookCategoryFilterProps) {
  const [selected, setSelected] = useState('Tous')
  const filtered =
    selected === 'Tous' ? ebooks : ebooks.filter((e) => e.categorie === selected)

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelected(cat)}
            className={`px-5 py-2 rounded-full text-sm border transition-all ${
              selected === cat
                ? 'border-[#D4A843] text-[#D4A843] bg-[rgba(212,168,67,0.1)]'
                : 'border-[#3A3A3C] text-[#8E8E93] hover:border-[#D4A843] hover:text-[#D4A843]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <EbookGrid ebooks={filtered} />
    </>
  )
}
