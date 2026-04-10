'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Lock, Mail, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(searchParams?.get('error') || '')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (res?.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Email ou mot de passe incorrect.')
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1E]"
            aria-label="Aller sur le site public"
          >
            <Image
              src="/images/logo/logo FFA.png"
              alt=""
              width={80}
              height={80}
              className="object-contain"
              sizes="80px"
              priority
            />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Back-office</h1>
          <p className="text-[#8E8E93] text-sm mt-1">Foncier Facile Afrique</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[#D4A843] hover:text-[#E8B84B] hover:underline mt-4"
          >
            Voir le site public
            <ExternalLink className="h-3.5 w-3.5 opacity-90" aria-hidden="true" />
          </Link>
        </div>

        <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="email" className="text-[#EFEFEF]">Adresse email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  className="pl-9 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-[#EFEFEF]">Mot de passe</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  className="pl-9 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2" role="alert">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E] font-semibold">
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Se connecter
            </Button>
          </form>

          <p className="mt-4 text-center">
            <Link
              href="/admin/mot-de-passe-oublie"
              className="text-sm text-[#D4A843] hover:text-[#E8B84B] hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </p>

          <p className="mt-4 text-center text-[#8E8E93] text-xs">
            Compte fourni par l’administrateur. En cas de difficulté, contactez la direction.
          </p>
        </div>
      </div>
    </div>
  )
}
