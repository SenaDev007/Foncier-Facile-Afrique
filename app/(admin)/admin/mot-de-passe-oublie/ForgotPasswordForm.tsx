'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue.')
        return
      }
      setSuccess(data.message ?? 'Si un compte existe, un e-mail a été envoyé.')
      setEmail('')
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/admin/login"
            className="relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1E]"
            aria-label="Retour à la connexion"
          >
            <Image
              src="/images/logo/logo FFA 1.png"
              alt=""
              width={80}
              height={80}
              className="object-contain"
              sizes="80px"
              priority
            />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Mot de passe oublié</h1>
          <p className="text-[#8E8E93] text-sm mt-1">Back-office — Foncier Facile Afrique</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-8">
          <p className="text-[#8E8E93] text-sm mb-6">
            Saisissez l’adresse e-mail de votre compte administrateur. Vous recevrez un lien valable environ une heure.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="email" className="text-[#EFEFEF]">
                Adresse email
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="text-emerald-400/95 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2" role="status">
                {success}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E] font-semibold"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Envoyer le lien
            </Button>
          </form>

          <Link
            href="/admin/login"
            className="mt-6 inline-flex items-center gap-2 text-sm text-[#D4A843] hover:text-[#E8B84B] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
