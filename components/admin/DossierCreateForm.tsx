'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { TypeRegul } from '@prisma/client'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TYPES_REGUL: { value: TypeRegul; label: string }[] = [
  { value: 'PH_TO_TF', label: 'Passage PH → TF' },
  { value: 'PREMIER_TF', label: 'Premier titre foncier' },
  { value: 'MUTATION', label: 'Mutation' },
  { value: 'LITIGE', label: 'Litige' },
  { value: 'MORCELLEMENT', label: 'Morcellement' },
  { value: 'AUDIT', label: 'Audit / expertise' },
]

const inputClass = 'bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]'

interface AgentOption {
  id: string
  name: string | null
}

interface DossierCreateFormProps {
  canAssign: boolean
  agents: AgentOption[]
  currentUserId: string
}

export function DossierCreateForm({ canAssign, agents, currentUserId }: DossierCreateFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [reference, setReference] = useState('')
  const [nomClient, setNomClient] = useState('')
  const [emailClient, setEmailClient] = useState('')
  const [telephoneClient, setTelephoneClient] = useState('')
  const [pays, setPays] = useState('')
  const [typeRegul, setTypeRegul] = useState<TypeRegul>('PH_TO_TF')
  const [situationInit, setSituationInit] = useState('')
  const [ville, setVille] = useState('')
  const [quartier, setQuartier] = useState('')
  const [delaiEstime, setDelaiEstime] = useState('')
  const [montantDevis, setMontantDevis] = useState('')
  const [assignUserId, setAssignUserId] = useState<string>('__none')
  const [assignToSelf, setAssignToSelf] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (situationInit.trim().length < 20) {
      toast.error('La situation initiale doit faire au moins 20 caractères.')
      return
    }
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        reference: reference.trim(),
        nomClient: nomClient.trim(),
        emailClient: emailClient.trim(),
        telephoneClient: telephoneClient.trim(),
        pays: pays.trim(),
        typeRegul,
        situationInit: situationInit.trim(),
        ville: ville.trim(),
        quartier: quartier.trim() || undefined,
        delaiEstime: delaiEstime.trim() || undefined,
      }
      const m = montantDevis.trim() === '' ? undefined : parseFloat(montantDevis.replace(/\s/g, ''))
      if (m !== undefined) {
        body.montantDevis = Number.isFinite(m) ? m : undefined
      }
      if (canAssign) {
        body.userId = assignUserId === '__none' ? undefined : assignUserId
      } else if (assignToSelf && currentUserId) {
        body.userId = currentUserId
      }

      const res = await fetch('/api/admin/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof json.error === 'string' ? json.error : 'Erreur')
      }
      const id = json.data?.id as string | undefined
      toast.success('Dossier créé.')
      if (id) {
        router.push(`/admin/dossiers/${id}`)
      } else {
        router.push('/admin/dossiers')
      }
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Référence dossier</Label>
          <Input className={inputClass} value={reference} onChange={(e) => setReference(e.target.value)} required minLength={3} />
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Type de dossier</Label>
          <Select value={typeRegul} onValueChange={(v) => setTypeRegul(v as TypeRegul)}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
              {TYPES_REGUL.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[#8E8E93]">Nom du client</Label>
        <Input className={inputClass} value={nomClient} onChange={(e) => setNomClient(e.target.value)} required minLength={2} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">E-mail</Label>
          <Input className={inputClass} type="email" value={emailClient} onChange={(e) => setEmailClient(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Téléphone</Label>
          <Input className={inputClass} value={telephoneClient} onChange={(e) => setTelephoneClient(e.target.value)} required minLength={8} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Pays</Label>
          <Input className={inputClass} value={pays} onChange={(e) => setPays(e.target.value)} required minLength={2} />
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Ville</Label>
          <Input className={inputClass} value={ville} onChange={(e) => setVille(e.target.value)} required minLength={2} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[#8E8E93]">Quartier</Label>
        <Input className={inputClass} value={quartier} onChange={(e) => setQuartier(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label className="text-[#8E8E93]">Situation initiale (min. 20 caractères)</Label>
        <Textarea
          className={inputClass}
          rows={8}
          value={situationInit}
          onChange={(e) => setSituationInit(e.target.value)}
          required
          minLength={20}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Délai estimé</Label>
          <Input className={inputClass} value={delaiEstime} onChange={(e) => setDelaiEstime(e.target.value)} placeholder="Optionnel" />
        </div>
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Montant devis (FCFA)</Label>
          <Input className={inputClass} value={montantDevis} onChange={(e) => setMontantDevis(e.target.value)} placeholder="Optionnel" />
        </div>
      </div>

      {canAssign ? (
        <div className="space-y-2">
          <Label className="text-[#8E8E93]">Assigner à un agent</Label>
          <Select value={assignUserId} onValueChange={setAssignUserId}>
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Non assigné" />
            </SelectTrigger>
            <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
              <SelectItem value="__none">Non assigné</SelectItem>
              {agents.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name ?? a.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        currentUserId && (
          <div className="flex items-center gap-3 rounded-xl border border-[#3A3A3C] p-4">
            <Checkbox id="assign-self" checked={assignToSelf} onCheckedChange={(c) => setAssignToSelf(c === true)} />
            <Label htmlFor="assign-self" className="text-sm text-[#EFEFEF] cursor-pointer leading-snug">
              Me assigner ce dossier (recommandé si vous en assurez le suivi)
            </Label>
          </div>
        )
      )}

      <Button type="submit" disabled={saving} className="bg-[#D4A843] text-[#1C1C1E] hover:bg-[#B8912E]">
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
            Création…
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
            Créer le dossier
          </>
        )}
      </Button>
    </form>
  )
}
