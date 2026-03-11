'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Mail, Loader2 } from 'lucide-react'

export default function LeadMagnetBanner() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message ?? 'Inscription réussie !')
        setEmail('')
      } else {
        toast.error(data.error ?? 'Erreur lors de l\'inscription')
      }
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#1C1C1E] py-16 md:py-20 relative overflow-hidden border-t border-[#2C2C2E]" aria-labelledby="newsletter-title">
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" aria-hidden="true" />
      <div className="container-site relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-[rgba(212,168,67,0.12)] border border-[rgba(212,168,67,0.2)]">
              <Mail className="h-7 w-7 text-[#D4A843]" aria-hidden="true" />
            </div>
          </div>
          <h2 id="newsletter-title" className="font-heading text-2xl sm:text-3xl font-bold text-[#EFEFEF] text-center mx-auto">
            Recevez nos meilleures offres en avant-première
          </h2>
          <p className="mt-3 text-[#8E8E93] text-base">
            Inscrivez-vous à notre newsletter et soyez le premier informé des nouveaux terrains et biens disponibles.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Adresse email</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
              className="flex-1 px-4 py-3 rounded-xl bg-[#2C2C2E] border border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366] focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-[#D4A843] transition-colors"
              aria-required="true"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-6 py-3 rounded-xl hover:bg-[#B8912E] transition-colors disabled:opacity-70 whitespace-nowrap"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Je m&apos;inscris
            </button>
          </form>
          <p className="mt-3 text-[#8E8E93] text-xs">
            Pas de spam. Désinscription possible à tout moment.
          </p>
        </div>
      </div>
    </section>
  )
}
