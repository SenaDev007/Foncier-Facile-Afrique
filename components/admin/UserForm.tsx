'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type RoleOption = 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'EDITEUR'

const ROLE_LABELS: Record<RoleOption, string> = {
  SUPER_ADMIN: 'Super administrateur',
  ADMIN: 'Administrateur',
  AGENT: 'Agent',
  EDITEUR: 'Éditeur',
}

interface UserFormProps {
  allowedRoles: RoleOption[]
}

export function UserForm({ allowedRoles }: UserFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<RoleOption>(allowedRoles[0] ?? 'AGENT')
  const [active, setActive] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Le nom est requis')
      return
    }
    if (!email.trim()) {
      toast.error('L\'email est requis')
      return
    }
    if (!password) {
      toast.error('Le mot de passe est requis')
      return
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/utilisateurs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          active,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Erreur lors de la création')
        return
      }
      toast.success(data.message ?? 'Utilisateur créé avec succès')
      router.push('/admin/utilisateurs')
      router.refresh()
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/utilisateurs"
          className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux utilisateurs
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF] flex items-center gap-2">
          <UserPlus className="h-7 w-7 text-[#D4A843]" aria-hidden="true" />
          Créer un compte utilisateur
        </h1>
        <p className="text-[#8E8E93] text-sm mt-1">
          Créez un compte avec mot de passe et droits d&apos;accès pour les personnes qui gèrent le site.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#EFEFEF]">Nom</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jean Dupont"
            className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
            autoComplete="name"
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#EFEFEF]">Email (identifiant de connexion)</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jean@exemple.com"
            className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
            autoComplete="email"
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#EFEFEF]">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
            autoComplete="new-password"
            minLength={8}
            disabled={saving}
          />
          <p className="text-xs text-[#8E8E93]">Minimum 8 caractères.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[#EFEFEF]">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
            autoComplete="new-password"
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#EFEFEF]">Rôle (droits d&apos;accès)</Label>
          <Select value={role} onValueChange={(v) => setRole(v as RoleOption)} disabled={saving}>
            <SelectTrigger className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allowedRoles.map((r) => (
                <SelectItem key={r} value={r} className="text-[#1C1C1E]">
                  {ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-[#8E8E93]">
            Super admin : tout le backoffice. Admin : gestion complète sauf paramètres sensibles. Agent : annonces/leads. Éditeur : contenu blog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="active"
            checked={active}
            onCheckedChange={(v) => setActive(v === true)}
            disabled={saving}
          />
          <Label htmlFor="active" className="text-[#EFEFEF] cursor-pointer">Compte actif (peut se connecter)</Label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving} className="bg-[#D4A843] text-[#1C1C1E] hover:bg-[#B8912E]">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <UserPlus className="h-4 w-4" aria-hidden="true" />}
            {saving ? 'Création…' : 'Créer le compte'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/utilisateurs')}
            disabled={saving}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}
