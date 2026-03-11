'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin]', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-[#1C1C1E]">
      <div className="text-center max-w-md">
        <p className="text-[#D4A843] font-heading text-sm uppercase tracking-wider mb-2">Erreur</p>
        <h1 className="font-heading text-xl font-bold text-[#EFEFEF]">Le tableau de bord a rencontré un problème</h1>
        <p className="text-[#8E8E93] text-sm mt-2">
          Vérifiez que la base de données est accessible et que les variables d&apos;environnement sont correctes.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <button
            onClick={reset}
            className="px-4 py-2 bg-[#D4A843] text-[#1C1C1E] font-semibold rounded-xl hover:bg-[#B8912E] transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/admin/login"
            className="px-4 py-2 border border-[#3A3A3C] text-[#EFEFEF] rounded-xl hover:bg-[#2C2C2E] transition-colors"
          >
            Retour au login
          </Link>
        </div>
      </div>
    </div>
  )
}
