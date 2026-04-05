'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { FadeInPage } from '@/components/ui/PageTransition'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <FadeInPage>
      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="text-[120px] font-bold text-[#D4A843] leading-none opacity-20 font-heading">500</div>
          <h1 className="font-heading text-3xl font-bold text-[#EFEFEF] mt-4">Une erreur est survenue</h1>
          <p className="text-[#8E8E93] mt-3 text-lg">
            Nous sommes désolés, quelque chose s&apos;est mal passé. Notre équipe a été notifiée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={reset}
              className="bg-[#D4A843] text-[#EFEFEF] px-6 py-3 rounded-lg font-medium hover:bg-[#B8912E] transition-colors"
            >
              Réessayer
            </button>
            <Link
              href="/"
              className="border-2 border-[#D4A843] text-[#D4A843] px-6 py-3 rounded-lg font-medium hover:bg-[#D4A843] hover:text-[#EFEFEF] transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </FadeInPage>
  )
}
