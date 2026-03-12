'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Download, Loader2 } from 'lucide-react'

interface MerciContentProps {
  txFromUrl?: string | null
}

export default function MerciContent({ txFromUrl }: MerciContentProps) {
  const [status, setStatus] = useState<{
    loading: boolean
    paid?: boolean
    downloadUrl?: string
    titre?: string
  }>({ loading: Boolean(txFromUrl) })

  useEffect(() => {
    if (!txFromUrl) return

    let cancelled = false
    const check = async () => {
      try {
        const res = await fetch(`/api/ebooks/merci-status?tx=${encodeURIComponent(txFromUrl)}`)
        const data = await res.json()
        if (cancelled) return
        if (data.paid && data.downloadUrl) {
          setStatus({ loading: false, paid: true, downloadUrl: data.downloadUrl, titre: data.titre })
          return
        }
        setStatus((s) => ({ ...s, loading: false, paid: false }))
      } catch {
        if (!cancelled) setStatus((s) => ({ ...s, loading: false }))
      }
    }

    check()
    const t = setTimeout(check, 3000)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [txFromUrl])

  return (
    <main className="min-h-screen bg-[#1C1C1E] pt-24 pb-20 flex items-center justify-center">
      <div className="container-site px-6 text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[rgba(52,199,89,0.15)] text-[#34C759] mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-[#EFEFEF] mb-3">
          Merci pour votre achat
        </h1>

        {status.loading && (
          <p className="text-[#8E8E93] text-lg mb-6 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Vérification du paiement...
          </p>
        )}

        {!status.loading && status.paid && status.downloadUrl && (
          <p className="text-[#EFEFEF] text-lg mb-4">
            Votre paiement est confirmé. Téléchargez votre ebook ci-dessous (lien valide 24h, 3 téléchargements max).
          </p>
        )}

        {!status.loading && !status.paid && (
          <p className="text-[#8E8E93] text-lg mb-8">
            Votre paiement est en cours de traitement. Vous recevrez un email avec le lien de
            téléchargement dès que la transaction sera confirmée.
          </p>
        )}

        {!status.loading && status.paid && status.downloadUrl && (
          <div className="mb-8">
            <a
              href={status.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-6 py-3 rounded-xl hover:bg-[#B8912E] transition-colors"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              Télécharger {status.titre ? `"${status.titre}"` : 'l\'ebook'}
            </a>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/ebooks"
            className="inline-flex items-center justify-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-6 py-3 rounded-xl hover:bg-[#B8912E] transition-colors"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" /> Retour à la boutique
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-[#3A3A3C] text-[#EFEFEF] font-medium px-6 py-3 rounded-xl hover:bg-[#2C2C2E] transition-colors"
          >
            <Download className="w-4 h-4" aria-hidden="true" /> Accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
