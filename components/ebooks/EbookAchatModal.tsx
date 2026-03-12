'use client'

import { useState } from 'react'
import { X, ShoppingCart, Tag, CheckCircle } from 'lucide-react'
import type { Ebook } from '@prisma/client'

interface EbookAchatModalProps {
  ebook: Ebook
  onClose: () => void
}

export default function EbookAchatModal({ ebook, onClose }: EbookAchatModalProps) {
  const [form, setForm] = useState({ nom: '', email: '', tel: '', codePromo: '' })
  const [promoInfo, setPromoInfo] = useState<{
    valide: boolean
    nouveauPrix?: number
    raison?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const prixBase = ebook.prixPromo ?? ebook.prixCFA
  const prixFinal = promoInfo?.valide && promoInfo.nouveauPrix != null ? promoInfo.nouveauPrix : prixBase

  const verifierPromo = async () => {
    if (!form.codePromo) return
    const res = await fetch('/api/ebooks/promo/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ebookId: ebook.id, code: form.codePromo }),
    })
    const data = await res.json()
    setPromoInfo(data)
  }

  const handleSubmit = async () => {
    if (!form.nom || !form.email || !form.tel) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ebooks/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ebookId: ebook.id,
          nom: form.nom,
          email: form.email,
          tel: form.tel,
          codePromo: form.codePromo || undefined,
        }),
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        setError(data.error ?? 'Erreur de paiement. Réessayez.')
        setLoading(false)
      }
    } catch {
      setError('Erreur réseau.')
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#636366] hover:text-[#EFEFEF] transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-[#EFEFEF] font-bold text-xl mb-1">Acheter l&apos;ebook</h3>
        <p className="text-[#8E8E93] text-sm mb-6 line-clamp-1">{ebook.titre}</p>

        <div className="space-y-4">
          {[
            { key: 'nom' as const, label: 'Nom complet', type: 'text', placeholder: 'Jean Dupont' },
            { key: 'email' as const, label: 'Email', type: 'email', placeholder: 'jean@email.com' },
            {
              key: 'tel' as const,
              label: 'Téléphone (Mobile Money)',
              type: 'tel',
              placeholder: '+229 97 00 00 00',
            },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-[#8E8E93] text-xs font-medium mb-1 uppercase tracking-wider">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl px-4 py-3 text-[#EFEFEF] text-sm placeholder-[#636366] focus:outline-none focus:border-[#D4A843] transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="block text-[#8E8E93] text-xs font-medium mb-1 uppercase tracking-wider">
              Code promo (optionnel)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ex : FFA2026"
                value={form.codePromo}
                onChange={(e) => {
                  setForm({ ...form, codePromo: e.target.value })
                  setPromoInfo(null)
                }}
                className="flex-1 bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl px-4 py-3 text-[#EFEFEF] text-sm placeholder-[#636366] focus:outline-none focus:border-[#D4A843] transition-colors"
              />
              <button
                type="button"
                onClick={verifierPromo}
                className="px-4 py-3 bg-[#3A3A3C] text-[#D4A843] rounded-xl text-sm font-medium hover:bg-[rgba(212,168,67,0.15)] transition-colors flex items-center gap-1"
              >
                <Tag className="w-4 h-4" /> Appliquer
              </button>
            </div>
            {promoInfo?.valide && promoInfo.nouveauPrix != null && (
              <p className="text-[#34C759] text-xs mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Code valide — nouveau prix : {promoInfo.nouveauPrix.toLocaleString('fr-FR')} FCFA
              </p>
            )}
            {promoInfo && !promoInfo.valide && (
              <p className="text-[#FF453A] text-xs mt-1">{promoInfo.raison ?? 'Code invalide'}</p>
            )}
          </div>
        </div>

        {error && <p className="text-[#FF453A] text-xs mt-3">{error}</p>}

        <div className="mt-6 pt-4 border-t border-[#3A3A3C] flex items-center justify-between">
          <span className="text-[#8E8E93] text-sm">Total à payer</span>
          <span className="text-[#D4A843] font-bold text-2xl">
            {prixFinal.toLocaleString('fr-FR')} FCFA
          </span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-[#D4A843] text-[#1C1C1E] font-bold text-base py-4 rounded-xl hover:bg-[#B8912E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          {loading ? 'Redirection...' : 'Payer avec FedaPay'}
        </button>
        <p className="text-center text-[#636366] text-xs mt-3">
          Mobile Money · MTN · Moov · Carte bancaire
        </p>
      </div>
    </div>
  )
}
