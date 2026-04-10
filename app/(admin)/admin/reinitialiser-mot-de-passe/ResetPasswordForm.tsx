'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  token: string
}

export function ResetPasswordForm({ token }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword: confirm }),
      })
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Réinitialisation impossible.')
        return
      }
      setSuccess(data.message ?? 'Mot de passe mis à jour.')
      setTimeout(() => {
        router.push('/admin/login')
        router.refresh()
      }, 2000)
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  if (!token || token.length < 64) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-8 text-center">
          <p className="text-[#EFEFEF] font-medium mb-2">Lien invalide</p>
          <p className="text-[#8E8E93] text-sm mb-6">
            Le lien est incomplet ou a expiré. Demandez un nouveau lien depuis la page « Mot de passe oublié ».
          </p>
          <Link href="/admin/mot-de-passe-oublie" className="text-[#D4A843] hover:underline text-sm font-medium">
            Mot de passe oublié
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-3 rounded-xl">
            <Image
              src="/images/logo/logo FFA.png"
              alt=""
              width={80}
              height={80}
              className="object-contain"
              sizes="80px"
              priority
            />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Nouveau mot de passe</h1>
          <p className="text-[#8E8E93] text-sm mt-1">Choisissez un mot de passe sécurisé (8 caractères minimum)</p>
        </div>

        <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="password" className="text-[#EFEFEF]">
                Nouveau mot de passe
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="pl-9 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="confirm" className="text-[#EFEFEF]">
                Confirmer
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  className="pl-9 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                {success} Redirection vers la connexion…
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || !!success}
              className="w-full gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E] font-semibold"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Enregistrer
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
