import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Plus, Edit, Eye, Star } from 'lucide-react'

export const metadata: Metadata = { title: 'Ebooks — Admin FFA' }

export default async function AdminEbooksPage() {
  const ebooks = await prisma.ebook.findMany({
    include: { _count: { select: { commandes: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Ebooks</h1>
          <p className="text-[#8E8E93] text-sm mt-1">{ebooks.length} ebook(s) au total</p>
        </div>
        <Link
          href="/admin/ebooks/nouveau"
          className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#B8912E] transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouvel ebook
        </Link>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3A3C]">
              {['Couverture', 'Titre', 'Prix', 'Ventes', 'Statut', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-4 text-xs font-semibold text-[#D4A843] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ebooks.map((ebook) => (
              <tr
                key={ebook.id}
                className="border-b border-[#3A3A3C] hover:bg-[#3A3A3C]/50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="w-10 h-14 bg-[#3A3A3C] rounded overflow-hidden relative">
                    {ebook.couverture ? (
                      <Image
                        src={ebook.couverture}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : null}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-[#EFEFEF] font-medium text-sm">{ebook.titre}</p>
                  <p className="text-[#636366] text-xs">{ebook.categorie}</p>
                  {ebook.vedette && (
                    <span className="text-[#D4A843] text-xs flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3" /> Vedette
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <p className="text-[#D4A843] font-semibold text-sm">
                    {ebook.prixCFA.toLocaleString('fr-FR')} F
                  </p>
                  {ebook.prixPromo != null && (
                    <p className="text-[#FF453A] text-xs">
                      {ebook.prixPromo.toLocaleString('fr-FR')} F (promo)
                    </p>
                  )}
                </td>
                <td className="px-5 py-4 text-[#8E8E93] text-sm">{ebook._count.commandes}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ebook.publie
                        ? 'bg-[rgba(52,199,89,0.15)] text-[#34C759]'
                        : 'bg-[#3A3A3C] text-[#636366]'
                    }`}
                  >
                    {ebook.publie ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/ebooks/${ebook.id}/modifier`}
                      className="p-2 text-[#8E8E93] hover:text-[#D4A843] transition-colors rounded-lg"
                      aria-label="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/ebooks/${ebook.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#8E8E93] hover:text-[#D4A843] transition-colors rounded-lg"
                      aria-label="Voir sur le site"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ebooks.length === 0 && (
          <div className="text-center py-16 text-[#636366]">
            <p>Aucun ebook pour l&apos;instant.</p>
            <Link
              href="/admin/ebooks/nouveau"
              className="text-[#D4A843] text-sm mt-2 inline-block hover:underline"
            >
              Créer le premier ebook →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
