'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, Save, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TemoignageFormProps {
  initialData: {
    id: string
    nom: string
    photo: string | null
    texte: string
    note: number
    actif: boolean
    ordre: number
  }
}

export function TemoignageForm({ initialData }: TemoignageFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: initialData.nom,
    photo: initialData.photo ?? '',
    texte: initialData.texte,
    note: initialData.note,
    actif: initialData.actif,
    ordre: initialData.ordre,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Choisissez une image (JPG, PNG, WebP)')
      return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setForm((f) => ({ ...f, photo: data.url }))
        toast.success('Image uploadée')
      } else {
        toast.error(data.error ?? 'Erreur upload')
      }
    } catch {
      toast.error('Erreur upload')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/temoignages/${initialData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          photo: form.photo || null,
        }),
      })
      if (res.ok) {
        toast.success('Témoignage mis à jour')
        router.push('/admin/temoignages')
        router.refresh()
      } else {
        toast.error('Erreur lors de l\'enregistrement')
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[#EFEFEF] text-lg">Photo / avatar</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#3A3A3C] flex-shrink-0">
            {form.photo ? (
              <Image src={form.photo} alt={form.nom} fill className="object-cover" sizes="96px" />
            ) : (
              <div className="w-full h-full bg-[#3A3A3C] flex items-center justify-center text-[#8E8E93] text-sm">Aucune</div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-[#EFEFEF]">URL de l&apos;image</Label>
            <Input
              value={form.photo}
              onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
              placeholder="/uploads/... ou https://..."
              className="bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
            />
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                id="temoignage-photo-upload"
                onChange={handleUpload}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                className="border-[#3A3A3C] text-[#EFEFEF] hover:bg-[#3A3A3C]"
                onClick={() => document.getElementById('temoignage-photo-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'Upload...' : 'Uploader une image'}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="nom" className="text-[#EFEFEF]">Nom *</Label>
          <Input id="nom" value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} required className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]" />
        </div>
        <div>
          <Label htmlFor="texte" className="text-[#EFEFEF]">Témoignage *</Label>
          <Textarea id="texte" value={form.texte} onChange={(e) => setForm((f) => ({ ...f, texte: e.target.value }))} required rows={4} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="note" className="text-[#EFEFEF]">Note (1-5)</Label>
            <Input id="note" type="number" min={1} max={5} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: parseInt(e.target.value, 10) || 5 }))} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]" />
          </div>
          <div>
            <Label htmlFor="ordre" className="text-[#EFEFEF]">Ordre d&apos;affichage</Label>
            <Input id="ordre" type="number" min={0} value={form.ordre} onChange={(e) => setForm((f) => ({ ...f, ordre: parseInt(e.target.value, 10) || 0 }))} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.actif} onChange={(e) => setForm((f) => ({ ...f, actif: e.target.checked }))} className="rounded border-[#3A3A3C] bg-[#1C1C1E] text-[#D4A843]" />
          <span className="text-[#EFEFEF] text-sm">Témoignage actif (visible sur le site)</span>
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E]">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#3A3A3C] text-[#EFEFEF] hover:bg-[#3A3A3C]">
          Annuler
        </Button>
      </div>
    </form>
  )
}
