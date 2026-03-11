'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, Save, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type StatutPost = 'BROUILLON' | 'PLANIFIE' | 'PUBLIE' | 'ARCHIVE'

interface BlogFormData {
  id?: string
  titre: string
  resume: string
  contenu: string
  statut: StatutPost
  metaTitle: string
  metaDesc: string
  tags: string[]
  imageUne: string
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>
}

const STATUTS: StatutPost[] = ['BROUILLON', 'PLANIFIE', 'PUBLIE', 'ARCHIVE']

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData?.id)

  const [form, setForm] = useState<BlogFormData>({
    titre: initialData?.titre ?? '',
    resume: initialData?.resume ?? '',
    contenu: initialData?.contenu ?? '',
    statut: initialData?.statut ?? 'BROUILLON',
    metaTitle: initialData?.metaTitle ?? '',
    metaDesc: initialData?.metaDesc ?? '',
    tags: initialData?.tags ?? [],
    imageUne: initialData?.imageUne ?? '',
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Choisissez une image (JPG, PNG, WebP)')
      return
    }
    setUploadingImage(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setForm((f) => ({ ...f, imageUne: data.url }))
        toast.success('Image uploadée')
      } else {
        toast.error(data.error ?? 'Erreur upload')
      }
    } catch {
      toast.error('Erreur upload')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const set = (field: keyof BlogFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }))
    }
    setTagInput('')
  }

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titre || !form.contenu) {
      toast.error('Le titre et le contenu sont obligatoires.')
      return
    }

    setSaving(true)
    try {
      const url = isEdit ? `/api/blog/${initialData!.id}` : '/api/blog'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success(isEdit ? 'Article mis à jour.' : 'Article créé.')
        router.push('/admin/blog')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Une erreur est survenue.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[#EFEFEF] text-lg">Contenu de l&apos;article</h2>

        <div>
          <Label htmlFor="titre" className="text-[#EFEFEF]">Titre *</Label>
          <Input id="titre" value={form.titre} onChange={set('titre')} required className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="Titre de l'article" />
        </div>

        <div>
          <Label htmlFor="statut" className="text-[#EFEFEF]">Statut</Label>
          <select id="statut" value={form.statut} onChange={set('statut')} className="mt-1.5 w-full rounded-lg border border-[#3A3A3C] bg-[#1C1C1E] px-3 py-2 text-sm text-[#EFEFEF] focus:outline-none focus:ring-2 focus:ring-[#D4A843]">
            {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <Label htmlFor="resume" className="text-[#EFEFEF]">Résumé</Label>
          <Textarea id="resume" value={form.resume} onChange={set('resume')} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" rows={2} placeholder="Court résumé affiché dans les listes..." />
        </div>

        <div>
          <Label htmlFor="contenu" className="text-[#EFEFEF]">Contenu * (Markdown supporté)</Label>
          <Textarea id="contenu" value={form.contenu} onChange={set('contenu')} required className="mt-1.5 font-mono text-xs bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" rows={16} placeholder="# Titre&#10;&#10;Votre contenu en Markdown..." />
        </div>

        <div>
          <Label htmlFor="imageUne" className="text-[#EFEFEF]">Image à la une</Label>
          <div className="mt-1.5 flex flex-col sm:flex-row gap-3 items-start">
            <Input id="imageUne" type="url" value={form.imageUne} onChange={set('imageUne')} className="flex-1 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="URL ou uploader ci‑dessous" />
            <span className="text-[#8E8E93] text-sm self-center">ou</span>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                id="blog-image-upload"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              <Button
                type="button"
                variant="outline"
                className="border-[#3A3A3C] text-[#EFEFEF] hover:bg-[#3A3A3C]"
                onClick={() => document.getElementById('blog-image-upload')?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploadingImage ? 'Upload...' : 'Uploader une image'}
              </Button>
            </div>
          </div>
          {form.imageUne && (
            <div className="mt-2 relative w-full max-w-xs h-32 rounded-lg overflow-hidden border border-[#3A3A3C]">
              <Image src={form.imageUne} alt="Aperçu" fill className="object-cover" sizes="320px" />
            </div>
          )}
        </div>

        <div>
          <Label className="text-[#EFEFEF]">Tags</Label>
          <div className="mt-1.5 flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="Ajouter un tag et appuyer Entrée"
              className="flex-1 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]"
            />
            <Button type="button" variant="outline" onClick={addTag} className="border-[#3A3A3C] text-[#EFEFEF] hover:bg-[#3A3A3C]">Ajouter</Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-[rgba(212,168,67,0.12)] text-[#D4A843] px-2 py-1 rounded-full font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} aria-label={`Supprimer le tag ${tag}`}>
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-5">
        <h2 className="font-heading font-semibold text-[#EFEFEF] text-lg">SEO</h2>

        <div>
          <Label htmlFor="metaTitle" className="text-[#EFEFEF]">Meta Title</Label>
          <Input id="metaTitle" value={form.metaTitle} onChange={set('metaTitle')} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" placeholder="Titre pour les moteurs de recherche (60 car. max)" maxLength={60} />
          <p className="text-xs text-[#8E8E93] mt-1">{form.metaTitle.length}/60 caractères</p>
        </div>

        <div>
          <Label htmlFor="metaDesc" className="text-[#EFEFEF]">Meta Description</Label>
          <Textarea id="metaDesc" value={form.metaDesc} onChange={set('metaDesc')} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93]" rows={2} placeholder="Description pour les moteurs de recherche (160 car. max)" maxLength={160} />
          <p className="text-xs text-[#8E8E93] mt-1">{form.metaDesc.length}/160 caractères</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E]">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {isEdit ? 'Mettre à jour' : 'Créer l\'article'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#3A3A3C] text-[#EFEFEF] hover:bg-[#3A3A3C]">
          Annuler
        </Button>
      </div>
    </form>
  )
}
