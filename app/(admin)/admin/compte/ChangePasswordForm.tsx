'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/account/password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast.success('Mot de passe mis à jour. Utilisez-le à la prochaine connexion.')
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        toast.error(typeof data.error === 'string' ? data.error : 'Échec de la mise à jour')
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <div>
        <Label htmlFor="currentPassword" className="text-[#EFEFEF]">
          Mot de passe actuel
        </Label>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
            required
            className="pl-9 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="newPassword" className="text-[#EFEFEF]">
          Nouveau mot de passe (min. 8 caractères)
        </Label>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
            required
            minLength={8}
            className="pl-9 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="confirmPassword" className="text-[#EFEFEF]">
          Confirmer le nouveau mot de passe
        </Label>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            required
            minLength={8}
            className="pl-9 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E] font-semibold gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Enregistrer le nouveau mot de passe
      </Button>
    </form>
  )
}
