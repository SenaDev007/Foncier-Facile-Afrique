'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Lock, Mail } from 'lucide-react'
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#D4A843] mb-3">
            <span className="text-white font-heading font-bold text-lg">FFA</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Back-office</h1>
          <p className="text-[#8E8E93] text-sm mt-1">Foncier Facile Afrique</p>
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
                  placeholder="isdineidisoule@gmail.com"
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
                  placeholder="Admin@2024!"
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
          
          <div className="mt-6 text-center">
            <p className="text-[#8E8E93] text-xs">
              Identifiant par défaut : isdineidisoule@gmail.com
            </p>
            <p className="text-[#8E8E93] text-xs">
              Mot de passe : Admin@2024!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
