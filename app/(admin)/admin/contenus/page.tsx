'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, FileCode, Edit, ChevronRight } from 'lucide-react'

interface PageWithCount {
  id: string
  slug: string
  titre: string
  _count: { sections: number }
}

const SLUG_LABELS: Record<string, string> = {
  home: 'Page d\'accueil',
  services: 'Services',
  'notre-expertise': 'Notre expertise',
  footer: 'Pied de page',
}

export default function AdminContenusPage() {
  const [pages, setPages] = useState<PageWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/pages')
      .then((r) => r.json())
      .then(setPages)
      .catch(() => setPages([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#D4A843]" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Contenus des pages</h1>
        <p className="text-[#8E8E93] text-sm mt-1">
          Modifier les textes et blocs affichés sur le site (accueil, services, expertise, footer).
        </p>
      </div>

      <div className="space-y-2">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={`/admin/contenus/${page.slug}`}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#2C2C2E] border border-[#3A3A3C] hover:border-[#D4A843]/50 hover:bg-[#2C2C2E]/90 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[rgba(212,168,67,0.12)]">
                <FileCode className="h-5 w-5 text-[#D4A843]" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-[#EFEFEF]">
                  {SLUG_LABELS[page.slug] ?? page.titre}
                </p>
                <p className="text-xs text-[#8E8E93]">
                  /{page.slug} · {page._count.sections} section(s)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
              <ChevronRight className="h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      {pages.length === 0 && (
        <p className="text-[#8E8E93] text-center py-10">
          Aucune page. Lancez le seed pour créer les pages par défaut.
        </p>
      )}
    </div>
  )
}
